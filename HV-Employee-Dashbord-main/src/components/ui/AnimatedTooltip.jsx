import React, { useState } from 'react';

/**
 * Aceternity UI AnimatedTooltip Component (adapted to pure React 19 JSX & Vanilla CSS)
 * Features:
 * - Spring-interpolated tilt and horizontal shift on mouse move
 * - Staggered overlapping circular avatar layout
 * - Dark emerald / neon accent glow lines matching Aceternity UI
 * - Image fallback to initials for offline reliability
 * - Keyboard navigation (Tab, Focus, Enter, Space) and screen reader accessibility
 */
export function AnimatedTooltip({ items = [], onItemClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [springOffset, setSpringOffset] = useState({ x: 0, rotate: 0 });
  const [imgErrors, setImgErrors] = useState({});

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const offsetX = event.clientX - rect.left - halfWidth;
    const clampedX = Math.max(-halfWidth, Math.min(halfWidth, offsetX));
    // Calculate tilt rotation (-22deg to +22deg) and translation (-18px to +18px)
    const rot = (clampedX / halfWidth) * 22;
    const transX = (clampedX / halfWidth) * 16;
    setSpringOffset({ x: transX, rotate: rot });
  };

  const handleMouseEnter = (id) => {
    setHoveredIndex(id);
    setSpringOffset({ x: 0, rotate: 0 });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setSpringOffset({ x: 0, rotate: 0 });
  };

  const handleFocus = (id) => {
    setHoveredIndex(id);
    setSpringOffset({ x: 0, rotate: 0 });
  };

  const handleBlur = () => {
    setHoveredIndex(null);
    setSpringOffset({ x: 0, rotate: 0 });
  };

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const getInitials = (name) => {
    if (!name) return 'HV';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="animated-tooltip-row" role="list" aria-label="Team member avatars">
      {items.map((item) => {
        const isHovered = hoveredIndex === item.id;
        const hasImgError = imgErrors[item.id];
        const initials = item.initials || getInitials(item.name);

        return (
          <div
            key={item.id || item.name}
            className={`animated-tooltip-item-wrapper ${isHovered ? 'is-active' : ''}`}
            role="listitem"
          >
            {/* Animated Tooltip Popup */}
            {isHovered && (
              <div
                className="animated-tooltip-popup"
                role="tooltip"
                id={`tooltip-member-${item.id}`}
                style={{
                  transform: `translateX(calc(-50% + ${springOffset.x}px)) rotate(${springOffset.rotate}deg)`,
                }}
              >
                {/* Distinctive Aceternity UI bottom gradient glow lines */}
                <div className="tooltip-glow-line emerald" aria-hidden="true" />
                <div className="tooltip-glow-line cyan" aria-hidden="true" />

                <div className="tooltip-name">{item.name}</div>
                <div className="tooltip-designation">{item.designation}</div>
              </div>
            )}

            {/* Interactive Circular Avatar Container */}
            <button
              type="button"
              className="animated-tooltip-avatar-btn"
              onClick={() => onItemClick?.(item)}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onFocus={() => handleFocus(item.id)}
              onBlur={handleBlur}
              aria-describedby={isHovered ? `tooltip-member-${item.id}` : undefined}
              aria-label={`${item.name}, ${item.designation}`}
            >
              {!hasImgError && item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="animated-tooltip-avatar-img"
                  onError={() => handleImgError(item.id)}
                  loading="lazy"
                />
              ) : (
                <div className="animated-tooltip-avatar-fallback" aria-hidden="true">
                  <span>{initials}</span>
                </div>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default AnimatedTooltip;
