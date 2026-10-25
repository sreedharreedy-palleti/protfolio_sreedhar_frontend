import React, { useState, useEffect } from 'react';
import { Activity, Menu, X, Terminal, ExternalLink } from 'lucide-react';
import './Navbar.css';

export default function Navbar({
  backendOnline,
  heroData,
  onOpenApiManager,
  onNavigateAdmin,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['about', 'experience', 'skills', 'projects', 'education', 'contact'];
      const scrollPosition = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          return;
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-root ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand / Logo */}
        <a href="#hero" className="navbar-brand" onClick={(e) => handleNavClick(e, '#hero')}>
          <div className="brand-icon">
            <Terminal size={18} />
          </div>
          <div className="brand-text">
            <span className="brand-name">SREEDHAR</span>
            <span className="brand-tag">.DEV</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="navbar-nav desktop-nav" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
              {activeSection === link.id && <span className="nav-active-pill" />}
            </a>
          ))}
        </nav>

        {/* Right Actions: API Status & Admin */}
        <div className="navbar-actions">
          {/* Backend Status Badge */}


          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="btn-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`mobile-nav-link ${activeSection === link.id ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                <span>{link.label}</span>
                {activeSection === link.id && <span className="mobile-active-indicator" />}
              </a>
            ))}
          </div>

          <div className="mobile-drawer-footer">
            <button
              type="button"
              className={`mobile-api-btn ${backendOnline ? 'online' : 'offline'}`}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApiManager();
              }}
            >
              <Activity size={15} />

            </button>
          </div>
        </div>
      )}
    </header>
  );
}
