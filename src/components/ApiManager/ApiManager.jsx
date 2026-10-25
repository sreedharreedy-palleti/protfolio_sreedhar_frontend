import React, { useState } from 'react';
import {
  X,
  Activity,
  Server,
  RefreshCw,
  Database,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Layers,
  Terminal,
} from 'lucide-react';
import { API_BASE, checkBackendHealth } from '../../services/api';
import './ApiManager.css';

export default function ApiManager({
  isOpen,
  onClose,
  backendOnline,
  content,
  projects = [],
  onRefreshData,
}) {
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingResult, setLastPingResult] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handlePing = async () => {
    setIsPinging(true);
    try {
      const res = await checkBackendHealth();
      setLastPingResult({
        online: res.online,
        time: new Date().toLocaleTimeString(),
        status: res.online ? '200 OK (Connected)' : 'Unreachable (Using Seed Fallbacks)',
      });
    } catch (err) {
      setLastPingResult({
        online: false,
        time: new Date().toLocaleTimeString(),
        status: 'Error: ' + (err.message || 'Connection failed'),
      });
    } finally {
      setIsPinging(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      if (onRefreshData) {
        await onRefreshData();
      }
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  return (
    <div className="api-manager-overlay" onClick={onClose}>
      <div className="glass-card api-manager-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <Server size={18} />
            </div>
            <div>
              <h3 className="modal-title">Backend API Diagnostics</h3>
              <span className="modal-subtitle">Live Connection & Cache Status</span>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Status Banner */}
          <div className={`status-banner ${backendOnline ? 'online' : 'offline'}`}>
            <div className="status-banner-left">
              <span className="status-indicator-dot" />
              <div>
                <h4 className="banner-title">
                  {backendOnline ? 'Backend API Connected' : 'Running in Offline / Cache Mode'}
                </h4>
                <p className="banner-desc">
                  {backendOnline
                    ? 'Portfolio is actively synchronized with the live Node.js/MongoDB cluster.'
                    : 'Backend host is spinning up or offline. All portfolio views are safely rendering verified local fallback content.'}
                </p>
              </div>
            </div>
          </div>

          {/* Endpoint Details */}
          <div className="api-info-section">
            <div className="api-field-group">
              <span className="api-field-label">TARGET API BASE URL</span>
              <div className="api-url-box">
                <code>{API_BASE}</code>
                <a
                  href={`${API_BASE}/api/health`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="api-url-external"
                  title="Test in new tab"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Diagnostics Stats */}
            <div className="diagnostics-grid">
              <div className="diag-stat-card">
                <span className="diag-label">PROJECTS LOADED</span>
                <span className="diag-value">{projects.length} Items</span>
              </div>
              <div className="diag-stat-card">
                <span className="diag-label">SKILLS COUNT</span>
                <span className="diag-value">
                  {Array.isArray(content?.skills) ? content.skills.length : 0} Items
                </span>
              </div>
              <div className="diag-stat-card">
                <span className="diag-label">HEALTH ENDPOINT</span>
                <span className="diag-value">/api/health</span>
              </div>
            </div>

            {/* Ping Result if available */}
            {lastPingResult && (
              <div className={`ping-result-box ${lastPingResult.online ? 'success' : 'warning'}`}>
                {lastPingResult.online ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span>
                  Ping at {lastPingResult.time}: {lastPingResult.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePing}
            disabled={isPinging}
          >
            <Activity size={16} className={isPinging ? 'spin-icon' : ''} />
            <span>{isPinging ? 'Pinging Host...' : 'Ping Backend Host'}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw size={16} className={isSyncing ? 'spin-icon' : ''} />
            <span>{isSyncing ? 'Synchronizing...' : 'Sync Data Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
