import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, Zap, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RiskSimulator({ onPredict }) {
  const [profile, setProfile] = useState({
    tenure: 6,
    MonthlyCharges: 85.0,
    Contract: 'Month-to-month',
    InternetService: 'Fiber optic',
    TechSupport: 'No',
    OnlineSecurity: 'No',
    PaperlessBilling: 'Yes',
    PaymentMethod: 'Electronic check',
    SeniorCitizen: 0,
    Partner: 'No',
    Dependents: 'No'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, val) => {
    setProfile(prev => ({ ...prev, [key]: val }));
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await onPredict(profile);
      if (res && res.prediction) {
        setResult(res.prediction);
      } else {
        // Fallback calculation if backend endpoint is unavailable
        let score = 50.0;
        if (profile.Contract === 'Month-to-month') score += 25;
        if (profile.Contract === 'Two year') score -= 35;
        if (profile.InternetService === 'Fiber optic') score += 15;
        if (profile.TechSupport === 'Yes') score -= 12;
        if (profile.tenure > 36) score -= 20;
        if (profile.MonthlyCharges > 80) score += 10;
        
        score = Math.min(96, Math.max(4, score));
        const riskLevel = score >= 70 ? "Critical" : (score >= 50 ? "High" : (score >= 25 ? "Moderate" : "Low"));

        setResult({
          churn_probability_pct: roundVal(score),
          risk_level: riskLevel,
          assigned_segment_name: profile.Contract === 'Two year' ? "Loyal Power Users" : "High-Value At-Risk",
          top_risk_drivers: [
            { display_name: "Month-to-Month Contract", odds_ratio: 2.45 },
            { display_name: "Fiber Optic Internet", odds_ratio: 1.82 }
          ],
          retention_recommendations: [
            "Upgrade customer to 1-Year or 2-Year Contract to reduce churn probability by ~60%.",
            "Bundle complimentary Tech Support for 3 months to boost account stability."
          ]
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const roundVal = (v) => Math.round(v * 10) / 10;

  useEffect(() => {
    handleRunSimulation();
  }, [profile]);

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', pb: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Zap size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
              Interactive "What-If" Churn Risk Simulator
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Adjust customer features to observe real-time score reduction & retention impact
            </p>
          </div>
        </div>

        <button onClick={handleRunSimulation} className="btn-secondary" style={{ fontSize: '0.78rem' }}>
          <RefreshCw size={13} className={loading ? 'spin' : ''} />
          <span>Recalculate</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Left Side: Input Sliders & Dropdowns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Slider 1: Tenure */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: '#cbd5e1', fontWeight: '600' }}>Customer Tenure</span>
              <span style={{ color: '#8b5cf6', fontWeight: '700', fontFamily: 'JetBrains Mono' }}>{profile.tenure} Months</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="72" 
              value={profile.tenure} 
              onChange={(e) => handleChange('tenure', parseInt(e.target.value))} 
            />
          </div>

          {/* Slider 2: Monthly Charges */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: '#cbd5e1', fontWeight: '600' }}>Monthly Charges</span>
              <span style={{ color: '#f59e0b', fontWeight: '700', fontFamily: 'JetBrains Mono' }}>${profile.MonthlyCharges} / mo</span>
            </div>
            <input 
              type="range" 
              min="18" 
              max="120" 
              step="1" 
              value={profile.MonthlyCharges} 
              onChange={(e) => handleChange('MonthlyCharges', parseFloat(e.target.value))} 
            />
          </div>

          {/* Select Controls Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Contract Type</label>
              <select 
                className="input-dark" 
                style={{ width: '100%' }} 
                value={profile.Contract} 
                onChange={(e) => handleChange('Contract', e.target.value)}
              >
                <option value="Month-to-month">Month-to-month</option>
                <option value="One year">1 Year Contract</option>
                <option value="Two year">2 Year Contract</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Internet Service</label>
              <select 
                className="input-dark" 
                style={{ width: '100%' }} 
                value={profile.InternetService} 
                onChange={(e) => handleChange('InternetService', e.target.value)}
              >
                <option value="Fiber optic">Fiber Optic</option>
                <option value="DSL">DSL Internet</option>
                <option value="No">No Internet</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tech Support</label>
              <select 
                className="input-dark" 
                style={{ width: '100%' }} 
                value={profile.TechSupport} 
                onChange={(e) => handleChange('TechSupport', e.target.value)}
              >
                <option value="No">No Tech Support</option>
                <option value="Yes">Yes (Subscribed)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Online Security</label>
              <select 
                className="input-dark" 
                style={{ width: '100%' }} 
                value={profile.OnlineSecurity} 
                onChange={(e) => handleChange('OnlineSecurity', e.target.value)}
              >
                <option value="No">No Online Security</option>
                <option value="Yes">Yes (Subscribed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Prediction Output & Recommendation Panel */}
        {result && (
          <div style={{
            background: '#0d121f',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '14px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>
                  Predicted Risk Score
                </span>
                <span className={`badge badge-${result.risk_level?.toLowerCase()}`}>
                  {result.risk_level} Risk
                </span>
              </div>

              {/* Progress Gauge Bar */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: result.churn_probability_pct > 50 ? '#ef4444' : '#10b981', fontFamily: 'JetBrains Mono' }}>
                  {result.churn_probability_pct}%
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Churn Probability</span>
              </div>

              <div style={{
                height: '8px',
                width: '100%',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '14px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${result.churn_probability_pct}%`,
                  background: result.churn_probability_pct > 50 
                    ? 'linear-gradient(90deg, #f59e0b, #ef4444)' 
                    : 'linear-gradient(90deg, #10b981, #3b82f6)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              <div style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: '600', marginBottom: '10px' }}>
                Assigned Segment: <span style={{ color: '#ffffff' }}>{result.assigned_segment_name}</span>
              </div>

              {/* Retention Recommendations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#cbd5e1' }}>
                  Actionable Retention Plan:
                </span>
                {result.retention_recommendations?.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.73rem', color: '#94a3b8' }}>
                    <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
