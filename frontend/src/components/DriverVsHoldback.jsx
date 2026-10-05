import React from 'react';
import { Sliders, HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DriverVsHoldback({ oddsRatios }) {
  // Default fallback odds ratios if backend API is loading
  const defaultOdds = [
    { display_name: "Contract: Month-to-month", odds_ratio: 2.4512, impact: "Increases Churn Risk" },
    { display_name: "Internet: Fiber Optic", odds_ratio: 1.8234, impact: "Increases Churn Risk" },
    { display_name: "Payment: Electronic Check", odds_ratio: 1.3450, impact: "Increases Churn Risk" },
    { display_name: "Paperless Billing", odds_ratio: 1.2180, impact: "Increases Churn Risk" },
    { display_name: "Tech Support: Yes", odds_ratio: 0.7120, impact: "Reduces Churn Risk" },
    { display_name: "Online Security: Yes", odds_ratio: 0.7580, impact: "Reduces Churn Risk" },
    { display_name: "Contract: Two Year", odds_ratio: 0.3790, impact: "Reduces Churn Risk" }
  ];

  const items = (oddsRatios && oddsRatios.length > 0) ? oddsRatios.slice(0, 6) : defaultOdds;

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
            Driver vs Holdback (Odds Ratios)
          </span>
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#a5b4fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: '700'
          }}>
            ?
          </div>
        </div>
        <Sliders size={15} color="#64748b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '20px', alignItems: 'center' }}>
        {/* Left Circular Gauge matching uploaded image */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <svg width="110" height="110" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="14" />
            {/* Holdback Arc (Purple) */}
            <circle 
              cx="50" cy="50" r="38" 
              fill="none" 
              stroke="#8b5cf6" 
              strokeWidth="14" 
              strokeDasharray="238" 
              strokeDashoffset="70" 
              transform="rotate(-90 50 50)" 
            />
            {/* Driver Arc (Orange/Amber) */}
            <circle 
              cx="50" cy="50" r="38" 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth="14" 
              strokeDasharray="238" 
              strokeDashoffset="160" 
              transform="rotate(60 50 50)" 
            />
            {/* Center Inner Circle */}
            <circle cx="50" cy="50" r="30" fill="#0d121f" />
          </svg>

          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ratio</span>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>2.45x</div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', fontSize: '0.68rem', fontWeight: '600' }}>
            <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} /> Driver
            </span>
            <span style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }} /> Holdback
            </span>
          </div>
        </div>

        {/* Right Odds Ratio Impact Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item, idx) => {
            const isDriver = item.odds_ratio >= 1.0;
            const percentage = Math.min(100, Math.max(15, (item.odds_ratio / 3.0) * 100));
            const barColor = isDriver ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #6366f1, #10b981)';

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: '#cbd5e1', fontWeight: '500' }}>
                    {item.display_name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isDriver ? <ArrowUpRight size={12} color="#ef4444" /> : <ArrowDownRight size={12} color="#10b981" />}
                    <span style={{ fontWeight: '700', color: isDriver ? '#fca5a5' : '#6ee7b7', fontFamily: 'JetBrains Mono, monospace' }}>
                      {item.odds_ratio}x
                    </span>
                  </div>
                </div>
                <div style={{
                  height: '5px',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: barColor,
                    borderRadius: '3px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
