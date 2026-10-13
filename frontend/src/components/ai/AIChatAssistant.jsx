import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  AlertTriangle,
  User,
  Sparkles,
  Calendar,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import aiService from '../../services/aiService';

const QUICK_PROMPTS = [
  "I have fever, cough and sore throat.",
  "Chest pain radiating to my shoulder.",
  "Severe headache, migraine and light sensitivity.",
  "Knee joint stiffness and swelling after running.",
  "Red itchy skin rash with small bumps.",
  "Stomach ache, acid reflux and mild nausea."
];

const AIChatAssistant = ({ onBookDoctorFromAI }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: "Hello! I am your CareConnect AI Health Assistant. Please describe any symptoms you are experiencing (e.g. 'I have fever, cough and sore throat') and I will help guide you toward relevant hospital specialties and qualified doctors.",
      disclaimer: "⚠️ CareConnect AI does not provide medical diagnosis. Information provided is for educational and appointment triage guidance only.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Simulate brief neural response time for realistic AI interaction
      const triageResult = await aiService.triageSymptoms(query);

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: triageResult.summary,
        data: triageResult,
        disclaimer: triageResult.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: "I experienced a temporary connection hiccup. Please describe your symptoms again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: "Conversation refreshed. How may I assist your medical triage today?",
        disclaimer: "⚠️ CareConnect AI does not provide medical diagnosis.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="ai-chat-container">
      {/* Header */}
      <div className="ai-chat-header">
        <div className="ai-chat-header-info">
          <div className="ai-bot-avatar">
            <Bot size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              CareConnect AI Assistant <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>Clinical Triage v2.4</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Always online • Decision support for specialist discovery
            </div>
          </div>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          style={{ color: '#94a3b8' }}
          onClick={handleResetChat}
          title="Restart Conversation"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {/* Messages Viewport */}
      <div className="ai-chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`ai-msg ${msg.sender}`}>
            {msg.sender === 'assistant' ? (
              <div className="ai-bot-avatar" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            ) : (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#0284c7',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <User size={16} />
              </div>
            )}

            <div className="ai-msg-bubble">
              <div>{msg.text}</div>

              {/* High Urgency / Emergency Warning */}
              {msg.data?.isEmergency && (
                <div className="ai-emergency-box">
                  <ShieldAlert size={22} style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                      URGENT MEDICAL NOTICE: CALL EMERGENCY SERVICES
                    </div>
                    <div style={{ fontSize: '0.82rem', marginTop: '2px' }}>
                      Potential acute cardiovascular symptoms detected. Do not wait for a clinic booking. Call 911 or visit the nearest Emergency Room immediately.
                    </div>
                  </div>
                </div>
              )}

              {/* Structured Clinical Recommendation Section */}
              {msg.data && (
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Recommended Specialty Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>
                      Recommended Specialty:
                    </span>
                    <span className="badge badge-primary" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                      {msg.data.recommendedSpecialty}
                    </span>
                    {msg.data.secondarySpecialty && (
                      <span className="badge badge-teal" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                        {msg.data.secondarySpecialty}
                      </span>
                    )}
                  </div>

                  {/* Red flags to monitor */}
                  {msg.data.redFlags && msg.data.redFlags.length > 0 && (
                    <div
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        fontSize: '0.84rem'
                      }}
                    >
                      <strong style={{ color: '#991b1b', display: 'block', marginBottom: '4px' }}>
                        Key Red Flag Symptoms to Monitor:
                      </strong>
                      <ul style={{ paddingLeft: '18px', color: '#7f1d1d', margin: 0 }}>
                        {msg.data.redFlags.map((flag, idx) => (
                          <li key={idx} style={{ marginBottom: '2px' }}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Self-care tips */}
                  {msg.data.selfCareTips && msg.data.selfCareTips.length > 0 && (
                    <div
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        fontSize: '0.84rem'
                      }}
                    >
                      <strong style={{ color: '#166534', display: 'block', marginBottom: '4px' }}>
                        Supportive Home Care Recommendations:
                      </strong>
                      <ul style={{ paddingLeft: '18px', color: '#14532d', margin: 0 }}>
                        {msg.data.selfCareTips.map((tip, idx) => (
                          <li key={idx} style={{ marginBottom: '2px' }}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Top Matching Specialists to Book Immediately */}
                  {msg.data.recommendedDoctors && msg.data.recommendedDoctors.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        Available CareConnect Specialists for this condition:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {msg.data.recommendedDoctors.map((doc) => (
                          <div
                            key={doc.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '10px',
                              padding: '8px 12px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={doc.avatar}
                                alt={doc.name}
                                style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                              />
                              <div>
                                <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{doc.name}</strong>
                                <div style={{ fontSize: '0.78rem', color: '#0284c7' }}>{doc.specialty} • ${doc.consultationFee}</div>
                              </div>
                            </div>
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                              onClick={() => onBookDoctorFromAI && onBookDoctorFromAI(doc)}
                            >
                              <Calendar size={13} /> Book Slot
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Disclaimer */}
              {msg.disclaimer && (
                <div className="ai-disclaimer-box">
                  {msg.disclaimer}
                </div>
              )}

              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '6px', textAlign: 'right' }}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="ai-msg assistant">
            <div className="ai-bot-avatar" style={{ width: '32px', height: '32px' }}>
              <Bot size={16} />
            </div>
            <div className="ai-msg-bubble" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Analyzing clinical symptoms...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div style={{ padding: '8px 16px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0', overflowX: 'auto', display: 'flex', gap: '8px', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>Try:</span>
        {QUICK_PROMPTS.map((promptText, i) => (
          <button
            key={i}
            className="symptom-chip"
            style={{ fontSize: '0.76rem', padding: '4px 10px' }}
            onClick={() => handleSendMessage(promptText)}
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="ai-chat-input-bar">
        <input
          type="text"
          className="ai-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your symptoms in natural language (e.g. 'fever, cough and sore throat')..."
        />
        <button
          className="btn btn-primary"
          style={{ width: '44px', height: '44px', borderRadius: '50%', padding: 0 }}
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          aria-label="Send symptom description"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIChatAssistant;
