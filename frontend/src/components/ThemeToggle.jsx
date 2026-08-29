import React from 'react';
import { IconSun, IconMoon } from './Icons';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      className="btn-ghost"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle theme"
      style={{ padding: '6px 8px' }}
    >
      {isDark ? <IconSun size={15} /> : <IconMoon size={15} />}
      <span style={{ fontSize: '0.74rem' }}>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
