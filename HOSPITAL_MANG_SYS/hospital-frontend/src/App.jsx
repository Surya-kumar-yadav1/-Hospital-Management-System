import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import PatientDashboard from './pages/PatientDashboard';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import PatientRegistration from './components/PatientRegistration';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/register" element={<PatientRegistration />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
