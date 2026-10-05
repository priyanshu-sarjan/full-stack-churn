import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip 
} from 'recharts';
import { Sliders } from 'lucide-react';

export default function SegmentRadarChart({ segments }) {
  // Polygon radar data comparing High-Value At-Risk vs Loyal Power Users (matching uploaded spider chart)
  const radarData = [
    { feature: 'Tenure', 'High-Value At-Risk': 25, 'Loyal Power Users': 92, 'Low-Tenure Budget': 15 },
    { feature: 'Monthly Bill', 'High-Value At-Risk': 95, 'Loyal Power Users': 88, 'Low-Tenure Budget': 35 },
    { feature: 'Tech Support', 'High-Value At-Risk': 18, 'Loyal Power Users': 85, 'Low-Tenure Budget': 20 },
    { feature: 'Security', 'High-Value At-Risk': 22, 'Loyal Power Users': 78, 'Low-Tenure Budget': 12 },
    { feature: 'Paperless', 'High-Value At-Risk': 88, 'Loyal Power Users': 65, 'Low-Tenure Budget': 45 },
    { feature: 'Contract Length', 'High-Value At-Risk': 12, 'Loyal Power Users': 95, 'Low-Tenure Budget': 20 }
  ];

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
            Segment Profiles (Feature Radar)
          </span>
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.2)',
            color: '#c084fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: '700'
          }}>
            2
          </div>
        </div>
        <Sliders size={15} color="#64748b" />
      </div>

      {/* Radar Chart Container */}
      <div style={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
            <PolarAngleAxis dataKey="feature" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.05)" tick={false} />
            <Radar 
              name="High-Value At-Risk" 
              dataKey="High-Value At-Risk" 
              stroke="#f59e0b" 
              fill="#f59e0b" 
              fillOpacity={0.3} 
            />
            <Radar 
              name="Loyal Power Users" 
              dataKey="Loyal Power Users" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.3} 
            />
            <Radar 
              name="Low-Tenure Budget" 
              dataKey="Low-Tenure Budget" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.2} 
            />
            <Tooltip 
              contentStyle={{
                background: '#0d121f',
                borderColor: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.75rem'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend below matching image design */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.72rem', color: '#94a3b8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
          <span>High-Value At-Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
          <span>Loyal Power Users</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
          <span>Budget Segments</span>
        </div>
      </div>
    </div>
  );
}
