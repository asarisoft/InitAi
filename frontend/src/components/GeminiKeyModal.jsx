import React, { useState } from 'react';
import { IconSparkles, IconCheck, IconExternalLink } from './Icons';

export default function GeminiKeyModal({ isOpen, onClose, geminiStatus, onVerifyKey }) {
  const [activeTab, setActiveTab] = useState(geminiStatus?.provider === 'openai' ? 'openai' : 'gemini');
  const [inputKey, setInputKey] = useState('');
  const [selectedModel, setSelectedModel] = useState(
    activeTab === 'openai' ? 'gpt-4o-mini' : 'gemini-2.5-flash'
  );
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setInputKey('');
    setTestResult(null);
    setSelectedModel(tab === 'openai' ? 'gpt-4o-mini' : 'gemini-2.5-flash');
  };

  const handleTest = async (e) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    setTesting(true);
    setTestResult(null);

    const res = await onVerifyKey({
      provider: activeTab,
      apiKey: inputKey.trim(),
      model: selectedModel
    });
    setTestResult(res);
    setTesting(false);
  };

  const isCurrentActive = geminiStatus?.valid && (
    (activeTab === 'gemini' && geminiStatus?.provider === 'gemini') ||
    (activeTab === 'openai' && geminiStatus?.provider === 'openai')
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconSparkles size={16} style={{ color: 'var(--brand-primary)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              Konfigurasi Multi-Provider LLM Engine
            </span>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        {/* Provider Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 20px',
          backgroundColor: 'var(--bg-sidebar)',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={() => handleTabSwitch('gemini')}
            style={{
              padding: '12px 14px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'gemini' ? 700 : 500,
              color: activeTab === 'gemini' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'gemini' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>✨ Google Gemini</span>
            {geminiStatus?.valid && geminiStatus?.provider === 'gemini' && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)' }}></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('openai')}
            style={{
              padding: '12px 14px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'openai' ? 700 : 500,
              color: activeTab === 'openai' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'openai' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⚡ OpenAI (GPT-4o)</span>
            {geminiStatus?.valid && geminiStatus?.provider === 'openai' && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)' }}></span>
            )}
          </button>
        </div>

        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Current Status Card */}
          <div style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isCurrentActive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
            border: `1px solid ${isCurrentActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isCurrentActive ? 'var(--accent-emerald)' : 'var(--accent-amber)',
              marginTop: '5px',
              flexShrink: 0
            }}></span>
            <div>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: isCurrentActive ? 'var(--accent-emerald)' : 'var(--accent-amber)'
              }}>
                {isCurrentActive
                  ? `${activeTab.toUpperCase()} Aktif (Model: ${geminiStatus?.model})`
                  : `${activeTab.toUpperCase()} Belum Terhubung`}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                {isCurrentActive ? geminiStatus?.message : `Masukkan API key ${activeTab === 'openai' ? 'OpenAI (sk-...)' : 'Google Gemini (AIzaSy...)'} di bawah.`}
              </div>
            </div>
          </div>

          <form onSubmit={handleTest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Model Selector */}
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Pilih Model LLM:
              </label>
              <select
                className="input-text-clean"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{ width: '100%', fontSize: '0.8rem', padding: '7px 10px', backgroundColor: 'var(--bg-surface)' }}
              >
                {activeTab === 'gemini' ? (
                  <>
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Direkomendasikan - Cepat & Cerdas)</option>
                    <option value="gemini-1.5-flash">gemini-1.5-flash (Latensi Rendah)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro (Penalaran Kompleks)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro (Konteks Panjang)</option>
                  </>
                ) : (
                  <>
                    <option value="gpt-4o-mini">gpt-4o-mini (Direkomendasikan - Hemat & Cepat)</option>
                    <option value="gpt-4o">gpt-4o (Flagship Multimodal)</option>
                    <option value="o3-mini">o3-mini (Reasoning Model)</option>
                    <option value="gpt-3.5-turbo">gpt-3.5-turbo (Legacy)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Masukkan {activeTab === 'openai' ? 'OpenAI API Key (sk-...)' : 'Google Gemini API Key (AIzaSy...)'}:
              </label>
              <input
                type="password"
                className="input-text-clean"
                placeholder={activeTab === 'openai' ? "sk-proj-..." : "AIzaSy..."}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn-download-primary"
              disabled={testing || !inputKey.trim()}
              style={{ justifyContent: 'center', marginTop: '4px', padding: '10px' }}
            >
              {testing ? 'Menguji Token Quota...' : `Test & Hubungkan ${activeTab === 'openai' ? 'OpenAI' : 'Gemini'} Live`}
            </button>
          </form>

          {/* Test Result Feedback */}
          {testResult && (
            <div style={{
              padding: '10px 14px',
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
            <span>Dapatkan API Key:</span>
            {activeTab === 'gemini' ? (
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Google AI Studio (Free)</span>
                <IconExternalLink size={11} />
              </a>
            ) : (
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>OpenAI Platform</span>
                <IconExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
