import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import SpotlightCard from './SpotlightCard';

export default function StatCard({
  index = 0,
  icon,
  iconVariant = 'green',
  label,
  value,
  note,
  pct = 0,
  hero = false,
  onNavigate,
}) {
  const isNumeric = typeof value === 'number';
  const isReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [displayValue, setDisplayValue] = useState(isNumeric && !isReduced ? 0 : value);

  useEffect(() => {
    if (!isNumeric) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let start = null;
    const duration = 900;
    const initial = 0;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(initial + (value - initial) * ease));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [value, isNumeric]);

  // Support both new layout with icon container and legacy layout
  const hasIcon = Boolean(icon);

  return (
    <SpotlightCard
      className={`card stat-v2 stat rise ${hero ? 'hero' : ''}`}
      style={{ '--i': index }}
      onClick={onNavigate}
      role={onNavigate ? 'button' : undefined}
      tabIndex={onNavigate ? 0 : undefined}
    >
      <div className="stat-v2-top ct" style={{ margin: 0 }}>
        {hasIcon ? (
          <div className={`stat-icon-box ${iconVariant}`}>
            <Icon name={icon} />
          </div>
        ) : (
          <span className="lab">{label}</span>
        )}

        {onNavigate && (
          <button
            className="stat-v2-go go"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
            aria-label={`Open ${label}`}
          >
            <Icon name="arrow" />
          </button>
        )}
      </div>

      <div className="stat-v2-body">
        {hasIcon && <div className="stat-v2-label">{label}</div>}
        <div className="stat-v2-val big">
          <span>{isNumeric ? displayValue : value}</span>
        </div>
        {note && <div className="stat-v2-note note">{note}</div>}
      </div>

      {pct > 0 && (
        <div className="stat-v2-bar mini">
          <i style={{ width: `${pct}%` }} />
        </div>
      )}
    </SpotlightCard>
  );
}
