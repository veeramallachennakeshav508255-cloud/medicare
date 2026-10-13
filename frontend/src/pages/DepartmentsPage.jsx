import React from 'react';
import {
  Layers,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Sparkles,
  Stethoscope,
  Activity,
  ShieldAlert,
  ArrowRight,
  Bot,
  Users
} from 'lucide-react';

const iconMap = {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Sparkles,
  Stethoscope,
  Activity,
  ShieldAlert
};

const DepartmentsPage = ({ departments, onSelectDepartment, onOpenAIModal }) => {
  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#f8fafc', minHeight: '80vh' }}>
      <div className="content-container">
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span className="badge badge-teal" style={{ marginBottom: '12px' }}>
            <Layers size={13} /> Specialized Clinical Divisions
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            Hospital Medical Departments
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Our hospital features state-of-the-art departments staffed by world-class specialists. Select any department to explore available doctors and clinical treatments.
          </p>
        </div>

        {/* Departments Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {departments.map((dep) => {
            const Icon = iconMap[dep.icon] || HeartPulse;

            return (
              <div
                key={dep.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Top Badge & Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '14px',
                      background: dep.bgLight,
                      color: dep.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={26} />
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.82rem' }}>
                    <Users size={12} /> {dep.doctorCount} Specialists
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    {dep.name}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
                    Head of Dept: <strong>{dep.headDoctor}</strong>
                  </div>
                </div>

                <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>
                  {dep.description}
                </p>

                {/* Common Symptoms / Indications */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Common Conditions Treated:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {dep.symptoms?.map((sym) => (
                      <span
                        key={sym}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: '#f1f5f9',
                          color: '#334155',
                          fontSize: '0.78rem',
                          fontWeight: 500
                        }}
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => onSelectDepartment(dep.name)}
                  >
                    Browse Specialists in {dep.name} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Symptom Banner */}
        <div
          className="card"
          style={{
            marginTop: '48px',
            background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
            border: '1.5px solid #bae6fd',
            borderRadius: '20px',
            padding: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Not sure which department fits your condition?
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem' }}>
              Chat with our clinical AI assistant to receive an instant department referral based on your symptoms.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={onOpenAIModal}>
            <Bot size={18} /> Consult AI Triage Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
