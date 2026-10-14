import React from 'react';

const COLORS = {
  forest: '#1f7a50',
  emerald: '#10b981',
  blue: '#3b6fe0',
  violet: '#6d54d6',
  amber: '#c57a14',
};

const THEMES = ['light', 'dark', 'system'];

export default function AppearancePopover({
  accent,
  theme,
  onAccentChange,
  onThemeChange,
  onClose,
}) {
  return (
    <div className="pop" role="dialog" aria-label="Appearance">
      <h2>One accent re-tints everything</h2>
      <div className="sw">
        {Object.entries(COLORS).map(([name, hex]) => (
          <button
            key={name}
            className={accent === name ? 'on' : ''}
            style={{ background: hex }}
            onClick={() => onAccentChange(name)}
            aria-label={name}
          />
        ))}
      </div>
      <div
        className="seg"
        style={{
          boxShadow: 'inset 0 0 0 1.5px var(--line)',
          background: 'var(--card2)',
        }}
      >
        {THEMES.map((t) => (
          <button
            key={t}
            className={theme === t ? 'on' : ''}
            style={{ textTransform: 'capitalize' }}
            onClick={() => onThemeChange(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
