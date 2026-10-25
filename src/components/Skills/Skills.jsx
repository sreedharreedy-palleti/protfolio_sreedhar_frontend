import React, { useState } from 'react';
import { Cpu } from 'lucide-react';
import { TechLogo } from '../common/TechLogos';
import './Skills.css';

const DEFAULT_CATEGORIES = [
  {
    name: 'All Technologies',
    id: 'all',
  },
  {
    name: 'Frontend',
    id: 'frontend',
    match: ['react', 'vue', 'next', 'tailwind', 'javascript', 'html', 'css', 'typescript', 'redux'],
  },
  {
    name: 'Backend & APIs',
    id: 'backend',
    match: ['node', 'express', 'fastapi', 'python', 'django', 'rest', 'graphql'],
  },
  {
    name: 'Databases & DevOps',
    id: 'devops',
    match: ['mongo', 'postgres', 'sql', 'docker', 'aws', 'cloud', 'redis', 'git', 'kube'],
  },
];

export default function Skills({ skillsList = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');

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

  const filteredSkills = skills.filter((skill) => {
    if (activeCategory === 'all') return true;
    const cat = DEFAULT_CATEGORIES.find((c) => c.id === activeCategory);
    if (!cat || !cat.match) return true;
    const lower = skill.name.toLowerCase();
    return cat.match.some((m) => lower.includes(m));
  });

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

        {/* Filter Tabs */}
        <div className="skills-filter-tabs">
          {DEFAULT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`skills-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Skills Grid without progress lines and without 'PROVEN' tags */}
        <div className="skills-grid">
          {filteredSkills.map((skill, idx) => (
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
