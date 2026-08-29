import React, { useState } from 'react';
import {
  generatePrdMarkdown,
  generateListSkillsMarkdown,
  generateSystemDesignMarkdown,
  downloadMarkdownFile
} from '../utils/markdownParser';
import { IconDownload, IconEye, IconFileText, IconCopy, IconCheck } from './Icons';

export default function DownloadSection({ projectData, skills }) {
  const [previewFile, setPreviewFile] = useState(null);
  const [copiedFileName, setCopiedFileName] = useState(null);

  const prdContent = generatePrdMarkdown(projectData);
  const skillsContent = generateListSkillsMarkdown(projectData, skills);
  const sysDesignContent = generateSystemDesignMarkdown(projectData);

  const files = [
    {
      name: "prd.md",
      title: "Product Requirements Document",
      desc: "Executive summary, target personas, MVP scope, and acceptance criteria.",
      content: prdContent,
      icon: "PRD"
    },
    {
      name: "list_skills.md",
      title: "Approved AI Agent Skills",
      desc: "Verified skill matrix with GitHub repository references and feature highlights.",
      content: skillsContent,
      icon: "SKL"
    },
    {
      name: "systemdesign.md",
      title: "System Architecture Blueprint",
      desc: "Client/Server topology, UI design tokens, state machine, and data flows.",
      content: sysDesignContent,
      icon: "SYS"
    }
  ];

  const handleDownloadAll = () => {
    files.forEach((file, index) => {
      setTimeout(() => {
        downloadMarkdownFile(file.name, file.content);
      }, index * 200);
    });
  };

  const handleCopyContent = (fileName, content) => {
    navigator.clipboard.writeText(content);
    setCopiedFileName(fileName);
    setTimeout(() => setCopiedFileName(null), 2000);
  };

  return (
    <div className="interactive-panel">
      <div className="download-deck-card">
        <div className="download-header">
          <div>
            <h3>Generated Architecture Artifacts</h3>
            <p>Production-grade Markdown deliverables ready for engineering handoff</p>
          </div>
          <span className="status-pill" style={{ background: 'var(--brand-surface)', color: 'var(--brand-primary)', borderColor: 'var(--brand-border)' }}>
            ✓ 3 Files Packaged
          </span>
        </div>

        <div className="artifacts-grid">
          {files.map((file) => (
            <div key={file.name} className="artifact-card">
              <div>
                <div className="artifact-meta">
                  <div className="doc-badge">{file.icon}</div>
                  <div>
                    <div className="doc-name">{file.name}</div>
                    <div className="doc-size">
                      {(file.content.length / 1024).toFixed(1)} KB • Markdown
                    </div>
                  </div>
                </div>

                <p className="doc-desc">{file.desc}</p>
              </div>

              <div className="artifact-btn-group">
                <button
                  type="button"
                  className="btn-download-primary"
                  onClick={() => downloadMarkdownFile(file.name, file.content)}
                  aria-label={`Download ${file.name}`}
                >
                  <IconDownload size={14} />
                  <span>Download {file.name}</span>
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => setPreviewFile(file)}
                  >
                    <IconEye size={13} />
                    <span>Preview</span>
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => handleCopyContent(file.name, file.content)}
                    title="Copy markdown to clipboard"
                  >
                    {copiedFileName === file.name ? <IconCheck size={13} style={{ color: 'var(--accent-emerald)' }} /> : <IconCopy size={13} />}
                    <span>{copiedFileName === file.name ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn-download-bundle"
          onClick={handleDownloadAll}
        >
          <IconDownload size={16} />
          <span>Download Complete Artifact Bundle (.zip / .md)</span>
        </button>
      </div>

      {/* Modal Preview */}
      {previewFile && (
        <div className="modal-overlay" onClick={() => setPreviewFile(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconFileText size={16} style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {previewFile.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ({(previewFile.content.length / 1024).toFixed(1)} KB)
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => handleCopyContent(previewFile.name, previewFile.content)}
                >
                  {copiedFileName === previewFile.name ? <IconCheck size={13} style={{ color: 'var(--accent-emerald)' }} /> : <IconCopy size={13} />}
                  <span>{copiedFileName === previewFile.name ? 'Copied' : 'Copy Code'}</span>
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setPreviewFile(null)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>
            <pre className="modal-viewer">
              <code>{previewFile.content}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
