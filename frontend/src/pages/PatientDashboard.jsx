import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Heart,
  Bot,
  Bell,
  FileText,
  Shield,
  Activity,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Video,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import AppointmentCard from '../components/dashboard/AppointmentCard';
import PrescriptionModal from '../components/dashboard/PrescriptionModal';
import DoctorCard from '../components/doctor/DoctorCard';

const PatientDashboard = ({
  onBookNewAppointment,
  onOpenAIModal,
  onViewDoctorDetails
}) => {
  const { user } = useAuth();
  const { appointments, doctors, savedDoctorIds, cancelAppointment } = useAppointments();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'
  const [selectedPrescriptionApt, setSelectedPrescriptionApt] = useState(null);

  // Filter appointments for this patient
  const patientAppointments = useMemo(() => {
    return appointments.filter(
      (a) => !a.patientEmail || a.patientEmail.toLowerCase() === (user?.email || 'patient@careconnect.ai').toLowerCase()
    );
  }, [appointments, user]);

  // Upcoming appointment (first non-completed and non-cancelled)
  const upcomingAppointment = useMemo(() => {
    return patientAppointments.find(
      (a) => a.status === 'Confirmed' || a.status === 'Pending'
    );
  }, [patientAppointments]);

  // Tab filtered appointments
  const filteredAppointments = useMemo(() => {
    if (activeTab === 'ALL') return patientAppointments;
    return patientAppointments.filter((a) => a.status.toUpperCase() === activeTab);
  }, [patientAppointments, activeTab]);

  // Saved / Favorite doctors list
  const favoritedDoctors = useMemo(() => {
    return doctors.filter((doc) => savedDoctorIds.includes(doc.id));
  }, [doctors, savedDoctorIds]);

  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="content-container">
        {/* Welcome Patient Header Banner */}
        <div
          className="card"
          style={{
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            border: '1px solid #bae6fd',
            borderRadius: '20px',
            padding: '28px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
              alt={user?.name}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #0284c7',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
                  Welcome, {user?.name || 'Alex Morgan'}
                </h1>
                <span className="badge badge-primary">Patient Portal</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
                Patient ID: <strong style={{ color: '#0f172a' }}>CC-PT-88910</strong> • Blood Group: <strong style={{ color: '#dc2626' }}>{user?.bloodGroup || 'O+'}</strong> • Allergies: <strong style={{ color: '#d97706' }}>{user?.allergies || 'Penicillin'}</strong>
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.82rem', color: '#64748b' }}>
                <span><Mail size={13} style={{ display: 'inline', marginRight: '4px' }} />{user?.email}</span>
                <span><Phone size={13} style={{ display: 'inline', marginRight: '4px' }} />{user?.phone || '+1 (555) 234-5678'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-outline" onClick={onOpenAIModal}>
              <Bot size={16} /> AI Symptom Check
            </button>
            <button className="btn btn-primary" onClick={onBookNewAppointment}>
              <Plus size={16} /> Book Appointment
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
          {/* LEFT COLUMN: Upcoming Appointment + Appointment History */}
          <div>
            {/* UPCOMING APPOINTMENT HIGHLIGHT CARD */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                  Next Scheduled Appointment
                </h2>
                {upcomingAppointment && (
                  <span className="badge badge-teal">
                    <Clock size={12} /> Scheduled Ahead
                  </span>
                )}
              </div>

              {upcomingAppointment ? (
                <div
                  className="card"
                  style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
                    border: '1.5px solid #86efac',
                    borderRadius: '16px',
                    padding: '24px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
                        Ref: {upcomingAppointment.referenceId}
                      </span>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                        {upcomingAppointment.doctorName}
                      </h3>
                      <div style={{ fontSize: '0.9rem', color: '#0284c7', fontWeight: 600 }}>
                        {upcomingAppointment.specialty} Department
                      </div>
                    </div>
                    <span className="badge badge-confirmed" style={{ fontSize: '0.85rem' }}>
                      {upcomingAppointment.status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px',
                      background: '#ffffff',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '16px'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Date & Day:</span>
                      <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={15} color="#0284c7" /> {upcomingAppointment.date}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Consultation Time:</span>
                      <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={15} color="#0d9488" /> {upcomingAppointment.time}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Consultation Mode:</span>
                      <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {upcomingAppointment.type === 'Video Consultation' ? (
                          <Video size={15} color="#6366f1" />
                        ) : (
                          <MapPin size={15} color="#64748b" />
                        )}
                        {upcomingAppointment.type}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '18px' }}>
                    <strong>Reason for visit:</strong> {upcomingAppointment.reason}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    {upcomingAppointment.type === 'Video Consultation' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => alert(`Launching encrypted video room for appointment ${upcomingAppointment.referenceId}...`)}
                      >
                        <Video size={14} /> Join Video Call
                      </button>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#ef4444' }}
                      onClick={() => cancelAppointment(upcomingAppointment.id, 'Patient requested cancellation')}
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="card"
                  style={{
                    textAlign: 'center',
                    padding: '36px 20px',
                    background: '#ffffff',
                    border: '1.5px dashed #cbd5e1'
                  }}
                >
                  <Calendar size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    No Upcoming Appointments
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 16px' }}>
                    You currently have no scheduled appointments. Need a consultation?
                  </p>
                  <button className="btn btn-primary btn-sm" onClick={onBookNewAppointment}>
                    Book a Doctor Now
                  </button>
                </div>
              )}
            </div>

            {/* APPOINTMENT HISTORY */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                  Appointment History ({patientAppointments.length})
                </h2>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '6px', background: '#e2e8f0', padding: '4px', borderRadius: '10px' }}>
                  {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '7px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        background: activeTab === tab ? '#ffffff' : 'transparent',
                        color: activeTab === tab ? '#0284c7' : '#64748b',
                        boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {filteredAppointments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      role="patient"
                      onCancel={(id) => cancelAppointment(id, 'Patient cancelled')}
                      onViewPrescription={(a) => setSelectedPrescriptionApt(a)}
                    />
                  ))}
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '40px', background: '#fff' }}>
                  <p style={{ color: '#64748b' }}>No appointments match the "{activeTab}" filter.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: AI Assistant Shortcut, Saved Doctors & Health Records */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* AI Assistant Quick Banner */}
            <div
              className="card"
              style={{
                background: 'linear-gradient(135deg, #0b192c 0%, #1e293b 100%)',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0284c7, #0d9488)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bot size={20} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                    AI Clinical Triage
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Always Active</div>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.55, marginBottom: '16px' }}>
                Experiencing unexpected symptoms? Describe them in plain words to see which hospital specialist to book.
              </p>

              <button
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.88rem' }}
                onClick={onOpenAIModal}
              >
                Launch Symptom Chat <ChevronRight size={16} />
              </button>
            </div>

            {/* Saved Doctors */}
            <div className="card" style={{ background: '#ffffff', padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} color="#f43f5e" fill="#f43f5e" /> Saved Doctors ({favoritedDoctors.length})
                </h3>
              </div>

              {favoritedDoctors.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {favoritedDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{doc.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#0284c7' }}>{doc.specialty}</div>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                        onClick={() => onViewDoctorDetails(doc)}
                      >
                        Profile
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  No saved specialists yet. Heart a doctor to save them here for quick access.
                </p>
              )}
            </div>

            {/* Notifications Feed */}
            <div className="card" style={{ background: '#ffffff', padding: '22px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="#0284c7" /> Hospital Notifications
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                <div style={{ padding: '10px', background: '#f0f9ff', borderRadius: '8px', borderLeft: '3px solid #0284c7' }}>
                  <strong>Appointment Confirmed:</strong> Dr. Sarah Mitchell on Oct 09, 11:00 AM.
                </div>
                <div style={{ padding: '10px', background: '#ecfdf5', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                  <strong>Prescription Ready:</strong> Digital consultation summary available for download.
                </div>
                <div style={{ padding: '10px', background: '#fffbeb', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                  <strong>Health Tip:</strong> Seasonal flu vaccines are now available at the outpatient clinic.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription View Modal */}
      {selectedPrescriptionApt && (
        <PrescriptionModal
          isOpen={!!selectedPrescriptionApt}
          onClose={() => setSelectedPrescriptionApt(null)}
          appointment={selectedPrescriptionApt}
          mode="view"
        />
      )}
    </div>
  );
};

export default PatientDashboard;
