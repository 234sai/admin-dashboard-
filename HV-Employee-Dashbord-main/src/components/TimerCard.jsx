import React from 'react';
import Icon from './Icon';
import SpotlightCard from './SpotlightCard';
import FlipCountdown from './FlipCountdown';
import { fmtT } from '../utils/time';

export default function TimerCard({
  index = 6,
  deadline,
  serverTime,
  portalState,
  onGoUploads,
  onFastForward,
}) {
  const timeLeft = Math.max(0, deadline - serverTime);

  // Determine urgency state
  const isClosed = portalState === 'closed' || timeLeft <= 0;
  const isClosingSoon = !isClosed && timeLeft < 2 * 3600 * 1000;

  return (
    <SpotlightCard className={`card timer-card-v2 timer rise ${isClosed ? 'closed' : isClosingSoon ? 'closing-soon' : 'open'}`} style={{ '--i': index }}>
      <div className="timer-header">
        <div className="timer-title-group">
          <span className="timer-kicker">NEXT DEADLINE</span>
          <h2 className="timer-title">Alpha upload window</h2>
        </div>
        <span className={`timer-status-badge ${isClosed ? 'badge-closed' : isClosingSoon ? 'badge-warn' : 'badge-open'}`}>
          {isClosed ? 'CLOSED (423)' : isClosingSoon ? 'CLOSING SOON' : 'OPEN WINDOW'}
        </span>
      </div>

      <div className="timer-display-body">
        <FlipCountdown
          timeLeft={timeLeft}
          isClosed={isClosed}
        />
        <div className="tsub">
          {!isClosed ? (
            <span>
              Closes <b className="mono">{fmtT(deadline)}</b> IST today.
            </span>
          ) : (
            <span>Upload window expired. Contact admin for extension.</span>
          )}
        </div>
      </div>

      <div className="timer-actions-row">
        <button
          type="button"
          className="btn-timer-primary"
          onClick={onGoUploads}
          aria-label="Go to uploads"
          title="Open upload portal"
        >
          <Icon name="upload" />
          <span>Upload files</span>
        </button>

        {onFastForward && (
          <button
            type="button"
            className="btn-timer-secondary"
            onClick={onFastForward}
            aria-label="Jump to deadline"
            title="Fast forward to 6 seconds left"
          >
            <Icon name="stop" />
            <span>Fast forward</span>
          </button>
        )}
      </div>
    </SpotlightCard>
  );
}
