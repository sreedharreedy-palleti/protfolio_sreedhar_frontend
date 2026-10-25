import React, { useState } from 'react';
import {
  CheckCircle,
  Copy,
  MessageSquare,
} from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from '../common/SocialIcons';
import defaultContactPhoto from '../../assets/sreedhar_photo.jpg';
import './Contact.css';

export default function Contact({ contactInfo = {} }) {
  const [copiedField, setCopiedField] = useState(null);

  const email = contactInfo.email || 'palletisreedharreddy82@gmail.com';
  const phone = contactInfo.phone || '+91-8885439267';
  const location = contactInfo.location || 'Andhra Pradesh, India';
  const photoSrc = contactInfo.photoUrl || defaultContactPhoto;
  const linkedinUrl = contactInfo.linkedinUrl || 'https://linkedin.com';
  const instagramUrl = contactInfo.instagramUrl || 'https://instagram.com';
  const githubUrl = contactInfo.githubUrl || 'https://github.com';
  const facebookUrl = contactInfo.facebookUrl || 'https://facebook.com';
  const twitterUrl = contactInfo.twitterUrl || 'https://twitter.com';

  const handleCopy = (text, fieldName) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container contact-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-badge">
            <MessageSquare size={13} />
            <span>Direct Communication</span>
          </span>
          <h2 className="section-title">Let's Connect & Collaborate</h2>
        </div>

        {/* Primary Contact Showcase Card */}
        <div className="contact-showcase-card">
          <div className="contact-showcase-image-wrapper">
            <img
              src={photoSrc}
              alt="Mallikarjuna Reddy"
              className="contact-showcase-image"
              onError={(e) => {
                e.target.src = defaultContactPhoto;
              }}
            />
          </div>

          <div className="contact-showcase-content">
            <div className="contact-details-list">
              {/* Email Entry */}
              <div className="contact-item-row">
                <a
                  href={`mailto:${email}`}
                  className="contact-icon-bubble contact-icon-email"
                  title="Send Email"
                  aria-label="Send Email"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="bubble-icon">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.511l-8 5.333-8-5.333V6h16zM4 18V8.91l7.445 4.963a1 1 0 0 0 1.11 0L20 8.91V18H4z" />
                  </svg>
                </a>
                <div className="contact-text-group">
                  <a href={`mailto:${email}`} className="contact-main-text">
                    {email}
                  </a>
                </div>
                <button
                  type="button"
                  className="btn-quick-copy"
                  onClick={() => handleCopy(email, 'email')}
                  title="Copy email address"
                  aria-label="Copy email"
                >
                  {copiedField === 'email' ? <CheckCircle size={15} /> : <Copy size={15} />}
                </button>
              </div>

              {/* WhatsApp / Phone Entry */}
              <div className="contact-item-row">
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-icon-bubble contact-icon-whatsapp"
                  title="WhatsApp Chat"
                  aria-label="WhatsApp Chat"
                >
                  <WhatsappIcon size={24} className="bubble-icon" />
                </a>
                <div className="contact-text-group">
                  <a href={`tel:${phone}`} className="contact-main-text">
                    {phone}
                  </a>
                </div>
                <button
                  type="button"
                  className="btn-quick-copy"
                  onClick={() => handleCopy(phone, 'phone')}
                  title="Copy phone number"
                  aria-label="Copy phone"
                >
                  {copiedField === 'phone' ? <CheckCircle size={15} /> : <Copy size={15} />}
                </button>
              </div>

              {/* Location Entry */}
              <div className="contact-item-row">
                <div
                  className="contact-icon-bubble contact-icon-location"
                  title="Location"
                  aria-label="Location"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="bubble-icon">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
                    />
                  </svg>
                </div>
                <div className="contact-text-group">
                  <span className="contact-main-text">
                    {location}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Icons Row */}
            <div className="contact-social-row">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                title="LinkedIn"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon size={22} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                title="Instagram"
                aria-label="Instagram Profile"
              >
                <InstagramIcon size={22} />
              </a>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                title="GitHub"
                aria-label="GitHub Profile"
              >
                <GithubIcon size={22} />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                title="Facebook"
                aria-label="Facebook Profile"
              >
                <FacebookIcon size={22} />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                title="Twitter"
                aria-label="Twitter Profile"
              >
                <TwitterIcon size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
