import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../common/Modal';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Video,
  Building2,
  FileText,
  Phone,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';

const BookingModal = ({ isOpen, onClose, preselectedDoctor = null, onSuccess }) => {
  const { doctors, bookAppointment } = useAppointments();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoctor);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultType, setConsultType] = useState('In-Person');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  // Patient info (prefilled if authenticated user is patient)
  const [patientName, setPatientName] = useState(user?.name || 'Alex Morgan');
  const [patientEmail, setPatientEmail] = useState(user?.email || 'patient@careconnect.ai');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '+1 (555) 234-5678');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Generate the next 7 available dates
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = d.getDate();
      dates.push({
        iso,
        dayName,
        monthName,
        dayNum,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${dayName}, ${monthName} ${dayNum}`
      });
    }
    return dates;
  }, []);

  // Update selected doctor if preselectedDoctor changes
  useEffect(() => {
    if (preselectedDoctor) {
      setSelectedDoctor(preselectedDoctor);
      setStep(2); // Jump right to date if doctor preselected
    } else {
      setStep(1);
    }
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0].iso);
    }
  }, [preselectedDoctor, availableDates]);

  // When selectedDoctor or selectedDate changes, calculate booked slots
  const bookedSlots = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return [];
    return appointmentService.getBookedSlots(selectedDoctor.id, selectedDate);
  }, [selectedDoctor, selectedDate]);

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1 && !selectedDoctor) {
      newErrors.doctor = 'Please select a doctor to continue.';
    }
    if (currentStep === 2 && !selectedDate) {
      newErrors.date = 'Please select an appointment date.';
    }
    if (currentStep === 3 && !selectedTime) {
      newErrors.time = 'Please select an available consultation time slot.';
    }
    if (currentStep === 4) {
      if (!patientName.trim()) newErrors.patientName = 'Patient full name is required.';
      if (!patientEmail.trim() || !patientEmail.includes('@')) newErrors.patientEmail = 'Valid email is required.';
      if (!patientPhone.trim()) newErrors.patientPhone = 'Phone number is required.';
      if (!reason.trim()) newErrors.reason = 'Please provide the primary reason for your visit / symptoms.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmAppointment = async () => {
    if (!validateStep(4)) {
      setStep(4);
      return;
    }

    try {
      setIsSubmitting(true);
      const bookingPayload = {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        department: selectedDoctor.departmentId,
        date: selectedDate,
        time: selectedTime,
        type: consultType,
        patientName,
        patientEmail,
        patientPhone,
        reason,
        notes
      };

      const result = await bookAppointment(bookingPayload);
      setConfirmedBooking(result);
      setStep(5);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedTime('');
    setReason('');
    setNotes('');
    setConfirmedBooking(null);
    setErrors({});
    onClose();
  };

  const stepsList = ['Doctor', 'Date', 'Time Slot', 'Details', 'Confirmed'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Book a Hospital Appointment"
      maxWidth="680px"
      footer={
        step === 5 ? (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn btn-primary" onClick={resetAndClose}>
              Done & Return
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            {step > 1 ? (
              <button className="btn btn-outline btn-sm" onClick={handlePrev} disabled={isSubmitting}>
                <ChevronLeft size={16} /> Back
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-ghost btn-sm" onClick={resetAndClose} disabled={isSubmitting}>
                Cancel
              </button>
              {step < 4 ? (
                <button className="btn btn-primary btn-sm" onClick={handleNext}>
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleConfirmAppointment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Securing Slot...' : 'Confirm Appointment'}
                </button>
              )}
            </div>
          </div>
        )
      }
    >
      <div>
        {/* Progress Bar */}
        <div className="booking-steps-bar">
          {stepsList.map((label, index) => {
            const stepNum = index + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum || (step === 5 && stepNum === 5);

            return (
              <div
                key={label}
                className={`booking-step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <div className="booking-step-num">
                  {isCompleted && stepNum !== 5 ? <CheckCircle2 size={16} /> : stepNum}
                </div>
                <div className="booking-step-label">{label}</div>
              </div>
            );
          })}
        </div>

        {/* STEP 1: SELECT DOCTOR */}
        {step === 1 && (
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
              Select a Specialist
            </h4>
            {errors.doctor && (
              <div style={{ color: '#e11d48', fontSize: '0.85rem', marginBottom: '12px' }}>
                {errors.doctor}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
              {doctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setErrors({});
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--primary-subtle)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.98rem' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.84rem', color: '#0284c7', fontWeight: 600 }}>{doc.specialty}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{doc.hospital}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>${doc.consultationFee}</div>
                      <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                        {doc.experienceYears}y exp
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DATE */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px', background: '#f0f9ff', borderRadius: '12px' }}>
              <img
                src={selectedDoctor?.avatar}
                alt={selectedDoctor?.name}
                style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>Booking with</div>
                <strong style={{ color: '#0f172a' }}>{selectedDoctor?.name}</strong> – {selectedDoctor?.specialty}
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>
              Choose Appointment Date
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              {availableDates.map((d) => {
                const isSelected = selectedDate === d.iso;
                return (
                  <button
                    key={d.iso}
                    onClick={() => {
                      setSelectedDate(d.iso);
                      setSelectedTime(''); // reset time when date changes
                    }}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--primary)' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', opacity: 0.85 }}>
                      {d.dayName}
                    </span>
                    <strong style={{ fontSize: '1.25rem' }}>{d.dayNum}</strong>
                    <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                      {d.monthName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Consultation Mode */}
            <div style={{ marginTop: '24px' }}>
              <label className="form-label">Consultation Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setConsultType('In-Person')}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: `2px solid ${consultType === 'In-Person' ? 'var(--primary)' : 'var(--border)'}`,
                    background: consultType === 'In-Person' ? 'var(--primary-subtle)' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#0f172a'
                  }}
                >
                  <Building2 size={18} color="var(--primary)" />
                  In-Person Visit
                </button>
                <button
                  type="button"
                  onClick={() => setConsultType('Video Consultation')}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: `2px solid ${consultType === 'Video Consultation' ? 'var(--teal)' : 'var(--border)'}`,
                    background: consultType === 'Video Consultation' ? 'var(--teal-subtle)' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#0f172a'
                  }}
                >
                  <Video size={18} color="var(--teal)" />
                  Video Telehealth
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT AVAILABLE TIME */}
        {step === 3 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Select Available Consultation Time
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Slots already scheduled by other patients are automatically disabled to prevent conflict.
              </p>
            </div>

            {errors.time && (
              <div style={{ color: '#e11d48', fontSize: '0.85rem', marginBottom: '10px' }}>
                {errors.time}
              </div>
            )}

            <div className="time-slot-grid">
              {selectedDoctor?.availableSlots?.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedTime === slot;

                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => {
                      setSelectedTime(slot);
                      setErrors({});
                    }}
                    className={`time-slot-btn ${isSelected ? 'selected' : ''}`}
                    title={isBooked ? 'Slot already reserved' : 'Available slot'}
                  >
                    <Clock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    {slot}
                    {isBooked && (
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#ef4444' }}>
                        Booked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '20px', fontSize: '0.8rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '1.5px solid var(--border)' }} />
                Available
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary)' }} />
                Selected
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#cbd5e1' }} />
                Booked / Unavailable
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ENTER PATIENT DETAILS & REASON */}
        {step === 4 && (
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
              Patient Contact & Clinical Reason
            </h4>

            <div className="form-group">
              <label className="form-label">Patient Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Alex Morgan"
              />
              {errors.patientName && <div className="form-error">{errors.patientName}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="name@example.com"
                />
                {errors.patientEmail && <div className="form-error">{errors.patientEmail}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.patientPhone && <div className="form-error">{errors.patientPhone}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Symptoms / Reason for Visit *</label>
              <input
                type="text"
                className="form-input"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Fever, persistent dry cough, chest tightness"
              />
              {errors.reason && <div className="form-error">{errors.reason}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Additional Medical Notes / Allergies (Optional)</label>
              <textarea
                className="form-textarea"
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any ongoing medications, allergies or past surgeries..."
              />
            </div>
          </div>
        )}

        {/* STEP 5: INSTANT CONFIRMATION & APPOINTMENT VOUCHER */}
        {step === 5 && confirmedBooking && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: '#d1fae5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Appointment Confirmed!
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '24px' }}>
              A confirmation email & SMS has been dispatched. Your booking reference is below:
            </p>

            {/* Hospital Booking Slip */}
            <div
              style={{
                background: '#f8fafc',
                border: '1.5px dashed #0284c7',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                margin: '0 auto',
                maxWidth: '520px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Reference ID</span>
                <strong style={{ color: '#0284c7', fontSize: '1.1rem', letterSpacing: '0.04em' }}>
                  {confirmedBooking.referenceId}
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Specialist:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{confirmedBooking.doctorName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#0284c7' }}>{confirmedBooking.specialty}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Patient:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{confirmedBooking.patientName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{confirmedBooking.patientPhone}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Date & Time:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{confirmedBooking.date}</div>
                  <div style={{ fontWeight: 600, color: '#10b981' }}>{confirmedBooking.time}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Format & Status:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{confirmedBooking.type}</div>
                  <span className="badge badge-confirmed">Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BookingModal;
