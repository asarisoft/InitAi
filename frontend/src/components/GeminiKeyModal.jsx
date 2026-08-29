import React, { useState } from 'react';
import { IconSparkles, IconCheck, IconExternalLink } from './Icons';

export default function GeminiKeyModal({ isOpen, onClose, geminiStatus, onVerifyKey }) {
  const [inputKey, setInputKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTest = async (e) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    setTesting(true);
    setTestResult(null);

    const res = await onVerifyKey(inputKey.trim());
    setTestResult(res);
    setTesting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconSparkles size={16} style={{ color: 'var(--brand-primary)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              Konfigurasi & Verifikasi Token Gemini
            </span>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Current Status Card */}
          <div style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: geminiStatus?.valid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${geminiStatus?.valid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: geminiStatus?.valid ? 'var(--accent-emerald)' : 'var(--accent-ruby)',
              marginTop: '5px',
              flexShrink: 0
            }}></span>
            <div>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: geminiStatus?.valid ? 'var(--accent-emerald)' : 'var(--accent-ruby)'
              }}>
                {geminiStatus?.valid ? 'Token Gemini Aktif (Live LLM Connected)' : 'Token Gemini Belum Aktif / Kuota Habis'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                {geminiStatus?.message || "Belum ada API key terhubung."}
              </div>
            </div>
          </div>

          <form onSubmit={handleTest} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Masukkan Google Gemini API Key:
            </label>
            <input
              type="password"
              className="input-text-clean"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
            />

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                type="submit"
                className="btn-download-primary"
                disabled={testing || !inputKey.trim()}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {testing ? 'Menguji Token Quota...' : 'Test & Hubungkan Token Live'}
              </button>
            </div>
          </form>

          {/* Test Result Feedback */}
          {testResult && (
            <div style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.74rem',
              backgroundColor: testResult.valid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: testResult.valid ? 'var(--accent-emerald)' : 'var(--accent-ruby)',
              border: `1px solid ${testResult.valid ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
            }}>
              {testResult.message}
            </div>
          )}

          <div style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            lineHeight: '1.4',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Dapatkan API Key Gratis di Google AI Studio:</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Google AI Studio</span>
              <IconExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
