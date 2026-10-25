import React from 'react';
import {
  Briefcase,
  Calendar,
  Globe,
  Building2,
  Cloud,
  Atom,
} from 'lucide-react';
import { LinkedinIcon, InstagramIcon } from '../common/SocialIcons';
import brillonLogo from '../../assets/Brillon_logo.png';
import './Experience.css';

export default function Experience({ experiencesList = [] }) {
  // Sort experiences so that newly added experiences come first
  const experiences = Array.isArray(experiencesList)
    ? [...experiencesList].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return (b._id || '').localeCompare(a._id || '');
    })
    : [];

  const renderCompanyLogo = (exp) => {
    if (exp.logoUrl) {
      return (
        <img
          src={exp.logoUrl}
          alt={exp.company}
          className="exp-company-logo-img"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }

    if (exp.company && exp.company.toLowerCase().includes('brillon')) {
      return (
        <img
          src={brillonLogo}
          alt={exp.company}
          className="exp-company-logo-img"
          style={{ objectFit: 'contain', background: '#070913', padding: '6px' }}
        />
      );
    }

    if (exp.logoType === 'cloud') {
      return (
        <div className="exp-preset-logo cloud-logo">
          <Cloud size={32} />
        </div>
      );
    }

    if (exp.logoType === 'atom') {
      return (
        <div className="exp-preset-logo atom-logo">
          <Atom size={32} />
        </div>
      );
    }

    return (
      <div className="exp-preset-logo default-logo">
        <Building2 size={32} />
      </div>
    );
  };

  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-badge">
            <Briefcase size={13} />
            <span>Career Path</span>
          </span>
          <h2 className="section-title">Experience</h2>

        </div>

        {experiences.length === 0 ? (
          <div className="glass-card empty-exp-card">
            <Building2 size={36} className="empty-icon" />
            <p>No experience entries currently configured.</p>
          </div>
        ) : (
          /* Centered Experience Grid */
          <div className="experience-grid">
            {experiences.map((exp, idx) => (
              <div
                key={exp._id || idx}
                className={`glass-card experience-grid-card ${exp.isCurrent ? 'current-role' : ''}`}
                style={{
                  borderTop: exp.bannerBg ? `3px solid ${exp.bannerBg}` : undefined,
                }}
              >
                <div className="experience-card-glow" />

                {/* Centered Large Company Logo */}
                <div className="exp-logo-center-wrapper">
                  {renderCompanyLogo(exp)}
                </div>

                {/* Role Title & Company */}
                <div className="exp-grid-title-block">
                  <h3 className="exp-grid-role">{exp.role}</h3>
                  <div className="exp-grid-company-row">
                    <span className="exp-grid-company">{exp.company}</span>
                    {exp.isCurrent && (
                      <span className="current-badge">
                        <span className="badge-pulse" />
                        <span>Current</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="exp-grid-duration">
                  <Calendar size={13} />
                  <span>{exp.duration}</span>
                </div>

                {/* Division / Department Tag if available */}
                {exp.logoText && (
                  <div className="exp-grid-division">
                    <span>{exp.logoText}</span>
                  </div>
                )}

                {/* Social Links Row (Down Center) */}
                {(exp.socials?.website || exp.socials?.linkedin || exp.socials?.instagram) && (
                  <div className="exp-bottom-socials">
                    {exp.socials?.website && (
                      <a
                        href={exp.socials.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="exp-icon-link"
                        title="Company Website"
                      >
                        <Globe size={18} />
                      </a>
                    )}
                    {exp.socials?.linkedin && (
                      <a
                        href={exp.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="exp-icon-link"
                        title="LinkedIn Profile"
                      >
                        <LinkedinIcon size={18} />
                      </a>
                    )}
                    {exp.socials?.instagram && (
                      <a
                        href={exp.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="exp-icon-link"
                        title="Instagram"
                      >
                        <InstagramIcon size={18} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
