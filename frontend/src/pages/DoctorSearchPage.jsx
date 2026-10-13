import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import DoctorCard from '../components/doctor/DoctorCard';

const DoctorSearchPage = ({
  doctors,
  departments,
  onBookDoctor,
  onViewDoctorDetails,
  onOpenAIModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL'); // 'ALL', 'TODAY', 'WEEK'
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'experience', 'fee_low', 'fee_high'

  // Extract unique locations/hospitals
  const locations = useMemo(() => {
    const set = new Set(doctors.map((d) => d.hospital));
    return Array.from(set);
  }, [doctors]);

  // Filtered and sorted doctors
  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        // Search text matching name, specialty, or condition keywords
        const matchesQuery =
          searchQuery.trim() === '' ||
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.about.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.qualifications.toLowerCase().includes(searchQuery.toLowerCase());

        // Specialty filter
        const matchesSpecialty =
          selectedSpecialty === 'ALL' || doc.specialty === selectedSpecialty;

        // Location filter
        const matchesLocation =
          selectedLocation === 'ALL' || doc.hospital === selectedLocation;

        // Availability filter
        const matchesAvailability =
          availabilityFilter === 'ALL' ||
          (availabilityFilter === 'TODAY' && doc.isAvailableToday);

        return matchesQuery && matchesSpecialty && matchesLocation && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
        if (sortBy === 'fee_low') return a.consultationFee - b.consultationFee;
        if (sortBy === 'fee_high') return b.consultationFee - a.consultationFee;
        return 0;
      });
  }, [doctors, searchQuery, selectedSpecialty, selectedLocation, availabilityFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('ALL');
    setSelectedLocation('ALL');
    setAvailabilityFilter('ALL');
    setSortBy('rating');
  };

  return (
    <div style={{ padding: '40px 0 80px', backgroundColor: '#f8fafc', minHeight: '80vh' }}>
      <div className="content-container">
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-teal" style={{ marginBottom: '8px' }}>
                <CheckCircle2 size={12} /> Certified Healthcare Practitioners
              </span>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a' }}>
                Find & Consult Doctors
              </h1>
              <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '6px' }}>
                Search over 120+ top medical specialists, filter by availability, and secure confirmed appointments.
              </p>
            </div>

            {/* AI Assistant Banner trigger */}
            <button
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={onOpenAIModal}
            >
              <Bot size={18} /> Let AI Match My Symptoms
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div
          className="card"
          style={{
            padding: '24px',
            marginBottom: '32px',
            background: '#ffffff',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Main Search Input */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search
              size={20}
              color="#94a3b8"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '48px', fontSize: '1rem', height: '48px' }}
              placeholder="Search doctor by name, specialty (e.g. Cardiology, Neurology), or symptom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              alignItems: 'center'
            }}
          >
            {/* Specialty Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Specialty / Department
              </label>
              <select
                className="form-select"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="ALL">All Specialties ({doctors.length})</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.name}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location / Campus Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Hospital Campus / Center
              </label>
              <select
                className="form-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="ALL">All Hospital Campuses</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Consultation Availability
              </label>
              <select
                className="form-select"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="ALL">Any Availability</option>
                <option value="TODAY">Available Today Only</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Sort Results By
              </label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Highest Patient Rating</option>
                <option value="experience">Most Clinical Experience</option>
                <option value="fee_low">Consultation Fee: Low to High</option>
                <option value="fee_high">Consultation Fee: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active filter count & reset */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '18px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.86rem',
              color: '#64748b'
            }}
          >
            <div>
              Showing <strong>{filteredDoctors.length}</strong> available doctor{filteredDoctors.length === 1 ? '' : 's'}
            </div>

            {(searchQuery || selectedSpecialty !== 'ALL' || selectedLocation !== 'ALL' || availabilityFilter !== 'ALL') && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: '#ef4444' }}
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} /> Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Doctor Cards Grid */}
        {filteredDoctors.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '24px'
            }}
          >
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBook={onBookDoctor}
                onViewDetails={onViewDoctorDetails}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              background: '#ffffff',
              borderRadius: '20px'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#f1f5f9',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Search size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              No Doctors Match Your Search
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 20px' }}>
              We couldn't find any specialists matching "{searchQuery}". Try loosening your filters or consult our AI assistant.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={handleResetFilters}>
                Reset Search Filters
              </button>
              <button className="btn btn-primary" onClick={onOpenAIModal}>
                <Bot size={16} /> Ask AI Assistant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearchPage;
