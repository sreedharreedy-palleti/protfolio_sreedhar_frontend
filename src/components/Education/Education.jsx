import React from 'react';
import { GraduationCap, Calendar, School, Award, CheckCircle } from 'lucide-react';
import './Education.css';

export default function Education({ educationList = [] }) {
  const education = Array.isArray(educationList) ? educationList : [];

  return (
    <section id="education" className="section education-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-badge">
            <GraduationCap size={13} />
            <span>Academic Foundations</span>
          </span>
          <h2 className="section-title">My Education</h2>
        </div>

        <div className="education-grid">
          {education.map((item, idx) => (
            <div key={idx} className="glass-card education-card">
              <div className="education-icon-box">
                <GraduationCap size={24} />
              </div>

              <div className="education-content">
                <div className="education-top-bar">
                  <span className="education-duration">
                    <Calendar size={13} />
                    <span>{item.duration}</span>
                  </span>
                </div>

                <h3 className="education-degree">{item.degree}</h3>
                <h4 className="education-institution">
                  <School size={16} className="inst-icon" />
                  <span>{item.institution}</span>
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
