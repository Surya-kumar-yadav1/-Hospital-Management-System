import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [tab, setTab] = useState('patients');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // LOGIN
  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/admin/login', { username, password });
      if (res.data.success) {
        setAuth(true);
        localStorage.setItem('admin', 'true');
      }
    } catch {
      setError('Invalid credentials');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin')) setAuth(true);
  }, []);

  if (!auth) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>🔐 Admin Login</h1>
          <form onSubmit={login}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="error">{error}</p>}
            <button type="submit">Login</button>
          </form>
          <p>Demo: admin / admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-top">
        <h1>Admin Dashboard</h1>
        <button onClick={() => { setAuth(false); localStorage.removeItem('admin'); }}>Logout</button>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'patients' ? 'active' : ''} onClick={() => setTab('patients')}>Patients</button>
        <button className={tab === 'doctors' ? 'active' : ''} onClick={() => setTab('doctors')}>Doctors</button>
        <button className={tab === 'appointments' ? 'active' : ''} onClick={() => setTab('appointments')}>Appointments</button>
      </div>

      {tab === 'patients' && <PatientsTab />}
      {tab === 'doctors' && <DoctorsTab />}
      {tab === 'appointments' && <AppointmentsTab />}
    </div>
  );
}

// PATIENTS TAB
function PatientsTab() {
  const [patients, setPatients] = useState([]);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/patients');
      setPatients(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete patient?')) {
      try {
        await axios.delete(`http://localhost:3001/api/admin/patients/${id}`);
        fetch();
      } catch {
        alert('Error deleting');
      }
    }
  };

  const handleSave = async (patient) => {
    try {
      await axios.put(`http://localhost:3001/api/admin/patients/${patient.patient_id}`, patient);
      setEdit(null);
      fetch();
    } catch {
      alert('Error saving');
    }
  };

  return (
    <div className="tab-content">
      <h2>Patients</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.patient_id}>
              <td>{p.patient_id}</td>
              <td>{p.first_name} {p.last_name}</td>
              <td>{p.email}</td>
              <td>{p.contact_number}</td>
              <td>
                <button className="btn-edit" onClick={() => setEdit(p)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(p.patient_id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {edit && (
        <EditPatientForm patient={edit} onSave={handleSave} onClose={() => setEdit(null)} />
      )}
    </div>
  );
}

// EDIT PATIENT FORM
function EditPatientForm({ patient, onSave, onClose }) {
  const [form, setForm] = useState(patient);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Patient</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} placeholder="First Name" />
          <input type="text" value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} placeholder="Last Name" />
          <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Email" />
          <input type="text" value={form.contact_number} onChange={(e) => setForm({...form, contact_number: e.target.value})} placeholder="Phone" />
          <input type="text" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} placeholder="Address" />
          <div className="modal-buttons">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// DOCTORS TAB
function DoctorsTab() {
  const [doctors, setDoctors] = useState([]);
  const [edit, setEdit] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/doctors');
      setDoctors(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete doctor?')) {
      try {
        await axios.delete(`http://localhost:3001/api/admin/doctors/${id}`);
        fetch();
      } catch {
        alert('Error deleting');
      }
    }
  };

  const handleSave = async (doctor) => {
    try {
      await axios.put(`http://localhost:3001/api/admin/doctors/${doctor.doctor_id}`, doctor);
      setEdit(null);
      fetch();
    } catch {
      alert('Error saving');
    }
  };

  const handleAdd = async (doctor) => {
    try {
      await axios.post('http://localhost:3001/api/admin/doctors', doctor);
      setShowAdd(false);
      fetch();
    } catch {
      alert('Error adding');
    }
  };

  return (
    <div className="tab-content">
      <h2>Doctors</h2>
      <button className="btn-add" onClick={() => setShowAdd(true)}>+ Add Doctor</button>
      
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(d => (
            <tr key={d.doctor_id}>
              <td>{d.doctor_id}</td>
              <td>{d.first_name} {d.last_name}</td>
              <td>{d.specialization}</td>
              <td>{d.email}</td>
              <td>{d.contact_number}</td>
              <td>
                <button className="btn-edit" onClick={() => setEdit(d)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(d.doctor_id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {edit && (
        <EditDoctorForm doctor={edit} onSave={handleSave} onClose={() => setEdit(null)} />
      )}

      {showAdd && (
        <AddDoctorForm onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}

// EDIT DOCTOR FORM
function EditDoctorForm({ doctor, onSave, onClose }) {
  const [form, setForm] = useState(doctor);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Doctor</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} placeholder="First Name" />
          <input type="text" value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} placeholder="Last Name" />
          <input type="text" value={form.specialization} onChange={(e) => setForm({...form, specialization: e.target.value})} placeholder="Specialization" />
          <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Email" />
          <input type="text" value={form.contact_number} onChange={(e) => setForm({...form, contact_number: e.target.value})} placeholder="Phone" />
          <div className="modal-buttons">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ADD DOCTOR FORM
function AddDoctorForm({ onAdd, onClose }) {
  const [form, setForm] = useState({ first_name: '', last_name: '', specialization: '', email: '', contact_number: '', department_id: 1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Doctor</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} placeholder="First Name" required />
          <input type="text" value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} placeholder="Last Name" required />
          <input type="text" value={form.specialization} onChange={(e) => setForm({...form, specialization: e.target.value})} placeholder="Specialization" required />
          <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Email" required />
          <input type="text" value={form.contact_number} onChange={(e) => setForm({...form, contact_number: e.target.value})} placeholder="Phone" required />
          <div className="modal-buttons">
            <button type="submit" className="btn-save">Add</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// APPOINTMENTS TAB
function AppointmentsTab() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/appointments');
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tab-content">
      <h2>Appointments</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.appointment_id}>
              <td>{a.appointment_id}</td>
              <td>{a.patient_first_name} {a.patient_last_name}</td>
              <td>{a.doctor_first_name} {a.doctor_last_name}</td>
              <td>{new Date(a.appointment_date).toLocaleString()}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
