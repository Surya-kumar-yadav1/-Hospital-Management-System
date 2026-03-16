// src/components/BookAppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookAppointmentModal.css';

function BookAppointmentModal({ patientId, onClose, onSuccess }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/doctors');
        setDoctors(res.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !appointmentDate) {
      setMessageType('error');
      setMessage('⚠️ Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/appointments', {
        patient_id: patientId,
        doctor_id: selectedDoctor,
        appointment_date: appointmentDate
      });

      setMessageType('success');
      setMessage(`✓ Appointment booked successfully! ID: ${response.data.appointment_id}`);
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      setMessageType('error');
      setMessage('❌ Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>📅 Book an Appointment</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Doctor</label>
            <select 
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Choose a doctor...</option>
              {doctors.map(doc => (
                <option key={doc.doctor_id} value={doc.doctor_id}>
                  Dr. {doc.first_name} {doc.last_name} - {doc.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Date & Time</label>
            <input 
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '⏳ Booking...' : '✓ Book Appointment'}
          </button>
        </form>

        {message && <p className={`message ${messageType}`}>{message}</p>}
      </div>
    </div>
  );
}

export default BookAppointmentModal;
