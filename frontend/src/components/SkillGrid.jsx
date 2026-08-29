import React, { useState } from 'react';
import { CATEGORIES } from '../utils/defaultSkills';
import { IconGithub, IconExternalLink, IconSearch, IconPlus, IconCheck } from './Icons';

export default function SkillGrid({ skills, onToggleSkill, onAddCustomSkill, onConfirmSkills }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [customInput, setCustomInput] = useState('');
  const [isSearchingCustom, setIsSearchingCustom] = useState(false);

  const filteredSkills = skills.filter(skill => {
    if (activeCategory === 'All') return true;
    return skill.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!customInput.trim() || isSearchingCustom) return;

    setIsSearchingCustom(true);
    try {
      await onAddCustomSkill(customInput);
      setCustomInput('');
    } finally {
      setIsSearchingCustom(false);
    }
  };

  const selectedCount = skills.filter(s => s.selected !== false).length;

  return (
    <div className="interactive-panel">
      <div className="skill-matrix-card">
        <div className="matrix-header">
          <div className="matrix-header-text">
            <h3>Agent Skill Matrix & Capabilities</h3>
            <p>Curate engineering toolchain ({selectedCount} of {skills.length} skills active)</p>
          </div>

          <div className="category-tabs-group" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`cat-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                role="tab"
                aria-selected={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="matrix-grid">
          {filteredSkills.map((skill) => {
            const isSelected = skill.selected !== false;
            const badgeClass = skill.category.replace(/[\/\s]/g, '-');

            return (
              <div
                key={skill.id}
                className={`skill-item-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onToggleSkill(skill.id)}
              >
                <div>
                  <div className="skill-card-top">
                    <span className="skill-title">{skill.name}</span>
                    <span className={`category-tag ${badgeClass}`}>
                      {skill.category}
                    </span>
                  </div>

                  <p className="skill-desc" style={{ marginTop: '8px' }}>
                    {skill.description}
                  </p>

                  {skill.advantages && skill.advantages.length > 0 && (
                    <ul className="feature-bullets">
                      {skill.advantages.slice(0, 3).map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="skill-card-footer">
                  <a
                    href={skill.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-github"
                    onClick={(e) => e.stopPropagation()}
                    title="View GitHub Repository"
                  >
                    <IconGithub size={13} />
                    <span>Repository</span>
                    <IconExternalLink size={10} style={{ opacity: 0.6 }} />
                  </a>

                  <label
                    className="switch-control"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSkill(skill.id)}
                      style={{ cursor: 'pointer', accentColor: 'var(--brand-primary)' }}
                    />
                    <span style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {isSelected ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Skill Input */}
        <form className="custom-skill-bar" onSubmit={handleAddSkill}>
          <input
            type="text"
            className="input-text-clean"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add custom capability (e.g. pgvector, LangGraph, OpenAPI generator)..."
            disabled={isSearchingCustom}
            aria-label="Add custom skill"
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={isSearchingCustom || !customInput.trim()}
          >
            {isSearchingCustom ? (
              <>
                <IconSearch size={14} className="animate-spin" />
                <span>Searching Trends...</span>
              </>
            ) : (
              <>
                <IconPlus size={14} />
                <span>Add Skill</span>
              </>
            )}
          </button>
        </form>

        <button
          type="button"
          className="btn-confirm-bar"
          onClick={onConfirmSkills}
        >
          <IconCheck size={16} />
          <span>Approve {selectedCount} Skills & Generate Artifacts</span>
        </button>
      </div>
    </div>
  );
}
