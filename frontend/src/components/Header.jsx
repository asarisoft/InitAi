import React from 'react';
import ThemeToggle from './ThemeToggle';
import { IconGithub, IconExternalLink } from './Icons';

export default function Header({ currentStep, theme, onToggleTheme, isBackendOnline }) {
  const getStepTitle = (step) => {
    switch (step) {
      case 1: return "PRD Architecture & Scope Interview";
      case 2: return "Visual Design & UI Specification";
      case 3: return "AI Agent Skillset Matrix";
      case 4: return "Packaging & Export Artifacts";
      default: return "AI Agent Workspace";
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="status-pill">
          <span className="status-dot"></span>
          <span>{isBackendOnline ? 'API Connected' : 'Studio Engine Ready'}</span>
        </div>
        <span className="breadcrumb-label">
          Step {currentStep}: {getStepTitle(currentStep)}
        </span>
      </div>

      <div className="header-right">
        <a
          href="https://github.com/asarisoft/InitAi"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
          style={{ textDecoration: 'none' }}
        >
          <IconGithub size={15} />
          <span>GitHub</span>
          <IconExternalLink size={12} style={{ opacity: 0.6 }} />
        </a>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
