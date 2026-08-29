import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import DesignRefUploader from './DesignRefUploader';
import SkillGrid from './SkillGrid';
import DownloadSection from './DownloadSection';
import { IconBot } from './Icons';

export default function ChatBox({
  messages,
  isTyping,
  currentStep,
  skills,
  onToggleSkill,
  onAddCustomSkill,
  onConfirmSkills,
  onConfirmDesign,
  projectData
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, currentStep, skills]);

  return (
    <div className="chat-history-scroll">
      {messages.map((msg, index) => (
        <MessageItem key={index} message={msg} />
      ))}

      {isTyping && (
        <div className="message-row ai">
          <div className="msg-avatar ai">
            <IconBot size={16} />
          </div>
          <div className="msg-body">
            <div className="msg-author">InitAI Architect</div>
            <div className="typing-pill">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        </div>
      )}

      {/* Embedded interactive Design Reference & Image Uploader when in Step 2 */}
      {currentStep === 2 && (
        <DesignRefUploader
          onConfirmDesign={onConfirmDesign}
          initialText={projectData.designGuidelines}
        />
      )}

      {/* Embedded interactive SkillGrid when reaching Step 3 */}
      {currentStep === 3 && (
        <SkillGrid
          skills={skills}
          onToggleSkill={onToggleSkill}
          onAddCustomSkill={onAddCustomSkill}
          onConfirmSkills={onConfirmSkills}
        />
      )}

      {/* Embedded Download Section when reaching Step 4 */}
      {currentStep === 4 && (
        <DownloadSection
          projectData={projectData}
          skills={skills}
        />
      )}

      <div ref={bottomRef} style={{ height: '1px' }} />
    </div>
  );
}
