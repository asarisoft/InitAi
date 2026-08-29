import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header({ currentStep, theme, onToggleTheme, isBackendOnline }) {
  const getStepTitle = (step) => {
    switch (step) {
      case 1: return "Tahap 1: PRD Interview";
      case 2: return "Tahap 2: Referensi Desain UI";
      case 3: return "Tahap 3: Kurasi Skill & Tren AI";
      case 4: return "Tahap 4: Unduh Artefak Markdown";
      default: return "AI Agent Workspace";
    }
  };

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="header-status-badge">
          <span className="header-status-dot"></span>
          <span>{isBackendOnline ? 'FastAPI Backend Online' : 'Mock AI Engine Standalone'}</span>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          • {getStepTitle(currentStep)}
        </span>
      </div>

      <div className="header-actions">
        <a
          href="https://github.com/asarisoft/InitAi"
          target="_blank"
          rel="noreferrer"
          className="btn-reset"
          style={{ textDecoration: 'none' }}
        >
          🐙 GitHub Repo
        </a>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
