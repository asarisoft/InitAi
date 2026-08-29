import React, { useState } from 'react';
import { CATEGORIES } from '../utils/defaultSkills';

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
      <div className="skill-grid-container">
        <div className="skill-header-row">
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ⚡ Matriks Rekomendasi Skill Agen AI
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Pilih dan kurasi kapabilitas yang dibutuhkan ({selectedCount} skill aktif)
            </p>
          </div>

          <div className="skill-category-tabs" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                role="tab"
                aria-selected={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="skill-cards-grid">
          {filteredSkills.map((skill) => {
            const isSelected = skill.selected !== false;
            const badgeClass = skill.category.replace(/[\/\s]/g, '-');

            return (
              <div
                key={skill.id}
                className={`skill-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onToggleSkill(skill.id)}
              >
                <div>
                  <div className="skill-card-top">
                    <span className="skill-name">{skill.name}</span>
                    <span className={`skill-badge ${badgeClass}`}>
                      {skill.category}
                    </span>
                  </div>

                  <p className="skill-desc" style={{ marginTop: '8px' }}>
                    {skill.description}
                  </p>

                  {skill.advantages && skill.advantages.length > 0 && (
                    <ul className="skill-advantages">
                      {skill.advantages.slice(0, 3).map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="skill-card-bottom">
                  <a
                    href={skill.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="github-link"
                    onClick={(e) => e.stopPropagation()}
                    title="Buka repositori GitHub terkait"
                  >
                    🔗 GitHub Repo
                  </a>

                  <label
                    className="skill-checkbox-label"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSkill(skill.id)}
                    />
                    <span style={{ color: isSelected ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                      {isSelected ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Skill Addition with AI Simulation */}
        <form className="custom-skill-form" onSubmit={handleAddSkill}>
          <input
            type="text"
            className="custom-skill-input"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Tambah skill custom (contoh: LangGraph Workflow, Vector Search, GraphQL)..."
            disabled={isSearchingCustom}
            aria-label="Nama skill custom"
          />
          <button
            type="submit"
            className="btn-add-skill"
            disabled={isSearchingCustom || !customInput.trim()}
          >
            {isSearchingCustom ? '🔍 Mencari Tren...' : '➕ Tambah Skill'}
          </button>
        </form>

        <button
          type="button"
          className="btn-confirm-skills"
          onClick={onConfirmSkills}
        >
          ✓ Setujui {selectedCount} Skill & Generate File Markdown
        </button>
      </div>
    </div>
  );
}
