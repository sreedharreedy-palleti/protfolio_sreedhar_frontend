import React from 'react';
import { Download, FileText } from 'lucide-react';
import './About.css';

export default function About({ aboutData }) {
  // Title & Subtitle
  const fullTitle = aboutData?.title || aboutData?.sectionTitle || 'About Me';
  const subtitle = aboutData?.subtitle || aboutData?.sectionSubtitle || 'My introduction';

  // Break title into main and accented word (e.g., "About" and "Me")
  const titleParts = fullTitle.trim().split(' ');
  const mainTitle = titleParts.slice(0, -1).join(' ') || titleParts[0];
  const accentWord = titleParts.length > 1 ? titleParts[titleParts.length - 1] : '';

  // 1. Passage Text (Narrative Bio Paragraph)
  const passageText =
    aboutData?.text ||
    'Senior Software Engineer with 6+ years of experience building scalable cloud-native applications, data platforms, and analytics solutions. I specialize in Java, Spring Boot, Python, React, Azure, Kubernetes, and Apache Superset, with a strong interest in open-source technologies, AI-powered products, and data-driven innovation.';

  // 2. Key Points (Points-wise Bullet List)
  const pointsList =
    Array.isArray(aboutData?.keyPoints) && aboutData.keyPoints.length > 0
      ? aboutData.keyPoints.filter(Boolean)
      : [
          'Specialized in CSE & Data Science fundamentals',
          'Extensive real-world experience across frontend and backend services',
          'Passionate about automated testing, CI/CD, and maintainable codebases',
        ];

  // Stats Counters
  const defaultStats = [
    { value: '06+', label: 'Years experience' },
    { value: '05', label: 'Companies Work' },
    { value: '15+', label: 'Technical Skills' },
  ];
  const stats =
    Array.isArray(aboutData?.stats) && aboutData.stats.length > 0
      ? aboutData.stats
      : defaultStats;

  // CV details
  const cv = aboutData?.cv || {};
  const hasCv = Boolean(cv?.data || cv?.url);

  const handleDownloadCv = () => {
    // 1. Direct Base64 PDF / File Download from MongoDB (uploaded by admin)
    if (cv?.data && cv.data.trim()) {
      const link = document.createElement('a');
      link.href = cv.data;
      link.download = cv.fileName || 'Venkata_Sreedhar_Reddy_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // 2. Direct Web URL or Google Drive Link if provided by admin
    if (cv?.url && cv.url.trim()) {
      window.open(cv.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // 3. Universal Fallback: Download static resume PDF directly so ANY user can download instantly
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Venkata_Sreedhar_Reddy_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="about" className="section about-section">
      <div className="container">
        {/* Section Header (Up side of the section) */}
        <div className="about-section-header">
          <h2 className="about-section-title">
            {accentWord ? (
              <>
                {mainTitle}{' '}
                <span className="about-title-accent">{accentWord}</span>
              </>
            ) : (
              mainTitle
            )}
          </h2>
          {subtitle && <p className="about-section-subtitle">{subtitle}</p>}
        </div>

        {/* Content Card below the header */}
        <div className="about-card-modern">
          {/* Narrative Bio Passage */}
          {passageText && (
            <p className="about-bio-text">{passageText}</p>
          )}

          {/* Key Points (Points-wise Bullet List) */}
          {pointsList.length > 0 && (
            <ul className="about-keypoints-list">
              {pointsList.map((point, idx) => (
                <li key={idx} className="about-keypoint-item">
                  <span className="about-point-bullet" aria-hidden="true" />
                  <span className="about-point-text">{point}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Stats Counters Grid */}
          <div className="about-stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="about-stat-item">
                <span className="stat-number">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Actions: Download CV */}
          <div className="about-actions-row">
            <button
              type="button"
              className="btn-download-cv"
              onClick={handleDownloadCv}
              title={hasCv ? `Download ${cv.fileName || 'CV'}` : 'Download CV'}
            >
              <span>Download CV</span>
              <Download size={18} />
            </button>

            {cv?.fileName && (
              <span className="cv-file-badge" title={`Uploaded CV: ${cv.fileName}`}>
                <FileText size={13} style={{ color: '#ef4444' }} />
                <span>{cv.fileName}</span>
                {cv.fileSize && <span>({cv.fileSize})</span>}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
