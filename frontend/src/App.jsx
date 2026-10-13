import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppointmentProvider, useAppointments } from './context/AppointmentContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Modal from './components/common/Modal';
import BookingModal from './components/booking/BookingModal';
import DoctorDetailsModal from './components/doctor/DoctorDetailsModal';
import AIChatAssistant from './components/ai/AIChatAssistant';

// Pages
import LandingPage from './pages/LandingPage';
import DoctorSearchPage from './pages/DoctorSearchPage';
import DepartmentsPage from './pages/DepartmentsPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';

// Styles
import './styles/index.css';
import './styles/components.css';

// Floating AI Quick Bubble
import { Bot, MessageSquare } from 'lucide-react';

const AppContent = () => {
  const { role, isAuthenticated } = useAuth();
  const { doctors, departments } = useAppointments();

  const [activePage, setActivePage] = useState('home');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  const [isDoctorDetailsModalOpen, setIsDoctorDetailsModalOpen] = useState(false);
  const [selectedDoctorForDetails, setSelectedDoctorForDetails] = useState(null);

  const [authModalMode, setAuthModalMode] = useState('login');

  // Trigger Booking flow for a specific doctor
  const handleBookDoctor = (doctor) => {
    setSelectedDoctorForBooking(doctor);
    setIsBookingModalOpen(true);
  };

  // Trigger Doctor Details modal
  const handleViewDoctorDetails = (doctor) => {
    setSelectedDoctorForDetails(doctor);
    setIsDoctorDetailsModalOpen(true);
  };

  // Open Auth page
  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setActivePage('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When AI Assistant recommends a doctor, seamlessly trigger booking modal
  const handleBookFromAI = (doctor) => {
    setIsAIModalOpen(false);
    handleBookDoctor(doctor);
  };

  // When Department is clicked
  const handleSelectDepartment = (departmentName) => {
    setActivePage('doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenAuthModal={handleOpenAuth}
      />

      {/* Main Routed Page Content */}
      <main className="main-content">
        {activePage === 'home' && (
          <LandingPage
            doctors={doctors}
            departments={departments}
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAIModal={() => setIsAIModalOpen(true)}
            onBookDoctor={handleBookDoctor}
            onViewDoctorDetails={handleViewDoctorDetails}
          />
        )}

        {activePage === 'doctors' && (
          <DoctorSearchPage
            doctors={doctors}
            departments={departments}
            onBookDoctor={handleBookDoctor}
            onViewDoctorDetails={handleViewDoctorDetails}
            onOpenAIModal={() => setIsAIModalOpen(true)}
          />
        )}

        {activePage === 'departments' && (
          <DepartmentsPage
            departments={departments}
            onSelectDepartment={handleSelectDepartment}
            onOpenAIModal={() => setIsAIModalOpen(true)}
          />
        )}

        {activePage === 'patient-dashboard' && (
          <PatientDashboard
            onBookNewAppointment={() => {
              setSelectedDoctorForBooking(null);
              setIsBookingModalOpen(true);
            }}
            onOpenAIModal={() => setIsAIModalOpen(true)}
            onViewDoctorDetails={handleViewDoctorDetails}
          />
        )}

        {activePage === 'doctor-dashboard' && (
          <DoctorDashboard />
        )}

        {activePage === 'admin-dashboard' && (
          <AdminDashboard />
        )}

        {activePage === 'auth' && (
          <AuthPage
            initialMode={authModalMode}
            initialRole={role}
            onSuccess={(loggedRole) => {
              if (loggedRole === 'doctor') setActivePage('doctor-dashboard');
              else if (loggedRole === 'admin') setActivePage('admin-dashboard');
              else setActivePage('patient-dashboard');
            }}
          />
        )}
      </main>

      {/* Global Footer (shown on public and informational pages) */}
      <Footer
        setActivePage={setActivePage}
        onOpenAIModal={() => setIsAIModalOpen(true)}
      />

      {/* Floating AI Assistant Trigger Button (Bottom-Right) */}
      <button
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 490,
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--teal) 100%)',
          color: '#ffffff',
          borderRadius: '999px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 25px rgba(2, 132, 199, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          fontWeight: 700,
          fontSize: '0.92rem',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onClick={() => setIsAIModalOpen(true)}
        title="Open AI Health Assistant"
      >
        <div style={{ position: 'relative' }}>
          <Bot size={22} />
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#34d399',
              border: '1.5px solid #ffffff'
            }}
          />
        </div>
        <span>AI Health Assistant</span>
      </button>

      {/* AI Assistant Chatbot Modal */}
      <Modal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        title="CareConnect Clinical AI Health Assistant"
        maxWidth="740px"
      >
        <AIChatAssistant
          onBookDoctorFromAI={handleBookFromAI}
        />
      </Modal>

      {/* Multi-step Appointment Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedDoctorForBooking(null);
        }}
        preselectedDoctor={selectedDoctorForBooking}
        onSuccess={() => {
          // If in patient dashboard, auto-refreshed via context
        }}
      />

      {/* Doctor Profile Details Modal */}
      <DoctorDetailsModal
        isOpen={isDoctorDetailsModalOpen}
        onClose={() => {
          setIsDoctorDetailsModalOpen(false);
          setSelectedDoctorForDetails(null);
        }}
        doctor={selectedDoctorForDetails}
        onBookDoctor={(doc) => {
          handleBookDoctor(doc);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppointmentProvider>
          <AppContent />
        </AppointmentProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
