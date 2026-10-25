import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Projects from '../components/Projects/Projects';
import Education from '../components/Education/Education';
import Experience from '../components/Experience/Experience';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';
import ApiManager from '../components/ApiManager/ApiManager';
import {
  fetchPortfolioContent,
  fetchAboutData,
  fetchProjects,
  fetchExperiences,
  checkBackendHealth,
  FALLBACK_CONTENT,
  FALLBACK_PROJECTS,
  FALLBACK_EXPERIENCES,
} from '../services/api';

export default function PortfolioPage({ onNavigateAdmin }) {
  const [content, setContent] = useState(FALLBACK_CONTENT);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [experiences, setExperiences] = useState(FALLBACK_EXPERIENCES);
  const [backendOnline, setBackendOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiManagerOpen, setIsApiManagerOpen] = useState(false);

  const loadAllData = useCallback(async () => {
    try {
      const [healthRes, contentData, aboutRes, projectsData, experiencesData] = await Promise.allSettled([
        checkBackendHealth(),
        fetchPortfolioContent(),
        fetchAboutData(),
        fetchProjects(),
        fetchExperiences(),
      ]);

      if (healthRes.status === 'fulfilled' && healthRes.value?.online) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }

      let currentContent = contentData.status === 'fulfilled' && contentData.value ? contentData.value : FALLBACK_CONTENT;
      if (aboutRes.status === 'fulfilled' && aboutRes.value) {
        currentContent = {
          ...currentContent,
          about: {
            ...currentContent.about,
            ...aboutRes.value,
          },
        };
      }
      setContent(currentContent);

      if (projectsData.status === 'fulfilled' && projectsData.value) {
        setProjects(projectsData.value);
      }

      if (experiencesData.status === 'fulfilled' && experiencesData.value) {
        setExperiences(experiencesData.value);
      }
    } catch (err) {
      console.warn('Portfolio system synchronization notice:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await loadAllData();
      if (isMounted) {
        setTimeout(() => setIsLoading(false), 250);
      }
    };

    init();

    // Periodic heartbeat to detect backend server status
    const interval = setInterval(async () => {
      const health = await checkBackendHealth();
      if (isMounted) {
        setBackendOnline(health.online);
      }
    }, 20000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [loadAllData]);

  if (isLoading) {
    return (
      <div className="portfolio-preloader">
        <div className="preloader-spinner">
          <div className="spinner-orbit"></div>
          <div className="spinner-core"></div>
        </div>
        <div className="preloader-text">
          <span className="preloader-title">INITIALIZING SYSTEM</span>
          <span className="preloader-subtitle">Synchronizing with Portfolio Backend API...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-app-root">
      {/* Background Cybernetic Grid Texture */}
      <div className="cyber-grid" aria-hidden="true" />

      {/* Navigation Header */}
      <Navbar
        backendOnline={backendOnline}
        heroData={content.hero}
        onOpenApiManager={() => setIsApiManagerOpen(true)}
        onNavigateAdmin={onNavigateAdmin}
      />

      {/* Main Content Sections */}
      <main id="main-content">
        <Hero
          heroData={content.hero}
          contactInfo={content.contactInfo}
        />

        <About
          aboutData={content.about}
          contactInfo={content.contactInfo}
        />

        <Experience experiencesList={experiences} />

        <Skills
          skillsList={content.skills}
        />

        <Projects
          projectsList={projects}
        />

        <Education
          educationList={content.education}
        />

        <Contact
          contactInfo={content.contactInfo}
        />
      </main>

      {/* Footer */}
      <Footer
        backendOnline={backendOnline}
        contactInfo={content.contactInfo}
        onNavigateAdmin={onNavigateAdmin}
      />

      {/* Live Backend API Operations Modal */}
      <ApiManager
        isOpen={isApiManagerOpen}
        onClose={() => setIsApiManagerOpen(false)}
        backendOnline={backendOnline}
        content={content}
        projects={projects}
        onRefreshData={loadAllData}
      />
    </div>
  );
}
