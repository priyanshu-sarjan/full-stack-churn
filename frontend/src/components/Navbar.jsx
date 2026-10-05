import React from 'react';
import { 
  ArrowLeft, Search, Settings, Bell, Share2, Edit3, 
  Sparkles, Layers, Sliders, ChevronDown, PanelRightClose, PanelRightOpen 
} from 'lucide-react';

export default function Navbar({ isSidePanelOpen, toggleSidePanel, activeTab, setActiveTab }) {
  return (
    <header style={{
      height: '64px',
      background: '#0d121f',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Left Navigation Brand & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '800',
          fontSize: '1.25rem',
          color: '#ffffff',
          letterSpacing: '-0.02em'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px rgba(139, 92, 246, 0.5)'
          }}>
            <Sparkles size={18} color="#ffffff" />
          </div>
          <span>fusedash</span>
        </div>

        <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

        <button className="btn-secondary" style={{ padding: '6px 10px' }}>
          <ArrowLeft size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
            Customer Churn & Segmentation Engine
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ ML v1.0</span>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '3px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.08)',
          marginLeft: '12px'
        }}>
          {['Overview', 'Simulator', 'Directory', 'Model ROC'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                color: activeTab === tab ? '#ffffff' : '#94a3b8',
                border: activeTab === tab ? '1px solid rgba(99, 102, 241, 0.4)' : 'none',
                padding: '5px 12px',
                borderRadius: '7px',
                fontSize: '0.8rem',
                fontWeight: activeTab === tab ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Right User & Utility Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search metric or ID..."
            className="input-dark"
            style={{ paddingLeft: '32px', width: '180px', height: '34px', fontSize: '0.8rem' }}
          />
        </div>

        <button className="btn-secondary" style={{ padding: '6px' }} title="Edit Dashboard Layout">
          <Edit3 size={15} />
        </button>

        <button className="btn-secondary" style={{ padding: '6px 12px' }}>
          <Share2 size={14} />
          <span>Share</span>
        </button>

        <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

        <button className="btn-secondary" style={{ padding: '6px' }} title="Notifications">
          <Bell size={15} />
        </button>

        <button className="btn-secondary" style={{ padding: '6px' }} title="Settings">
          <Settings size={15} />
        </button>

        <div className="badge badge-primary" style={{ height: '30px', display: 'flex', alignItems: 'center' }}>
          <Layers size={13} />
          <span>12 Widgets</span>
        </div>

        {/* User Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '6px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.75rem',
            color: '#ffffff',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            RR
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#f8fafc' }}>
              Robert Robertson
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
              robert.r@gmail.com
            </span>
          </div>
          <ChevronDown size={12} color="#64748b" />
        </div>

        {/* Fuse AI Toggle Button */}
        <button
          onClick={toggleSidePanel}
          style={{
            background: isSidePanelOpen ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
            border: isSidePanelOpen ? 'none' : '1px solid rgba(255,255,255,0.1)',
            color: '#ffffff',
            padding: '7px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: '600',
            fontSize: '0.8rem',
            cursor: 'pointer',
            marginLeft: '8px',
            boxShadow: isSidePanelOpen ? '0 0 14px rgba(139, 92, 246, 0.4)' : 'none'
          }}
        >
          <Sparkles size={14} />
          <span>Fuse AI</span>
          {isSidePanelOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
        </button>
      </div>
    </header>
  );
}
