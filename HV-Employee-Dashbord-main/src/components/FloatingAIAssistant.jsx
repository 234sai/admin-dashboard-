import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { fmtT, hms, dhm, now } from '../utils/time';

/**
 * Procedural SVG Avatar Graphic for HV VERTEX AI
 * High-tech concentric gyro core with rotating orbital rings and emerald vertex sparkle.
 */
function VertexAvatarGraphic({ size = 48, isThinking = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`ai-avatar-svg ${isThinking ? 'thinking' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ai-grad-primary" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
        <linearGradient id="ai-grad-core" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="60%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <radialGradient id="ai-glow-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#047857" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#06120d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow circle */}
      <circle cx="32" cy="32" r="28" fill="url(#ai-glow-bg)" />

      {/* Outer rotating gyro ring */}
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="url(#ai-grad-primary)"
        strokeWidth="1.5"
        strokeDasharray="8 4"
        className="ai-avatar-ring-outer"
      />

      {/* Tilted orbital ring */}
      <ellipse
        cx="32"
        cy="32"
        rx="20"
        ry="10"
        stroke="#34d399"
        strokeWidth="1.2"
        strokeOpacity="0.8"
        className="ai-avatar-ring-orbit"
      />

      {/* Inner Central AI Core */}
      <circle
        cx="32"
        cy="32"
        r="13"
        fill="#04160f"
        stroke="url(#ai-grad-core)"
        strokeWidth="1.5"
      />

      {/* Central 4-point Vertex Sparkle */}
      <path
        d="M32 23.5L34 29.5L40 32L34 34.5L32 40.5L30 34.5L24 32L30 29.5L32 23.5Z"
        fill="url(#ai-grad-core)"
        className="ai-avatar-sparkle"
      />

      {/* Center Iris Core */}
      <circle cx="32" cy="32" r="2.5" fill="#ffffff" />
    </svg>
  );
}

/**
 * Predefined Quick-Help Suggested Actions
 */
const SUGGESTED_ACTIONS = [
  { id: 'next', label: 'What should I do next?' },
  { id: 'deadlines', label: 'Show my upcoming deadlines.' },
  { id: 'upload', label: 'Help me upload a file.' },
  { id: 'locked', label: 'Why is this file locked?' },
  { id: 'find', label: 'Find something in my workspace.' },
];

/**
 * Floating AI Avatar & Quick Assistant Component
 */
export default function FloatingAIAssistant({
  portalState = 'open',
  deadline,
  serverTime,
  isReleased = false,
  releaseAt,
  uploadCount = 16,
  uploadedFiles = [],
  onNavigate,
  onToast,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'assistant',
      time: 'Just now',
      text: 'Good day, Maya. I am your HV VERTEX workspace assistant. How can I assist your operations today?',
      actions: [
        { label: 'Check Tasks', action: 'next' },
        { label: 'Next Deadline', action: 'deadlines' },
      ],
    },
  ]);

  const messagesEndRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const msgCounterRef = useRef(100);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  // Keyboard escape listener to close panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Deterministic local response generator using live workspace state
  const generateResponse = (query) => {
    const q = query.toLowerCase();
    const curTime = serverTime || now();
    const remDeadline = Math.max(0, (deadline || curTime) - curTime);
    const remVault = Math.max(0, (releaseAt || curTime) - curTime);
    const timeFormatted = fmtT(curTime);

    // 1. What should I do next?
    if (/next|todo|task|priorit|queue/.test(q)) {
      if (portalState === 'closed') {
        return {
          text: `**Priority Alert**: The Alpha firmware upload portal is currently **Locked (HTTP 423)** as the deadline passed. Your top priority is to request an Extension Pass from an administrator to unlock your submission window.`,
          actions: [
            { label: 'Open Team Chat', nav: 'chat' },
            { label: 'View Vault Assets', nav: 'vault' },
          ],
        };
      }
      return {
        text: `**Current Priority (Alpha Team)**:\n\n1. **Upload Deliverables**: Window closes at **${fmtT(deadline)} IST** today (${remDeadline > 0 ? `in ${hms(remDeadline)}` : 'closing now'}). You currently have ${uploadedFiles.length > 0 ? uploadedFiles.length : uploadCount} active files.\n2. **Review Schematics**: Inspect \`Alpha_schematic_v3.pdf\` in the Secure Vault.\n3. **Bench Status**: Meera Shah confirmed UART bench testing passed in \`# alpha\`.`,
        actions: [
          { label: 'Go to Uploads', nav: 'uploads' },
          { label: 'Check Vault', nav: 'vault' },
          { label: 'Open Task Queue', nav: 'dash' },
        ],
      };
    }

    // 2. Show upcoming deadlines
    if (/deadline|when|close|time left|timer/.test(q)) {
      const statusLabel = portalState === 'open' ? 'Open Window' : portalState === 'late' ? 'Soft Lockout' : 'Closed (423)';
      return {
        text: `**Live Deadline Telemetry (Server: ${timeFormatted} IST)**:\n\n• **Alpha Firmware Pack**: Closes at **${fmtT(deadline)} IST** today (${remDeadline > 0 ? `${hms(remDeadline)} remaining` : 'Expired'}). Status: **${statusLabel}**.\n• **Vertex Controller Schematics**: Sep 26, 12:00 AM IST.\n• **Firmware Build 4.10.2**: Sep 28, 3:30 PM IST (Confidential).`,
        actions: [
          { label: 'Open Uploads Portal', nav: 'uploads' },
          { label: 'View Dashboard', nav: 'dash' },
        ],
      };
    }

    // 3. Help me upload a file
    if (/upload|file|deliverable|drop|submit/.test(q)) {
      if (portalState === 'closed') {
        return {
          text: `Uploads are currently **Locked (HTTP 423)**. The server has rejected new submissions because the deadline passed at ${fmtT(deadline)} IST. Contact an administrator to issue an extension pass.`,
          actions: [
            { label: 'Ask Admin via Chat', nav: 'chat' },
            { label: 'View Submissions Log', nav: 'uploads' },
          ],
        };
      }
      return {
        text: `Navigating you to the **Uploads Portal**. Drag and drop your deliverables (.bin, .hex, .zip, .pdf) up to 250 MB into the dropzone. Every submission generates a cryptographic SHA-256 server receipt.`,
        actions: [
          { label: 'Go to Uploads Portal', nav: 'uploads' },
        ],
        autoNavigate: 'uploads',
      };
    }

    // 4. Why is this file locked?
    if (/lock|why.*lock|locked|423|vault|restricted/.test(q)) {
      return {
        text: `**HV VERTEX Isolation Policy**:\n\n• **Upload Windows**: Submissions stop strictly at the deadline (${fmtT(deadline)} IST) returning **HTTP 423 Locked**.\n• **Confidential Releases**: Files such as \`motor_ctrl_codebase.zip\` unlock inside a signed release window (${isReleased ? 'Currently Released' : `Unlocks in ${dhm(remVault)}`}).\n• **Link Lifetime**: Generated signed download links are valid for **300 seconds**, then return **HTTP 410 Gone**. Direct URLs are disabled.`,
        actions: [
          { label: 'Open Secure Vault', nav: 'vault' },
          { label: 'Check Policy Alerts', nav: 'alerts' },
        ],
      };
    }

    // 5. Find something in my workspace
    if (/find|search|where|asset|workspace|document/.test(q)) {
      return {
        text: `**Verified Workspace Index**:\n\n• **Deliverables**: Sensor driver (\`sensor_driver_v1.bin\`), Bootloader notes (\`bootloader_notes.pdf\`).\n• **Vault Files**: Alpha Schematic v3 (4.2 MB), Motor Control Codebase (86 MB).\n• **Channels**: \`# alpha\`, \`# motor-ctrl\`, \`# fw-team\`.\n• **Intelligence**: Full Vertex AI technical manual.`,
        actions: [
          { label: 'Open Vault', nav: 'vault' },
          { label: 'Open Uploads', nav: 'uploads' },
          { label: 'Open Team Chat', nav: 'chat' },
          { label: 'Full Vertex AI', nav: 'ai' },
        ],
      };
    }

    // Greeting
    if (/hi|hello|hey|good morning|assist/.test(q)) {
      return {
        text: `Hello Maya. I'm connected to the Alpha firmware project environment. All systems are operating normally. What would you like to review?`,
        actions: [
          { label: 'What should I do next?', action: 'next' },
          { label: 'Show deadlines', action: 'deadlines' },
        ],
      };
    }

    // General fallback with honest guidance
    return {
      text: `I've analyzed your question against current workspace telemetry. For specific operations, choose a suggested action below, or launch the **Full Vertex AI Workspace** for deeper technical analysis.`,
      actions: [
        { label: 'Open Full Vertex AI', nav: 'ai' },
        { label: 'Upcoming Deadlines', action: 'deadlines' },
        { label: 'Upload Deliverables', nav: 'uploads' },
      ],
    };
  };

  const handleSend = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isTyping) return;

    const userMsgId = 'msg-' + (msgCounterRef.current++);
    const userTime = fmtT(now()).slice(0, 5);

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', time: userTime, text },
    ]);
    setInputVal('');
    setIsTyping(true);

    // Natural assistant latency (400ms)
    setTimeout(() => {
      const resp = generateResponse(text);
      const botMsgId = 'bot-' + (msgCounterRef.current++);
      const botTime = fmtT(now()).slice(0, 5);

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'assistant',
          time: botTime,
          text: resp.text,
          actions: resp.actions,
        },
      ]);
      setIsTyping(false);

      if (resp.autoNavigate && onNavigate) {
        onNavigate(resp.autoNavigate);
        if (onToast) onToast(`Opened ${resp.autoNavigate} page`);
      }
    }, 420);
  };

  const handleSuggestedClick = (actionItem) => {
    if (actionItem.nav) {
      if (onNavigate) onNavigate(actionItem.nav);
      if (onToast) onToast(`Navigated to ${actionItem.nav}`);
      return;
    }
    handleSend(actionItem.label);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="floating-ai-assistant-root">
      {/* 1. Quick-Help Assistant Panel */}
      {isOpen && (
        <div
          id="vertex-assistant-panel"
          className="floating-ai-panel rise"
          role="dialog"
          aria-label="Vertex Assistant"
          aria-modal="false"
        >
          {/* Panel Header */}
          <div className="ai-panel-header">
            <div className="ai-panel-header-left">
              <div className="ai-panel-avatar-icon">
                <VertexAvatarGraphic size={32} isThinking={isTyping} />
              </div>
              <div>
                <div className="ai-panel-title-row">
                  <h3 className="ai-panel-title">Vertex Assistant</h3>
                  <span className="ai-panel-status-pill">Active</span>
                </div>
                <p className="ai-panel-subtitle">Your workspace assistant</p>
              </div>
            </div>

            <div className="ai-panel-header-actions">
              <button
                type="button"
                className="ai-panel-icon-btn"
                onClick={() => {
                  if (onNavigate) onNavigate('ai');
                  setIsOpen(false);
                  if (onToast) onToast('Opened full Vertex AI workspace');
                }}
                title="Open full Vertex AI workspace"
                aria-label="Open full Vertex AI workspace"
              >
                <Icon name="sparkles" />
              </button>
              <button
                type="button"
                className="ai-panel-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                aria-label="Close assistant"
              >
                <Icon name="x" />
              </button>
            </div>
          </div>

          {/* Panel Body / Messages Conversation */}
          <div className="ai-panel-body">
            {/* Greeting Banner */}
            <div className="ai-greeting-banner">
              <div className="ai-greeting-icon">
                <Icon name="sparkles" />
              </div>
              <div className="ai-greeting-text">
                <strong>Hi Maya! How can I help you today?</strong>
                <span>Workspace telemetry synchronized in real time.</span>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="ai-messages-list">
              {messages.map((m) => (
                <div key={m.id} className={`ai-message-row ${m.sender}`}>
                  {m.sender === 'assistant' && (
                    <div className="ai-msg-avatar" aria-hidden="true">
                      <VertexAvatarGraphic size={24} />
                    </div>
                  )}
                  <div className="ai-message-bubble">
                    <div className="ai-msg-header">
                      <span className="ai-msg-sender">
                        {m.sender === 'assistant' ? 'Vertex AI' : 'You'}
                      </span>
                      <span className="ai-msg-time">{m.time}</span>
                    </div>

                    <div className="ai-msg-text">
                      {m.text.split('\n').map((line, lIdx) => (
                        <p key={lIdx} style={{ margin: line ? '0 0 6px' : '4px 0' }}>
                          {line.split('**').map((chunk, cIdx) =>
                            cIdx % 2 === 1 ? <strong key={cIdx}>{chunk}</strong> : chunk
                          )}
                        </p>
                      ))}
                    </div>

                    {/* Interactive Action Buttons */}
                    {m.actions && m.actions.length > 0 && (
                      <div className="ai-msg-action-chips">
                        {m.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            type="button"
                            className="ai-action-chip"
                            onClick={() => {
                              if (act.nav) {
                                if (onNavigate) onNavigate(act.nav);
                                if (onToast) onToast(`Navigated to ${act.nav}`);
                              } else if (act.action) {
                                const found = SUGGESTED_ACTIONS.find((s) => s.id === act.action);
                                if (found) handleSend(found.label);
                              }
                            }}
                          >
                            <span>{act.label}</span>
                            <Icon name="arrow" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="ai-message-row assistant">
                  <div className="ai-msg-avatar" aria-hidden="true">
                    <VertexAvatarGraphic size={24} isThinking={true} />
                  </div>
                  <div className="ai-message-bubble ai-typing-bubble">
                    <span className="ai-typing-dot" />
                    <span className="ai-typing-dot" />
                    <span className="ai-typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Actions */}
            <div className="ai-suggested-section">
              <span className="ai-suggested-label">SUGGESTED ACTIONS</span>
              <div className="ai-suggested-chips-grid">
                {SUGGESTED_ACTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="ai-suggested-btn"
                    onClick={() => handleSuggestedClick(s)}
                  >
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Panel Input Footer */}
          <div className="ai-panel-footer">
            <form
              className="ai-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                className="ai-input-field"
                placeholder="Ask about deadlines, files, or tasks..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                aria-label="Message Vertex Assistant"
              />
              <button
                type="submit"
                className="ai-send-btn"
                disabled={!inputVal.trim() || isTyping}
                aria-label="Send message"
                title="Send message (Enter)"
              >
                <Icon name="send" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Floating Avatar Trigger Button */}
      <div className="floating-avatar-container">
        <button
          ref={buttonRef}
          type="button"
          className={`floating-avatar-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close Vertex AI Assistant' : 'Ask Vertex AI'}
          aria-expanded={isOpen}
          aria-controls="vertex-assistant-panel"
          title="Ask Vertex AI"
        >
          {/* Avatar Graphic with floating motion */}
          <div className="floating-avatar-graphic-wrap">
            <VertexAvatarGraphic size={48} isThinking={isTyping} />
          </div>

          {/* Status Indicator Green Dot with Ping Ripple */}
          <span className="avatar-status-badge" aria-hidden="true">
            <span className="avatar-status-dot" />
            <span className="avatar-status-ping" />
          </span>

          {/* Floating Tooltip Pill */}
          {!isOpen && (
            <div className="floating-avatar-tooltip" role="tooltip">
              <Icon name="sparkles" />
              <span>Ask Vertex AI</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
