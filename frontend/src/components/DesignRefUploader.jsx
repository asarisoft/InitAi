import React, { useState, useRef } from 'react';
import { IconUploadCloud, IconImage, IconTrash, IconCheck, IconEye, IconSparkles } from './Icons';

export default function DesignRefUploader({ onConfirmDesign, initialText = '' }) {
  const [designText, setDesignText] = useState(initialText || 'Modern Dark SaaS Web Studio (Pacdora & Figma inspired, glassmorphism, 60fps micro-interactions)');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewModalImg, setPreviewModalImg] = useState(null);
  const fileInputRef = useRef(null);

  const stylePresets = [
    "Pacdora & Figma 3D Web Studio (Obsidian Canvas + Electric Indigo)",
    "Linear Minimalist (Subtle 1px Borders, JetBrains Mono, Zinc 900)",
    "Raycast / Arc Clean SaaS (Glassmorphism, High Contrast, WCAG AA)",
    "Cyberpunk / Neon Glow (Deep Obsidian + Electric Cyan & Magenta)"
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImages(prev => [
          ...prev,
          {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            size: (file.size / 1024).toFixed(1),
            dataUrl: event.target.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (id, e) => {
    e.stopPropagation();
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!designText.trim() && uploadedImages.length === 0) return;

    let finalPrompt = designText.trim();
    if (uploadedImages.length > 0) {
      const imgNames = uploadedImages.map(img => img.name).join(', ');
      finalPrompt += ` [Disertai ${uploadedImages.length} file referensi gambar: ${imgNames}]`;
    }

    onConfirmDesign({
      text: finalPrompt,
      images: uploadedImages
    });
  };

  return (
    <div className="interactive-panel">
      <div className="skill-matrix-card" style={{ borderColor: 'var(--border-accent)' }}>
        <div className="matrix-header">
          <div className="matrix-header-text">
            <h3>🎨 Visual Design & UI/UX System Specification</h3>
            <p>Upload screenshot referensi UI / mockups dan tentukan panduan estetika visual sistem</p>
          </div>
          <span className="status-pill" style={{ background: 'var(--brand-surface)', color: 'var(--brand-primary)', borderColor: 'var(--brand-border)' }}>
            Tahap 2: System Design
          </span>
        </div>

        {/* Upload Dropzone */}
        <div
          style={{
            marginTop: '16px',
            border: '2px dashed var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-sidebar)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) {
              handleFileChange({ target: { files: e.dataTransfer.files } });
            }
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            style={{ display: 'none' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--brand-surface)',
              border: '1px solid var(--brand-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)'
            }}>
              <IconUploadCloud size={20} />
            </div>
            <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Klik atau Seret Gambar Referensi / Mockup UI ke Sini
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Mendukung PNG, JPG, WebP, SVG (Screenshot Figma, Moodboard, Dieline, Palette)
            </div>
          </div>
        </div>

        {/* Uploaded Image Thumbnails Grid */}
        {uploadedImages.length > 0 && (
          <div style={{
            marginTop: '14px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '10px'
          }}>
            {uploadedImages.map((img) => (
              <div
                key={img.id}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => setPreviewModalImg(img)}
              >
                <div style={{
                  height: '80px',
                  width: '100%',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  backgroundColor: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={img.dataUrl}
                    alt={img.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '4px'
                }}>
                  <span style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }} title={img.name}>
                    {img.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveImage(img.id, e)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Hapus gambar"
                  >
                    <IconTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Style Presets Pills */}
        <div style={{ marginTop: '16px' }}>
          <div className="section-label" style={{ marginBottom: '8px' }}>
            Preset Gaya Arsitektur UI Populer:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {stylePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="prompt-pill"
                onClick={() => setDesignText(preset)}
                style={{ fontSize: '0.72rem' }}
              >
                <IconSparkles size={11} style={{ color: 'var(--brand-primary)' }} />
                <span>{preset}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input / URL Reference */}
        <div style={{ marginTop: '14px' }}>
          <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            URL Referensi & Deskripsi Desain UI:
          </label>
          <textarea
            className="input-text-clean"
            style={{ width: '100%', minHeight: '60px', resize: 'vertical' }}
            value={designText}
            onChange={(e) => setDesignText(e.target.value)}
            placeholder="Contoh: pacdora.com, figma.com/community/... atau deskripsi gaya: Dark mode elegan, glassmorphism, accent purple glow..."
          />
        </div>

        <button
          type="button"
          className="btn-confirm-bar"
          onClick={handleSubmit}
          disabled={!designText.trim() && uploadedImages.length === 0}
        >
          <IconCheck size={16} />
          <span>Analisis Desain UI & Lanjut ke Tahap 3 (Skill Matrix)</span>
        </button>
      </div>

      {/* Modal Zoom Image Preview */}
      {previewModalImg && (
        <div className="modal-overlay" onClick={() => setPreviewModalImg(null)}>
          <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconImage size={16} style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{previewModalImg.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({previewModalImg.size} KB)</span>
              </div>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setPreviewModalImg(null)}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#000000', display: 'flex', justifyContent: 'center' }}>
              <img
                src={previewModalImg.dataUrl}
                alt={previewModalImg.name}
                style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
