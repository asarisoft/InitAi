import React, { useState, useRef } from 'react';
import { IconSend, IconSparkles } from './Icons';

export default function ChatInput({ onSendMessage, disabled, currentStep }) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  const getSuggestions = () => {
    switch (currentStep) {
      case 1:
        return [
          "B2B SaaS Web Studio for Automated Software Architectures",
          "Autonomous Code Review & Security Analysis Agent for GitHub",
          "Real-time Collaborative Whiteboard & Design System Studio"
        ];
      case 2:
        return [
          "Modern SaaS dark-mode aesthetic with zinc slate palette and 60fps micro-interactions",
          "Linear-inspired minimal interface with subtle 1px border lines and monospace accents",
          "High-contrast obsidian theme with electric indigo and emerald status tokens"
        ];
      case 3:
        return [
          "Curated toolchain looks solid, proceed to file generation",
          "Add PgVector & LangGraph for multi-agent workflows",
          "Exclude DevOps containerization for now"
        ];
      default:
        return [];
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const suggestions = getSuggestions();

  return (
    <footer className="chat-input-bar">
      <div className="chat-input-inner">
        {suggestions.length > 0 && (
          <div className="suggestions-pills">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                className="prompt-pill"
                onClick={() => {
                  setInputText(sug);
                  if (textareaRef.current) {
                    textareaRef.current.focus();
                  }
                }}
              >
                <IconSparkles size={12} style={{ color: 'var(--brand-primary)' }} />
                <span>{sug}</span>
              </button>
            ))}
          </div>
        )}

        <div className="input-composer">
          <textarea
            ref={textareaRef}
            className="composer-textarea"
            rows={1}
            value={inputText}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              currentStep === 1
                ? "Describe your product vision, target persona, or problem statement..."
                : currentStep === 2
                ? "Provide reference URLs (e.g. figma.com, linear.app) or UI design guidelines..."
                : currentStep === 3
                ? "Provide additional skills or instructions..."
                : "Project initialization completed. Review and download artifacts above."
            }
            disabled={disabled || currentStep >= 4}
            aria-label="Message prompt composer"
          />
          <button
            type="button"
            className="btn-send"
            onClick={handleSend}
            disabled={disabled || !inputText.trim() || currentStep >= 4}
            title="Send Message (Enter)"
            aria-label="Send message"
          >
            <IconSend size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
