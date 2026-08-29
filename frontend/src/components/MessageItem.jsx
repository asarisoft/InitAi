import React from 'react';
import { IconBot, IconUser } from './Icons';

export default function MessageItem({ message }) {
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
    return text
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
      </div>
    </div>
  );
}
