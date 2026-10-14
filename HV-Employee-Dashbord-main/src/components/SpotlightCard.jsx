import React, { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Aceternity UI Card Spotlight / Canvas Reveal Particle Effect
 * 
 * Features:
 * - Independent mouse tracking relative to each card
 * - High-performance 2D Canvas reveal particle matrix around pointer
 * - Radial spotlight gradient and dynamic edge border illumination
 * - Runs animation frame ONLY while hovered (0% idle CPU)
 * - Safe for prefers-reduced-motion and touch devices
 * - Preserves existing card semantics, accessibility, and click targets
 * - Leaves flex/grid document flow completely intact
 */
export default function SpotlightCard({
  as: Component = 'div',
  className = '',
  style = {},
  children,
  spotlightColor = 'rgba(16, 185, 129, 0.14)',
  particleColors = ['#10b981', '#34d399', '#6ee7b7'],
  spotlightRadius = 260,
  borderSpotlight = true,
  disabled = false,
  ...restProps
}) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const mousePosRef = useRef({ x: -999, y: -999 });
  const isHoveredRef = useRef(false);

  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: -999, y: -999 });

  // Check if reduced motion
  const isReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Particle matrix rendering loop (active only during hover)
  const renderParticles = useCallback(function loop(timestamp) {
    const canvas = canvasRef.current;
    if (!canvas || !isHoveredRef.current || isReducedMotion || disabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    ctx.clearRect(0, 0, width, height);

    const mouseX = mousePosRef.current.x * dpr;
    const mouseY = mousePosRef.current.y * dpr;
    const R = spotlightRadius * dpr;
    const gap = 13 * dpr;

    // 1. Draw radial ambient spotlight glow
    if (mouseX >= 0 && mouseY >= 0) {
      const ambientGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, R);
      ambientGlow.addColorStop(0, spotlightColor);
      ambientGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
      ambientGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Draw revealed particle matrix
    if (mouseX >= 0 && mouseY >= 0) {
      const startX = Math.max(0, Math.floor((mouseX - R) / gap) * gap);
      const endX = Math.min(width, Math.ceil((mouseX + R) / gap) * gap);
      const startY = Math.max(0, Math.floor((mouseY - R) / gap) * gap);
      const endY = Math.min(height, Math.ceil((mouseY + R) / gap) * gap);

      const colorCount = particleColors.length;

      for (let px = startX; px <= endX; px += gap) {
        for (let py = startY; py <= endY; py += gap) {
          const dx = px - mouseX;
          const dy = py - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < R) {
            const falloff = 1 - dist / R;
            const intensity = Math.pow(falloff, 1.8);
            // Dynamic subtle twinkle oscillation
            const twinkle = Math.sin(timestamp * 0.0035 + (px * 0.05 + py * 0.05)) * 0.35 + 0.65;
            const alpha = Math.min(1, Math.max(0, intensity * twinkle * 0.88));

            if (alpha > 0.02) {
              const colorIdx = Math.abs(Math.floor((px / gap + py / gap))) % colorCount;
              const hex = particleColors[colorIdx];

              ctx.fillStyle = hex;
              ctx.globalAlpha = alpha;

              // Draw neat micro-dot
              const dotSize = 1.8 * dpr;
              ctx.beginPath();
              ctx.arc(px, py, dotSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    animFrameRef.current = requestAnimationFrame(loop);
  }, [disabled, isReducedMotion, particleColors, spotlightColor, spotlightRadius]);

  // Adjust canvas buffer size to match card dimensions
  const updateCanvasDimensions = useCallback(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;

    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    }
  }, []);

  const handleMouseEnter = (e) => {
    if (disabled || isReducedMotion) return;
    isHoveredRef.current = true;
    setIsHovered(true);

    updateCanvasDimensions();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y };
    setCoords({ x, y });

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(renderParticles);
  };

  const handleMouseMove = (e) => {
    if (disabled || isReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y };
    setCoords({ x, y });

    if (!isHoveredRef.current) {
      isHoveredRef.current = true;
      setIsHovered(true);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(renderParticles);
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsHovered(false);
    mousePosRef.current = { x: -999, y: -999 };
    setCoords({ x: -999, y: -999 });

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Fade canvas out cleanly
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Compute CSS custom properties for border spotlight illumination
  const combinedStyle = {
    ...style,
    '--spotlight-x': `${coords.x}px`,
    '--spotlight-y': `${coords.y}px`,
  };

  return (
    <Component
      ref={cardRef}
      className={`spotlight-card ${isHovered ? 'spotlight-active' : ''} ${className}`}
      style={combinedStyle}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...restProps}
    >
      {/* Background Particle Canvas & Spotlight Layer */}
      {!disabled && !isReducedMotion && (
        <div className="spotlight-layer" aria-hidden="true">
          <canvas ref={canvasRef} className="spotlight-canvas" />
          {borderSpotlight && <div className="spotlight-border-glow" />}
        </div>
      )}

      {children}
    </Component>
  );
}
