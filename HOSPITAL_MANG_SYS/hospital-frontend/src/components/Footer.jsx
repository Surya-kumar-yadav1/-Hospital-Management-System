// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: About */}
            <div className="footer-column">
              <h4 className="footer-title">
                <span className="footer-logo">⚕️</span> LifeCare
              </h4>
              <p className="footer-about">
                Providing world-class healthcare services with compassion and excellence. Your health is our priority.
              </p>
              <div className="social-links">
                <a href="#facebook" className="social-icon" title="Facebook">f</a>
                <a href="#twitter" className="social-icon" title="Twitter">𝕏</a>
                <a href="#instagram" className="social-icon" title="Instagram">📷</a>
                <a href="#linkedin" className="social-icon" title="LinkedIn">in</a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-column">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/doctors">Find Doctors</Link></li>
                <li><Link to="/dashboard">Patient Portal</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 3: Services */}
            <div className="footer-column">
              <h4 className="footer-title">Services</h4>
              <ul className="footer-links">
                <li><a href="#cardiology">Cardiology</a></li>
                <li><a href="#orthopedics">Orthopedics</a></li>
                <li><a href="#neurology">Neurology</a></li>
                <li><a href="#pediatrics">Pediatrics</a></li>
                <li><a href="#emergency">Emergency Care</a></li>
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div className="footer-column">
              <h4 className="footer-title">Contact</h4>
              <ul className="contact-info">
                <li>
                  <span className="contact-icon">📍</span>
                  <span>123 Health Street, Wellness City</span>
                </li>
                <li>
                  <span className="contact-icon">📞</span>
                  <a href="tel:+911234567890">+91 123-456-7890</a>
                </li>
                <li>
                  <span className="contact-icon">✉️</span>
                  <a href="mailto:info@lifecare.com">info@lifecare.com</a>
                </li>
                <li>
                  <span className="contact-icon">🕐</span>
                  <span>24/7 Available</span>
                </li>
              </ul>
            </div>

            {/* Column 5: Newsletter */}
            <div className="footer-column">
              <h4 className="footer-title">Newsletter</h4>
              <p className="newsletter-text">Subscribe to get health tips and updates.</p>
              <form className="newsletter-form" onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing!');
                e.target.reset();
              }}>
                <input 
                  type="email" 
                  placeholder="Your email"
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider"></div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; {currentYear} LifeCare Hospitals. All rights reserved.</p>
            </div>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <span className="divider">|</span>
              <a href="#terms">Terms of Service</a>
              <span className="divider">|</span>
              <a href="#cookies">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
