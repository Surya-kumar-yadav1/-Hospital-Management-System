-- Create the database
CREATE DATABASE hospital_management;

-- Use the database
USE hospital_management;

-- Patients Table
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    contact_number VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);

-- Doctors Table
CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100),
    department_id INT,
    contact_number VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Appointments Table
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    appointment_date DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

-- Prescriptions Table
CREATE TABLE prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    medication TEXT NOT NULL,
    dosage VARCHAR(100),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
);

-- Billing Table
CREATE TABLE billing (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    billing_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Unpaid',
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Insert departments
INSERT INTO departments (department_name) VALUES ('Cardiology'), ('Orthopedics'), ('Neurology'), ('Pediatrics');

-- Insert doctors
INSERT INTO doctors (first_name, last_name, specialization, department_id, contact_number, email) VALUES
('Rajesh', 'Sharma', 'Cardiologist', 1, '9876543210', 'rajesh.sharma@lifecare.com'),
('Priya', 'Verma', 'Orthopedic Surgeon', 2, '9876543211', 'priya.verma@lifecare.com'),
('Vikram', 'Patel', 'Neurologist', 3, '9876543212', 'vikram.patel@lifecare.com'),
('Anjali', 'Desai', 'Pediatrician', 4, '9876543213', 'anjali.desai@lifecare.com');

-- Check if patient ID 3 exists
SELECT * FROM patients WHERE patient_id = 3;

-- View all patients
SELECT patient_id, first_name, last_name, email FROM patients;
