// src/components/PrescriptionCard.jsx
import React from 'react';
import './PrescriptionCard.css';

function PrescriptionCard({ prescription }) {
  return (
    <div className="prescription-card">
      <div className="prescription-header">
        <div className="medication-name">
          <h4>💊 {prescription.medication}</h4>
          <p className="prescribed-by">Dr. {prescription.doctor_first_name} {prescription.doctor_last_name}</p>
        </div>
        <div className="prescription-date">
          {new Date(prescription.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className="prescription-details">
        <div className="detail">
          <span className="label">Dosage:</span>
          <span className="value">{prescription.dosage}</span>
        </div>
        <div className="detail">
          <span className="label">Instructions:</span>
          <span className="value">{prescription.instructions}</span>
        </div>
      </div>

      <button className="btn-download">⬇️ Download Prescription</button>
    </div>
  );
}

export default PrescriptionCard;
