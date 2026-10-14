import React from 'react';

export default function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.kind || ''} ${t.exiting ? 'out' : ''}`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
