import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  CheckCircle,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import StarRating from '../common/StarRating';
import { useAppointments } from '../../context/AppointmentContext';

const DoctorCard = ({ doctor, onBook, onViewDetails }) => {
  const { savedDoctorIds, toggleFavorite } = useAppointments();
  const isFavorited = savedDoctorIds.includes(doctor.id);

  return (
    <div className="doctor-card">
      <div className="doctor-card-top">
        <div className="doctor-card-avatar-wrap">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="doctor-card-avatar"
            loading="lazy"
          />
          {doctor.isAvailableToday && (
            <div className="doctor-online-dot" title="Available for appointments today" />
          )}
        </div>

        <div className="doctor-info-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 className="doctor-name">{doctor.name}</h3>
            <button
              style={{
                color: isFavorited ? '#f43f5e' : '#94a3b8',
                padding: '4px',
                transition: 'transform 0.2s'
              }}
              onClick={() => toggleFavorite(doctor.id)}
              aria-label={isFavorited ? "Remove favorite" : "Add to favorites"}
            >
              <Heart size={18} fill={isFavorited ? '#f43f5e' : 'none'} />
            </button>
          </div>

          <div className="doctor-specialty">{doctor.specialty}</div>

          <div className="doctor-rating-row">
            <StarRating rating={doctor.rating} reviewCount={doctor.reviewCount} />
          </div>
        </div>
      </div>

      <div className="doctor-card-details">
        <div className="doctor-detail-line">
          <GraduationCap size={15} style={{ color: '#0284c7', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {doctor.qualifications}
          </span>
        </div>
        <div className="doctor-detail-line">
          <Briefcase size={15} style={{ color: '#0d9488', flexShrink: 0 }} />
          <span>{doctor.experienceYears}+ years clinical experience</span>
        </div>
        <div className="doctor-detail-line">
          <MapPin size={15} style={{ color: '#64748b', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {doctor.hospital}
          </span>
        </div>

        <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {doctor.isAvailableToday ? (
            <span className="badge badge-confirmed">
              <CheckCircle size={12} /> Next Available: Today
            </span>
          ) : (
            <span className="badge badge-pending">
              <Clock size={12} /> Next Available: Tomorrow
            </span>
          )}
          {doctor.badges && doctor.badges.length > 0 && (
            <span className="badge badge-primary">{doctor.badges[0]}</span>
          )}
        </div>
      </div>

      <div className="doctor-card-footer">
        <div className="doctor-fee">
          <span className="doctor-fee-label">Consultation Fee</span>
          <span className="doctor-fee-val">${doctor.consultationFee}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onViewDetails(doctor)}
          >
            Profile
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onBook(doctor)}
          >
            <Calendar size={14} /> Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
