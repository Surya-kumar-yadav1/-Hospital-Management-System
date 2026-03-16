// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
      setLoading(false);
      
      // Reset after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get in Touch</h1>
          <p>We're here to help and answer any questions you might have</p>
        </div>
      </div>

      <div className="container">
        {/* Contact Info Cards */}
        <div className="contact-info-grid">
          <div className="contact-info-card">
            <div className="info-icon">📍</div>
            <h3>Visit Us</h3>
            <p>LifeCare Hospital Main Building</p>
            <p>123 Health Street, Wellness City</p>
            <p>PIN: 123456</p>
            <a href="#map" className="info-link">View on Map →</a>
          </div>

          <div className="contact-info-card">
            <div className="info-icon">📞</div>
            <h3>Call Us</h3>
            <p><strong>Main Reception:</strong></p>
            <a href="tel:+911234567890" className="phone-link">+91 123-456-7890</a>
            <p style={{marginTop: '1rem'}}><strong>Emergency:</strong></p>
            <a href="tel:+911234567891" className="phone-link">+91 123-456-7891</a>
            <p style={{marginTop: '0.5rem', fontSize: '0.85rem', color: '#666'}}>Available 24/7</p>
          </div>

          <div className="contact-info-card">
            <div className="info-icon">✉️</div>
            <h3>Email Us</h3>
            <p><strong>General Inquiries:</strong></p>
            <a href="mailto:info@lifecare.com" className="email-link">info@lifecare.com</a>
            <p style={{marginTop: '1rem'}}><strong>Support:</strong></p>
            <a href="mailto:support@lifecare.com" className="email-link">support@lifecare.com</a>
          </div>

          <div className="contact-info-card">
            <div className="info-icon">🕐</div>
            <h3>Hours</h3>
            <div className="hours-list">
              <p><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM</p>
              <p><strong>Saturday:</strong> 9:00 AM - 5:00 PM</p>
              <p><strong>Sunday:</strong> 10:00 AM - 3:00 PM</p>
              <p style={{marginTop: '1rem', color: '#10b981'}}><strong>Emergency: Open 24/7</strong></p>
            </div>
          </div>
        </div>

        {/* Main Contact Section */}
        <div className="contact-main">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <p>Have a question or feedback? We'd love to hear from you.</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="appointment">Appointment Related</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="feedback">Feedback</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input 
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your inquiry in detail..."
                  rows="6"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? '⏳ Sending...' : '📤 Send Message'}
              </button>

              {submitted && (
                <div className="success-message">
                  ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}
            </form>
          </div>

          {/* Side Information */}
          <div className="contact-side-info">
            <div className="side-card">
              <h3>Quick Responses</h3>
              <p>We typically respond to inquiries within 24 business hours.</p>
              <div className="response-times">
                <div className="response-item">
                  <span>📧 Email:</span>
                  <span>24 hours</span>
                </div>
                <div className="response-item">
                  <span>☎️ Phone:</span>
                  <span>Immediate</span>
                </div>
                <div className="response-item">
                  <span>💬 Chat:</span>
                  <span>5-10 min</span>
                </div>
              </div>
            </div>

            <div className="side-card">
              <h3>Departments</h3>
              <ul className="department-list">
                <li>🏥 General Inquiry</li>
                <li>👨‍⚕️ Doctor Inquiry</li>
                <li>💼 Billing Department</li>
                <li>🧑‍⚖️ Patient Rights</li>
                <li>📋 Records Request</li>
              </ul>
            </div>

            <div className="side-card">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="#facebook" className="social-link">f</a>
                <a href="#twitter" className="social-link">𝕏</a>
                <a href="#instagram" className="social-link">📷</a>
                <a href="#linkedin" className="social-link">in</a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>Find Us On The Map</h2>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.876329438422!2d77.2!3d28.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce67ab3c34567%3A0x1234567890abcdef!2s123%20Health%20Street!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="450"
              style={{border: 0, borderRadius: '12px'}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="LifeCare Hospital Location"
            ></iframe>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>📅 How do I book an appointment?</h4>
              <p>You can book an appointment through our online portal, by calling us, or by visiting our reception desk. Visit our Dashboard section to book online.</p>
            </div>
            <div className="faq-item">
              <h4>💳 What are your payment options?</h4>
              <p>We accept cash, credit cards, debit cards, and digital wallets. We also offer installment plans for major procedures.</p>
            </div>
            <div className="faq-item">
              <h4>🏥 Is emergency care available?</h4>
              <p>Yes, our emergency department is open 24/7. In case of emergency, call +91 123-456-7891 or visit our ER directly.</p>
            </div>
            <div className="faq-item">
              <h4>📋 How can I get my medical records?</h4>
              <p>You can request your medical records through our patient portal or by visiting our Records Department. Requests are typically fulfilled within 5 business days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
