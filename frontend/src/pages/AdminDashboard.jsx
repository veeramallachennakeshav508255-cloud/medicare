import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  TrendingUp,
  Activity,
  Power,
  Download,
  RefreshCw,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useAppointments } from '../context/AppointmentContext';
import DashboardCard from '../components/dashboard/DashboardCard';

const AdminDashboard = () => {
  const {
    appointments,
    doctors,
    departments,
    stats,
    toggleDoctorAvailability,
    refreshData
  } = useAppointments();

  const [timeRange, setTimeRange] = useState('7D'); // '7D', '30D'

  // Weekly trend mock values calibrated to current state
  const weeklyTrends = [
    { day: 'Mon', count: 24, completed: 21 },
    { day: 'Tue', count: 32, completed: 29 },
    { day: 'Wed', count: 28, completed: 26 },
    { day: 'Thu', count: 35, completed: 31 },
    { day: 'Fri', count: 42, completed: 39 },
    { day: 'Sat', count: 30, completed: 28 },
    { day: 'Sun', count: 18, completed: 17 }
  ];

  const maxWeeklyCount = Math.max(...weeklyTrends.map((t) => t.count));

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Reference,Patient,Doctor,Specialty,Date,Time,Status"]
        .concat(
          appointments.map(
            (a) =>
              `${a.referenceId},"${a.patientName}","${a.doctorName}",${a.specialty},${a.date},${a.time},${a.status}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `careconnect-appointments-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="content-container">
        {/* Admin Header */}
        <div className="dashboard-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">Hospital Management Console</span>
              <span className="badge badge-teal">Live System Metrics</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
              Hospital Executive Analytics
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.98rem' }}>
              Real-time monitoring of patient flow, doctor availability, clinical departments, and appointment conversions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-outline" onClick={refreshData}>
              <RefreshCw size={15} /> Refresh
            </button>
            <button className="btn btn-primary" onClick={handleExportCSV}>
              <Download size={15} /> Export Audit Log
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}
        >
          <DashboardCard
            title="Total Registered Patients"
            value={stats.totalPatients}
            subtitle="Verified patient accounts"
            icon={Users}
            color="#0284c7"
            trend="+14% this mo"
          />
          <DashboardCard
            title="Total Doctors Roster"
            value={stats.totalDoctors}
            subtitle={`${stats.activeDoctors} currently on-duty`}
            icon={UserCheck}
            color="#0d9488"
          />
          <DashboardCard
            title="Total Appointments"
            value={stats.totalAppointments}
            subtitle="System bookings logged"
            icon={Calendar}
            color="#6366f1"
          />
          <DashboardCard
            title="Completed Visits"
            value={stats.completed}
            subtitle="Fulfilled consultations"
            icon={CheckCircle2}
            color="#10b981"
            trend="+8%"
          />
          <DashboardCard
            title="Cancelled Rate"
            value={`${Math.round((stats.cancelled / Math.max(stats.totalAppointments, 1)) * 100)}%`}
            subtitle={`${stats.cancelled} cancellations`}
            icon={XCircle}
            color="#ef4444"
          />
        </div>

        {/* Analytics Charts & Department Breakdown Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* APPOINTMENT TRENDS CHART */}
          <div className="card" style={{ background: '#ffffff', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Appointment Volume Trends
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Weekly patient visit distribution vs completed consultations
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                <button
                  onClick={() => setTimeRange('7D')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: timeRange === '7D' ? '#ffffff' : 'transparent',
                    color: timeRange === '7D' ? '#0284c7' : '#64748b'
                  }}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setTimeRange('30D')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: timeRange === '30D' ? '#ffffff' : 'transparent',
                    color: timeRange === '30D' ? '#0284c7' : '#64748b'
                  }}
                >
                  30 Days
                </button>
              </div>
            </div>

            {/* Custom High-Precision SVG/CSS Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '220px', paddingTop: '20px', paddingBottom: '10px' }}>
              {weeklyTrends.map((item) => {
                const totalHeightPct = (item.count / maxWeeklyCount) * 100;
                const completedHeightPct = (item.completed / item.count) * 100;

                return (
                  <div key={item.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f172a' }}>
                      {item.count}
                    </div>

                    <div
                      style={{
                        width: '36px',
                        height: `${totalHeightPct}%`,
                        background: '#e0f2fe',
                        borderRadius: '8px 8px 0 0',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-end',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: `${completedHeightPct}%`,
                          background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.4s ease'
                        }}
                        title={`Completed: ${item.completed} / ${item.count}`}
                      />
                    </div>

                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                      {item.day}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px', fontSize: '0.82rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#0284c7' }} />
                Completed Consultations
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e0f2fe' }} />
                Scheduled / Total Bookings
              </div>
            </div>
          </div>

          {/* DEPARTMENT STATISTICS */}
          <div className="card" style={{ background: '#ffffff', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Department Patient Load
            </h3>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
              Consultation volume distribution by department
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {stats.depStats.map((dep) => {
                const totalAppointmentsEst = 120;
                const percentage = Math.min(Math.round((dep.appointmentCount / totalAppointmentsEst) * 100), 95);

                return (
                  <div key={dep.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '4px' }}>
                      <strong style={{ color: '#0f172a' }}>{dep.name}</strong>
                      <span style={{ color: '#64748b', fontWeight: 600 }}>{dep.appointmentCount} visits ({percentage}%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: dep.color,
                          borderRadius: '999px',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DOCTOR AVAILABILITY & ROSTER TABLE */}
        <div className="card" style={{ background: '#ffffff', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Specialist Availability & Roster Management
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.86rem' }}>
                Toggle physician duty status or inspect appointment load in real time.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Doctor Name</th>
                  <th style={{ padding: '12px 16px' }}>Specialty</th>
                  <th style={{ padding: '12px 16px' }}>Hospital Center</th>
                  <th style={{ padding: '12px 16px' }}>Consultation Fee</th>
                  <th style={{ padding: '12px 16px' }}>Rating</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Duty Toggle</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      {doc.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#0284c7', fontWeight: 600 }}>
                      {doc.specialty}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>
                      {doc.hospital}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                      ${doc.consultationFee}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      ⭐ {doc.rating} ({doc.reviewCount})
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {doc.isAvailableToday ? (
                        <span className="badge badge-confirmed">Available</span>
                      ) : (
                        <span className="badge badge-cancelled">Off-Duty</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        className={`btn btn-sm ${doc.isAvailableToday ? 'btn-ghost' : 'btn-outline'}`}
                        style={{ fontSize: '0.78rem' }}
                        onClick={() => toggleDoctorAvailability(doc.id, !doc.isAvailableToday)}
                      >
                        <Power size={13} /> {doc.isAvailableToday ? 'Set Offline' : 'Set Available'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
