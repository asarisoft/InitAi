import React, { useState } from 'react';
import {
  generatePrdMarkdown,
  generateListSkillsMarkdown,
  generateSystemDesignMarkdown,
  downloadMarkdownFile
} from '../utils/markdownParser';

export default function DownloadSection({ projectData, skills }) {
  const [previewFile, setPreviewFile] = useState(null);

  const prdContent = generatePrdMarkdown(projectData);
  const skillsContent = generateListSkillsMarkdown(projectData, skills);
  const sysDesignContent = generateSystemDesignMarkdown(projectData);

  const files = [
    {
      name: "prd.md",
      title: "Product Requirements Document",
      desc: "Spesifikasi MVP, persona user, user stories, dan acceptance criteria.",
      content: prdContent,
      icon: "PRD"
    },
    {
      name: "list_skills.md",
      title: "Approved AI Agent Skills",
      desc: "Daftar skill agen terintegrasi dengan tautan GitHub repo & keunggulan fitur.",
      content: skillsContent,
      icon: "SKL"
    },
    {
      name: "systemdesign.md",
      title: "System Architecture Blueprint",
      desc: "Arsitektur frontend/backend, UI design tokens, dan data flow diagram.",
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

  return (
    <div className="interactive-panel">
      <div className="download-deck-container">
        <div className="download-title-row">
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              📦 Paket Artefak Siap Diunduh
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Seluruh rancangan spesifikasi dan skill siap dipakai untuk inisiasi tim
            </p>
          </div>
          <span className="header-status-badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--brand-primary)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
            ✓ 3 File Markdown Terverifikasi
          </span>
        </div>

        <div className="download-cards-grid">
          {files.map((file) => (
            <div key={file.name} className="download-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div className="file-icon-badge">{file.icon}</div>
                  <div>
                    <div className="file-name">{file.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {(file.content.length / 1024).toFixed(1)} KB • Markdown
                    </div>
                  </div>
                </div>

                <p className="file-desc">{file.desc}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  className="btn-download-action"
                  onClick={() => downloadMarkdownFile(file.name, file.content)}
                  aria-label={`Unduh ${file.name}`}
                >
                  📥 Unduh {file.name}
                </button>
                <button
                  type="button"
                  className="btn-reset"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.74rem' }}
                  onClick={() => setPreviewFile(file)}
                >
                  👁️ Preview Konten
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn-download-all"
          onClick={handleDownloadAll}
        >
          🚀 Unduh Semua File Sekaligus (.md)
        </button>
      </div>

      {/* Modal Preview */}
      {previewFile && (
        <div className="modal-backdrop" onClick={() => setPreviewFile(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="file-icon-badge">{previewFile.icon}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {previewFile.name}
                </span>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setPreviewFile(null)}
                aria-label="Tutup preview"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {previewFile.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
