import React, { useEffect, useState } from 'react';
import '../components/Banner.css';
import './Invertors.css';
import PdfViewer from '../components/PdfViewer';
import invertorBanner from '../assets/invertor/banneri.png';
import invertorLogo from '../assets/invertor/invertorlogo.png';
import { useNavigate } from 'react-router-dom';

// PDF path in public folder (encode spaces/parentheses)
const pdfPath = encodeURI('/Ecocruze-solar-inverter  (2).pdf');

export default function Invertors() {
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  // Initialize Tawk.to chat widget
  useEffect(() => {
    var Tawk_API = window.Tawk_API || {};
    var Tawk_LoadStart = new Date();
    (function(){
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/YOUR_TAWK_TO_ID/default'; // Replace with your tawk.to widget code
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  // Enlarge global header logo while on this page for a stronger brand presence
  useEffect(() => {
    // keep header/logo size controlled by CSS; avoid inline width changes that shift layout
    return undefined;
  }, []);

  return (
    <main className="invertors-page">
      {/* Navigation handled by global Header component; do not render duplicate nav here */}

      {/* Dynamic Content Sections */}
      {activeSection === 'home' && (
        <>
          <div className="invertors-banner">
            <img 
              src={invertorBanner} 
              alt="Ecocruze Solar Inverter" 
              className="banner-image"
              width={1256}
              height={428}
              loading="eager"
              priority="high"
            />
          </div>

          <div className="page-heading">
            <h1>Ecocruze Invertor</h1>
          </div>

          <div className="pdf-container">
            <div className="pdf-controls">
              <a className="control-btn" href={pdfPath} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-external-link-alt"></i> Open in New Tab
              </a>
              <a className="control-btn" href={pdfPath} download>
                <i className="fas fa-download"></i> Download PDF
              </a>
              <button
                className="control-btn"
                onClick={() => {
                  const el = document.querySelector('.pdf-frame');
                  if (!el) return;
                  if (el.requestFullscreen) el.requestFullscreen();
                  else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
                  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
                  else if (el.msRequestFullscreen) el.msRequestFullscreen();
                }}
              >
                <i className="fas fa-expand"></i> Fullscreen
              </button>
            </div>

            <div className="pdf-frame">
              <PdfViewer url={pdfPath} />
            </div>

            <div className="contact-section">
              <div className="contact-container">
                <h2>Contact Us</h2>
                <p className="contact-intro">
                  Interested in our Inverter solutions? Fill out the form below and our team will get back to you shortly.
                </p>
                <form className="inverter-contact-form" onSubmit={e => { e.preventDefault(); navigate('/contact'); }}>
                  <div className="form-group">
                    <input type="text" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <input type="email" placeholder="Your Email" required />
                  </div>
                  <div className="form-group">
                    <input type="tel" placeholder="Phone Number" required />
                  </div>
                  <div className="form-group">
                    <textarea placeholder="Your Message" rows="4" required></textarea>
                  </div>
                  <button type="submit" className="submit-btn">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'about' && (
        <div className="about-section">
          <div className="about-container">
            <div className="about-image">
              <img src={invertorLogo} alt="Ecocruze Inverter" />
            </div>
            <div className="about-content">
              <h2>About Ecocruze Inverters</h2>
              <p>
                Ecocruze has launched its own line of inverters designed to support homes and businesses 
                with reliable, eco-friendly power backup solutions. These inverters are built on the brand's 
                core values of sustainability, advanced technology, and user-centric innovation, aiming to 
                deliver uninterrupted power while minimizing environmental impact.
              </p>
              
              <h3>Key Highlights</h3>
              <ul className="features-list">
                <li>
                  <span className="feature-icon">✓</span>
                  Advanced pure sine wave technology for safe, clean, and reliable power supply to sensitive appliances.
                </li>
                <li>
                  <span className="feature-icon">✓</span>
                  Efficient battery management, enabling rapid charging and extended backup times optimal for Indian power conditions.
                </li>
                <li>
                  <span className="feature-icon">✓</span>
                  Smart LCD displays for real-time monitoring of backup time, charging status, and system health.
                </li>
                <li>
                  <span className="feature-icon">✓</span>
                  Eco-ready design, emphasizing low noise, minimal pollution, and sustainable energy use.
                </li>
                <li>
                  <span className="feature-icon">✓</span>
                  Built-in protection against overload, short circuits, battery deep discharge, and reverse polarity.
                </li>
              </ul>

              <p className="about-footer">
                Ecocruze Inverters are ideal for residential, commercial, and office applications—delivering 
                performance trusted by modern families and green businesses alike. Aligned with Ecocruze's 
                mission, these inverters empower users to experience reliable energy with a lower carbon 
                footprint, supporting a smarter, greener future for all.
              </p>
            </div>
          </div>
        </div>
      )}

  {/* Contact section removed for this page (per design) */}
  {/* Footer is provided globally by the site layout; do not render it here to avoid duplicates */}
    </main>
  );
}
