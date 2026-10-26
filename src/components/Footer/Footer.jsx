import React from 'react';
import {
  ArrowUp,
  Terminal,
  Heart,
  Mail,
  Activity,
} from 'lucide-react';
import './Footer.css';

export default function Footer({
  backendOnline,
  contactInfo = {},
  onNavigateAdmin,
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-root">
      <div className="container footer-container">
        <div className="footer-top-row">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <Terminal size={18} />
              </div>
              <span className="footer-brand-title">SREEDHAR.DEV</span>
            </div>
            <p className="footer-brand-desc">
              Engineered for resilient performance and exceptional user experiences.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="footer-links-col">
            <h4 className="footer-links-header">Navigation</h4>
            <div className="footer-nav-list">
              <a href="#about" className="footer-link">About</a>
              <a href="#experience" className="footer-link">Experience</a>
              <a href="#skills" className="footer-link">Skills</a>
              <a href="#projects" className="footer-link">Projects</a>
              <a href="#education" className="footer-link">Education</a>
              <a href="#contact" className="footer-link">Contact</a>
            </div>
          </div>

          {/* Connect Column */}
          <div className="footer-links-col">
            <h4 className="footer-links-header">Profiles</h4>
            <div className="footer-nav-list">
              {contactInfo?.linkedinUrl && (
                <a
                  href={contactInfo.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  LinkedIn
                </a>
              )}
              {contactInfo?.instagramUrl && (
                <a
                  href={contactInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Instagram
                </a>
              )}
              {contactInfo?.githubUrl && (
                <a
                  href={contactInfo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  GitHub
                </a>
              )}
              {contactInfo?.facebookUrl && (
                <a
                  href={contactInfo.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Facebook
                </a>
              )}
              {contactInfo?.twitterUrl && (
                <a
                  href={contactInfo.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Twitter
                </a>
              )}
              {contactInfo?.email && (
                <a href={`mailto:${contactInfo.email}`} className="footer-link">
                  Direct Email
                </a>
              )}
            </div>
          </div>

          {/* Quick Action */}
          <div className="footer-admin-col">
            <h4 className="footer-links-header">Action</h4>
            <button
              type="button"
              className="footer-scroll-top-btn"
              onClick={scrollToTop}
            >
              <span>Back to Top</span>
              <ArrowUp size={15} />
            </button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom-row">
          <p className="copyright-text">
            © {new Date().getFullYear()} Venkata Sreedhar Reddy Palleti. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
