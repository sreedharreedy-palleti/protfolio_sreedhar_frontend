import React, { useState, useEffect } from 'react';
import PortfolioPage from './pages/PortfolioPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function checkIsAdminRoute() {
  const pathname = (window.location.pathname || '').toLowerCase();
  const hash = (window.location.hash || '').toLowerCase();
  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin') ||
    hash === '#admin' ||
    hash === '#/admin'
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => (checkIsAdminRoute() ? 'admin' : 'portfolio'));

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPage(checkIsAdminRoute() ? 'admin' : 'portfolio');
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else {
      if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
        window.history.pushState(null, '', window.location.pathname);
      }
      if (window.location.pathname.toLowerCase().startsWith('/admin')) {
        window.history.pushState(null, '', '/');
      }
    }
  };

  return currentPage === 'admin' ? (
    <AdminPage onNavigateHome={() => navigateTo('portfolio')} />
  ) : (
    <PortfolioPage onNavigateAdmin={() => navigateTo('admin')} />
  );
}
