import React, { useState } from 'react';
import { Search, Filter, Eye, ChevronRight, UserCheck, ShieldAlert, X, Zap } from 'lucide-react';

export default function CustomerTable({ customers, onSelectCustomer, onSimulateCustomer }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [drawerCustomer, setDrawerCustomer] = useState(null);

  const filtered = (customers || []).filter(c => {
    if (searchTerm && !c.customerID.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedRisk !== 'All' && c.Risk_Level !== selectedRisk) return false;
    if (selectedSegment !== 'All' && c.Cluster_Name !== selectedSegment) return false;
    return true;
  });

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search & Filter Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
            Customer Directory & Segment Profiles
          </span>
          <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
            {filtered.length} Accounts
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search Customer ID..." 
              className="input-dark" 
              style={{ paddingLeft: '32px', width: '170px', height: '32px', fontSize: '0.78rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Risk Level Filter */}
          <select 
            className="input-dark" 
            style={{ height: '32px', padding: '4px 10px', fontSize: '0.78rem' }}
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical Risk (&gt;70%)</option>
            <option value="High">High Risk (50-70%)</option>
            <option value="Moderate">Moderate Risk (25-50%)</option>
            <option value="Low">Low Risk (&lt;25%)</option>
          </select>

          {/* Segment Filter */}
          <select 
            className="input-dark" 
            style={{ height: '32px', padding: '4px 10px', fontSize: '0.78rem' }}
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
          >
            <option value="All">All Segments</option>
            <option value="High-Value At-Risk">High-Value At-Risk</option>
            <option value="Loyal Power Users">Loyal Power Users</option>
            <option value="Low-Tenure Budget">Low-Tenure Budget</option>
            <option value="Standard Stable">Standard Stable</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Customer ID</th>
              <th style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Cluster Segment</th>
              <th style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Risk Score</th>
              <th style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Tenure</th>
              <th style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Monthly Bill</th>
              <th style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Contract</th>
              <th style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Tech Support</th>
              <th style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 8).map((c, i) => (
              <tr key={c.customerID || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s ease' }}>
                <td style={{ padding: '10px 12px', fontSize: '0.8rem', fontWeight: '700', color: '#ffffff', fontFamily: 'JetBrains Mono' }}>
                  {c.customerID}
                </td>
                <td style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                  {c.Cluster_Name}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <span className={`badge badge-${c.Risk_Level?.toLowerCase()}`}>
                    {c.Churn_Probability}% ({c.Risk_Level})
                  </span>
                </td>
                <td style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#94a3b8' }}>
                  {c.tenure} mos
                </td>
                <td style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#f59e0b', fontWeight: '600', fontFamily: 'JetBrains Mono' }}>
                  ${c.MonthlyCharges}
                </td>
                <td style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#94a3b8' }}>
                  {c.Contract}
                </td>
                <td style={{ padding: '10px 12px', fontSize: '0.78rem' }}>
                  <span style={{ color: c.TechSupport === 'Yes' ? '#10b981' : '#64748b', fontWeight: '500' }}>
                    {c.TechSupport}
                  </span>
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <button 
                    onClick={() => setDrawerCustomer(c)}
                    className="btn-secondary" 
                    style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                  >
                    <Eye size={12} />
                    <span>Inspect</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Modal Drawer */}
      {drawerCustomer && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '480px', maxWidth: '90%', padding: '24px', position: 'relative' }}>
            <button 
              onClick={() => setDrawerCustomer(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff' }}>
                {drawerCustomer.customerID.substring(0, 2)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>Account: {drawerCustomer.customerID}</h3>
                <span className={`badge badge-${drawerCustomer.Risk_Level?.toLowerCase()}`}>{drawerCustomer.Risk_Level} Risk • {drawerCustomer.Churn_Probability}% Churn Prob</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#0d121f', padding: '14px', borderRadius: '10px', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '16px' }}>
              <div>Cluster Segment: <b style={{ color: '#fff' }}>{drawerCustomer.Cluster_Name}</b></div>
              <div>Tenure: <b style={{ color: '#fff' }}>{drawerCustomer.tenure} months</b></div>
              <div>Monthly Bill: <b style={{ color: '#f59e0b' }}>${drawerCustomer.MonthlyCharges}</b></div>
              <div>Total Charges: <b style={{ color: '#fff' }}>${drawerCustomer.TotalCharges}</b></div>
              <div>Contract: <b style={{ color: '#fff' }}>{drawerCustomer.Contract}</b></div>
              <div>Internet Service: <b style={{ color: '#fff' }}>{drawerCustomer.InternetService}</b></div>
              <div>Tech Support: <b style={{ color: '#fff' }}>{drawerCustomer.TechSupport}</b></div>
              <div>Payment Method: <b style={{ color: '#fff' }}>{drawerCustomer.PaymentMethod}</b></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  if (onSimulateCustomer) onSimulateCustomer(drawerCustomer);
                  setDrawerCustomer(null);
                }} 
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Zap size={14} />
                <span>Simulate in What-If Engine →</span>
              </button>
              <button onClick={() => setDrawerCustomer(null)} className="btn-secondary">
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
