import React, { useState } from 'react';
import {
  HeartPulse,
  Bot,
  Search,
  Calendar,
  Layers,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Stethoscope,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ activePage, setActivePage, onOpenAIModal, onOpenAuthModal }) => {
  const { user, role, logout, switchRole, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const roleLabels = {
    patient: 'Patient Portal',
    doctor: 'Doctor Portal',
    admin: 'Admin Console'
  };

  return (
    <header className="navbar-wrapper">
      <div className="content-container">
        <div className="navbar">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => handleNavClick('home')}>
            <div className="brand-icon-box">
              <HeartPulse size={24} />
            </div>
            <div className="brand-name">
              CareConnect <span className="brand-ai">AI</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            <li
              className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </li>
            <li
              className={`nav-item ${activePage === 'doctors' ? 'active' : ''}`}
              onClick={() => handleNavClick('doctors')}
            >
              <Search size={16} /> Find Doctors
            </li>
            <li
              className={`nav-item ${activePage === 'departments' ? 'active' : ''}`}
              onClick={() => handleNavClick('departments')}
            >
              <Layers size={16} /> Departments
            </li>
            <li
              className={`nav-item ${activePage === 'appointments' ? 'active' : ''}`}
              onClick={() => {
                if (role === 'doctor') handleNavClick('doctor-dashboard');
                else if (role === 'admin') handleNavClick('admin-dashboard');
                else handleNavClick('patient-dashboard');
              }}
            >
              <Calendar size={16} /> Appointments
            </li>
            <li
              className="nav-item"
              style={{ color: '#0284c7', fontWeight: 700 }}
              onClick={onOpenAIModal}
            >
              <Bot size={16} /> AI Health Assistant
            </li>
          </ul>

          {/* Nav Actions / Role Switcher / Auth */}
          <div className="nav-actions nav-actions-desktop">
            {/* Quick Demo Role Switcher for pairwise testing */}
            <div className="role-switcher-badge" title="Switch Demo Profile Role">
              <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Role:</span>
              <select
                className="role-select"
                value={role}
                onChange={(e) => {
                  switchRole(e.target.value);
                  if (e.target.value === 'patient') setActivePage('patient-dashboard');
                  if (e.target.value === 'doctor') setActivePage('doctor-dashboard');
                  if (e.target.value === 'admin') setActivePage('admin-dashboard');
                }}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="user-profile-btn"
                  onClick={() => {
                    if (role === 'doctor') handleNavClick('doctor-dashboard');
                    else if (role === 'admin') handleNavClick('admin-dashboard');
                    else handleNavClick('patient-dashboard');
                  }}
                >
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                    alt={user?.name}
                    className="user-avatar-mini"
                  />
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                      {user?.name?.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#0284c7', textTransform: 'capitalize' }}>
                      {role}
                    </div>
                  </div>
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={logout}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline btn-sm" onClick={() => onOpenAuthModal('login')}>
                  Login
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => onOpenAuthModal('register')}>
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div
          className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => handleNavClick('home')}
        >
          Home
        </div>
        <div
          className={`nav-item ${activePage === 'doctors' ? 'active' : ''}`}
          onClick={() => handleNavClick('doctors')}
        >
          <Search size={16} /> Find Doctors
        </div>
        <div
          className={`nav-item ${activePage === 'departments' ? 'active' : ''}`}
          onClick={() => handleNavClick('departments')}
        >
          <Layers size={16} /> Departments
        </div>
        <div
          className={`nav-item ${activePage.includes('dashboard') ? 'active' : ''}`}
          onClick={() => {
            if (role === 'doctor') handleNavClick('doctor-dashboard');
            else if (role === 'admin') handleNavClick('admin-dashboard');
            else handleNavClick('patient-dashboard');
          }}
        >
          <Calendar size={16} /> {roleLabels[role] || 'Appointments'}
        </div>
        <div
          className="nav-item"
          style={{ color: '#0284c7', fontWeight: 700 }}
          onClick={() => {
            setMobileMenuOpen(false);
            onOpenAIModal();
          }}
        >
          <Bot size={16} /> AI Health Assistant
        </div>

        <div style={{ paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Current Role:</span>
            <select
              className="role-select"
              value={role}
              onChange={(e) => {
                switchRole(e.target.value);
                setMobileMenuOpen(false);
              }}
            >
              <option value="patient">Patient Portal</option>
              <option value="doctor">Doctor Portal</option>
              <option value="admin">Admin Console</option>
            </select>
          </div>
          {isAuthenticated ? (
            <button className="btn btn-outline btn-sm" onClick={logout}>
              <LogOut size={16} /> Sign Out ({user?.name})
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => onOpenAuthModal('login')}>
                Login
              </button>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => onOpenAuthModal('register')}>
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
