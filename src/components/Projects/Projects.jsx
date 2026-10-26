import React from 'react';
import {
  FolderGit2,
  ExternalLink,
  Layers,
  ArrowUpRight,
  Activity,
  Code2,
} from 'lucide-react';
import { GithubIcon } from '../common/SocialIcons';
import { parseProjectPoints } from '../../utils/projectHelpers';
import './Projects.css';

export default function Projects({ projectsList = [] }) {
  const projects = Array.isArray(projectsList) ? projectsList : [];

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-badge">
            <FolderGit2 size={13} />
            <span>Featured Innovations</span>
          </span>
          <h2 className="section-title">My Projects</h2>
        </div>

        {/* Projects Timeline */}
        {projects.length === 0 ? (
          <div className="glass-card empty-proj-card">
            <Layers size={36} className="empty-icon" />
            <p>No projects available to display.</p>
          </div>
        ) : (
          <div className="projects-timeline">
            {projects.map((project, idx) => {
              const points = parseProjectPoints(project.content || project.description);
              const liveUrl = project.liveDemo || project.live;
              const githubUrl = project.github;
              const techList = Array.isArray(project.tech) ? project.tech : [];
              const isLive = Boolean(liveUrl);

              return (
                <div
                  key={project._id || idx}
                  className={`project-timeline-wrap ${isLive ? 'live-project' : ''}`}
                >
                  {/* Timeline Connector */}
                  <div className="timeline-connector">
                    <div className="timeline-dot">
                      {isLive && <span className="timeline-dot-ping" />}
                    </div>
                    {idx < projects.length - 1 && <div className="timeline-line" />}
                  </div>

                  {/* Horizontal Timeline Card */}
                  <div className="glass-card project-timeline-card">
                    {/* Header Banner (like Experience card header) */}
                    <div className="project-banner-header">
                      <div className="project-brand-header">
                        <div className="project-preset-icon">
                          <Layers size={22} />
                        </div>
                        <div className="project-title-block">
                          <div className="project-title-row">
                            <h3 className="project-name">{project.title}</h3>
                            {isLive && (
                              <span className="live-status-badge">
                                <span className="badge-pulse" />
                                <span>Live Application</span>
                              </span>
                            )}
                          </div>
                          {techList.length > 0 && (
                            <span className="project-tech-summary">
                              {techList.slice(0, 4).join(' • ')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="project-type-badge">
                        <Activity size={13} />
                        <span>Featured Project</span>
                      </div>
                    </div>

                    {/* Bullet Points List */}
                    <div className="project-points-list">
                      {points.map((pt, pIdx) => (
                        <div key={pIdx} className="project-point-item">
                          <span className="point-bullet">•</span>
                          <span className="point-text">{pt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Badges */}
                    {techList.length > 0 && (
                      <div className="project-tech-tags">
                        {techList.map((tech, tIdx) => (
                          <span key={tIdx} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Footer Actions (like Experience socials row) */}
                    <div className="project-socials-row">
                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn btn-live"
                          title="Open Live Demonstration"
                        >
                          <ExternalLink size={14} />
                          <span>Live Preview</span>
                          <ArrowUpRight size={13} />
                        </a>
                      )}
                      {githubUrl && (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn btn-repo"
                          title="View Source on GitHub"
                        >
                          <GithubIcon size={14} />
                          <span>Repository</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
