import React from 'react';

export default function Sidebar({ currentStep, onReset, projectData }) {
  const steps = [
    { number: 1, title: "PRD Interview", desc: "Tanya-jawab ide & MVP requirements" },
    { number: 2, title: "Design References", desc: "Panduan gaya visual & UI Tokens" },
    { number: 3, title: "Skill Matrix", desc: "Kurasi perkakas & rekomendasi tren" },
    { number: 4, title: "Download Files", desc: "Ekspor 3 artefak markdown" }
  ];

  return (
    <aside className="sidebar" aria-label="Project Wizard Navigation">
      <div className="sidebar-header">
        <div className="logo-badge">⚡</div>
        <div>
          <h1 className="logo-title">InitAI Studio</h1>
          <div className="logo-subtitle">AI Agent Initializer</div>
        </div>
      </div>

      <div className="sidebar-body">
        <div>
          <div className="steps-tracker-title">Tahapan Wizard</div>
          <nav>
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div
                  key={step.number}
                  className={`step-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="step-number-badge">
                    {isCompleted ? '✓' : step.number}
                  </div>
                  <div>
                    <div className="step-info-title">{step.title}</div>
                    <div className="step-info-desc">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {projectData && (projectData.coreIdea || projectData.designGuidelines) && (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            fontSize: '0.78rem'
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              📌 Rangkuman Sesi:
            </div>
            {projectData.coreIdea && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <strong>Ide:</strong> {projectData.coreIdea.slice(0, 45)}...
              </p>
            )}
            {projectData.designGuidelines && (
              <p style={{ color: 'var(--text-secondary)' }}>
                <strong>Desain:</strong> {projectData.designGuidelines.slice(0, 45)}...
              </p>
            )}
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <button
          onClick={onReset}
          className="btn-reset"
          title="Reset Sesi Percakapan"
          aria-label="Reset wizard session"
        >
          🔄 Reset Wizard
        </button>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          v1.0.0
        </span>
      </div>
    </aside>
  );
}
