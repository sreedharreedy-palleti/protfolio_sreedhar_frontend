import React from 'react';
import { Cpu } from 'lucide-react';
import { TechLogo } from '../common/TechLogos';
import './Skills.css';

export default function Skills({ skillsList = [] }) {
  // Normalize skills so each entry has { name, iconUrl }
  const skills = Array.isArray(skillsList)
    ? skillsList.map((s) => {
      if (typeof s === 'string') {
        return { name: s, iconUrl: '' };
      }
      return {
        name: s.name || '',
        iconUrl: s.iconUrl || '',
        category: s.category || '',
      };
    })
    : [];

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-badge">
            <Cpu size={13} />
            <span>Technical Proficiencies</span>
          </span>
          <h2 className="section-title">My Skills</h2>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {skills.map((skill, idx) => (
            <div key={idx} className="glass-card skill-card">
              <div className="skill-card-glow" />
              <div className="skill-content-wrap">
                <div className="skill-icon-bubble">
                  <TechLogo name={skill.name} iconUrl={skill.iconUrl} size={24} />
                </div>
                <span className="skill-name">{skill.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
