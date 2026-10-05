import React, { useState } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Filter, Users } from 'lucide-react';

export default function ClusterScatterPlot({ customers, segments }) {
  const [selectedCluster, setSelectedCluster] = useState('All');

  const clusterColors = {
    "High-Value At-Risk": "#ef4444",
    "Loyal Power Users": "#10b981",
    "Low-Tenure Budget": "#f59e0b",
    "Standard Stable": "#6366f1"
  };

  const filteredData = (customers && customers.length > 0) ? customers.filter(c => {
    if (selectedCluster === 'All') return true;
    return c.Cluster_Name === selectedCluster;
  }) : [];

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
            K-Means 2D Customer Segment Explorer
          </span>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Clusters mapped across Tenure (Months) vs Monthly Charges ($)
          </p>
        </div>

        {/* Segment Filter Pill Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'High-Value At-Risk', 'Loyal Power Users', 'Low-Tenure Budget', 'Standard Stable'].map(seg => (
            <button
              key={seg}
              onClick={() => setSelectedCluster(seg)}
              style={{
                background: selectedCluster === seg ? (clusterColors[seg] || 'rgba(99, 102, 241, 0.3)') : 'rgba(255,255,255,0.05)',
                color: selectedCluster === seg ? '#ffffff' : '#94a3b8',
                border: selectedCluster === seg ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Scatter Plot */}
      <div style={{ width: '100%', height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              type="number" 
              dataKey="tenure" 
              name="Tenure" 
              unit=" mos" 
              stroke="#64748b" 
              fontSize={11}
              label={{ value: 'Tenure (Months)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }} 
            />
            <YAxis 
              type="number" 
              dataKey="MonthlyCharges" 
              name="Monthly Charges" 
              unit="$" 
              stroke="#64748b" 
              fontSize={11}
              label={{ value: 'Monthly Charges ($)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} 
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div style={{
                      background: '#0d121f',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      color: '#fff',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ fontWeight: '700', color: clusterColors[data.Cluster_Name] || '#6366f1', marginBottom: '4px' }}>
                        ID: {data.customerID} ({data.Cluster_Name})
                      </div>
                      <div>Tenure: <b>{data.tenure} months</b></div>
                      <div>Monthly Charges: <b>${data.MonthlyCharges}</b></div>
                      <div>Contract: <b>{data.Contract}</b></div>
                      <div>Churn Probability: <b style={{ color: data.Churn_Probability > 50 ? '#ef4444' : '#10b981' }}>{data.Churn_Probability}%</b></div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Customers" data={filteredData} fill="#8884d8">
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={clusterColors[entry.Cluster_Name] || '#6366f1'} 
                  fillOpacity={0.7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Cluster Legend Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
        {Object.entries(clusterColors).map(([name, color]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
            <span style={{ color: '#cbd5e1', fontWeight: '500' }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
