import React, { useState } from 'react';
import { 
  Sparkles, X, Plus, Clock, ChevronDown, Mic, Paperclip, Send, 
  HelpCircle, Bot, Zap, ArrowRight 
} from 'lucide-react';

export default function FuseAIPanel({ onClose, onAskAI }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your Fuse AI Churn Copilot. I can analyze K-Means customer segments, calculate Logistic Regression odds ratios, or evaluate ROC-AUC model metrics. How can I assist your team today?'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    "Top Churn Drivers & Odds Ratios",
    "High-Value At-Risk Strategy",
    "Model Performance & ROC-AUC",
    "What-if Simulator Guidance"
  ];

  const handleSend = async (textToSend) => {
    const promptText = textToSend || query;
    if (!promptText.trim()) return;

    // Add user message
    const newMsgs = [...messages, { sender: 'user', text: promptText }];
    setMessages(newMsgs);
    setQuery('');
    setLoading(true);

    try {
      const res = await onAskAI(promptText);
      const reply = res?.response || "Analysis completed for your query. The K-Means engine parsed 7,043 customer accounts across 4 distinct clusters.";
      setMessages([...newMsgs, { sender: 'ai', text: reply }]);
    } catch (e) {
      setMessages([...newMsgs, { sender: 'ai', text: "Error connecting to AI backend. Please verify FastAPI server status." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="side-panel">
      {/* Sidebar Header matching screenshot */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Sparkles size={14} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#ffffff' }}>
            Fuse AI
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>≡</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <Plus size={16} />
          </button>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Top Banner Stats */}
      <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.08)', borderBottom: '1px solid rgba(99, 102, 241, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <span style={{ color: '#a5b4fc', fontWeight: '600' }}>
            Telco Churn Stats: 7,043 active accounts
          </span>
          <Clock size={12} color="#818cf8" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.75rem', color: '#cbd5e1', fontWeight: '700' }}>
          <span>Summary</span>
          <ChevronDown size={12} />
        </div>
      </div>

      {/* Scrollable Main Assistant Content */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Complex Charts Widget matching screenshot */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>
              Complex ML Charts
            </span>
            <X size={12} color="#64748b" />
          </div>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '10px' }}>
            Modify the chart type or adjust its visualization settings for odds ratio attribution.
          </p>

          {/* Mini Bubble Matrix Dot Grid inside widget matching screenshot */}
          <div style={{ background: '#090d16', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Ethnicity & Service Distribution
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
              <div className="matrix-bubble">437</div>
              <div className="matrix-bubble empty" />
              <div className="matrix-bubble">123</div>
              <div className="matrix-bubble">437</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.7rem' }}>
            <span style={{ color: '#94a3b8' }}>Switch to line chart (5.4% growth)</span>
            <button className="btn-primary" style={{ padding: '3px 8px', fontSize: '0.68rem' }}>
              Use ✓
            </button>
          </div>
        </div>

        {/* Conversation Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '90%',
                background: m.sender === 'user' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#111726',
                border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: '#ffffff',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '0.78rem',
                lineHeight: '1.4'
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div style={{ fontSize: '0.75rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={12} className="spin" />
              <span>Analyzing ML pipeline metrics...</span>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Prompt Pills matching screenshot */}
      <div style={{ padding: '8px 16px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '0.7rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Bottom Chat Input Form matching screenshot */}
      <div style={{ padding: '12px 16px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <input
            type="text"
            placeholder="Ask a question..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.8rem',
              flex: 1,
              outline: 'none'
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <Paperclip size={14} />
          </button>
          <button style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <Mic size={14} />
          </button>
          <button 
            onClick={() => handleSend()}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </aside>
  );
}
