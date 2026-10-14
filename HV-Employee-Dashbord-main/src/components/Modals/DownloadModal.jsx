import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import SpotlightCard from '../SpotlightCard';
import { now, rid } from '../../utils/time';

export default function DownloadModal({ fileName, onClose, onToast }) {
  const [expiresAt, setExpiresAt] = useState(() => now() + 300000);
  const [url, setUrl] = useState(() => {
    const exp = Math.floor((now() + 300000) / 1000);
    return `https://files.hvvertex.example/s/${rid(14)}?exp=${exp}&sig=${rid(20)}`;
  });
  const [remainingSec, setRemainingSec] = useState(300);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const rem = Math.max(0, expiresAt - now());
      const sec = Math.ceil(rem / 1000);
      setRemainingSec(sec);
      if (rem <= 0) {
        setIsExpired(true);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleSimulateExpiry = () => {
    setExpiresAt(now() - 1000);
    setRemainingSec(0);
    setIsExpired(true);
  };

  const handleNewLink = () => {
    const newExp = now() + 300000;
    setExpiresAt(newExp);
    setUrl(`https://files.hvvertex.example/s/${rid(14)}?exp=${Math.floor(newExp / 1000)}&sig=${rid(20)}`);
    setRemainingSec(300);
    setIsExpired(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      onToast('Link copied');
    } catch (e) {
      onToast('Link copied');
    }
  };

  const circumference = 163.4;
  const strokeDashoffset = (circumference * (1 - remainingSec / 300)).toFixed(1);

  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <SpotlightCard className="modal" role="dialog" aria-modal="true">
        <h3>Download ready</h3>
        <p className="sub">{fileName}</p>

        <div style={{ marginTop: 8 }}>
          {isExpired ? (
            <div className="banner bad">
              <Icon name="alert" />
              <div>
                <b>410 Gone</b>
                <div style={{ fontWeight: 500 }}>
                  This link expired after 300 seconds. Request a new one.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div className="ring">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="var(--card2)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="var(--a2)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.5s linear' }}
                  />
                </svg>
                <b>{remainingSec}s</b>
              </div>
              <div className="link">{url}</div>
            </div>
          )}
        </div>

        <div className="mfoot">
          {isExpired ? (
            <>
              <button className="btn out" type="button" onClick={onClose}>
                Close
              </button>
              <button className="btn pri" type="button" onClick={handleNewLink}>
                Get a new link
              </button>
            </>
          ) : (
            <>
              <button
                className="btn ghost"
                type="button"
                onClick={handleSimulateExpiry}
              >
                Simulate expiry
              </button>
              <button
                className="btn out"
                type="button"
                onClick={handleCopyLink}
              >
                Copy link
              </button>
              <button className="btn pri" type="button" onClick={onClose}>
                Done
              </button>
            </>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
}
