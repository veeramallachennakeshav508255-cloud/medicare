import React from 'react';
import {
  Calendar,
  Clock,
  User,
  Video,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Edit3
} from 'lucide-react';

const AppointmentCard = ({
  appointment,
  role = 'patient',
  onStatusChange,
  onCancel,
  onWritePrescription,
  onViewPrescription
}) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'badge-confirmed';
      case 'Pending': return 'badge-pending';
      case 'Completed': return 'badge-completed';
      case 'Cancelled': return 'badge-cancelled';
      default: return 'badge-primary';
    }
  };

  const isCompleted = appointment.status === 'Completed';
  const isCancelled = appointment.status === 'Cancelled';
  const isConfirmed = appointment.status === 'Confirmed';
  const isPending = appointment.status === 'Pending';

  return (
    <div
      className="card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        borderLeft: `4px solid ${
          isConfirmed ? 'var(--emerald)' : isPending ? 'var(--amber)' : isCompleted ? 'var(--primary)' : 'var(--rose)'
        }`
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Ref: {appointment.referenceId}</span>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
            {role === 'doctor' ? appointment.patientName : appointment.doctorName}
          </h4>
          <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>
            {role === 'doctor' ? `Patient • ${appointment.patientPhone}` : appointment.specialty}
          </div>
        </div>

        <span className={`badge ${getBadgeClass(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      {/* Date, Time & Format Strip */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          background: '#f8fafc',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '0.86rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={15} color="#0284c7" />
          <strong>{appointment.date}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={15} color="#0d9488" />
          <strong>{appointment.time}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {appointment.type === 'Video Consultation' ? (
            <Video size={15} color="#6366f1" />
          ) : (
            <Building2 size={15} color="#64748b" />
          )}
          <span>{appointment.type}</span>
        </div>
      </div>

      {/* Clinical Reason */}
      <div style={{ fontSize: '0.88rem' }}>
        <span style={{ color: '#64748b', fontWeight: 500 }}>Chief Complaint / Symptoms: </span>
        <span style={{ color: '#334155', fontWeight: 600 }}>{appointment.reason}</span>
      </div>

      {appointment.notes && (
        <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic' }}>
          Note: {appointment.notes}
        </div>
      )}

      {/* Action Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border)',
          paddingTop: '12px',
          marginTop: 'auto',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        {/* Prescription View Button if available */}
        {appointment.prescription ? (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onViewPrescription && onViewPrescription(appointment)}
          >
            <FileText size={14} color="#0284c7" /> View Medical Prescription
          </button>
        ) : <div />}

        {/* Video Link */}
        {appointment.type === 'Video Consultation' && !isCancelled && !isCompleted && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => alert(`Starting encrypted video consultation session for ${appointment.referenceId}...`)}
          >
            <Video size={14} /> Join Video Room
          </button>
        )}

        {/* Doctor Action Controls */}
        {role === 'doctor' && !isCancelled && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {isPending && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onStatusChange && onStatusChange(appointment.id, 'Confirmed')}
              >
                <CheckCircle size={14} /> Confirm
              </button>
            )}

            {!isCompleted && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onWritePrescription && onWritePrescription(appointment)}
              >
                <Edit3 size={14} /> Add Notes / Prescription
              </button>
            )}

            {!isCompleted && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onCancel && onCancel(appointment.id)}
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {/* Patient Action Controls */}
        {role === 'patient' && !isCancelled && !isCompleted && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: '#ef4444' }}
              onClick={() => onCancel && onCancel(appointment.id)}
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
