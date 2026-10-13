import React, { useState } from 'react';
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  Phone,
  Shield,
  Stethoscope,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../services/mockData';

const AuthPage = ({ initialMode = 'login', initialRole = 'patient', onSuccess }) => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [role, setRole] = useState(initialRole); // 'patient', 'doctor', 'admin'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [hospital, setHospital] = useState('CareConnect Central Campus');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Quick fill helper for demo accounts
  const handleQuickFill = (roleType) => {
    const demo = DEMO_USERS[roleType];
    if (demo) {
      setRole(roleType);
      setEmail(demo.email);
      setPassword('password123');
      setErrors({});
    }
  };

  const validate = () => {
    const errs = {};
    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Valid email address is required.';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (mode === 'register') {
      if (!name.trim()) errs.name = 'Full name is required.';
      if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.';
      }
      if (!phone.trim()) errs.phone = 'Phone number is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      if (mode === 'login') {
        await login(email, password, role);
      } else {
        await register({
          name,
          email,
          password,
          role,
          phone,
          specialty: role === 'doctor' ? specialty : undefined,
          hospital: role === 'doctor' ? hospital : undefined
        });
      }
      if (onSuccess) onSuccess(role);
    } catch (err) {
      console.error("Auth error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f0fdfa 50%, #e0f2fe 100%)'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '36px 32px',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--teal) 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 8px 16px rgba(2, 132, 199, 0.25)'
            }}
          >
            <HeartPulse size={30} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            CareConnect <span className="brand-ai">AI</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
            {mode === 'login' ? 'Sign in to access your portal' : 'Create your patient or doctor account'}
          </p>
        </div>

        {/* Mode Toggle (Login vs Register) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              padding: '10px',
              borderRadius: '9px',
              fontSize: '0.9rem',
              fontWeight: 700,
              background: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? '#0284c7' : '#64748b',
              boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              padding: '10px',
              borderRadius: '9px',
              fontSize: '0.9rem',
              fontWeight: 700,
              background: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? '#0284c7' : '#64748b',
              boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ marginBottom: '22px' }}>
          <label className="form-label" style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Portal Type / Role
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {['patient', 'doctor', 'admin'].map((r) => {
              const isSelected = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--primary-subtle)' : '#ffffff',
                    color: isSelected ? '#0284c7' : '#64748b',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    textTransform: 'capitalize'
                  }}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Demo Autofill Helper Ribbon */}
        {mode === 'login' && (
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '20px'
            }}
          >
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
              ⚡ 1-Click Demo Login Profiles:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                onClick={() => handleQuickFill('patient')}
              >
                Patient (Alex M.)
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                onClick={() => handleQuickFill('doctor')}
              >
                Doctor (Dr. Sarah)
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                onClick={() => handleQuickFill('admin')}
              >
                Admin (Eleanor)
              </button>
            </div>
          </div>
        )}

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="name@careconnect.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Contact Phone Number *</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="+1 (555) 234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
          )}

          {mode === 'register' && role === 'doctor' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Clinical Specialty</label>
                <select
                  className="form-select"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="General Medicine">General Medicine</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Hospital</label>
                <input
                  type="text"
                  className="form-input"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password *</label>
              {mode === 'login' && (
                <button
                  type="button"
                  style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}
                  onClick={() => setForgotPasswordOpen(true)}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px', height: '46px', fontSize: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : mode === 'login' ? `Sign In as ${role}` : 'Create Account'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.84rem', color: '#64748b' }}>
          Spring Boot JWT Ready • Encrypted Session Token
        </div>
      </div>

      {/* Forgot Password Dialog */}
      {forgotPasswordOpen && (
        <div className="modal-overlay" onClick={() => setForgotPasswordOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reset Password</h3>
              <button className="modal-close-btn" onClick={() => setForgotPasswordOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              {resetEmailSent ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <CheckCircle2 size={44} color="#10b981" style={{ margin: '0 auto 12px' }} />
                  <h4>Password Reset Link Sent!</h4>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '6px' }}>
                    Check your inbox at <strong>{email || 'your email'}</strong> for password reset instructions.
                  </p>
                  <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setForgotPasswordOpen(false)}>
                    Close
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px' }}>
                    Enter your account email address and we'll dispatch a secure password reset link.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@careconnect.ai"
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => setResetEmailSent(true)}
                  >
                    Send Password Reset Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
