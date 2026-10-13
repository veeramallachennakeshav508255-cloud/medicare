import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock3,
  Search,
  Check,
  X,
  Stethoscope,
  Power,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import AppointmentCard from '../components/dashboard/AppointmentCard';
import PrescriptionModal from '../components/dashboard/PrescriptionModal';
import DashboardCard from '../components/dashboard/DashboardCard';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const {
    appointments,
    updateStatus,
    cancelAppointment,
    toggleDoctorAvailability
  } = useAppointments();

  const [activeTab, setActiveTab] = useState('TODAY'); // 'TODAY', 'UPCOMING', 'PATIENTS', 'SCHEDULE'
  const [selectedPrescriptionApt, setSelectedPrescriptionApt] = useState(null);
  const [prescriptionMode, setPrescriptionMode] = useState('edit');
  const [isAvailableToday, setIsAvailableToday] = useState(true);

  // Doctor ID (default to doc-1 Dr. Sarah Mitchell if logged in as doctor)
  const doctorId = user?.id || 'doc-1';
  const doctorName = user?.name || 'Dr. Sarah Mitchell';

  // Appointments for this doctor
  const doctorAppointments = useMemo(() => {
    return appointments.filter(
      (a) => a.doctorId === doctorId || a.doctorName.toLowerCase().includes(doctorName.toLowerCase().split(' ')[1] || '')
    );
  }, [appointments, doctorId, doctorName]);

  // Today's appointments (for demo, treats all pending/confirmed as active queue or matching date)
  const todayAppointments = useMemo(() => {
    return doctorAppointments.filter((a) => a.status === 'Confirmed' || a.status === 'Pending');
  }, [doctorAppointments]);

  const completedAppointments = useMemo(() => {
    return doctorAppointments.filter((a) => a.status === 'Completed');
  }, [doctorAppointments]);

  // Unique patient directory
  const patientDirectory = useMemo(() => {
    const map = new Map();
    doctorAppointments.forEach((apt) => {
      if (!map.has(apt.patientName)) {
        map.set(apt.patientName, {
          name: apt.patientName,
          phone: apt.patientPhone,
          email: apt.patientEmail,
          lastVisit: apt.date,
          visitCount: 1,
          lastDiagnosis: apt.prescription?.diagnosis || apt.reason
        });
      } else {
        const item = map.get(apt.patientName);
        item.visitCount += 1;
      }
    });
    return Array.from(map.values());
  }, [doctorAppointments]);

  const handleToggleOnline = () => {
    const nextVal = !isAvailableToday;
    setIsAvailableToday(nextVal);
    toggleDoctorAvailability(doctorId, nextVal);
  };

  const handleOpenPrescriptionEditor = (apt) => {
    setSelectedPrescriptionApt(apt);
    setPrescriptionMode('edit');
  };

  const handleViewPrescription = (apt) => {
    setSelectedPrescriptionApt(apt);
    setPrescriptionMode('view');
  };

  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="content-container">
        {/* Doctor Header Banner */}
        <div
          className="card"
          style={{
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #0b192c 0%, #1e293b 100%)',
            color: '#ffffff',
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
              src={user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"}
              alt={doctorName}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '3px solid #38bdf8'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                  {doctorName}
                </h1>
                <span className="badge badge-teal">Physician Console</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: '4px' }}>
                Senior Consultant • Department of Cardiology & Cardiovascular Sciences
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                <span>Hospital: CareConnect Central Campus</span>
                <span>Room: Suite 402, Level 4</span>
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255, 255, 255, 0.1)', padding: '12px 18px', borderRadius: '14px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Consultation Duty:</div>
              <strong style={{ color: isAvailableToday ? '#34d399' : '#f87171' }}>
                {isAvailableToday ? 'Online & Accepting Patients' : 'Off-Duty / Unavailable'}
              </strong>
            </div>
            <button
              className={`btn btn-sm ${isAvailableToday ? 'btn-secondary' : 'btn-outline'}`}
              onClick={handleToggleOnline}
            >
              <Power size={14} /> {isAvailableToday ? 'Go Off-Duty' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Doctor KPIs */}
        <div className="dashboard-kpi-grid">
          <DashboardCard
            title="Today's Queue"
            value={todayAppointments.length}
            subtitle="Appointments to attend"
            icon={Clock3}
            color="#0284c7"
          />
          <DashboardCard
            title="Completed Visits"
            value={completedAppointments.length}
            subtitle="Prescriptions issued"
            icon={CheckCircle}
            color="#10b981"
          />
          <DashboardCard
            title="Total Registered Patients"
            value={patientDirectory.length}
            subtitle="Unique clinical records"
            icon={Users}
            color="#6366f1"
          />
          <DashboardCard
            title="Clinical Rating"
            value="4.9 / 5.0"
            subtitle="340+ verified patient reviews"
            icon={Stethoscope}
            color="#f59e0b"
          />
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
          {[
            { id: 'TODAY', label: "Today's Consultations" },
            { id: 'UPCOMING', label: "All Appointments" },
            { id: 'PATIENTS', label: "Patient Directory" },
            { id: 'SCHEDULE', label: "Schedule Management" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                borderBottom: activeTab === tab.id ? '3px solid #0284c7' : '3px solid transparent',
                color: activeTab === tab.id ? '#0284c7' : '#64748b',
                fontWeight: 700,
                fontSize: '0.94rem',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: TODAY'S APPOINTMENTS */}
        {activeTab === 'TODAY' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Active Consultation Queue ({todayAppointments.length})
              </h2>
            </div>

            {todayAppointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {todayAppointments.map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    role="doctor"
                    onStatusChange={(id, status) => updateStatus(id, status)}
                    onCancel={(id) => cancelAppointment(id, 'Cancelled by doctor')}
                    onWritePrescription={(a) => handleOpenPrescriptionEditor(a)}
                    onViewPrescription={(a) => handleViewPrescription(a)}
                  />
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '48px', background: '#fff' }}>
                <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Queue Clear!</h3>
                <p style={{ color: '#64748b', marginTop: '4px' }}>
                  All appointments for today have been attended or none are currently pending.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL APPOINTMENTS */}
        {activeTab === 'UPCOMING' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                All Historical & Upcoming Appointments ({doctorAppointments.length})
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {doctorAppointments.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  role="doctor"
                  onStatusChange={(id, status) => updateStatus(id, status)}
                  onCancel={(id) => cancelAppointment(id, 'Cancelled by doctor')}
                  onWritePrescription={(a) => handleOpenPrescriptionEditor(a)}
                  onViewPrescription={(a) => handleViewPrescription(a)}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PATIENT DIRECTORY */}
        {activeTab === 'PATIENTS' && (
          <div className="card" style={{ background: '#ffffff', padding: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Patient Roster & Consultation History
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Patient Name</th>
                    <th style={{ padding: '12px 16px' }}>Phone / Email</th>
                    <th style={{ padding: '12px 16px' }}>Last Visit</th>
                    <th style={{ padding: '12px 16px' }}>Total Visits</th>
                    <th style={{ padding: '12px 16px' }}>Last Clinical Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {patientDirectory.map((patient, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                        {patient.name}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>
                        <div>{patient.phone}</div>
                        <div style={{ fontSize: '0.78rem' }}>{patient.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#0f172a' }}>
                        {patient.lastVisit}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge badge-primary">{patient.visitCount} visits</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#334155' }}>
                        {patient.lastDiagnosis}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SCHEDULE MANAGEMENT */}
        {activeTab === 'SCHEDULE' && (
          <div className="card" style={{ background: '#ffffff', padding: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Weekly Outpatient Schedule & Slot Management
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
              Configure your active consultation days and time intervals for hospital outpatient appointments.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <div
                  key={day}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    background: '#f8fafc'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong>{day}</strong>
                    <span className="badge badge-confirmed" style={{ fontSize: '0.72rem' }}>Active</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '4px' }}>
                    09:00 AM – 05:00 PM
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#0284c7' }}>
                    6 Slots / Day (45m each)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prescription / Notes Modal */}
      {selectedPrescriptionApt && (
        <PrescriptionModal
          isOpen={!!selectedPrescriptionApt}
          onClose={() => setSelectedPrescriptionApt(null)}
          appointment={selectedPrescriptionApt}
          mode={prescriptionMode}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
