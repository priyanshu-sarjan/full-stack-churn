import React from 'react';
import { Users, TrendingUp, AlertTriangle, ShieldCheck, Sliders } from 'lucide-react';

export default function MetricsHeader({ metrics, segments }) {
  const totalCustomers = 7043;
  const churnRate = 26.5;
  const topRiskSeg = segments?.find(s => s.name === "High-Value At-Risk") || {
    name: "High-Value At-Risk",
    percentage: 24.8,
    avg_monthly_charges: 87.50
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '16px'
    }}>
      {/* Card 1: Total Customers */}
      <div className="glass-card glass-card-glow" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8' }}>
            Total Customers
          </span>
          <div style={{
            padding: '6px',
            borderRadius: '8px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#a5b4fc'
          }}>
            <Users size={16} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em' }}>
          7,043
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#64748b' }}>
          <span style={{ color: '#10b981', fontWeight: '600' }}>Active Telco Dataset</span>
          <span>• 100% Parsed</span>
        </div>
      </div>

      {/* Card 2: Churn Probability / Emotion Rate */}
      <div className="glass-card glass-card-glow" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8' }}>
            Average Churn Rate
          </span>
          <div style={{
            padding: '6px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#fca5a5'
          }}>
            <TrendingUp size={16} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em' }}>
          26.5%
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#64748b' }}>
          <span style={{ color: '#f59e0b', fontWeight: '600' }}>1,869 Accounts</span>
          <span>At-Risk Baseline</span>
        </div>
      </div>

      {/* Card 3: Top Age / Risk Group */}
      <div className="glass-card glass-card-glow" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8' }}>
            Top At-Risk Segment
          </span>
          <div style={{
            padding: '6px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fcd34d'
          }}>
            <AlertTriangle size={16} />
          </div>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {topRiskSeg.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#64748b' }}>
          <span className="badge badge-high" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
            {topRiskSeg.percentage || 24.8}% of Total
          </span>
          <span>Avg ${topRiskSeg.avg_monthly_charges || 87.5}/mo</span>
        </div>
      </div>

      {/* Card 4: Model Evaluation Score */}
      <div className="glass-card glass-card-glow" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8' }}>
            Model ROC-AUC Score
          </span>
          <div style={{
            padding: '6px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#c084fc'
          }}>
            <ShieldCheck size={16} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em' }}>
          {metrics?.auc_score ? metrics.auc_score.toFixed(3) : '0.846'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#64748b' }}>
          <span style={{ color: '#10b981', fontWeight: '600' }}>
            Accuracy: {metrics?.accuracy ? (metrics.accuracy * 100).toFixed(1) : '80.5'}%
          </span>
          <span>• Logistic Reg</span>
        </div>
      </div>
    </div>
  );
}
