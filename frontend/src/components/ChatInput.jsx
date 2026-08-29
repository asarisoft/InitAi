import React, { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSendMessage, disabled, currentStep }) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  const getSuggestions = () => {
    switch (currentStep) {
      case 1:
        return [
          "Aplikasi SaaS AI Web Agent untuk otomatisasi PRD dan arsitektur sistem",
          "Platform E-Commerce Modern dengan AI Personal Shopper",
          "Aplikasi Manajemen Tugas Tim dengan Real-time Collaboration"
        ];
      case 2:
        return [
          "Modern Dark SaaS Web Studio (seperti Pacdora & Figma, 60fps micro-animations)",
          "Clean Minimalist Light Dashboard (seperti Linear & Notion)",
          "Cyberpunk Neon Theme dengan High Contrast & Glassmorphism"
        ];
      case 3:
        return [
          "Konfirmasi skill ini sudah sesuai, lanjut ke unduh file!",
          "Tambahkan skill integrasi Vector DB & LangChain",
          "Hapus skill DevOps untuk sementara"
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
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        {suggestions.length > 0 && (
          <div className="prompt-suggestions-row">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                className="suggestion-pill"
                onClick={() => {
                  setInputText(sug);
                  if (textareaRef.current) {
                    textareaRef.current.focus();
                  }
                }}
              >
                💡 {sug}
              </button>
            ))}
          </div>
        )}

        <div className="input-box-row">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            rows={1}
            value={inputText}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              currentStep === 1
                ? "Ketikkan ide proyek Anda di sini..."
                : currentStep === 2
                ? "Ketik URL referensi atau panduan gaya desain UI..."
                : currentStep === 3
                ? "Ketik pesan / skill tambahan jika ada..."
                : "Percakapan selesai. Download file di atas."
            }
            disabled={disabled || currentStep >= 4}
            aria-label="Ketik pesan untuk AI Agent"
          />
          <button
            type="button"
            className="btn-send-message"
            onClick={handleSend}
            disabled={disabled || !inputText.trim() || currentStep >= 4}
            title="Kirim Pesan"
            aria-label="Kirim pesan"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
