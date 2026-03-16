import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">⚕️ LifeCare</Link>
        
        <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
        
        <ul className={`nav-menu ${mobileOpen ? 'open' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/doctors">Doctors</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/admin" className="admin-btn">🔐 Admin</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
