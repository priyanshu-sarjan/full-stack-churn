import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricsHeader from './components/MetricsHeader';
import DriverVsHoldback from './components/DriverVsHoldback';
import SegmentRadarChart from './components/SegmentRadarChart';
import ServiceMatrix from './components/ServiceMatrix';
import ClusterScatterPlot from './components/ClusterScatterPlot';
import RiskSimulator from './components/RiskSimulator';
import ModelEvaluation from './components/ModelEvaluation';
import CustomerTable from './components/CustomerTable';
import FuseAIPanel from './components/FuseAIPanel';

const API_BASE = '/api/v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  // ML Data state
  const [segments, setSegments] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [oddsRatios, setOddsRatios] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [backendStatus, setBackendStatus] = useState('Connecting...');
  const [healthInfo, setHealthInfo] = useState(null);
  const [selectedSimulatorProfile, setSelectedSimulatorProfile] = useState(null);

  // Fetch initial ML metrics & segments from FastAPI backend
  useEffect(() => {
    async function loadEngineData() {
      try {
        const t0 = performance.now();
        // Check health endpoint first
        try {
          const healthRes = await fetch(`${API_BASE}/health`);
          if (healthRes.ok) {
            const hData = await healthRes.json();
            const latency = Math.round(performance.now() - t0);
            setHealthInfo({ ...hData, latencyMs: latency });
            setBackendStatus('Online');
          }
        } catch (e) {
          console.warn("[App] Health ping failed, proceeding with data endpoints:", e);
        }

        // Fetch remaining data in parallel
        const [segRes, perfRes, custRes] = await Promise.allSettled([
          fetch(`${API_BASE}/segments`),
          fetch(`${API_BASE}/analytics/model-performance`),
          fetch(`${API_BASE}/customers?limit=100`)
        ]);

        if (segRes.status === 'fulfilled' && segRes.value.ok) {
          const segData = await segRes.value.json();
          setSegments(segData.segments || []);
        }

        if (perfRes.status === 'fulfilled' && perfRes.value.ok) {
          const perfData = await perfRes.value.json();
          setMetrics(perfData.metrics || null);
          setOddsRatios(perfData.odds_ratios || []);
        }

        if (custRes.status === 'fulfilled' && custRes.value.ok) {
          const custData = await custRes.value.json();
          setCustomers(custData.customers || []);
        }

        setBackendStatus('Online');
      } catch (err) {
        console.warn("[App] FastAPI backend connecting or offline, using cached ML engine state:", err);
        setBackendStatus('Cached Mode');
      }
    }
    loadEngineData();
  }, []);

  const handleSimulateCustomer = (cust) => {
    if (!cust) return;
    setSelectedSimulatorProfile(cust);
    setActiveTab('Simulator');
  };

  // Simulator prediction handler
  const handlePredictChurn = async (profile) => {
    try {
      const res = await fetch(`${API_BASE}/predict-churn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  // AI Insights query handler
  const handleAskAI = async (promptText) => {
    try {
      const res = await fetch(`${API_BASE}/ai-insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar 
        isSidePanelOpen={isSidePanelOpen} 
        toggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        healthInfo={healthInfo}
      />

      <div className="main-layout">
        {/* Central Dashboard Scroll Area */}
        <main className="content-area">
          
          {/* Row 1: Summary Metric Header Cards */}
          <MetricsHeader metrics={metrics} segments={segments} />

          {/* Tab 1: Full Overview Dashboard matching uploaded image */}
          {activeTab === 'Overview' && (
            <>
              {/* Row 2: Driver vs Holdback Gauge & Segment Radar Chart */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
                <DriverVsHoldback oddsRatios={oddsRatios} />
                <SegmentRadarChart segments={segments} />
              </div>

              {/* Row 3: Service Subscriptions Dot Matrix */}
              <ServiceMatrix />

              {/* Row 4: K-Means 2D Scatter Plot Cluster Explorer */}
              <ClusterScatterPlot customers={customers} segments={segments} />

              {/* Row 5: Interactive Risk Score Simulator */}
              <RiskSimulator 
                onPredict={handlePredictChurn} 
                initialProfile={selectedSimulatorProfile} 
              />

              {/* Row 6: Customer Directory Table */}
              <CustomerTable 
                customers={customers} 
                onSimulateCustomer={handleSimulateCustomer} 
              />
            </>
          )}

          {/* Tab 2: Dedicated Simulator View */}
          {activeTab === 'Simulator' && (
            <RiskSimulator 
              onPredict={handlePredictChurn} 
              initialProfile={selectedSimulatorProfile} 
            />
          )}

          {/* Tab 3: Dedicated Customer Directory */}
          {activeTab === 'Directory' && (
            <CustomerTable 
              customers={customers} 
              onSimulateCustomer={handleSimulateCustomer} 
            />
          )}

          {/* Tab 4: Model Evaluation Diagnostics */}
          {activeTab === 'Model ROC' && (
            <ModelEvaluation metrics={metrics} />
          )}

        </main>

        {/* Right Fuse AI Copilot Side Panel */}
        {isSidePanelOpen && (
          <FuseAIPanel 
            onClose={() => setIsSidePanelOpen(false)} 
            onAskAI={handleAskAI}
          />
        )}
      </div>
    </div>
  );
}
