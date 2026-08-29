import React from 'react';
import { IconBot, IconUser, IconSparkles } from './Icons';

export default function MessageItem({ message, onSelectOption }) {
  const isAi = message.role === 'assistant';

  const renderFormattedContent = (content) => {
    const lines = content.split('\n');
    const elements = [];

    lines.forEach((line, idx) => {
      // Horizontal rule
      if (line.trim() === '---') {
        elements.push(<hr key={idx} />);
        return;
      }

      // Heading 3
      if (line.startsWith('### ')) {
        elements.push(<h3 key={idx}>{line.replace('### ', '')}</h3>);
        return;
      }

      // Heading 2
      if (line.startsWith('## ')) {
        elements.push(<h2 key={idx}>{line.replace('## ', '')}</h2>);
        return;
      }

      // Bullets
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        const bulletText = line.replace(/^[•\-\*]\s+/, '');
        elements.push(
          <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletText) }} />
        );
        return;
      }

      // Numbered list
      if (/^\d+\.\s+/.test(line)) {
        elements.push(
          <p key={idx} style={{ margin: '4px 0 4px 6px' }} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        );
        return;
      }

      // Empty line
      if (line.trim() === '') {
        elements.push(<div key={idx} style={{ height: '8px' }} />);
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
      );
    });

    return elements;
  };

  const formatInlineMarkdown = (text) => {
    // 1. Sanitize raw HTML characters first to prevent XSS (OWASP A03 / Zero-Trust)
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // 2. Safely apply styling tags
    return escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  };

  return (
    <div className={`message-row ${isAi ? 'ai' : 'user'}`}>
      <div className={`msg-avatar ${isAi ? 'ai' : 'user'}`}>
        {isAi ? <IconBot size={16} /> : <IconUser size={16} />}
      </div>
      <div className="msg-body">
        <div className="msg-author">{isAi ? 'InitAI Architect' : 'You'}</div>
        <div className="bubble">
          {renderFormattedContent(message.content)}
        </div>

        {/* Proactive Idea Enrichment Option Cards */}
        {message.suggestedOptions && message.suggestedOptions.length > 0 && (
          <div style={{
            marginTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'slideFadeIn 0.3s ease'
          }}>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <IconSparkles size={12} />
              <span>Opsi Arah Pengembangan (Klik untuk Memilih):</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '8px'
            }}>
              {message.suggestedOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => onSelectOption && onSelectOption(opt.promptPayload || opt.prompt_payload || opt.title)}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand-primary)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {opt.title}
                      </span>
                      {opt.badge && (
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--brand-surface)',
                          color: 'var(--brand-primary)',
                          border: '1px solid var(--brand-border)'
                        }}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {opt.description}
                    </p>
                  </div>

                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '4px'
                  }}>
                    <span>Pilih Konsep Ini</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
