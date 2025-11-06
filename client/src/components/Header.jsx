import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import './Header.css';
import { FaBars } from 'react-icons/fa';
import logo from '../assets/main-logo.webp';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  // Auto-close mobile menu on route change
  useEffect(() => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <header>
      <div className="main-header">
        <Link to="/" className="logo">
          <img src={logo} alt="Ecocruze Motorcycles" />
        </Link>
        
        <nav className={mobileMenuOpen ? 'mobile-open' : ''}>
          <ul onClick={() => setMobileMenuOpen(false)}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/dealership">Dealership</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/invertors">Ecocruze Invertors</Link></li>
          </ul>
        </nav>
        
        <div className="header-actions">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FaBars />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;