// src/pages/DoctorsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorCard from '../components/DoctorCard';
import './DoctorsPage.css';

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/doctors');
        setDoctors(response.data);
        setFilteredDoctors(response.data);
        
        const uniqueSpecialties = [...new Set(response.data.map(doc => doc.specialization))];
        setSpecialties(uniqueSpecialties.sort());
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        `${doc.first_name} ${doc.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(doc => doc.specialization === selectedSpecialty);
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, doctors]);

  if (loading) {
    return <div className="loading"><span className="spinner"></span>Loading doctors...</div>;
  }

  return (
    <div className="doctors-page">
      <div className="doctors-header">
        <div className="header-content">
          <h1>Find Your Perfect Doctor</h1>
          <p>Browse our network of 500+ expert medical professionals</p>
        </div>
      </div>

      <div className="container">
        {/* Advanced Search & Filter Section */}
        <div className="search-filter-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by doctor name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-controls">
            <div className="specialty-filter">
              <label>Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="specialty-select"
              >
                <option value="">All Specialties ({doctors.length})</option>
                {specialties.map(specialty => {
                  const count = doctors.filter(d => d.specialization === specialty).length;
                  return (
                    <option key={specialty} value={specialty}>
                      {specialty} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewType === 'grid' ? 'active' : ''}`}
                onClick={() => setViewType('grid')}
                title="Grid View"
              >
                ⊞ Grid
              </button>
              <button 
                className={`toggle-btn ${viewType === 'list' ? 'active' : ''}`}
                onClick={() => setViewType('list')}
                title="List View"
              >
                ≡ List
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <h3>{filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found</h3>
          {selectedSpecialty && <span className="active-filter">📌 {selectedSpecialty}</span>}
        </div>

        {/* Doctors Grid/List */}
        <div className={`doctors-container ${viewType}`}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.doctor_id} doctor={doctor} viewType={viewType} />
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-icon">😔</div>
              <h3>No doctors found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorsPage;
