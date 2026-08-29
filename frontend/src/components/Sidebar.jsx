import React from 'react';
import { IconSparkles, IconCheck, IconRefresh } from './Icons';

export default function Sidebar({ currentStep, onReset, projectData }) {
  const steps = [
    { number: 1, title: "PRD Interview", desc: "Core problem & MVP scope" },
    { number: 2, title: "Design Language", desc: "Visual tokens & UI system" },
    { number: 3, title: "Agent Skills", desc: "Curated tools & trend matrix" },
    { number: 4, title: "Export Files", desc: "Download prd, skills & design" }
  ];

  return (
    <aside className="sidebar" aria-label="Project Wizard Navigation">
      <div className="sidebar-header">
        <div className="logo-symbol">
          <IconSparkles size={16} />
        </div>
        <div className="logo-meta">
          <h1>InitAI Studio</h1>
          <p>AI System Architect</p>
        </div>
      </div>

      <div className="sidebar-body">
        <div>
          <div className="section-label">Workflow Progress</div>
          <nav className="stepper-nav">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div
                  key={step.number}
                  className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="step-indicator-wrapper">
                    <div className="step-indicator">
                      {isCompleted ? <IconCheck size={12} /> : step.number}
                    </div>
                  </div>
                  <div className="step-content">
                    <div className="step-title">{step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {projectData && (projectData.coreIdea || projectData.designGuidelines) && (
          <div className="session-summary-box">
            <div className="section-label" style={{ marginBottom: '8px' }}>
              Project Context
            </div>
            {projectData.coreIdea && (
              <div className="summary-item">
                <strong>Problem / Concept</strong>
                <div>{projectData.coreIdea.length > 70 ? `${projectData.coreIdea.slice(0, 70)}...` : projectData.coreIdea}</div>
              </div>
            )}
            {projectData.designGuidelines && (
              <div className="summary-item">
                <strong>Design Paradigm</strong>
                <div>{projectData.designGuidelines.length > 70 ? `${projectData.designGuidelines.slice(0, 70)}...` : projectData.designGuidelines}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <button
          onClick={onReset}
          className="btn-ghost"
          title="Reset Wizard Session"
          aria-label="Reset session"
        >
          <IconRefresh size={13} />
          <span>Reset Session</span>
        </button>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          v1.0.0
        </span>
      </div>
    </aside>
  );
}
