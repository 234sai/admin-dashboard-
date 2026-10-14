import React, { useState, useEffect } from 'react';

export default function GaugeChart({ percent = 42, label = 'of Alpha tasks' }) {
  const L = 251.3;
  const targetOffset = L * (1 - percent / 100);
  const [offset, setOffset] = useState(L);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setOffset(targetOffset);
      setCount(percent);
      return;
    }

    const timer = setTimeout(() => {
      setOffset(targetOffset);
    }, 150);

    let start = null;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(percent * ease));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    const anim = requestAnimationFrame(step);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(anim);
    };
  }, [percent, targetOffset]);

  return (
    <div className="gauge">
      <svg viewBox="0 0 200 112" aria-hidden="true">
        <path
          d="M20 100A80 80 0 01180 100"
          fill="none"
          stroke="var(--card2)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          className="gp"
          d="M20 100A80 80 0 01180 100"
          fill="none"
          stroke="var(--a2)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1) .35s' }}
        />
      </svg>
      <div className="gv">
        <b>
          <span>{count}%</span>
        </b>
        <span>{label}</span>
      </div>
    </div>
  );
}
