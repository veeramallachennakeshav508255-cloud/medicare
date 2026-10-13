import React, { useState } from 'react';
import Modal from '../common/Modal';
import { FileText, Plus, Trash2, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';

const PrescriptionModal = ({ isOpen, onClose, appointment, mode = 'view' }) => {
  const { addPrescription } = useAppointments();

  const isViewOnly = mode === 'view' || !!appointment?.prescription;

  const [diagnosis, setDiagnosis] = useState(
    appointment?.prescription?.diagnosis || 'Acute Upper Respiratory Tract Infection'
  );
  const [medications, setMedications] = useState(
    appointment?.prescription?.medications || [
      { name: 'Amoxicillin 500mg', dosage: '1 capsule three times daily after food', duration: '5 days' },
      { name: 'Paracetamol 650mg', dosage: '1 tablet every 6 hours as needed for fever', duration: '3 days' }
    ]
  );
  const [doctorAdvice, setDoctorAdvice] = useState(
    appointment?.prescription?.doctorAdvice || 'Drink plenty of warm fluids, rest for 48 hours, and monitor temperature.'
  );

  const handleAddMed = () => {
    setMedications([...medications, { name: '', dosage: '', duration: '' }]);
  };

  const handleRemoveMed = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSave = async () => {
    if (!diagnosis.trim()) {
      alert('Please enter a clinical diagnosis');
      return;
    }
    const prescriptionData = {
      diagnosis,
      medications: medications.filter(m => m.name.trim()),
      doctorAdvice
    };
    await addPrescription(appointment.id, prescriptionData);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  if (!appointment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isViewOnly ? "Official Medical Prescription" : "Issue Prescription & Consultation Notes"}
      maxWidth="700px"
      footer={
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          {isViewOnly ? (
            <button className="btn btn-outline btn-sm" onClick={handlePrint}>
              <Printer size={15} /> Print / Save PDF
            </button>
          ) : <div />}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              Close
            </button>
            {!isViewOnly && (
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                <CheckCircle2 size={15} /> Save & Mark Completed
              </button>
            )}
          </div>
        </div>
      }
    >
      <div id="printable-prescription">
        {/* Prescription Header */}
        <div
          style={{
            borderBottom: '2px solid #0284c7',
            paddingBottom: '16px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>CareConnect Hospital</h3>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Department of {appointment.specialty}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Consultant: {appointment.doctorName}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Date Issued</div>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
              {appointment.prescription?.dateIssued || new Date().toISOString().split('T')[0]}
            </strong>
            <div style={{ fontSize: '0.78rem', color: '#0284c7' }}>Ref: {appointment.referenceId}</div>
          </div>
        </div>

        {/* Patient Details Strip */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            fontSize: '0.88rem'
          }}
        >
          <div>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Patient Name:</span>
            <div style={{ fontWeight: 700 }}>{appointment.patientName}</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Contact Phone:</span>
            <div style={{ fontWeight: 600 }}>{appointment.patientPhone}</div>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.76rem' }}>Consultation Format:</span>
            <div style={{ fontWeight: 600 }}>{appointment.type}</div>
          </div>
        </div>

        {/* Clinical Diagnosis */}
        <div className="form-group">
          <label className="form-label">Clinical Diagnosis / Assessment</label>
          {isViewOnly ? (
            <div style={{ padding: '10px 14px', background: '#f0f9ff', borderRadius: '8px', fontWeight: 700, color: '#0369a1' }}>
              {appointment.prescription?.diagnosis || diagnosis}
            </div>
          ) : (
            <input
              type="text"
              className="form-input"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Pharyngitis with Viral Syndrome"
            />
          )}
        </div>

        {/* Medications List */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Prescribed Medications & Dosages (Rx)</label>
            {!isViewOnly && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleAddMed}
                style={{ padding: '4px 8px', fontSize: '0.78rem' }}
              >
                <Plus size={13} /> Add Medicine
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {medications.map((med, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isViewOnly ? '1.5fr 2fr 1fr' : '1.5fr 2fr 1fr 36px',
                  gap: '8px',
                  alignItems: 'center',
                  background: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              >
                {isViewOnly ? (
                  <>
                    <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{med.name}</strong>
                    <span style={{ color: '#334155', fontSize: '0.85rem' }}>{med.dosage}</span>
                    <span style={{ color: '#0284c7', fontSize: '0.82rem', fontWeight: 600 }}>{med.duration}</span>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      value={med.name}
                      onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                      placeholder="Medicine name"
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      value={med.dosage}
                      onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                      placeholder="Dosage instruction"
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      value={med.duration}
                      onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                      placeholder="Duration"
                    />
                    <button
                      type="button"
                      style={{ color: '#ef4444', padding: '6px' }}
                      onClick={() => handleRemoveMed(idx)}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Advice / Notes */}
        <div className="form-group">
          <label className="form-label">Doctor's Clinical Advice & Follow-up</label>
          {isViewOnly ? (
            <p style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
              {appointment.prescription?.doctorAdvice || doctorAdvice}
            </p>
          ) : (
            <textarea
              className="form-textarea"
              rows="2"
              value={doctorAdvice}
              onChange={(e) => setDoctorAdvice(e.target.value)}
              placeholder="Clinical recommendations, lifestyle advice, follow-up period..."
            />
          )}
        </div>

        {/* Digital Signature */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0d9488', fontSize: '0.84rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> Verified Digital Medical Signature
            </div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{appointment.doctorName}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>CareConnect Health Network</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PrescriptionModal;
