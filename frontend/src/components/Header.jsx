import React from 'react';
import ThemeToggle from './ThemeToggle';
import { IconGithub, IconExternalLink, IconSparkles } from './Icons';

export default function Header({
  currentStep,
  theme,
  onToggleTheme,
  isBackendOnline,
  geminiStatus,
  onOpenGeminiModal
}) {
  const getStepTitle = (step) => {
    switch (step) {
      case 1: return "PRD Architecture & Scope Interview";
      case 2: return "Visual Design & UI Specification";
      case 3: return "AI Agent Skillset Matrix";
      case 4: return "Packaging & Export Artifacts";
      default: return "AI Agent Workspace";
    }
  };

  const getLLMBadge = () => {
    const provider = geminiStatus?.provider || 'local';
    const model = geminiStatus?.model;

    if (geminiStatus?.valid) {
      const providerLabel = provider === 'openai' ? 'OpenAI' : 'Gemini';
      return {
        label: `${providerLabel}: ${model || 'Active'}`,
        color: "var(--accent-emerald)",
        bg: "rgba(16, 185, 129, 0.12)",
        border: "rgba(16, 185, 129, 0.3)"
      };
    } else if (geminiStatus?.status === 'quota_exceeded' || geminiStatus?.status === 'invalid_key') {
      return {
        label: `${provider.toUpperCase()} Token Error`,
        color: "var(--accent-ruby)",
        bg: "rgba(239, 68, 68, 0.12)",
        border: "rgba(239, 68, 68, 0.3)"
      };
    }
    return {
      label: "LLM Key Not Set",
      color: "var(--accent-amber)",
      bg: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.3)"
    };
  };

  const badge = getLLMBadge();

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="status-pill">
          <span className="status-dot"></span>
          <span>{isBackendOnline ? 'Backend Online' : 'Local Engine Ready'}</span>
        </div>

        {/* Clickable Multi-Provider LLM Token Verification Pill */}
        <button
          type="button"
          onClick={onOpenGeminiModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '100px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: badge.bg,
            color: badge.color,
            border: `1px solid ${badge.border}`,
            transition: 'all 0.15s ease'
          }}
          title="Klik untuk memilih & mengonfigurasi LLM (Gemini / OpenAI)"
        >
          <IconSparkles size={12} />
          <span>{badge.label}</span>
          <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>⚙️</span>
        </button>

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
