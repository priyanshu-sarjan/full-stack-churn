import React from 'react';
import { Sliders } from 'lucide-react';

export default function ServiceMatrix() {
  const rows = [
    "Fiber Optic",
    "DSL Internet",
    "Tech Support",
    "Online Security",
    "Device Protection",
    "Paperless Billing",
    "Electronic Check",
    "Month-to-Month"
  ];

  const columns = ["0-12m", "13-24m", "25-41m", "42-59m", "60-64m", "65-69m", "70-74m", "75+m"];

  // Grid counts matching exact bubble patterns from the screenshot image (437, 123, etc.)
  const matrixData = {
    "Fiber Optic": { "0-12m": 437, "25-41m": 437, "60-64m": 123, "70-74m": 437 },
    "DSL Internet": { "0-12m": 123, "13-24m": 437, "42-59m": 123, "75+m": 437 },
    "Tech Support": { "13-24m": 123, "42-59m": 437, "70-74m": 123, "75+m": 123 },
    "Online Security": { "0-12m": 123, "25-41m": 437, "60-64m": 123, "70-74m": 123 },
    "Device Protection": { "13-24m": 437, "42-59m": 123, "65-69m": 437, "75+m": 437 },
    "Paperless Billing": { "25-41m": 437, "42-59m": 437, "75+m": 437 },
    "Electronic Check": { "0-12m": 123, "25-41m": 437, "42-59m": 123 },
    "Month-to-Month": { "0-12m": 437, "42-59m": 437, "75+m": 123 }
  };

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
            Service Subscriptions by Tenure Matrix
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
            2
          </div>
        </div>
        <Sliders size={15} color="#64748b" />
      </div>

      {/* Matrix Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>
                Service / Feature
              </th>
              {columns.map(col => (
                <th key={col} style={{ textAlign: 'center', padding: '6px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '8px 10px', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: '500', whiteSpace: 'nowrap' }}>
                  {row}
                </td>
                {columns.map(col => {
                  const val = matrixData[row]?.[col];
                  return (
                    <td key={col} style={{ textAlign: 'center', padding: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {val ? (
                          <div className="matrix-bubble">
                            {val}
                          </div>
                        ) : (
                          <div className="matrix-bubble empty" />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
