import React, { useState } from 'react';
import Modal from '../common/Modal';
import StarRating from '../common/StarRating';
import {
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Briefcase,
  Languages,
  Award,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

const DoctorDetailsModal = ({ doctor, isOpen, onClose, onBookDoctor }) => {
  if (!doctor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Doctor Profile & Clinical Credentials"
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Standard Consultation: </span>
            <strong style={{ fontSize: '1.2rem', color: '#0f172a' }}>${doctor.consultationFee}</strong>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onBookDoctor(doctor);
              }}
            >
              <Calendar size={16} /> Proceed to Book
            </button>
          </div>
        </div>
      }
    >
      <div>
        {/* Top Profile Header */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
          <img
            src={doctor.avatar}
            alt={doctor.name}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '20px',
              objectFit: 'cover',
              boxShadow: 'var(--shadow-md)',
              border: '2px solid #e0f2fe'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{doctor.name}</h2>
              <ShieldCheck size={20} color="#0284c7" title="CareConnect Verified Specialist" />
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0284c7', marginBottom: '6px' }}>
              {doctor.title || doctor.specialty}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <StarRating rating={doctor.rating} reviewCount={doctor.reviewCount} />
              <span className="badge badge-teal">{doctor.experienceYears}+ Yrs Experience</span>
            </div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '14px',
            marginBottom: '20px',
            border: '1px solid #e2e8f0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
            <GraduationCap size={18} color="#0284c7" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Credentials</div>
              <strong>{doctor.qualifications}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
            <MapPin size={18} color="#0d9488" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Facility & Campus</div>
              <strong>{doctor.hospital}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
            <Languages size={18} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Languages Spoken</div>
              <strong>{doctor.languages?.join(', ') || 'English'}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
            <Clock size={18} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Avg. Consult Duration</div>
              <strong>30 - 45 Minutes</strong>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div style={{ marginBottom: '22px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
            About the Specialist
          </h4>
          <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: '1.65' }}>
            {doctor.about}
          </p>
        </div>

        {/* Available Weekly Days & Sample Slots */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: '#0f172a' }}>
            Weekly Schedule & Typical Slots
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {doctor.availableDays?.map((day) => (
              <span
                key={day}
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  color: '#0284c7',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                {day}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {doctor.availableSlots?.map((slot) => (
              <span
                key={slot}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#1e293b'
                }}
              >
                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {slot}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DoctorDetailsModal;
