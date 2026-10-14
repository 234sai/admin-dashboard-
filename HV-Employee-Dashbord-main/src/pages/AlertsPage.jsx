import React from 'react';
import Icon from '../components/Icon';
import SpotlightCard from '../components/SpotlightCard';

export default function AlertsPage({
  alerts,
  onMarkRead,
  onMarkAllRead,
}) {
  return (
    <>
      <div className="head rise">
        <div>
          <h1>Alerts</h1>
          <p className="sub">Red is critical, blue is project, green is company-wide.</p>
        </div>
        <div className="acts">
          <button className="btn out" onClick={onMarkAllRead}>
            <Icon name="check" />
            Mark all read
          </button>
        </div>
      </div>

      <div className="list" style={{ gap: 12 }}>
        {alerts.map((a, i) => (
          <SpotlightCard
            key={a.id}
            className={`al t-${a.tier} ${a.read ? 'read' : 'unread'} rise`}
            style={{ '--i': i }}
          >
            <span className="tier" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <b>{a.title}</b>
              <p className="sub">{a.body}</p>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 8,
              }}
            >
              <small className="mono" style={{ color: 'var(--ink3)' }}>
                {a.time}
              </small>
              {a.read ? (
                <span className="pill mute">
                  {a.ack ? 'Acknowledged' : 'Read'}
                </span>
              ) : (
                <button
                  className="btn pri sm"
                  onClick={() => onMarkRead(a.id, a.ack)}
                >
                  {a.ack ? 'Acknowledge' : 'Mark read'}
                </button>
              )}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </>
  );
}
