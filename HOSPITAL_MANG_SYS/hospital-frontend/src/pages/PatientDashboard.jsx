import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentCard from '../components/AppointmentCard';
import PrescriptionCard from '../components/PrescriptionCard';
import BillingCard from '../components/BillingCard';
import BookAppointmentModal from '../components/BookAppointmentModal';
import './PatientDashboard.css';

function PatientDashboard() {
  const [patientId, setPatientId] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    pendingBills: 0,
    totalBillAmount: 0
  });

  // ========== SECURE LOGIN WITH PASSWORD ==========
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!patientId || patientId.trim() === '') {
      setLoginError('⚠️ Please enter your Patient ID');
      return;
    }

    if (!password || password.trim() === '') {
      setLoginError('⚠️ Please enter your Password');
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      // Step 1: Authenticate with password
      const authRes = await axios.post('http://localhost:3001/api/patient/login', {
        patient_id: parseInt(patientId),
        password: password
      });

      if (authRes.data.success) {
        // Step 2: Fetch all patient data after successful authentication
        const [patientRes, appointmentsRes, prescriptionsRes, billingRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/patients/${patientId}`),
          axios.get(`http://localhost:3001/api/patients/${patientId}/appointments`),
          axios.get(`http://localhost:3001/api/patients/${patientId}/prescriptions`),
          axios.get(`http://localhost:3001/api/patients/${patientId}/billing`)
        ]);

        setPatient(patientRes.data);
        setAppointments(appointmentsRes.data || []);
        setPrescriptions(prescriptionsRes.data || []);
        setBilling(billingRes.data || []);
        setAuthenticated(true);

        // Save session
        localStorage.setItem('patientId', patientId);
        localStorage.setItem('patientAuth', 'true');

        // Calculate stats from real data
        const upcomingCount = (appointmentsRes.data || []).filter(a => new Date(a.appointment_date) > new Date()).length;
        const totalBill = (billingRes.data || []).reduce((sum, b) => sum + b.amount, 0);
        const pendingBill = (billingRes.data || []).filter(b => b.status === 'Unpaid').length;

        setStats({
          upcomingAppointments: upcomingCount,
          activePrescriptions: (prescriptionsRes.data || []).length,
          pendingBills: pendingBill,
          totalBillAmount: totalBill.toFixed(2)
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setLoginError('❌ Invalid Patient ID or Password');
      } else if (error.response?.status === 404) {
        setLoginError(`❌ Patient ID ${patientId} not found`);
      } else {
        setLoginError('❌ Login failed. Check your credentials.');
      }
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  // Check if already logged in
  useEffect(() => {
    const auth = localStorage.getItem('patientAuth');
    const pId = localStorage.getItem('patientId');
    if (auth && pId) {
      setPatientId(pId);
      setAuthenticated(true);
    }
  }, []);

  // LOGOUT
  const handleLogout = () => {
    setAuthenticated(false);
    setPatientId('');
    setPassword('');
    localStorage.removeItem('patientAuth');
    localStorage.removeItem('patientId');
  };

  if (!authenticated) {
    return <LoginPage 
      onSubmit={handleLogin} 
      loading={loading} 
      patientId={patientId}
      setPatientId={setPatientId}
      password={password}
      setPassword={setPassword}
      loginError={loginError}
    />;
  }

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Welcome, {patient?.first_name || 'Patient'}!</h1>
              <p>Manage your health and appointments in one place</p>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <StatCard 
            icon="📅" 
            title="Upcoming Appointments" 
            value={stats.upcomingAppointments}
            color="blue"
          />
          <StatCard 
            icon="💊" 
            title="Active Prescriptions" 
            value={stats.activePrescriptions}
            color="green"
          />
          <StatCard 
            icon="💰" 
            title="Pending Bills" 
            value={stats.pendingBills}
            color="orange"
          />
          <StatCard 
            icon="💵" 
            title="Total Amount Due" 
            value={`₹${stats.totalBillAmount}`}
            color="red"
          />
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            📅 Appointments ({appointments.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            💊 Prescriptions ({prescriptions.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            💳 Billing ({billing.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="overview-grid">
                <div className="overview-card profile-card">
                  <h3>Your Profile</h3>
                  <div className="profile-info">
                    <p><strong>Name:</strong> {patient?.first_name} {patient?.last_name}</p>
                    <p><strong>Email:</strong> {patient?.email}</p>
                    <p><strong>Phone:</strong> {patient?.contact_number}</p>
                    <p><strong>Date of Birth:</strong> {patient?.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Address:</strong> {patient?.address}</p>
                  </div>
                </div>

                <div className="overview-card quick-actions">
                  <h3>Quick Actions</h3>
                  <button className="action-btn" onClick={() => {setActiveTab('appointments'); setShowBookingModal(true);}}>
                    📅 Book Appointment
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('prescriptions')}>
                    💊 View Prescriptions
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('billing')}>
                    💳 Pay Bills
                  </button>
                </div>
              </div>

              <div className="recent-section">
                <h3>Recent Appointments</h3>
                {appointments.length > 0 ? (
                  <div className="appointments-preview">
                    {appointments.slice(0, 3).map(appt => (
                      <AppointmentCard key={appt.appointment_id} appointment={appt} />
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No appointments scheduled</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="appointments-section">
              <div className="section-header">
                <h3>Your Appointments</h3>
                <button className="btn-book-appointment" onClick={() => setShowBookingModal(true)}>
                  + Book New Appointment
                </button>
              </div>
              {appointments.length > 0 ? (
                <div className="appointments-list">
                  {appointments.map(appt => (
                    <AppointmentCard key={appt.appointment_id} appointment={appt} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>📅 No appointments found</p>
                  <button onClick={() => setShowBookingModal(true)}>Book your first appointment</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="prescriptions-section">
              <h3>Your Prescriptions</h3>
              {prescriptions.length > 0 ? (
                <div className="prescriptions-list">
                  {prescriptions.map(prescription => (
                    <PrescriptionCard key={prescription.prescription_id} prescription={prescription} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>💊 No prescriptions available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="billing-section">
              <h3>Billing History</h3>
              {billing.length > 0 ? (
                <div className="billing-list">
                  {billing.map(bill => (
                    <BillingCard key={bill.bill_id} bill={bill} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>💳 No billing records found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showBookingModal && (
        <BookAppointmentModal 
          patientId={patientId}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            axios.get(`http://localhost:3001/api/patients/${patientId}/appointments`)
              .then(res => setAppointments(res.data || []));
          }}
        />
      )}
    </div>
  );
}

// ========== LOGIN PAGE WITH PASSWORD ==========
function LoginPage({ onSubmit, loading, patientId, setPatientId, password, setPassword, loginError }) {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">⚕️</div>
            <h1>LifeCare Patient Portal</h1>
            <p>Access your health records and manage appointments securely</p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>🆔 Patient ID</label>
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
              <label>🔑 Password</label>
              <input 
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <small>Your secure password</small>
            </div>

            {loginError && (
              <div className="login-error">
                {loginError}
              </div>
            )}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? '⏳ Logging in...' : '🔓 Access Portal'}
            </button>
          </form>

          <div className="login-features">
            <h4>What you can access:</h4>
            <ul>
              <li>✓ View and manage appointments</li>
              <li>✓ Access prescriptions</li>
              <li>✓ Check billing information</li>
              <li>✓ Contact your doctor</li>
            </ul>
          </div>

          <div className="login-footer">
            <p>New patient? <a href="/register">Register here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

export default PatientDashboard;
