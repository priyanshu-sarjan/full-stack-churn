# ⚡ Customer Churn & Segmentation Engine

> **Industry-Standard Business ML Platform** | Full-Stack Enterprise Intelligence Dashboard

[![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.142-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit_Learn-1.9-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

An enterprise-grade full-stack machine learning application demonstrating both **Supervised Learning** (Logistic Regression & Odds Ratio Driver Attribution) and **Unsupervised Learning** (K-Means Customer Segmentation), trained on the **Telco Customer Churn Dataset (Kaggle)**.

Designed with a high-fidelity **Fusedash Dark Theme** user interface, decoupling the **ML Engine**, **FastAPI Backend REST API**, and **Interactive React Dashboard**.

---

## 📸 Dashboard Highlights

- **Driver vs Holdback Odds Ratio Gauge**: Visualizes feature impact multipliers ($e^\beta$) identifying top risk drivers and retention protectors.
- **Segment Feature Profiles Radar Chart**: Polygon spider chart comparing 6 core features (Tenure, Monthly Charges, Tech Support, Security, Paperless, Contract) across customer segments.
- **Service Subscriptions Dot Matrix**: Matrix grid table presenting subscription counts across tenure groups.
- **K-Means 2D Scatter Plot Explorer**: Interactive 2D PCA mapping (Tenure vs. Monthly Charges) with segment toggle filters and hover tooltips.
- **"What-If" Churn Risk Simulator**: Real-time sliders & dropdown controls allowing account managers to test scenario changes and receive instant retention recommendations.
- **Fuse AI Copilot Side Panel**: Interactive AI assistant offering natural language query insights, suggested prompt pills, and real-time backend intelligence.

---

## 🏗 System Architecture

```
                          ┌────────────────────────────────────────────────────────┐
                          │         Telco Customer Churn Dataset (Kaggle)          │
                          └───────────────────────────┬────────────────────────────┘
                                                      │
                                                      ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                           Scikit-Learn ML Engine                                        │
  │  - Logistic Regression & Odds Ratios (e^β)           - K-Means Clustering (4 Business Segments)          │
  │  - Model Evaluation (ROC-AUC: 0.842, Accuracy: 80.7%) - 2D PCA Dimensionality Reduction                 │
  └───────────────────────────────────────────┬─────────────────────────────────────────────────────────────┘
                                              │
                                              ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                           FastAPI Backend Service                                       │
  │  - GET /api/v1/segments                      - POST /api/v1/predict-churn                              │
  │  - GET /api/v1/analytics/model-performance  - GET  /api/v1/customers                                 │
  │  - POST /api/v1/ai-insights                  - Static Asset Server (frontend/dist)                     │
  └───────────────────────────────────────────┬─────────────────────────────────────────────────────────────┘
                                              │
                                              ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                      React Dashboard (fusedash UI)                                      │
  │  - Driver vs Holdback Odds Ratio Donut Gauge  - Segment Feature Profiles Radar Chart                    │
  │  - Service Subscriptions Dot Matrix          - 2D K-Means Cluster Scatter Plot                          │
  │  - Interactive "What-If" Churn Risk Simulator - Fuse AI Copilot Sidebar Assistant                      │
  └─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Machine Learning Engine & Methodology

### 1. Unsupervised K-Means Customer Segmentation
Engineers 4 distinct business personas using customer usage patterns, tenure, monthly charges, and service subscriptions:
1. **High-Value At-Risk**: High monthly spend ($70–$120/mo), Fiber Optic, Month-to-Month contracts. Highest priority for retention offers.
2. **Loyal Power Users**: Long tenure (40+ mos), 1–2 Year contracts, bundled security & tech support. Lowest churn probability.
3. **Low-Tenure Budget**: New accounts (<12 mos), lower monthly charges, basic DSL service. Susceptible to early drop-off.
4. **Standard Stable**: Moderate tenure (12–36 mos), steady usage patterns, responsive to loyalty upgrades.

### 2. Logistic Regression & Odds Ratio Analysis ($e^\beta$)
Quantifies feature impact on customer churn probability:
- **Top Churn Drivers (Odds Ratio > 1.0)**:
  - `Month-to-Month Contract`: **$2.45\times$** odds multiplier (Increases churn risk by +145%)
  - `Fiber Optic Internet`: **$1.82\times$** odds multiplier
  - `Electronic Check Payment`: **$1.35\times$** odds multiplier
- **Top Retention Protectors (Odds Ratio < 1.0)**:
  - `Two-Year Contract`: **$0.38\times$** odds multiplier (Reduces churn risk by 62%)
  - `Tech Support Subscribed`: **$0.71\times$** odds multiplier
  - `Online Security Subscribed`: **$0.76\times$** odds multiplier

### 3. Model Evaluation Diagnostics
- **ROC-AUC Score**: `0.842`
- **Classification Accuracy**: `80.7%`
- **Precision**: `64.6%`
- **Recall**: `58.5%`

---

## 🔌 API Reference Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/v1/health` | `GET` | Health check & model status info |
| `/api/v1/segments` | `GET` | K-Means customer cluster profiles, centroids, & statistics |
| `/api/v1/analytics/model-performance` | `GET` | ROC curve coordinates, Confusion Matrix counts, & Odds Ratios |
| `/api/v1/predict-churn` | `POST` | Real-time single profile inference & retention plan generation |
| `/api/v1/customers` | `GET` | Filterable & paginated customer account directory |
| `/api/v1/ai-insights` | `POST` | Fuse AI Copilot natural language query processing |

---

## 🚀 Quickstart & Installation Guide

### Prerequisites
- **Python**: 3.10+ (Tested on Python 3.14)
- **Node.js**: 18+ (Tested on Node v24.19)

### 1. Clone Repository
```bash
git clone https://github.com/priyanshu-sarjan/Full-Stack-Churn-Experience-Dashboard-Site.git
cd Full-Stack-Churn-Experience-Dashboard-Site
```

### 2. Set Up Python Environment & Backend
```bash
# Create Virtual Environment
python -m venv .venv

# Activate Virtual Environment
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install Dependencies
pip install pandas scikit-learn numpy fastapi uvicorn kagglehub joblib
```

### 3. Build Frontend Assets (Vite + React)
```bash
cd frontend
npm install
node "node_modules/vite/bin/vite.js" build
cd ..
```

### 4. Launch Full-Stack Web Application
```bash
python main.py
```

Open your browser and navigate to: **`http://127.0.0.1:8000`**

---

## 🛠 Technology Stack

- **ML Pipeline**: Python, Scikit-learn, Pandas, NumPy, Joblib, KaggleHub
- **Backend API**: FastAPI, Uvicorn, Pydantic
- **Frontend SPA**: React 19, Vite 8, Recharts, Lucide Icons, Custom Fusedash CSS System

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

Developed with ❤️ by **Priyanshu Sarjan**.
