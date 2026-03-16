require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL Database.');
});
app.post('/api/patients', (req, res) => {
  const { first_name, last_name, date_of_birth, gender, contact_number, email, address } = req.body;
  const sql = 'INSERT INTO patients (first_name, last_name, date_of_birth, gender, contact_number, email, address) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [first_name, last_name, date_of_birth, gender, contact_number, email, address], (err, result) => {
    if (err) {
      console.error('Error inserting patient:', err);
      return res.status(500).send('Error registering patient.');
    }
    res.status(201).send({ message: 'Patient registered successfully!', patient_id: result.insertId });
  });
    });
app.get('/api/doctors', (req, res) => {
    const sql = 'SELECT doctor_id, first_name, last_name, specialization FROM doctors';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching doctors:', err);
            return res.status(500).send('Error fetching doctors.');
        }
        res.json(results);
    });
});
app.get('/api/doctors', (req, res) => {
  const sql = `
    SELECT 
      d.doctor_id, 
      d.first_name, 
      d.last_name, 
      d.specialization, 
      d.contact_number, 
      d.email,
      dept.department_name,
      COUNT(a.appointment_id) as total_appointments
    FROM doctors d
    LEFT JOIN departments dept ON d.department_id = dept.department_id
    LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
    GROUP BY d.doctor_id, d.first_name, d.last_name, d.specialization, d.contact_number, d.email, dept.department_name
    ORDER BY d.first_name ASC`;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching doctors:', err);
      return res.status(500).json({ error: 'Error fetching doctors.' });
    }
    res.json(results);
  });
});
app.get('/api/doctors/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  const sql = `
    SELECT 
      d.doctor_id, 
      d.first_name, 
      d.last_name, 
      d.specialization, 
      d.contact_number, 
      d.email,
      dept.department_name
    FROM doctors d
    LEFT JOIN departments dept ON d.department_id = dept.department_id
    WHERE d.doctor_id = ?`;
  
  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error('Error fetching doctor:', err);
      return res.status(500).json({ error: 'Error fetching doctor.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }
    res.json(results[0]);
  });
});
app.get('/api/patients/:patientId', (req, res) => {
  const { patientId } = req.params;
  const sql = 'SELECT * FROM patients WHERE patient_id = ?';
  
  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error('Error fetching patient:', err);
      return res.status(500).json({ error: 'Error fetching patient.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    res.json(results[0]);
  });
});
app.get('/api/patients/:patientId/appointments', (req, res) => {
  const { patientId } = req.params;
  const sql = `
    SELECT 
      a.appointment_id, 
      a.appointment_date, 
      a.status,
      d.doctor_id,
      d.first_name AS doctor_first_name, 
      d.last_name AS doctor_last_name, 
      d.specialization,
      d.contact_number AS doctor_phone,
      d.email AS doctor_email,
      dept.department_name
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.doctor_id
    JOIN departments dept ON d.department_id = dept.department_id
    WHERE a.patient_id = ?
    ORDER BY a.appointment_date DESC`;
  
  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      return res.status(500).json({ error: 'Error fetching appointments.' });
    }
    res.json(results);
  });
});
app.get('/api/patients/:patientId/prescriptions', (req, res) => {
  const { patientId } = req.params;
  const sql = `
    SELECT 
      p.prescription_id,
      p.medication,
      p.dosage,
      p.instructions,
      p.created_at,
      a.appointment_id,
      d.first_name AS doctor_first_name,
      d.last_name AS doctor_last_name
    FROM prescriptions p
    JOIN appointments a ON p.appointment_id = a.appointment_id
    JOIN doctors d ON a.doctor_id = d.doctor_id
    WHERE a.patient_id = ?
    ORDER BY p.created_at DESC`;
  
  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error('Error fetching prescriptions:', err);
      return res.status(500).json({ error: 'Error fetching prescriptions.' });
    }
    res.json(results);
  });
});
app.get('/api/patients/:patientId/billing', (req, res) => {
  const { patientId } = req.params;
  const sql = `
    SELECT 
      bill_id,
      amount,
      billing_date,
      status,
      details,
      created_at
    FROM billing
    WHERE patient_id = ?
    ORDER BY billing_date DESC`;
  
  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error('Error fetching billing:', err);
      return res.status(500).json({ error: 'Error fetching billing.' });
    }
    res.json(results);
  });
});
app.put('/api/appointments/:appointmentId', (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  
  const sql = 'UPDATE appointments SET status = ? WHERE appointment_id = ?';
  
  db.query(sql, [status, appointmentId], (err, result) => {
    if (err) {
      console.error('Error updating appointment:', err);
      return res.status(500).json({ error: 'Error updating appointment.' });
    }
    res.json({ message: 'Appointment updated successfully!' });
  });
});
app.post('/api/appointments', (req, res) => {
    const { patient_id, doctor_id, appointment_date } = req.body;
    
    // Validate the data
    if (!patient_id || !doctor_id || !appointment_date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = 'INSERT INTO appointments (patient_id, doctor_id, appointment_date, status) VALUES (?, ?, ?, ?)';

    db.query(sql, [patient_id, doctor_id, appointment_date, 'Scheduled'], (err, result) => {
        if (err) {
            console.error('Error booking appointment:', err);
            return res.status(500).json({ error: 'Error booking appointment.' });
        }
        res.status(201).json({ 
            message: 'Appointment booked successfully!', 
            appointment_id: result.insertId 
        });
    });
});
// ADMIN LOGIN
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, admin: { id: 1, username: 'admin' } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ADMIN STATS
app.get('/api/admin/stats', (req, res) => {
  const queries = {
    patients: 'SELECT COUNT(*) as count FROM patients',
    doctors: 'SELECT COUNT(*) as count FROM doctors',
    appointments: 'SELECT COUNT(*) as count FROM appointments',
    scheduled: 'SELECT COUNT(*) as count FROM appointments WHERE status = "Scheduled"',
    revenue: 'SELECT SUM(amount) as total FROM billing WHERE status = "Unpaid"'
  };

  let completed = 0;
  let results = {};

  Object.entries(queries).forEach(([key, sql]) => {
    db.query(sql, (err, data) => {
      results[key] = err ? 0 : (data.count || data.total || 0);
      completed++;
      if (completed === Object.keys(queries).length) {
        res.json({
          totalPatients: results.patients,
          totalDoctors: results.doctors,
          totalAppointments: results.appointments,
          scheduledAppointments: results.scheduled,
          pendingRevenue: results.revenue
        });
      }
    });
  });
});

// GET ALL PATIENTS
app.get('/api/admin/patients', (req, res) => {
  const search = req.query.search || '';
  let sql = 'SELECT * FROM patients';
  const params = [];

  if (search) {
    sql += ' WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?';
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  sql += ' ORDER BY created_at DESC LIMIT 50';
  db.query(sql, params, (err, results) => {
    res.json({ data: results || [], total: results?.length || 0 });
  });
});
// ========== PATIENT LOGIN WITH PASSWORD ==========

app.post('/api/patient/login', (req, res) => {
  const { patient_id, password } = req.body;

  if (!patient_id || !password) {
    return res.status(400).json({ error: 'Patient ID and password required' });
  }

  const sql = 'SELECT * FROM patients WHERE patient_id = ? AND password = ?';
  
  db.query(sql, [patient_id, password], (err, results) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid Patient ID or Password' });
    }

    res.json({
      success: true,
      patient: {
        id: results.patient_id,
        name: results.first_name + ' ' + results.last_name,
        email: results.email
      }
    });
  });
});

// ========== PATIENT CHANGE PASSWORD ==========

app.put('/api/patient/change-password/:id', (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  const sql = 'SELECT password FROM patients WHERE patient_id = ?';
  
  db.query(sql, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Patient not found' });
    }

    if (results.password !== oldPassword) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    const updateSql = 'UPDATE patients SET password = ? WHERE patient_id = ?';
    db.query(updateSql, [newPassword, id], (err) => {
      if (err) return res.status(500).json({ error: 'Error updating password' });
      res.json({ message: 'Password changed successfully' });
    });
  });
});

// ========== SET PASSWORD FOR NEW PATIENT ==========

app.post('/api/patient/set-password', (req, res) => {
  const { patient_id, password } = req.body;

  const sql = 'UPDATE patients SET password = ? WHERE patient_id = ? AND password IS NULL';
  
  db.query(sql, [password, patient_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error setting password' });
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Patient not found or password already set' });
    }
    res.json({ message: 'Password set successfully' });
  });
});

// UPDATE PATIENT
app.put('/api/admin/patients/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, contact_number, address, date_of_birth, gender } = req.body;
  const sql = `UPDATE patients SET first_name=?, last_name=?, email=?, contact_number=?, address=?, date_of_birth=?, gender=? WHERE patient_id=?`;
  
  db.query(sql, [first_name, last_name, email, contact_number, address, date_of_birth, gender, id], (err) => {
    res.json({ message: err ? 'Error' : 'Patient updated' });
  });
});

// DELETE PATIENT
app.delete('/api/admin/patients/:id', (req, res) => {
  const id = req.params.id;
  db.query(`DELETE FROM prescriptions WHERE appointment_id IN (SELECT appointment_id FROM appointments WHERE patient_id=?)`, [id], () => {
    db.query(`DELETE FROM billing WHERE patient_id=?`, [id], () => {
      db.query(`DELETE FROM appointments WHERE patient_id=?`, [id], () => {
        db.query(`DELETE FROM patients WHERE patient_id=?`, [id], (err) => {
          res.json({ message: 'Patient deleted' });
        });
      });
    });
  });
});

// GET ALL DOCTORS
app.get('/api/admin/doctors', (req, res) => {
  const sql = `SELECT d.*, dept.department_name, COUNT(CASE WHEN a.status='Scheduled' THEN 1 END) as scheduled_appointments 
    FROM doctors d 
    LEFT JOIN departments dept ON d.department_id=dept.department_id 
    LEFT JOIN appointments a ON d.doctor_id=a.doctor_id 
    GROUP BY d.doctor_id`;
  
  db.query(sql, (err, results) => {
    res.json(results || []);
  });
});

// CREATE DOCTOR
app.post('/api/admin/doctors', (req, res) => {
  const { first_name, last_name, specialization, department_id, contact_number, email } = req.body;
  const sql = 'INSERT INTO doctors (first_name, last_name, specialization, department_id, contact_number, email) VALUES (?,?,?,?,?,?)';
  
  db.query(sql, [first_name, last_name, specialization, department_id, contact_number, email], (err, result) => {
    res.status(201).json({ message: 'Doctor created', doctor_id: result?.insertId });
  });
});

// UPDATE DOCTOR
app.put('/api/admin/doctors/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, specialization, department_id, contact_number, email } = req.body;
  const sql = `UPDATE doctors SET first_name=?, last_name=?, specialization=?, department_id=?, contact_number=?, email=? WHERE doctor_id=?`;
  
  db.query(sql, [first_name, last_name, specialization, department_id, contact_number, email, id], (err) => {
    res.json({ message: 'Doctor updated' });
  });
});

// DELETE DOCTOR
app.delete('/api/admin/doctors/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT COUNT(*) as count FROM appointments WHERE doctor_id=?', [id], (err, result) => {
    if (result.count > 0) {
      res.status(400).json({ error: 'Cannot delete - has appointments' });
    } else {
      db.query('DELETE FROM doctors WHERE doctor_id=?', [id], () => {
        res.json({ message: 'Doctor deleted' });
      });
    }
  });
});

// GET ALL APPOINTMENTS
app.get('/api/admin/appointments', (req, res) => {
  const sql = `SELECT a.*, p.first_name as patient_first_name, p.last_name as patient_last_name, 
    d.first_name as doctor_first_name, d.last_name as doctor_last_name 
    FROM appointments a 
    JOIN patients p ON a.patient_id=p.patient_id 
    JOIN doctors d ON a.doctor_id=d.doctor_id 
    ORDER BY a.appointment_date DESC`;
  
  db.query(sql, (err, results) => {
    res.json(results || []);
  });
});

// GET PATIENT REPORTS
app.get('/api/admin/reports/patients', (req, res) => {
  const sql = `SELECT p.patient_id, CONCAT(p.first_name,' ',p.last_name) as patient_name, p.email, p.contact_number,
    COUNT(DISTINCT a.appointment_id) as total_appointments,
    COUNT(DISTINCT pr.prescription_id) as total_prescriptions,
    SUM(b.amount) as total_billing,
    SUM(CASE WHEN b.status='Unpaid' THEN b.amount ELSE 0 END) as pending_amount
    FROM patients p 
    LEFT JOIN appointments a ON p.patient_id=a.patient_id 
    LEFT JOIN prescriptions pr ON a.appointment_id=pr.appointment_id 
    LEFT JOIN billing b ON p.patient_id=b.patient_id 
    GROUP BY p.patient_id`;
  
  db.query(sql, (err, results) => {
    res.json(results || []);
  });
});

// GET DOCTOR REPORTS
app.get('/api/admin/reports/doctors', (req, res) => {
  const sql = `SELECT d.doctor_id, CONCAT(d.first_name,' ',d.last_name) as doctor_name, d.specialization, dept.department_name,
    COUNT(a.appointment_id) as total_appointments,
    COUNT(CASE WHEN a.status='Completed' THEN 1 END) as completed_appointments,
    COUNT(CASE WHEN a.status='Scheduled' THEN 1 END) as scheduled_appointments,
    COUNT(CASE WHEN a.status='Cancelled' THEN 1 END) as cancelled_appointments
    FROM doctors d 
    LEFT JOIN departments dept ON d.department_id=dept.department_id 
    LEFT JOIN appointments a ON d.doctor_id=a.doctor_id 
    GROUP BY d.doctor_id`;
  
  db.query(sql, (err, results) => {
    res.json(results || []);
  });
});



app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
