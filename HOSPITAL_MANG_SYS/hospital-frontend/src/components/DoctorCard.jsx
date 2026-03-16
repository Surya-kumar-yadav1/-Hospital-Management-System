// src/components/DoctorCard.jsx (Updated BookingModal function)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './DoctorCard.css';

function DoctorCard({ doctor, viewType = 'grid' }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [bookingModal, setBookingModal] = useState(false);
  
  const rating = (Math.random() * 0.5 + 4.5).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 200 + 50);
  const experienceYears = Math.floor(Math.random() * 15 + 5);

  return (
    <>
      <div className={`doctor-card ${viewType}`}>
        <div className="availability-badge available">
          <span className="dot"></span> Available
        </div>

        <div className="card-header">
          <div className="avatar-section">
            <div className="avatar">
              <div className="avatar-initials">
                {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
              </div>
            </div>
            <div className="verification-badge">✓</div>
          </div>

          <div className="header-info">
            <h3 className="doctor-name">Dr. {doctor.first_name} {doctor.last_name}</h3>
            <p className="doctor-specialty">{doctor.specialization}</p>
            <div className="rating">
              <span className="stars">⭐ {rating}</span>
              <span className="review-count">({reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <div className="card-details">
          <div className="detail-item">
            <span className="detail-label">📍 Department</span>
            <span className="detail-value">{doctor.department_name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">💼 Experience</span>
            <span className="detail-value">{experienceYears}+ years</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">👥 Consultations</span>
            <span className="detail-value">{doctor.total_appointments}+ patients</span>
          </div>
          {viewType === 'list' && (
            <>
              <div className="detail-item">
                <span className="detail-label">📧 Email</span>
                <span className="detail-value email">{doctor.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📞 Phone</span>
                <span className="detail-value phone">{doctor.contact_number}</span>
              </div>
            </>
          )}
        </div>

        <div className="card-actions">
          <button 
            className="btn-outline"
            onClick={() => setShowContactModal(true)}
          >
            📞 Contact
          </button>
          <button 
            className="btn-primary"
            onClick={() => setBookingModal(true)}
          >
            📅 Book Now
          </button>
        </div>

        <div className="quick-info">Next available: Today 2:00 PM</div>
      </div>

      {showContactModal && (
        <ContactModal 
          doctor={doctor} 
          onClose={() => setShowContactModal(false)}
        />
      )}

      {bookingModal && (
        <BookingModal 
          doctor={doctor}
          onClose={() => setBookingModal(false)}
        />
      )}
    </>
  );
}

function ContactModal({ doctor, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Contact Information</h2>
        <div className="modal-doctor-header">
          <div className="modal-avatar">
            <div className="avatar-initials">
              {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
            </div>
          </div>
          <div>
            <h3>Dr. {doctor.first_name} {doctor.last_name}</h3>
            <p>{doctor.specialization}</p>
          </div>
        </div>
        
        <div className="contact-details">
          <div className="contact-item">
            <span className="icon">✉️</span>
            <div>
              <p className="contact-label">Email</p>
              <a href={`mailto:${doctor.email}`} className="contact-value">{doctor.email}</a>
            </div>
          </div>
          <div className="contact-item">
            <span className="icon">📞</span>
            <div>
              <p className="contact-label">Phone</p>
              <a href={`tel:${doctor.contact_number}`} className="contact-value">{doctor.contact_number}</a>
            </div>
          </div>
          <div className="contact-item">
            <span className="icon">🏥</span>
            <div>
              <p className="contact-label">Department</p>
              <p className="contact-value">{doctor.department_name}</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="icon">👨‍⚕️</span>
            <div>
              <p className="contact-label">Specialization</p>
              <p className="contact-value">{doctor.specialization}</p>
            </div>
          </div>
        </div>

        <button className="btn-close-modal" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// UPDATED BOOKING MODAL WITH DATABASE SAVING
function BookingModal({ doctor, onClose }) {
  const [appointmentDate, setAppointmentDate] = useState('');
  const [patientId, setPatientId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!patientId) {
      setMessageType('error');
      setMessage('⚠️ Please enter your Patient ID');
      return;
    }

    if (!appointmentDate) {
      setMessageType('error');
      setMessage('⚠️ Please select a date and time');
      return;
    }

    setLoading(true);

    try {
      // Make POST request to backend to save appointment
      const response = await axios.post(
        'http://localhost:3001/api/appointments',
        {
          patient_id: patientId,
          doctor_id: doctor.doctor_id,
          appointment_date: appointmentDate
        }
      );

      setMessageType('success');
      setMessage(`✓ ${response.data.message} (Appointment ID: ${response.data.appointment_id})`);
      
      // Clear form
      setPatientId('');
      setAppointmentDate('');

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      setMessageType('error');
      if (error.response?.data?.error) {
        setMessage(`❌ Error: ${error.response.data.error}`);
      } else {
        setMessage('❌ Failed to book appointment. Please try again.');
      }
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Book an Appointment</h2>
        <div className="modal-doctor-header">
          <div className="modal-avatar">
            <div className="avatar-initials">
              {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
            </div>
          </div>
          <div>
            <h3>Dr. {doctor.first_name} {doctor.last_name}</h3>
            <p>{doctor.specialization}</p>
          </div>
        </div>

        <form onSubmit={handleBooking}>
          <div className="form-group">
            <label>Patient ID*</label>
            <input 
              type="number" 
              placeholder="Enter your patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              disabled={loading}
            />
            <small>You received this ID when you registered</small>
          </div>

          <div className="form-group">
            <label>Select Date & Time*</label>
            <input 
              type="datetime-local" 
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? '⏳ Booking...' : '📅 Book Appointment'}
          </button>
        </form>

        {message && (
          <p className={`message ${messageType}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default DoctorCard;
