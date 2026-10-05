import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ShieldCheck, Target, Award } from 'lucide-react';

export default function ModelEvaluation({ metrics }) {
  const [activeView, setActiveView] = useState('roc');

  const defaultRoc = [
    { fpr: 0, tpr: 0 },
    { fpr: 0.05, tpr: 0.35 },
    { fpr: 0.12, tpr: 0.62 },
    { fpr: 0.22, tpr: 0.78 },
    { fpr: 0.35, tpr: 0.88 },
    { fpr: 0.55, tpr: 0.94 },
    { fpr: 1, tpr: 1 }
  ];

  const rocData = (metrics && metrics.roc_curve) ? metrics.roc_curve : defaultRoc;
  const cm = metrics?.confusion_matrix || { tn: 915, fp: 120, fn: 155, tp: 219 };

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Header & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
            Model Evaluation & ROC-AUC Diagnostics
          </span>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Logistic Regression performance on 20% stratified test set
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveView('roc')}
            className={activeView === 'roc' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
          >
            ROC Curve
          </button>
          <button
            onClick={() => setActiveView('cm')}
            className={activeView === 'cm' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
          >
            Confusion Matrix
          </button>
        </div>
      </div>

      {/* View 1: ROC Curve Plot */}
      {activeView === 'roc' ? (
        <div style={{ width: '100%', height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rocData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="fpr" 
                stroke="#64748b" 
                fontSize={11}
                label={{ value: 'False Positive Rate (FPR)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
              />
              <YAxis 
                dataKey="tpr" 
                stroke="#64748b" 
                fontSize={11}
                label={{ value: 'True Positive Rate (TPR)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{
                  background: '#0d121f',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="tpr" 
                name="TPR (Sensitivity)" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                dot={{ r: 3, fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* View 2: Confusion Matrix Heatmap */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 140px 140px', gap: '8px', textAlign: 'center' }}>
            <div />
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>Pred: No Churn (0)</div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>Pred: Churn (1)</div>

            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px' }}>
              Actual: No Churn
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#6ee7b7' }}>{cm.tn}</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>True Negative (TN)</div>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fca5a5' }}>{cm.fp}</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>False Positive (FP)</div>
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px' }}>
              Actual: Churn
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fcd34d' }}>{cm.fn}</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>False Negative (FN)</div>
            </div>
            <div style={{ background: 'rgba(139, 92, 246, 0.25)', border: '1px solid #8b5cf6', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#c084fc' }}>{cm.tp}</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>True Positive (TP)</div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Summary Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-around', background: '#0d121f', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>AUC Score</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#c084fc', fontFamily: 'JetBrains Mono' }}>
            {metrics?.auc_score || '0.846'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Accuracy</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#6ee7b7', fontFamily: 'JetBrains Mono' }}>
            {metrics?.accuracy ? (metrics.accuracy * 100).toFixed(1) : '80.5'}%
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Precision</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#93c5fd', fontFamily: 'JetBrains Mono' }}>
            {metrics?.precision ? (metrics.precision * 100).toFixed(1) : '64.6'}%
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Recall</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fcd34d', fontFamily: 'JetBrains Mono' }}>
            {metrics?.recall ? (metrics.recall * 100).toFixed(1) : '58.5'}%
          </div>
        </div>
      </div>
    </div>
  );
}
