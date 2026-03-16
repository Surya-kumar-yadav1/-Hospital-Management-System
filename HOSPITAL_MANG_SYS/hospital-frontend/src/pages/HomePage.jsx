// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Your Health, Our Priority</h1>
            <p>Experience world-class healthcare with compassionate doctors, modern facilities, and 24/7 emergency care.</p>
            <div className="hero-actions">
              <Link to="/register" className="btn-primary-large">Book Appointment</Link>
              <Link to="/doctors" className="btn-secondary-large">Find a Doctor</Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <h3>500+</h3>
                <p>Expert Doctors</p>
              </div>
              <div className="stat">
                <h3>50,000+</h3>
                <p>Happy Patients</p>
              </div>
              <div className="stat">
                <h3>24/7</h3>
                <p>Emergency Care</p>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=700&fit=crop" alt="Healthcare Professional" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose LifeCare?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>Advanced Medical Care</h3>
              <p>State-of-the-art equipment and cutting-edge treatment protocols ensure the best outcomes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Expert Specialists</h3>
              <p>Board-certified doctors with years of experience across all major specialties.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>24/7 Availability</h3>
              <p>Round-the-clock emergency services and online appointment booking anytime.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Comprehensive Services</h3>
              <p>From diagnostics to surgery, we provide complete healthcare under one roof.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-content">
          <h2>Ready to Take Control of Your Health?</h2>
          <p>Join thousands of patients who trust LifeCare for their healthcare needs</p>
          <Link to="/register" className="btn-light-large">Get Started Today</Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
