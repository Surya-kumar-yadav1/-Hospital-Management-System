import React, { useState } from 'react';
import axios from 'axios';
import './PatientRegistration.css';

function PatientRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    contact_number: '',
    email: '',
    address: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registeredPatient, setRegisteredPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // STEP 1: REGISTER PATIENT
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/patients', formData);
      setRegisteredPatient(response.data);
      setStep(2);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: SET PASSWORD
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/patient/set-password', {
        patient_id: registeredPatient.patient_id,
        password: password
      });
      setStep(3);
    } catch (err) {
      setError('Error setting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ========== STEP 1: REGISTRATION FORM ==========
  if (step === 1) {
    return (
      <div className="registration-page">
        <div className="registration-container">
          <div className="registration-card">
            <h1>📝 Patient Registration</h1>
            <p>Create your account to access our hospital services</p>

            <form onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input 
                    name="first_name" 
                    value={formData.first_name} 
                    onChange={handleChange} 
                    placeholder="John" 
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input 
                    name="last_name" 
                    value={formData.last_name} 
                    onChange={handleChange} 
                    placeholder="Doe" 
                    required 
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="john@example.com" 
                  required 
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input 
                    name="date_of_birth" 
                    type="date" 
                    value={formData.date_of_birth} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <input 
                  name="contact_number" 
                  value={formData.contact_number} 
                  onChange={handleChange} 
                  placeholder="+91 98765 43210" 
                  required 
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="Enter your address" 
                  rows="3"
                  disabled={loading}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? '⏳ Registering...' : '✓ Next'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 2: SET PASSWORD ==========
  if (step === 2) {
    return (
      <div className="registration-page">
        <div className="registration-container">
          <div className="registration-card">
            <h1>🔑 Set Your Password</h1>
            <p>Create a secure password for your account</p>

            <form onSubmit={handleSetPassword}>
              <div className="info-box">
                <p><strong>Patient ID:</strong> {registeredPatient?.patient_id}</p>
                <p><strong>Name:</strong> {registeredPatient?.first_name} {registeredPatient?.last_name}</p>
                <p className="save-id">💾 Save your Patient ID - You'll need it to login</p>
              </div>

              <div className="form-group">
                <label>🔑 Password *</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter password (min 6 characters)" 
                  required 
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>🔑 Confirm Password *</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Confirm password" 
                  required 
                  disabled={loading}
                />
              </div>

              <div className="password-strength">
                <p className={password.length >= 6 ? 'strong' : 'weak'}>
                  {password.length >= 6 ? '✓ Strong Password' : '✗ Weak (min 6 characters)'}
                </p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? '⏳ Setting Password...' : '✓ Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 3: SUCCESS ==========
  if (step === 3) {
    return (
      <div className="registration-page">
        <div className="registration-container">
          <div className="registration-card success">
            <div className="success-icon">✓</div>
            <h1>Registration Complete!</h1>
            <p>Your account has been created successfully</p>

            <div className="success-details">
              <p><strong>📝 Patient ID:</strong> <code>{registeredPatient?.patient_id}</code></p>
              <p><strong>👤 Name:</strong> {registeredPatient?.first_name} {registeredPatient?.last_name}</p>
              <p><strong>📧 Email:</strong> {registeredPatient?.email}</p>
              <p className="important">🔒 Save your Patient ID and Password - You'll need them to login to dashboard</p>
            </div>

            <div className="next-steps">
              <h3>Next Steps:</h3>
              <ol>
                <li>📋 Save your Patient ID: <code>{registeredPatient?.patient_id}</code></li>
                <li>🔑 Remember your password</li>
                <li>📊 Go to Dashboard and login</li>
              </ol>
            </div>

            <div className="action-buttons">
              <a href="/dashboard" className="btn-primary">📊 Go to Dashboard</a>
              <a href="/" className="btn-secondary">🏠 Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PatientRegistration;
