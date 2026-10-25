import React from 'react';
import {
  Mail,
  ArrowRight,
  Sparkles,
  Download,
  Terminal,
  MapPin,
  ExternalLink,
  Code2,
  Cloud,
  Zap,
  Star,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { LinkedinIcon, InstagramIcon, GithubIcon, FacebookIcon, TwitterIcon } from '../common/SocialIcons';
import defaultAvatar from '../../assets/sreedhar_photo.jpg';
import './Hero.css';

export default function Hero({ heroData, contactInfo }) {
  const badgeText = heroData?.badge || 'Full-Stack Developer';
  const headingText = heroData?.heading || "HELLO ! I'm Venkata Sreedhar Reddy Palleti";
  const avatarImage = heroData?.avatarUrl || defaultAvatar;

  // Render chip icon by name
  const renderChipIcon = (iconName) => {
    switch (iconName) {
      case 'code':
        return <Code2 size={14} style={{ color: '#06b6d4' }} />;
      case 'terminal':
        return <Terminal size={14} style={{ color: '#10b981' }} />;
      case 'cloud':
        return <Cloud size={14} style={{ color: '#38bdf8' }} />;
      case 'zap':
        return <Zap size={14} style={{ color: '#f59e0b' }} />;
      case 'star':
        return <Star size={14} style={{ color: '#fbbf24' }} />;
      case 'shield':
        return <ShieldCheck size={14} style={{ color: '#a855f7' }} />;
      case 'check':
        return <CheckCircle size={14} style={{ color: '#10b981' }} />;
      case 'sparkles':
      default:
        return <Sparkles size={14} className="chip-sparkle" />;
    }
  };

  const defaultChips = [
    {
      text: 'Cloud Ready',
      icon: 'sparkles',
      position: 'top-right',
      animate: true,
    },
  ];
  const chipsList =
    Array.isArray(heroData?.chips) && heroData.chips.length > 0
      ? heroData.chips
      : defaultChips;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">

          {/* Heading */}
          <h1 className="hero-heading">
            {headingText}
          </h1>


          {/* Location & Quick Meta */}
          {contactInfo?.location && (
            <div className="hero-meta-row">
              <div className="hero-meta-item">
                <MapPin size={14} className="meta-icon" />
                <span>{contactInfo.location}</span>
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-primary hero-btn-main"
              onClick={() => scrollTo('projects')}
            >
              <span>Explore Projects</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="btn btn-secondary hero-btn-sub"
              onClick={() => scrollTo('contact')}
            >
              <Mail size={17} />
              <span>Get In Touch</span>
            </button>
          </div>

          {/* Social Links Bar */}
          <div className="hero-socials">
            <span className="socials-label">Connect:</span>
            <div className="socials-icons">
              {contactInfo?.linkedinUrl && (
                <a
                  href={contactInfo.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon size={18} />
                </a>
              )}
              {contactInfo?.instagramUrl && (
                <a
                  href={contactInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon size={18} />
                </a>
              )}
              {contactInfo?.githubUrl && (
                <a
                  href={contactInfo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon size={18} />
                </a>
              )}
              {contactInfo?.facebookUrl && (
                <a
                  href={contactInfo.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Facebook Profile"
                >
                  <FacebookIcon size={18} />
                </a>
              )}
              {contactInfo?.twitterUrl && (
                <a
                  href={contactInfo.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Twitter Profile"
                >
                  <TwitterIcon size={18} />
                </a>
              )}
              {contactInfo?.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="social-link"
                  aria-label="Send Email"
                >
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Hero Visual / Avatar Card */}
        <div className="hero-visual">
          <div className="hero-visual-frame">
            <div className="hero-glow-back" />
            <div className="hero-card-inner">
              <img
                src={avatarImage}
                alt="Venkata Sreedhar Reddy Palleti"
                className="hero-avatar-img"
                onError={(e) => {
                  if (e.target.src !== defaultAvatar) {
                    e.target.src = defaultAvatar;
                  }
                }}
              />
              <div className="hero-card-overlay">
                <div className="hero-status-pill">
                  <span className="live-status-dot" />
                  <span>Full-Stack Engineering</span>
                </div>
              </div>
            </div>

            {/* Floating Cyber Accent Chips - Configured via Admin / MongoDB */}
            {chipsList.map((chip, idx) => {
              const rawPos = chip.position || 'top-right';
              const posClass = `chip-${rawPos}`;
              const isFloating = chip.animate !== false;

              return (
                <div
                  key={chip._id || idx}
                  className={`hero-chip ${posClass} ${isFloating ? 'is-floating' : ''}`}
                  title={chip.text}
                >
                  <span className="chip-icon">{renderChipIcon(chip.icon)}</span>
                  <span>{chip.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
