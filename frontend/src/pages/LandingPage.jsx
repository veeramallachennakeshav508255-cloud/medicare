import React from 'react';
import {
  Sparkles,
  Bot,
  Search,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Clock,
  Users,
  Award,
  Star,
  ChevronRight,
  HeartPulse,
  Stethoscope,
  Activity,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';
import DoctorCard from '../components/doctor/DoctorCard';
import heroIllustration from '../assets/hero-illustration.jpg';

const LandingPage = ({
  doctors,
  departments,
  onNavigate,
  onOpenAIModal,
  onBookDoctor,
  onViewDoctorDetails
}) => {
  const featuredDoctors = doctors.slice(0, 4);

  const symptomPills = [
    "Fever & Sore Throat",
    "Chest Pressure",
    "Migraine Headache",
    "Knee & Joint Pain",
    "Skin Allergy",
    "Acid Reflux"
  ];

  return (
    <div>
      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section className="hero-section">
        <div className="hero-glow-blob" />
        <div className="content-container">
          <div className="hero-grid">
            {/* Left Column: Headline and CTAs */}
            <div>
              <div className="hero-pill">
                <Sparkles size={16} className="hero-pill-sparkle" />
                <span>Next-Gen Healthcare Management</span>
              </div>

              <h1 className="hero-title">
                Smarter Healthcare. <br />
                <span className="hero-title-gradient">Simpler Appointments.</span>
              </h1>

              <p className="hero-description">
                CareConnect AI streamlines clinical scheduling and patient triage. Describe your symptoms in natural language, discover verified medical specialists, and book confirmed hospital slots in seconds.
              </p>

              <div className="hero-cta-group">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => onNavigate('doctors')}
                >
                  <Search size={18} /> Find a Doctor
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={onOpenAIModal}
                >
                  <Bot size={18} /> Ask AI Assistant
                </button>
              </div>

              {/* Symptom shortcuts */}
              <div className="hero-symptom-strip">
                <span style={{ fontWeight: 600 }}>Quick Triage:</span>
                {symptomPills.map((symptom) => (
                  <button
                    key={symptom}
                    className="symptom-chip"
                    onClick={onOpenAIModal}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Visual Illustration & Badges */}
            <div className="hero-visual-wrapper">
              <div className="hero-illustration-frame">
                <img
                  src={heroIllustration}
                  alt="CareConnect AI Doctor Consultation and Hospital Appointments"
                  className="hero-illustration-img"
                />

                {/* Floating Badge 1: Confirmed Appointment */}
                <div className="floating-badge floating-badge-1">
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: '#d1fae5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                      Slot Confirmed
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      Today • Dr. Sarah Mitchell
                    </div>
                  </div>
                </div>

                {/* Floating Badge 2: AI Triage Badge */}
                <div className="floating-badge floating-badge-2">
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: '#e0f2fe',
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Bot size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                      AI Triage Active
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 600 }}>
                      98% Match Precision
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          LIVE HOSPITAL STATS BANNER
          ============================================================ */}
      <section className="stats-banner">
        <div className="content-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon-wrap">
                <Users size={26} />
              </div>
              <div>
                <div className="stat-value">15,000+</div>
                <div className="stat-label">Patients Treated</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrap" style={{ background: '#f0fdfa', color: '#0d9488' }}>
                <Stethoscope size={26} />
              </div>
              <div>
                <div className="stat-value">120+</div>
                <div className="stat-label">Certified Specialists</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
                <Award size={26} />
              </div>
              <div>
                <div className="stat-value">98.6%</div>
                <div className="stat-label">Patient Satisfaction</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrap" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                <Clock size={26} />
              </div>
              <div>
                <div className="stat-value">&lt; 15 min</div>
                <div className="stat-label">Avg Clinic Wait Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURE CARDS
          ============================================================ */}
      <section className="features-section">
        <div className="content-container">
          <div className="section-header">
            <span className="section-tag">Intelligent Healthcare</span>
            <h2 className="section-title">Engineered for Better Patient Outcomes</h2>
            <p className="section-subtitle">
              From intelligent symptom triage to seamless appointment management, CareConnect AI elevates the healthcare experience for patients, doctors, and hospital administrators.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                <Bot size={28} />
              </div>
              <h3 className="feature-title">AI Health Assistant</h3>
              <p className="feature-desc">
                Natural language symptom analysis matches you with the right medical specialty while checking for emergency red flags and clinical guidance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-box" style={{ background: '#ccfbf1', color: '#0d9488' }}>
                <Search size={28} />
              </div>
              <h3 className="feature-title">Doctor Discovery</h3>
              <p className="feature-desc">
                Browse board-certified doctors with verified ratings, qualifications, clinic locations, and transparent consultation fees.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
                <Calendar size={28} />
              </div>
              <h3 className="feature-title">Easy Appointment Booking</h3>
              <p className="feature-desc">
                Streamlined 5-step booking wizard with real-time slot conflict prevention, instant booking reference IDs, and reminder notifications.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon-box" style={{ background: '#e0e7ff', color: '#6366f1' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 className="feature-title">Secure Patient Records</h3>
              <p className="feature-desc">
                HIPAA-ready architecture ensuring encrypted digital prescriptions, diagnostic notes, and consultation histories stay strictly confidential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOSPITAL DEPARTMENTS
          ============================================================ */}
      <section style={{ padding: '80px 0', background: '#f1f5f9' }}>
        <div className="content-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-tag">Clinical Departments</span>
              <h2 className="section-title" style={{ marginBottom: '8px' }}>Center of Medical Excellence</h2>
              <p style={{ color: '#64748b' }}>Specialized departments staffed with leading doctors and cutting-edge facilities.</p>
            </div>
            <button className="btn btn-outline" onClick={() => onNavigate('departments')}>
              View All Departments <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {departments.slice(0, 6).map((dep) => (
              <div
                key={dep.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: '#ffffff'
                }}
                onClick={() => onNavigate('doctors')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: dep.bgLight,
                      color: dep.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <HeartPulse size={22} />
                  </div>
                  <span className="badge badge-primary">{dep.doctorCount} Doctors</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{dep.name}</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.55' }}>{dep.description}</p>

                <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#64748b' }}>Head: <strong>{dep.headDoctor}</strong></span>
                  <span style={{ color: '#0284c7', fontWeight: 600 }}>Browse Specialists →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED DOCTORS
          ============================================================ */}
      <section style={{ padding: '80px 0' }}>
        <div className="content-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-tag">Featured Specialists</span>
              <h2 className="section-title" style={{ marginBottom: '8px' }}>Meet Our Top Rated Doctors</h2>
              <p style={{ color: '#64748b' }}>Consult with highly recommended physicians with verified patient reviews.</p>
            </div>
            <button className="btn btn-outline" onClick={() => onNavigate('doctors')}>
              Browse All Doctors <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '24px' }}>
            {featuredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBook={onBookDoctor}
                onViewDetails={onViewDoctorDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS (3-STEP GUIDE)
          ============================================================ */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, #f8fafc 0%, #f0fdfa 100%)' }}>
        <div className="content-container">
          <div className="section-header">
            <span className="section-tag">Patient Journey</span>
            <h2 className="section-title">How CareConnect AI Works</h2>
            <p className="section-subtitle">
              Book a certified specialist consultation in three simple steps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '36px 24px', background: '#ffffff' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#e0f2fe',
                  color: '#0284c7',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>Describe Symptoms or Search</h3>
              <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6 }}>
                Type your symptoms into our AI Assistant or search directly by specialty, hospital campus, and preferred language.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '36px 24px', background: '#ffffff' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#ccfbf1',
                  color: '#0d9488',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>Select Real-time Time Slot</h3>
              <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6 }}>
                Choose an available date and verified consultation slot. Choose in-person clinic attendance or secure telehealth video.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '36px 24px', background: '#ffffff' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#fef3c7',
                  color: '#d97706',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>Receive Care & Records</h3>
              <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6 }}>
                Get instant booking confirmations, visit the hospital, receive digital prescriptions, and track longitudinal health progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          AI BANNER CALL TO ACTION
          ============================================================ */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="content-container">
          <div
            style={{
              background: 'linear-gradient(135deg, #0b192c 0%, #0369a1 100%)',
              borderRadius: '24px',
              padding: '48px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '32px',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ maxWidth: '620px' }}>
              <span className="badge badge-teal" style={{ marginBottom: '14px' }}>
                <Sparkles size={13} /> 24/7 AI Clinical Assistant
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
                Unsure which specialist to book?
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#bae6fd', lineHeight: 1.65 }}>
                Try telling our AI assistant: <br />
                <em>"I have a fever, cough and sore throat"</em> — and receive an immediate department recommendation and matched doctor profiles.
              </p>
            </div>

            <button
              className="btn btn-secondary btn-lg"
              style={{ fontSize: '1.1rem', padding: '16px 32px' }}
              onClick={onOpenAIModal}
            >
              <Bot size={22} /> Start AI Health Assistant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
