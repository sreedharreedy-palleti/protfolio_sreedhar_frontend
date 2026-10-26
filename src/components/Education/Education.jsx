import React from 'react';
import { GraduationCap, Calendar, School, Award } from 'lucide-react';
import './Education.css';

const DEFAULT_EDUCATION = [
  {
    degree: 'B.Tech – CSE(Data Science)',
    institution: 'Rajeev Gandhi Memorial College of Engineering and Technology, Nandyal',
    duration: '2023 – 2027',
  },
  {
    degree: 'Higher Secondary',
    institution: 'Narayana Junior College, Nellore',
    duration: '2021 – 2023',
  },
  {
    degree: 'Secondary School',
    institution: 'Usha Kiran High School, Vempalli',
    duration: '2021',
  },
];
export default function Education({ educationList = [] }) {
  const education = Array.isArray(educationList) && educationList.length >= 2
    ? educationList
    : DEFAULT_EDUCATION;

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

        {/* 3-Card Education Grid */}
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
