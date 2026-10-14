import React, { useState, useEffect, useRef } from 'react';
import { pad } from '../utils/time';

/**
 * 3D Flip Digit Card Component
 *
 * Implements a split-flap 3D card display.
 * Upper and lower halves are split across the center hinge.
 * Rotating leaves animate down when the digit changes.
 */
export function FlipDigit({ digit }) {
  const [displayDigits, setDisplayDigits] = useState({ curr: digit, prev: digit });
  const [isFlipping, setIsFlipping] = useState(false);
  const prevDigitRef = useRef(digit);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (prevDigitRef.current !== digit) {
      const old = prevDigitRef.current;
      prevDigitRef.current = digit;
      setDisplayDigits({ curr: digit, prev: old });
      setIsFlipping(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsFlipping(false);
      }, 500);
    }
  }, [digit]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={`flip-digit-card ${isFlipping ? 'flipping' : ''}`}>
      {/* 1. Static Top Half (shows the target current digit) */}
      <div className="flip-card-half flip-card-top">
        <span className="flip-num">{displayDigits.curr}</span>
      </div>

      {/* 2. Static Bottom Half (shows previous digit during flip, current when resting) */}
      <div className="flip-card-half flip-card-bottom">
        <span className="flip-num">{isFlipping ? displayDigits.prev : displayDigits.curr}</span>
      </div>

      {/* 3. Flipping Leaves (active strictly during flip) */}
      {isFlipping && (
        <>
          <div className="flip-card-half flip-card-top flip-leaf-top">
            <span className="flip-num">{displayDigits.prev}</span>
          </div>
          <div className="flip-card-half flip-card-bottom flip-leaf-bottom">
            <span className="flip-num">{displayDigits.curr}</span>
          </div>
        </>
      )}

      {/* Mechanical center crease divider and side hinge notches */}
      <div className="flip-card-divider" aria-hidden="true" />
      <div className="flip-card-notch notch-left" aria-hidden="true" />
      <div className="flip-card-notch notch-right" aria-hidden="true" />
    </div>
  );
}

/**
 * 3D Flip Countdown Component
 * Formats time as HH:MM:SS with separate 3D flip digits and rhythmic colon separators.
 */
export default function FlipCountdown({
  timeLeft = 0,
  isClosed = false,
  className = '',
}) {
  const safeTime = isClosed ? 0 : Math.max(0, timeLeft);
  const totalSeconds = Math.floor(safeTime / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  const hStr = hours < 100 ? pad(hours) : String(hours);
  const mStr = pad(minutes);
  const sStr = pad(seconds);

  return (
    <div
      className={`flip-countdown-container ${className}`}
      role="timer"
      aria-label={`${hStr} hours, ${mStr} minutes, ${sStr} seconds remaining`}
    >
      {/* Hours Group */}
      <div className="flip-unit-group">
        <div className="flip-digits-pair">
          {[...hStr].map((d, i) => (
            <FlipDigit key={`h-${i}`} digit={d} />
          ))}
        </div>
        <span className="flip-unit-label">HOURS</span>
      </div>

      {/* Separator 1 */}
      <div className="flip-colon-separator" aria-hidden="true">
        <span className="flip-colon-dot" />
        <span className="flip-colon-dot" />
      </div>

      {/* Minutes Group */}
      <div className="flip-unit-group">
        <div className="flip-digits-pair">
          <FlipDigit digit={mStr[0]} />
          <FlipDigit digit={mStr[1]} />
        </div>
        <span className="flip-unit-label">MINUTES</span>
      </div>

      {/* Separator 2 */}
      <div className="flip-colon-separator" aria-hidden="true">
        <span className="flip-colon-dot" />
        <span className="flip-colon-dot" />
      </div>

      {/* Seconds Group */}
      <div className="flip-unit-group">
        <div className="flip-digits-pair">
          <FlipDigit digit={sStr[0]} />
          <FlipDigit digit={sStr[1]} />
        </div>
        <span className="flip-unit-label">SECONDS</span>
      </div>
    </div>
  );
}
