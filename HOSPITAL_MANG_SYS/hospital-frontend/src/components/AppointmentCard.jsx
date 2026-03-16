// src/components/AppointmentCard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './AppointmentCard.css';

function AppointmentCard({ appointment }) {
  const [showDetails, setShowDetails] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const appointmentDate = new Date(appointment.appointment_date);
  const isUpcoming = appointmentDate > new Date();
  const statusColor = {
    'Scheduled': 'blue',
    'Completed': 'green',
    'Cancelled': 'red',
    'No-show': 'gray'
  }[appointment.status] || 'blue';

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setCancelling(true);
      try {
        await axios.put(`http://localhost:3001/api/appointments/${appointment.appointment_id}`, {
          status: 'Cancelled'
        });
        window.location.reload();
      } catch (error) {
        alert('Failed to cancel appointment');
      } finally {
        setCancelling(false);
      }
    }
  };

  return (
    <>
      <div className={`appointment-card ${statusColor}`}>
        <div className="appointment-header">
          <div className="appointment-date-time">
            <div className="date">{appointmentDate.toLocaleDateString()}</div>
            <div className="time">{appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          <div className="appointment-doctor">
            <h4>Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}</h4>
            <p className="specialty">{appointment.specialization}</p>
          </div>
          <div className={`status-badge ${statusColor}`}>
            {appointment.status}
          </div>
        </div>

        <div className="appointment-body">
          <p><strong>Department:</strong> {appointment.department_name}</p>
          <p><strong>Contact:</strong> <a href={`tel:${appointment.doctor_phone}`}>{appointment.doctor_phone}</a></p>
        </div>

        <div className="appointment-footer">
          <button className="btn-details" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? '✕ Hide' : '→ Details'}
          </button>
          {isUpcoming && appointment.status === 'Scheduled' && (
            <button 
              className="btn-cancel" 
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? '⏳ Cancelling...' : '✕ Cancel'}
            </button>
          )}
        </div>

        {showDetails && (
          <div className="appointment-details">
            <p><strong>Email:</strong> <a href={`mailto:${appointment.doctor_email}`}>{appointment.doctor_email}</a></p>
            <p><strong>Status:</strong> {appointment.status}</p>
            <p className="note">Please arrive 15 minutes early</p>
          </div>
        )}
      </div>
    </>
  );
}

export default AppointmentCard;
