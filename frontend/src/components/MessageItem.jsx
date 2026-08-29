import React from 'react';

export default function MessageItem({ message }) {
  const isAi = message.role === 'assistant';

  // Helper to format simple markdown elements (headings, bold, lists, code) safely
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

      // Numbered lists
      if (/^\d+\.\s+/.test(line)) {
        const numText = line.replace(/^\d+\.\s+/, '');
        elements.push(
          <p key={idx} style={{ margin: '4px 0 4px 12px' }} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        );
        return;
      }

      // Empty line
      if (line.trim() === '') {
        elements.push(<div key={idx} style={{ height: '6px' }} />);
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
    return text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline Code
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  };

  return (
    <div className={`message-row ${isAi ? 'ai' : 'user'}`}>
      <div className={`avatar ${isAi ? 'ai' : 'user'}`}>
        {isAi ? '⚡' : '👤'}
      </div>
      <div className="bubble">
        {renderFormattedContent(message.content)}
      </div>
    </div>
  );
}
