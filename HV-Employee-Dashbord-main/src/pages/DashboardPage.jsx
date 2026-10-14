import React from 'react';
import Icon from '../components/Icon';
import StatCard from '../components/StatCard';
import TimerCard from '../components/TimerCard';
import SpotlightCard from '../components/SpotlightCard';
import { dhm } from '../utils/time';

export default function DashboardPage({
  uploadCount,
  isReleased,
  deadline,
  releaseAt,
  serverTime,
  portalState,
  onNavigate,
  onFastForward,
}) {
  const teamActivity = [
    { av: 'RK', name: 'Ravi Kumar', text: 'Merged UART fix for motor-ctrl', status: 'Merged', type: 'good', time: '16:02' },
    { av: 'MS', name: 'Meera Shah', text: 'Testing firmware on bench board', status: 'In progress', type: 'warn', time: '16:04' },
    { av: 'PN', name: 'Priya Nair', text: 'Schematic review approved', status: 'Reviewing', type: 'info', time: 'Yesterday' },
  ];

  return (
    <div className="overview-page">
      {/* 1. Personalized Welcome Header */}
      <div className="overview-header">
        <div className="overview-header-left">
          <div className="overview-kicker">
            <span>TUESDAY, SEPTEMBER 22, 2026</span>
            <span className="kicker-dot" />
            <span className="kicker-status">LIVE WORKSPACE</span>
          </div>
          <h1 className="overview-title">Good morning, Maya.</h1>
          <p className="overview-subtitle">
            Senior Systems Engineer · Alpha Team. Here's what needs your attention today.
          </p>
        </div>

        <div className="overview-header-actions">
          <button
            className="btn-vertex-ai"
            onClick={() => onNavigate('ai')}
            title="Ask technical questions to Vertex AI"
          >
            <Icon name="sparkles" />
            <span>Ask Vertex AI</span>
          </button>
          <button
            className="btn-mint-cta"
            onClick={() => onNavigate('uploads')}
            title="Upload deliverables to Alpha portal"
          >
            <Icon name="upload" />
            <span>+ Upload files</span>
          </button>
        </div>
      </div>

      {/* Critical Status Banner (Conditional) */}
      {portalState === 'closed' && (
        <div className="overview-banner error">
          <Icon name="lock" />
          <span>Strict isolation lockout active: Upload deadline passed (HTTP 423). Contact admin for an extension pass.</span>
        </div>
      )}

      {/* 2. Key Summary Metrics Grid (4 Stat Cards) */}
      <div className="stats-quad-grid">
        <StatCard
          index={1}
          icon="clock"
          iconVariant="green"
          label="ACTIVE WINDOWS"
          value="02"
          note="1 closes in 18 hours"
          onNavigate={() => onNavigate('uploads')}
        />
        <StatCard
          index={2}
          icon="file"
          iconVariant="blue"
          label="FILES IN WORKSPACE"
          value={uploadCount || 24}
          note="Across 3 active tasks"
          onNavigate={() => onNavigate('uploads')}
        />
        <StatCard
          index={3}
          icon="users"
          iconVariant="amber"
          label="TEAM PRESENCE"
          value="08/12"
          note="3 in your channels"
          onNavigate={() => onNavigate('chat')}
        />
        <StatCard
          index={4}
          icon="shield"
          iconVariant="slate"
          label="SECURITY STATUS"
          value="100%"
          note="All sessions verified"
          onNavigate={() => onNavigate('alerts')}
        />
      </div>

      {/* 3. Main Operational Stage (Two Columns: 62% / 38% split) */}
      <div className="overview-main-columns">
        {/* LEFT COLUMN: Primary Deliverables & Next Deadline */}
        <div className="overview-left-column">
          {/* Controlled Access Task Queue */}
          <SpotlightCard className="overview-panel task-queue-panel">
            <div className="panel-header">
              <div>
                <div className="panel-kicker">CONTROLLED ACCESS</div>
                <h2 className="panel-title">Your task queue</h2>
              </div>
              <button
                className="panel-link-action"
                onClick={() => onNavigate('uploads')}
              >
                <span>View all</span>
                <Icon name="chevron-down" />
              </button>
            </div>

            <div className="task-queue-list">
              {/* Task 1 */}
              <SpotlightCard className="task-card-item">
                <div className="task-item-left">
                  <div className="task-icon-box green">
                    <Icon name="upload" />
                  </div>
                  <div className="task-info">
                    <h3 className="task-name">Q3 Engineering Review Pack</h3>
                    <span className="task-meta">Upload portal · 4 files</span>
                  </div>
                </div>

                <div className="task-item-middle">
                  <span className="task-badge badge-open">OPEN WINDOW</span>
                  <div className="task-deadline-info">
                    <span className="deadline-label">DEADLINE</span>
                    <span className="deadline-value">Sep 24, 9:30 PM</span>
                  </div>
                </div>

                <div className="task-item-right">
                  <button
                    className="btn-task-action"
                    onClick={() => onNavigate('uploads')}
                  >
                    <Icon name="open-external" />
                    <span>Open</span>
                  </button>
                </div>
              </SpotlightCard>

              {/* Task 2 */}
              <SpotlightCard className="task-card-item">
                <div className="task-item-left">
                  <div className="task-icon-box blue">
                    <Icon name="download" />
                  </div>
                  <div className="task-info">
                    <h3 className="task-name">Vertex Controller Schematics</h3>
                    <span className="task-meta">Secure download vault · 8 files</span>
                  </div>
                </div>

                <div className="task-item-middle">
                  <span className="task-badge badge-available">AVAILABLE</span>
                  <div className="task-deadline-info">
                    <span className="deadline-label">DEADLINE</span>
                    <span className="deadline-value">Sep 26, 12:00 AM</span>
                  </div>
                </div>

                <div className="task-item-right">
                  <button
                    className="btn-task-action"
                    onClick={() => onNavigate('vault')}
                  >
                    <Icon name="download" />
                    <span>Download</span>
                  </button>
                </div>
              </SpotlightCard>

              {/* Task 3 */}
              <SpotlightCard className="task-card-item">
                <div className="task-item-left">
                  <div className="task-icon-box slate">
                    <Icon name="download" />
                  </div>
                  <div className="task-info">
                    <h3 className="task-name">Firmware Build 4.10.2</h3>
                    <span className="task-meta">Secure download vault · 12 files</span>
                  </div>
                </div>

                <div className="task-item-middle">
                  <span className="task-badge badge-locked">LOCKED</span>
                  <div className="task-deadline-info">
                    <span className="deadline-label">AVAILABLE</span>
                    <span className="deadline-value">Sep 28, 3:30 PM</span>
                  </div>
                </div>

                <div className="task-item-right">
                  <button className="btn-task-action locked" disabled>
                    <Icon name="lock" />
                    <span>Locked</span>
                  </button>
                </div>
              </SpotlightCard>
            </div>
          </SpotlightCard>

          {/* Next Deadline Widget */}
          <TimerCard
            index={5}
            deadline={deadline}
            serverTime={serverTime}
            portalState={portalState}
            onGoUploads={() => onNavigate('uploads')}
            onFastForward={onFastForward}
          />
        </div>

        {/* RIGHT COLUMN: Awareness & Secondary Operations */}
        <div className="overview-right-column">
          {/* Attention Center */}
          <SpotlightCard className="overview-panel attention-panel">
            <div className="panel-header">
              <div>
                <div className="panel-kicker">3 ITEMS</div>
                <h2 className="panel-title">Attention center</h2>
              </div>
              <button className="panel-dots-btn" aria-label="More options">
                <Icon name="dots" />
              </button>
            </div>

            <div className="attention-items-list">
              {/* Attention Item 1 */}
              <SpotlightCard className="attention-item">
                <div className="attention-icon-box red">
                  <Icon name="clock" />
                </div>
                <div className="attention-content">
                  <h4 className="attention-title">Upload window closing</h4>
                  <p className="attention-text">
                    Q3 Engineering Review Pack closes in 18 hours.
                  </p>
                  <button
                    className="attention-action-link"
                    onClick={() => onNavigate('uploads')}
                  >
                    <span>Review task</span>
                    <Icon name="chevron-down" />
                  </button>
                </div>
              </SpotlightCard>

              {/* Attention Item 2 */}
              <SpotlightCard className="attention-item">
                <div className="attention-icon-box amber">
                  <Icon name="lock" />
                </div>
                <div className="attention-content">
                  <h4 className="attention-title">Download is locked</h4>
                  <p className="attention-text">
                    Firmware Build 4.10.2 releases Monday at 09:00.
                  </p>
                  <button
                    className="attention-action-link"
                    onClick={() => onNavigate('vault')}
                  >
                    <span>View schedule</span>
                    <Icon name="chevron-down" />
                  </button>
                </div>
              </SpotlightCard>

              {/* Attention Item 3 */}
              <SpotlightCard className="attention-item">
                <div className="attention-icon-box blue">
                  <Icon name="help" />
                </div>
                <div className="attention-content">
                  <h4 className="attention-title">Need a hand?</h4>
                  <p className="attention-text">
                    Vertex AI can search your technical knowledge base.
                  </p>
                  <button
                    className="attention-action-link"
                    onClick={() => onNavigate('ai')}
                  >
                    <span>Start AI chat</span>
                    <Icon name="chevron-down" />
                  </button>
                </div>
              </SpotlightCard>
            </div>
          </SpotlightCard>

          {/* Recent Activity Feed */}
          <SpotlightCard className="overview-panel activity-panel">
            <div className="panel-header">
              <div>
                <div className="panel-kicker">TEAM UPDATES</div>
                <h2 className="panel-title">Recent activity</h2>
              </div>
              <button
                className="panel-link-action"
                onClick={() => onNavigate('chat')}
              >
                <span>Open chat</span>
                <Icon name="chevron-down" />
              </button>
            </div>

            <div className="activity-list">
              {teamActivity.map((item, idx) => (
                <div className="activity-item" key={idx}>
                  <div className="activity-avatar">{item.av}</div>
                  <div className="activity-body">
                    <div className="activity-name-row">
                      <span className="activity-name">{item.name}</span>
                      <span className="activity-time">{item.time}</span>
                    </div>
                    <span className="activity-desc">{item.text}</span>
                  </div>
                  <span className={`pill sm ${item.type}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </SpotlightCard>

          {/* Compact Secure Vault Snapshot */}
          <SpotlightCard className="overview-panel compact-vault-panel">
            <div className="panel-header">
              <div>
                <div className="panel-kicker">DOWNLOAD VAULT</div>
                <h2 className="panel-title">Secure assets</h2>
              </div>
              <button
                className="panel-link-action"
                onClick={() => onNavigate('vault')}
              >
                <span>Open vault</span>
                <Icon name="chevron-down" />
              </button>
            </div>

            <div className="compact-vault-list">
              <div className="vault-snapshot-row">
                <div className="vault-snapshot-icon green">
                  <Icon name="file" />
                </div>
                <div className="vault-snapshot-info">
                  <strong>Alpha_schematic_v3.pdf</strong>
                  <span>4.2 MB · Link valid 300s</span>
                </div>
                <span className="task-badge badge-open">READY</span>
              </div>

              <div className="vault-snapshot-row">
                <div className="vault-snapshot-icon amber">
                  <Icon name="lock" />
                </div>
                <div className="vault-snapshot-info">
                  <strong>motor_ctrl_codebase.zip</strong>
                  <span>{isReleased ? '86 MB · Released' : `Unlocks in ${dhm(Math.max(0, releaseAt - serverTime))}`}</span>
                </div>
                <span className={`task-badge ${isReleased ? 'badge-open' : 'badge-locked'}`}>
                  {isReleased ? 'READY' : 'LOCKED'}
                </span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}
