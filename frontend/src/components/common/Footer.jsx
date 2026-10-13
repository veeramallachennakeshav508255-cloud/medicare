import React from 'react';
import { HeartPulse, PhoneCall, Mail, MapPin, Shield, Clock, Award } from 'lucide-react';

const Footer = ({ setActivePage, onOpenAIModal }) => {
  return (
    <footer className="footer">
      <div className="content-container">
        {/* Emergency Hotline Alert Strip */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(220, 38, 38, 0.05))',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '16px',
            padding: '18px 24px',
            marginBottom: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <PhoneCall size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.05rem' }}>
                24/7 Hospital Emergency & Trauma Line
              </div>
              <div style={{ fontSize: '0.85rem', color: '#fca5a5' }}>
                For immediate life-threatening situations, dial 911 or call CareConnect Rapid Response.
              </div>
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171', letterSpacing: '0.04em' }}>
            +1 (800) 999-CARE
          </div>
        </div>

        {/* Footer Columns */}
        <div className="footer-grid">
          <div>
            <div className="brand-logo" style={{ marginBottom: '16px' }}>
              <div className="brand-icon-box">
                <HeartPulse size={24} />
              </div>
              <div className="brand-name" style={{ color: '#ffffff' }}>
                CareConnect <span className="brand-ai">AI</span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Next-generation hospital appointment system powered by clinical AI triage. Connecting patients to the right medical specialists faster, safer, and effortlessly.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#38bdf8' }}>
              <Shield size={16} /> HIPAA Compliant & ISO 27001 Certified Architecture
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Quick Navigation</h4>
            <ul className="footer-links">
              <li>
                <a className="footer-link" href="#home" onClick={(e) => { e.preventDefault(); setActivePage('home'); }}>
                  Home
                </a>
              </li>
              <li>
                <a className="footer-link" href="#doctors" onClick={(e) => { e.preventDefault(); setActivePage('doctors'); }}>
                  Find Doctors
                </a>
              </li>
              <li>
                <a className="footer-link" href="#departments" onClick={(e) => { e.preventDefault(); setActivePage('departments'); }}>
                  Medical Departments
                </a>
              </li>
              <li>
                <a className="footer-link" href="#ai" onClick={(e) => { e.preventDefault(); onOpenAIModal(); }}>
                  AI Symptom Assistant
                </a>
              </li>
              <li>
                <a className="footer-link" href="#appointments" onClick={(e) => { e.preventDefault(); setActivePage('patient-dashboard'); }}>
                  Patient Portal
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Specialties</h4>
            <ul className="footer-links">
              <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setActivePage('doctors')}>Cardiology</span></li>
              <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setActivePage('doctors')}>Neurology & Brain Sciences</span></li>
              <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setActivePage('doctors')}>Pediatrics & Child Care</span></li>
              <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setActivePage('doctors')}>Orthopedics & Joint Care</span></li>
              <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setActivePage('doctors')}>Dermatology & Skin Center</span></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Hospital Campus</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: '2px' }} />
                <span>450 Innovation Parkway, Medical Technology District, Seattle, WA 98101</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} style={{ color: '#0ea5e9', flexShrink: 0 }} />
                <span>Outpatient: Mon–Sat 8:00 AM – 8:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} style={{ color: '#0ea5e9', flexShrink: 0 }} />
                <span>support@careconnect.ai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} CareConnect AI Healthcare Systems. All rights reserved.
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Disclaimer: CareConnect AI provides decision support and symptom triage assistance. It does not replace professional medical diagnosis.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
