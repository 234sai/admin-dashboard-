import React from 'react';
import Icon from '../components/Icon';
import StatCard from '../components/StatCard';
import SpotlightCard from '../components/SpotlightCard';
import BarChart from '../components/BarChart';
import { fmtT, hms } from '../utils/time';

export default function AdminOverviewPage({
  deadline,
  serverTime,
  portalState,
  lockoutMode,
  defaulters,
  securityAlertsCount,
  onModeChange,
  onOpenExtensionModal,
  onFastForward,
  onResetDeadline,
  onRemindDefaulter,
  onPenaltyDefaulter,
  onNavigate,
}) {
  const timeLeft = Math.max(0, deadline - serverTime);
  const needActionCount = defaulters.filter((d) => d.st < 2).length;

  return (
    <>
      <div className="head rise">
        <div>
          <h1>Overview</h1>
          <p className="sub">Deadlines, release windows and who needs a nudge.</p>
        </div>
        <div className="acts">
          <button className="btn pri" onClick={onOpenExtensionModal}>
            <Icon name="plus" />
            Extension pass
          </button>
          <button className="btn out" onClick={() => onNavigate('subs')}>
            <Icon name="table" />
            Submissions
          </button>
        </div>
      </div>

      <div className="bento">
        <div className="c3">
          <StatCard
            index={1}
            label="Submitted on time"
            value={42}
            note="of 58 employees"
            pct={72}
            hero={true}
            onNavigate={() => onNavigate('subs')}
          />
        </div>
        <div className="c3">
          <StatCard
            index={2}
            label="Defaulters"
            value={defaulters.length + 12}
            note="Missed upload or download"
            pct={28}
            hero={false}
            onNavigate={() => onNavigate('adash')}
          />
        </div>
        <div className="c3">
          <StatCard
            index={3}
            label="Active sessions"
            value={31}
            note="MFA verified admins: 2"
            pct={53}
            hero={false}
            onNavigate={() => onNavigate('sec')}
          />
        </div>
        <div className="c3">
          <StatCard
            index={4}
            label="Security alerts"
            value={securityAlertsCount}
            note="Last 7 days"
            pct={20}
            hero={false}
            onNavigate={() => onNavigate('sec')}
          />
        </div>

        <SpotlightCard className="card c5 rise" style={{ '--i': 5 }}>
          <div className="ct">
            <h2>Submissions by hour</h2>
            <span className="pill mute">Today</span>
          </div>
          <BarChart
            vals={[2, 4, 3, 6, 9, 12, 16, 8]}
            labels={['10', '11', '12', '13', '14', '15', '16', '17']}
            tips={[
              '10:00 · 2 files',
              '11:00 · 4 files',
              '12:00 · 3 files',
              '13:00 · 6 files',
              '14:00 · 9 files',
              '15:00 · 12 files',
              '16:00 · 16 files',
              '17:00 · 8 files',
            ]}
            hl={[0, 0, 0, 0, 0, 2, 3, 1]}
          />
        </SpotlightCard>

        <SpotlightCard className="card c4 rise" style={{ '--i': 6 }}>
          <div className="ct">
            <h2>Deadline master</h2>
            <span
              className={`pill ${portalState === 'open'
                  ? 'good'
                  : portalState === 'closed'
                    ? 'bad'
                    : 'warn'
                }`}
            >
              {portalState === 'open'
                ? 'Open'
                : portalState === 'closed'
                  ? 'Locked'
                  : 'Late allowed'}
            </span>
          </div>

          <div className="kv">
            <span>Task</span>
            <b>Alpha firmware</b>
          </div>
          <div className="kv">
            <span>Closes</span>
            <b className="mono">{fmtT(deadline)} IST</b>
          </div>
          <div className="kv">
            <span>Time left</span>
            <b className="mono">{hms(timeLeft)}</b>
          </div>

          <div
            className="seg"
            style={{
              margin: '12px 0',
              boxShadow: 'inset 0 0 0 1.5px var(--line)',
              background: 'var(--card2)',
            }}
          >
            <button
              className={lockoutMode === 'hard' ? 'on' : ''}
              onClick={() => onModeChange('hard')}
            >
              Hard lockout
            </button>
            <button
              className={lockoutMode === 'soft' ? 'on' : ''}
              onClick={() => onModeChange('soft')}
            >
              Soft lockout
            </button>
          </div>

          <div className="form-row">
            <button
              className="btn out sm"
              onClick={onOpenExtensionModal}
            >
              <Icon name="plus" />
              Extension pass
            </button>
            <button
              className="btn red sm"
              onClick={onFastForward}
            >
              <Icon name="stop" />
              Jump to deadline
            </button>
            <button
              className="btn ghost sm"
              onClick={onResetDeadline}
            >
              Reset
            </button>
          </div>
        </SpotlightCard>

        <SpotlightCard className="card c3 rise" style={{ '--i': 7 }}>
          <div className="ct">
            <h2>Download gatekeeper</h2>
          </div>
          <div className="kv">
            <span>File</span>
            <b>codebase.zip</b>
          </div>
          <div className="kv">
            <span>Opens</span>
            <b className="mono">20 Oct 10:00</b>
          </div>
          <div className="kv">
            <span>Expires</span>
            <b className="mono">31 Oct 18:00</b>
          </div>
          <div className="kv">
            <span>Access</span>
            <b>Employee, Alpha</b>
          </div>
          <div className="kv">
            <span>Link life</span>
            <b className="mono">300 s</b>
          </div>
        </SpotlightCard>

        <SpotlightCard className="card c12 rise" style={{ '--i': 8 }}>
          <div className="ct">
            <h2>Defaulter tracker</h2>
            <span className="pill bad">{needActionCount} need action</span>
          </div>
          <div className="list">
            {defaulters.map((d, i) => {
              const initials = d.n
                .split(' ')
                .map((w) => w[0])
                .join('');
              return (
                <div className="row" key={i}>
                  <div className="ava">{initials}</div>
                  <div className="grow">
                    <b>{d.n}</b>
                    <small>{d.why}</small>
                  </div>
                  {d.st === 0 && (
                    <button
                      className="btn out sm"
                      onClick={() => onRemindDefaulter(i)}
                    >
                      <Icon name="bell" />
                      Send reminder
                    </button>
                  )}
                  {d.st === 1 && (
                    <>
                      <span className="pill info">Reminded</span>
                      <button
                        className="btn out sm"
                        onClick={() => onPenaltyDefaulter(i)}
                      >
                        Tag penalty
                      </button>
                    </>
                  )}
                  {d.st === 2 && (
                    <span className="pill bad">Penalty tagged</span>
                  )}
                </div>
              );
            })}
          </div>
        </SpotlightCard>
      </div>
    </>
  );
}
