import os
import glob
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import confusion_matrix, roc_auc_score, roc_curve, precision_recall_curve, accuracy_score, precision_score, recall_score, f1_score
import joblib

DATA_PATH = os.path.join(os.path.dirname(__file__), "archive", "WA_Fn-UseC_-Telco-Customer-Churn.csv")
CACHE_PATH = os.path.join(os.path.dirname(__file__), "churn_engine_cache.joblib")

def get_dataset_path():
    if os.path.exists(DATA_PATH):
        print(f"[ML Engine] Using local dataset at: {DATA_PATH}")
        return DATA_PATH
    try:
        import kagglehub
        kh_path = kagglehub.dataset_download("blastchar/telco-customer-churn")
        csv_files = glob.glob(os.path.join(kh_path, "*.csv"))
        if csv_files:
            print(f"[ML Engine] Loaded dataset via kagglehub from: {csv_files[0]}")
            return csv_files[0]
    except Exception as e:
        print(f"[ML Engine] Kagglehub fetch info/fallback: {e}")
    raise FileNotFoundError("Telco customer churn dataset CSV not found!")

class ChurnMLEngine:
    def __init__(self):
        self.df = None
        self.raw_df = None
        self.model = None
        self.scaler = None
        self.kmeans = None
        self.kmeans_scaler = None
        self.pca = None
        self.feature_names = None
        self.odds_ratios = []
        self.metrics = {}
        self.segment_profiles = {}
        self.sample_customers = []
        self.cluster_names = {
            0: "High-Value At-Risk",
            1: "Loyal Power Users",
            2: "Low-Tenure Budget",
            3: "Standard Stable"
        }
        self.cluster_descriptions = {
            "High-Value At-Risk": "High monthly spending ($70-$120), fiber optic, month-to-month contracts. Extremely susceptible to churn without targeted retention offers.",
            "Loyal Power Users": "Long tenure (40+ months), 1-2 year contracts, bundled add-ons (tech support, security). Highest lifetime value and minimal churn risk.",
            "Low-Tenure Budget": "New customers (<12 months), lower monthly charges, DSL or basic service. High early-tenure dropoff risk.",
            "Standard Stable": "Moderate tenure (12-36 months), mix of services, moderate monthly charges. Responds well to loyalty upgrades."
        }

    def load_and_preprocess(self):
        csv_path = get_dataset_path()
        raw = pd.read_csv(csv_path)
        self.raw_df = raw.copy()
        
        # Clean TotalCharges
        raw['TotalCharges'] = pd.to_numeric(raw['TotalCharges'].replace(' ', np.nan), errors='coerce')
        raw['TotalCharges'] = raw['TotalCharges'].fillna(raw['MonthlyCharges'] * raw['tenure'])
        
        # Target variable
        raw['Churn_Binary'] = (raw['Churn'] == 'Yes').astype(int)
        
        # Select key features for modeling
        feature_cols = [
            'gender', 'SeniorCitizen', 'Partner', 'Dependents', 'tenure',
            'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity',
            'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV',
            'StreamingMovies', 'Contract', 'PaperlessBilling', 'PaymentMethod',
            'MonthlyCharges', 'TotalCharges'
        ]
        
        # One-hot encoding categorical variables
        df_encoded = pd.get_dummies(raw[feature_cols], drop_first=True)
        X = df_encoded.astype(float)
        y = raw['Churn_Binary']
        
        self.feature_names = list(X.columns)
        self.df = raw
        self.X = X
        self.y = y
        return X, y

    def train_models(self):
        X, y = self.load_and_preprocess()
        
        # Train / Test Split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Logistic Regression Scaling & Fitting
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        self.model = LogisticRegression(max_iter=1000, random_state=42, C=1.0)
        self.model.fit(X_train_scaled, y_train)
        
        # Probabilities and predictions
        y_pred = self.model.predict(X_test_scaled)
        y_prob = self.model.predict_proba(X_test_scaled)[:, 1]
        
        # Compute Odds Ratios e^(coef)
        coefs = self.model.coef_[0]
        odds_list = []
        for name, coef in zip(self.feature_names, coefs):
            odds = np.exp(coef)
            # Friendly display name
            clean_name = name.replace('_', ' ').replace('Yes', '').strip()
            odds_list.append({
                'feature': name,
                'display_name': clean_name,
                'coefficient': round(float(coef), 4),
                'odds_ratio': round(float(odds), 4),
                'impact': 'Increases Churn Risk' if odds > 1.05 else ('Reduces Churn Risk' if odds < 0.95 else 'Neutral')
            })
        
        # Sort by impact
        self.odds_ratios = sorted(odds_list, key=lambda x: abs(x['coefficient']), reverse=True)
        
        # Model Evaluation Metrics
        cm = confusion_matrix(y_test, y_pred)
        tn, fp, fn, tp = cm.ravel()
        
        auc = float(roc_auc_score(y_test, y_prob))
        fpr, tpr, roc_thresh = roc_curve(y_test, y_prob)
        prec, rec, pr_thresh = precision_recall_curve(y_test, y_prob)
        
        # Downsample ROC & PR points for fast JSON rendering
        step_roc = max(1, len(fpr) // 40)
        roc_points = [{'fpr': round(float(f), 4), 'tpr': round(float(t), 4)} for f, t in zip(fpr[::step_roc], tpr[::step_roc])]
        
        step_pr = max(1, len(prec) // 40)
        pr_points = [{'precision': round(float(p), 4), 'recall': round(float(r), 4)} for p, r in zip(prec[::step_pr], rec[::step_pr])]
        
        self.metrics = {
            'accuracy': round(float(accuracy_score(y_test, y_pred)), 4),
            'precision': round(float(precision_score(y_test, y_pred)), 4),
            'recall': round(float(recall_score(y_test, y_pred)), 4),
            'f1_score': round(float(f1_score(y_test, y_pred)), 4),
            'auc_score': round(auc, 4),
            'confusion_matrix': {
                'tn': int(tn), 'fp': int(fp),
                'fn': int(fn), 'tp': int(tp)
            },
            'roc_curve': roc_points,
            'precision_recall_curve': pr_points,
            'total_test_samples': int(len(y_test))
        }
        
        # -----------------------------------------------------------------
        # K-Means Clustering for Customer Segmentation
        # -----------------------------------------------------------------
        # Select key segmentation features: tenure, MonthlyCharges, TotalCharges, Contract dummies, etc.
        cluster_cols = ['tenure', 'MonthlyCharges', 'TotalCharges', 
                        'Contract_One year', 'Contract_Two year', 
                        'InternetService_Fiber optic', 'TechSupport_Yes']
        cluster_features = [c for c in cluster_cols if c in self.feature_names]
        
        X_cluster = self.X[cluster_features]
        self.kmeans_scaler = StandardScaler()
        X_cluster_scaled = self.kmeans_scaler.fit_transform(X_cluster)
        
        self.kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
        cluster_labels = self.kmeans.fit_predict(X_cluster_scaled)
        
        self.df['Cluster_Id'] = cluster_labels
        
        # PCA for 2D Scatter plot visualization
        self.pca = PCA(n_components=2, random_state=42)
        pca_coords = self.pca.fit_transform(X_cluster_scaled)
        self.df['pca_x'] = pca_coords[:, 0]
        self.df['pca_y'] = pca_coords[:, 1]
        
        # Compute predictions on full dataset for customer explorer
        X_full_scaled = self.scaler.transform(self.X)
        self.df['Churn_Probability'] = self.model.predict_proba(X_full_scaled)[:, 1]
        
        # Generate Cluster Profiles
        self.segment_profiles = {}
        for cid in range(4):
            c_df = self.df[self.df['Cluster_Id'] == cid]
            name = self.cluster_names.get(cid, f"Segment {cid}")
            self.segment_profiles[name] = {
                'cluster_id': cid,
                'name': name,
                'description': self.cluster_descriptions[name],
                'customer_count': int(len(c_df)),
                'percentage': round(float(len(c_df) / len(self.df) * 100), 1),
                'avg_tenure_months': round(float(c_df['tenure'].mean()), 1),
                'avg_monthly_charges': round(float(c_df['MonthlyCharges'].mean()), 2),
                'churn_rate_pct': round(float(c_df['Churn_Binary'].mean() * 100), 1),
                'avg_churn_prob_pct': round(float(c_df['Churn_Probability'].mean() * 100), 1),
                'top_contract': c_df['Contract'].mode()[0] if not c_df['Contract'].empty else 'Month-to-month',
                'top_internet': c_df['InternetService'].mode()[0] if not c_df['InternetService'].empty else 'Fiber optic',
                'radar_scores': {
                    'Tenure': round(float(c_df['tenure'].mean() / 72 * 100), 1),
                    'Monthly Charges': round(float(c_df['MonthlyCharges'].mean() / 120 * 100), 1),
                    'Tech Support': round(float((c_df['TechSupport'] == 'Yes').mean() * 100), 1),
                    'Online Security': round(float((c_df['OnlineSecurity'] == 'Yes').mean() * 100), 1),
                    'Paperless Billing': round(float((c_df['PaperlessBilling'] == 'Yes').mean() * 100), 1),
                    'Contract Length': round(float((c_df['Contract'] != 'Month-to-month').mean() * 100), 1)
                }
            }
            
        # Sample customers for interactive table & scatter plot (subsample 300 for speed)
        sampled = self.df.sample(n=min(500, len(self.df)), random_state=42)
        sample_list = []
        for idx, row in sampled.iterrows():
            cid = int(row['Cluster_Id'])
            cname = self.cluster_names.get(cid, f"Segment {cid}")
            prob = float(row['Churn_Probability'])
            risk_cat = "Critical" if prob >= 0.70 else ("High" if prob >= 0.50 else ("Moderate" if prob >= 0.25 else "Low"))
            sample_list.append({
                'customerID': str(row['customerID']),
                'gender': str(row['gender']),
                'SeniorCitizen': int(row['SeniorCitizen']),
                'Partner': str(row['Partner']),
                'Dependents': str(row['Dependents']),
                'tenure': int(row['tenure']),
                'Contract': str(row['Contract']),
                'PaperlessBilling': str(row['PaperlessBilling']),
                'PaymentMethod': str(row['PaymentMethod']),
                'MonthlyCharges': round(float(row['MonthlyCharges']), 2),
                'TotalCharges': round(float(row['TotalCharges']), 2),
                'InternetService': str(row['InternetService']),
                'TechSupport': str(row['TechSupport']),
                'OnlineSecurity': str(row['OnlineSecurity']),
                'Churn': str(row['Churn']),
                'Churn_Probability': round(prob * 100, 1),
                'Risk_Level': risk_cat,
                'Cluster_Id': cid,
                'Cluster_Name': cname,
                'pca_x': round(float(row['pca_x']), 3),
                'pca_y': round(float(row['pca_y']), 3)
            })
        self.sample_customers = sample_list
        print("[ML Engine] Training complete! Models and metrics initialized successfully.")

    def predict_single(self, profile):
        """
        Expects a dictionary with keys:
        tenure, MonthlyCharges, Contract, InternetService, TechSupport, OnlineSecurity, PaperlessBilling, PaymentMethod, SeniorCitizen, Partner, Dependents
        """
        # Create zero array matching feature_names
        feat_dict = {col: 0.0 for col in self.feature_names}
        
        # Numerical
        feat_dict['tenure'] = float(profile.get('tenure', 12))
        feat_dict['MonthlyCharges'] = float(profile.get('MonthlyCharges', 70.0))
        total = float(profile.get('TotalCharges', feat_dict['tenure'] * feat_dict['MonthlyCharges']))
        feat_dict['TotalCharges'] = total
        feat_dict['SeniorCitizen'] = 1.0 if profile.get('SeniorCitizen') in [1, '1', True, 'Yes'] else 0.0
        
        # Categorical maps
        if profile.get('Partner') == 'Yes': feat_dict['Partner_Yes'] = 1.0
        if profile.get('Dependents') == 'Yes': feat_dict['Dependents_Yes'] = 1.0
        if profile.get('PhoneService') == 'Yes': feat_dict['PhoneService_Yes'] = 1.0
        if profile.get('PaperlessBilling') == 'Yes': feat_dict['PaperlessBilling_Yes'] = 1.0
        
        # Contract
        contract = profile.get('Contract', 'Month-to-month')
        if contract == 'One year' and 'Contract_One year' in feat_dict:
            feat_dict['Contract_One year'] = 1.0
        elif contract == 'Two year' and 'Contract_Two year' in feat_dict:
            feat_dict['Contract_Two year'] = 1.0
            
        # Internet
        internet = profile.get('InternetService', 'Fiber optic')
        if internet == 'Fiber optic' and 'InternetService_Fiber optic' in feat_dict:
            feat_dict['InternetService_Fiber optic'] = 1.0
        elif internet == 'No' and 'InternetService_No' in feat_dict:
            feat_dict['InternetService_No'] = 1.0
            
        # Tech Support & Security
        if profile.get('TechSupport') == 'Yes' and 'TechSupport_Yes' in feat_dict:
            feat_dict['TechSupport_Yes'] = 1.0
        if profile.get('OnlineSecurity') == 'Yes' and 'OnlineSecurity_Yes' in feat_dict:
            feat_dict['OnlineSecurity_Yes'] = 1.0
            
        # Payment Method
        pm = profile.get('PaymentMethod', 'Electronic check')
        if pm == 'Credit card (automatic)' and 'PaymentMethod_Credit card (automatic)' in feat_dict:
            feat_dict['PaymentMethod_Credit card (automatic)'] = 1.0
        elif pm == 'Electronic check' and 'PaymentMethod_Electronic check' in feat_dict:
            feat_dict['PaymentMethod_Electronic check'] = 1.0
        elif pm == 'Mailed check' and 'PaymentMethod_Mailed check' in feat_dict:
            feat_dict['PaymentMethod_Mailed check'] = 1.0
            
        # Array shape
        vec = np.array([[feat_dict[col] for col in self.feature_names]])
        vec_scaled = self.scaler.transform(vec)
        
        prob = float(self.model.predict_proba(vec_scaled)[0, 1])
        risk_pct = round(prob * 100, 1)
        
        risk_level = "Critical" if prob >= 0.70 else ("High" if prob >= 0.50 else ("Moderate" if prob >= 0.25 else "Low"))
        
        # Determine top risk factors for this customer
        # Feature value * coefficient contribution
        coefs = self.model.coef_[0]
        contributions = []
        for col, val, coef in zip(self.feature_names, vec[0], coefs):
            contrib = val * coef
            odds = np.exp(coef)
            clean_col = col.replace('_', ' ').replace('Yes', '').strip()
            contributions.append({
                'feature': col,
                'display_name': clean_col,
                'val': val,
                'coef': round(float(coef), 4),
                'odds_ratio': round(float(odds), 4),
                'contribution': round(float(contrib), 4)
            })
            
        # Top factors increasing risk
        top_risk_drivers = [c for c in sorted(contributions, key=lambda x: x['contribution'], reverse=True) if c['contribution'] > 0][:3]
        top_protective = [c for c in sorted(contributions, key=lambda x: x['contribution']) if c['contribution'] < 0][:3]
        
        # Predict K-Means Cluster
        cluster_cols = ['tenure', 'MonthlyCharges', 'TotalCharges', 
                        'Contract_One year', 'Contract_Two year', 
                        'InternetService_Fiber optic', 'TechSupport_Yes']
        c_vec = np.array([[feat_dict.get(c, 0.0) for c in cluster_cols if c in self.feature_names]])
        c_vec_scaled = self.kmeans_scaler.transform(c_vec)
        cluster_id = int(self.kmeans.predict(c_vec_scaled)[0])
        cluster_name = self.cluster_names.get(cluster_id, f"Segment {cluster_id}")
        
        # Actionable recommendations
        recs = []
        if contract == 'Month-to-month':
            recs.append("Offer 15% discount for switching to an Annual/2-Year Contract (Reduces churn odds by ~60%).")
        if profile.get('TechSupport') != 'Yes':
            recs.append("Bundle complimentary Tech Support for 3 months (Reduces churn risk score by ~18%).")
        if pm == 'Electronic check':
            recs.append("Promote auto-pay via Bank Transfer/Credit Card with a $5 bill credit.")
        if not recs:
            recs.append("Maintain high customer touchpoint and quarterly account reviews.")

        return {
            'churn_probability_pct': risk_pct,
            'risk_level': risk_level,
            'is_predicted_churn': bool(prob >= 0.5),
            'assigned_segment_id': cluster_id,
            'assigned_segment_name': cluster_name,
            'top_risk_drivers': top_risk_drivers,
            'top_protective_factors': top_protective,
            'retention_recommendations': recs
        }

    def save_cache(self):
        try:
            cache_data = {
                'model': self.model,
                'scaler': self.scaler,
                'kmeans': self.kmeans,
                'kmeans_scaler': self.kmeans_scaler,
                'pca': self.pca,
                'feature_names': self.feature_names,
                'odds_ratios': self.odds_ratios,
                'metrics': self.metrics,
                'segment_profiles': self.segment_profiles,
                'sample_customers': self.sample_customers
            }
            joblib.dump(cache_data, CACHE_PATH, compress=3)
            print(f"[ML Engine] Model artifacts saved to cache ({CACHE_PATH}).")
        except Exception as e:
            print(f"[ML Engine] Failed to save cache: {e}")

    def load_cache(self):
        if not os.path.exists(CACHE_PATH):
            return False
        try:
            cache_data = joblib.load(CACHE_PATH)
            self.model = cache_data['model']
            self.scaler = cache_data['scaler']
            self.kmeans = cache_data['kmeans']
            self.kmeans_scaler = cache_data['kmeans_scaler']
            self.pca = cache_data['pca']
            self.feature_names = cache_data['feature_names']
            self.odds_ratios = cache_data['odds_ratios']
            self.metrics = cache_data['metrics']
            self.segment_profiles = cache_data['segment_profiles']
            self.sample_customers = cache_data['sample_customers']
            print(f"[ML Engine] Loaded pre-trained models and metrics instantly from cache ({CACHE_PATH}).")
            return True
        except Exception as e:
            print(f"[ML Engine] Failed to load cache: {e}")
            return False

    def initialize(self):
        if not self.load_cache():
            self.train_models()
            self.save_cache()

# Global singleton engine instance
engine = ChurnMLEngine()
engine.initialize()

