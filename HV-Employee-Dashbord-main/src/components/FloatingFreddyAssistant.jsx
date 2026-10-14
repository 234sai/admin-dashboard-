import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Avatar } from '@bible-strong/avatar-react';
import '@bible-strong/avatar-react/styles.css';
import rawFreddyDefinition from '../assets/freddy.avatar.json';
import Icon from './Icon';
import { fmtT, hms, dhm, now } from '../utils/time';
import './FloatingFreddyAssistant.css';

/**
 * Sanitize definition once at module level to guarantee strict schema compatibility.
 * Clamps cylinder node surface roundness <= 1.0 per @bible-strong/avatar-core rules.
 */
function prepareDefinition(raw) {
  try {
    const clone = JSON.parse(JSON.stringify(raw));
    if (clone?.body?.nodes && Array.isArray(clone.body.nodes)) {
      clone.body.nodes.forEach((node) => {
        if (
          node?.surface &&
          typeof node.surface.roundness === 'number' &&
          node.surface.roundness > 1
        ) {
          node.surface.roundness = 1.0;
        }
      });
    }
    return clone;
  } catch {
    return raw;
  }
}

const freddyDefinition = prepareDefinition(rawFreddyDefinition);

/**
 * Procedural Vector Fallback Graphic for Freddy
 * Used gracefully if procedural rendering fails or WebGL/SVG throws an error.
 */
function FreddyFallbackGraphic({ size = 68, animation = 'idle' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="freddy-body-grad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f39c73" />
          <stop offset="60%" stopColor="#e6855c" />
          <stop offset="100%" stopColor="#c4643c" />
        </radialGradient>
        <filter id="freddy-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Ears / Side Nodes */}
      <circle cx="20" cy="30" r="12" fill="#d7724a" filter="url(#freddy-shadow)" />
      <circle cx="80" cy="30" r="12" fill="#d7724a" filter="url(#freddy-shadow)" />
      {/* Main Cube Body with soft roundness */}
      <rect
        x="14"
        y="22"
        width="72"
        height="64"
        rx="22"
        fill="url(#freddy-body-grad)"
        filter="url(#freddy-shadow)"
      />
      {/* Cheeks */}
      <ellipse cx="28" cy="62" rx="5" ry="3" fill="#ffaa8a" opacity="0.6" />
      <ellipse cx="72" cy="62" rx="5" ry="3" fill="#ffaa8a" opacity="0.6" />
      {/* Eyes */}
      <ellipse cx="36" cy="46" rx="8" ry="12" fill="#ffffff" />
      <ellipse cx="64" cy="46" rx="8" ry="12" fill="#ffffff" />
      {/* Pupils / Expression */}
      {animation === 'thinking' ? (
        <>
          <circle cx="38" cy="41" r="5" fill="#1b2a22" />
          <circle cx="66" cy="41" r="5" fill="#1b2a22" />
        </>
      ) : animation === 'listening' ? (
        <>
          <circle cx="36" cy="47" r="5" fill="#1b2a22" />
          <circle cx="64" cy="47" r="5" fill="#1b2a22" />
        </>
      ) : (
        <>
          <circle cx="36" cy="46" r="5" fill="#1b2a22" />
          <circle cx="64" cy="46" r="5" fill="#1b2a22" />
          <circle cx="38" cy="43" r="1.8" fill="#ffffff" />
          <circle cx="66" cy="43" r="1.8" fill="#ffffff" />
        </>
      )}
      {/* Smile / Mouth */}
      {animation === 'happy' || animation === 'celebrate' ? (
        <path
          d="M42 63 Q50 72 58 63"
          stroke="#5a2412"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      ) : animation === 'confused' ? (
        <path
          d="M44 65 Q50 60 56 65"
          stroke="#5a2412"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M45 64 Q50 68 55 64"
          stroke="#5a2412"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

/**
 * Freddy Avatar Component with safe fallback
 */
function FreddyAvatarRender({ animation = 'idle', size = 68, className = '' }) {
  const [renderError, setRenderError] = useState(false);

  if (renderError) {
    return <FreddyFallbackGraphic size={size} animation={animation} />;
  }

  return (
    <Avatar
      definition={freddyDefinition}
      animation={animation}
      autoplay={true}
      size={size}
      className={className}
      ariaLabel="Freddy AI Avatar"
      onError={(err) => {
        console.warn('[Freddy Avatar error]:', err);
        setRenderError(true);
      }}
    />
  );
}

/**
 * 6 Suggested Quick Actions per specification
 */
const SUGGESTED_ACTIONS = [
  { id: 'next', label: 'What should I do next?' },
  { id: 'deadlines', label: 'Show my upcoming deadlines.' },
  { id: 'upload', label: 'Help me upload a file.' },
  { id: 'locked', label: 'Why is this file locked?' },
  { id: 'find', label: 'Find something in my workspace.' },
  { id: 'vertex_ai', label: 'Open Vertex AI.' },
];

const STORAGE_KEY = 'hv-vertex-freddy-position';
const AVATAR_SIZE = 72;
const VIEWPORT_PAD = 16;

/**
 * Validate and clamp coordinates within current viewport
 */
function clampPosition(x, y) {
  if (typeof window === 'undefined') return { x, y };
  const maxX = Math.max(VIEWPORT_PAD, window.innerWidth - AVATAR_SIZE - VIEWPORT_PAD);
  const maxY = Math.max(VIEWPORT_PAD, window.innerHeight - AVATAR_SIZE - VIEWPORT_PAD);
  return {
    x: Math.min(Math.max(VIEWPORT_PAD, Math.round(x)), maxX),
    y: Math.min(Math.max(VIEWPORT_PAD, Math.round(y)), maxY),
  };
}

/**
 * Read initial position from localStorage with validation and fallback
 */
function getSavedPosition() {
  if (typeof window === 'undefined') return { x: 100, y: 100 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        typeof parsed?.x === 'number' &&
        isFinite(parsed.x) &&
        typeof parsed?.y === 'number' &&
        isFinite(parsed.y)
      ) {
        return clampPosition(parsed.x, parsed.y);
      }
    }
  } catch {}

  // Default: Bottom-right corner of viewport
  return clampPosition(window.innerWidth - AVATAR_SIZE - 24, window.innerHeight - AVATAR_SIZE - 28);
}

/**
 * Dynamically calculate glassmorphism panel position anchored near Freddy
 */
function calculatePanelPosition(avatarPos) {
  if (typeof window === 'undefined') return null;
  if (window.innerWidth <= 480) {
    return null; // Fixed position handled in mobile CSS
  }

  const PANEL_WIDTH = 395;
  const PANEL_HEIGHT = 590;
  const GAP = 14;

  let left;
  let top;

  // Horizontal anchor:
  if (avatarPos.x + AVATAR_SIZE / 2 > window.innerWidth / 2) {
    left = avatarPos.x - PANEL_WIDTH - GAP;
  } else {
    left = avatarPos.x + AVATAR_SIZE + GAP;
  }

  // Vertical anchor:
  if (avatarPos.y + AVATAR_SIZE / 2 > window.innerHeight / 2) {
    top = avatarPos.y + AVATAR_SIZE - PANEL_HEIGHT;
  } else {
    top = avatarPos.y;
  }

  // Viewport clamping
  const minX = VIEWPORT_PAD;
  const maxX = window.innerWidth - PANEL_WIDTH - VIEWPORT_PAD;
  const minY = VIEWPORT_PAD;
  const maxY = window.innerHeight - PANEL_HEIGHT - VIEWPORT_PAD;

  return {
    left: Math.min(Math.max(minX, left), maxX),
    top: Math.min(Math.max(minY, top), maxY),
  };
}

/**
 * Main FloatingFreddyAssistant Component
 */
export default function FloatingFreddyAssistant({
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
  const [position, setPosition] = useState(getSavedPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [animation, setAnimation] = useState('idle');
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'assistant',
      time: 'Just now',
      text: "Hey! I'm **Freddy**, your workspace assistant companion. How can I help you with your workspace operations today?",
      actions: [
        { label: 'Check Tasks', action: 'next' },
        { label: 'Next Deadline', action: 'deadlines' },
      ],
    },
  ]);

  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const animTimeoutRef = useRef(null);
  const msgCounterRef = useRef(100);

  // Drag tracking refs
  const dragStartRef = useRef({ pointerX: 0, pointerY: 0, avatarX: 0, avatarY: 0 });
  const hasMovedPastThresholdRef = useRef(false);
  const pointerActiveRef = useRef(false);

  // Save position to localStorage safely
  const persistPosition = useCallback((newPos) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPos));
    } catch {}
  }, []);

  // Central reaction trigger: temporarily plays state animation, then returns smoothly
  const triggerReaction = useCallback(
    (targetAnim, durationMs = 3500) => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      setAnimation(targetAnim);
      if (durationMs > 0) {
        animTimeoutRef.current = setTimeout(() => {
          setAnimation(isOpen ? 'listening' : 'idle');
        }, durationMs);
      }
    },
    [isOpen]
  );

  const closePanel = useCallback(() => {
    setIsOpen(false);
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    setAnimation('idle');
    buttonRef.current?.focus();
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        triggerReaction('listening', 0);
        setTimeout(() => textareaRef.current?.focus(), 120);
      } else {
        if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
        setAnimation('idle');
        buttonRef.current?.focus();
      }
      return next;
    });
  }, [triggerReaction]);

  // Tab visibility: Freddy sleeps when tab is inactive, wakes up when returned
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setAnimation('sleeping');
      } else {
        setAnimation(isOpen ? 'listening' : 'idle');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isOpen]);

  // Viewport resize and orientation changes
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const clamped = clampPosition(prev.x, prev.y);
        if (clamped.x !== prev.x || clamped.y !== prev.y) {
          persistPosition(clamped);
          return clamped;
        }
        return prev;
      });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [persistPosition]);

  // Auto-scroll conversation to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Keyboard Escape listener to close panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closePanel]);

  // Reset Freddy position to bottom-right
  const handleResetPosition = () => {
    const defaultPos = clampPosition(
      window.innerWidth - AVATAR_SIZE - 24,
      window.innerHeight - AVATAR_SIZE - 28
    );
    setPosition(defaultPos);
    persistPosition(defaultPos);
    if (onToast) onToast('Freddy position reset to default');
    triggerReaction('happy', 2000);
  };

  // Keyboard repositioning on avatar button (Arrow keys nudge by 20px / 40px)
  const handleButtonKeyDown = (e) => {
    const step = e.shiftKey ? 40 : 20;
    let dx = 0;
    let dy = 0;

    if (e.key === 'ArrowUp') dy = -step;
    else if (e.key === 'ArrowDown') dy = step;
    else if (e.key === 'ArrowLeft') dx = -step;
    else if (e.key === 'ArrowRight') dx = step;
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePanel();
      return;
    } else {
      return;
    }

    e.preventDefault();
    setPosition((prev) => {
      const nextPos = clampPosition(prev.x + dx, prev.y + dy);
      persistPosition(nextPos);
      return nextPos;
    });
  };

  // Pointer Drag Handlers
  const handlePointerDown = (e) => {
    if (e.button !== 0) return; // Left click / touch only
    pointerActiveRef.current = true;
    hasMovedPastThresholdRef.current = false;
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      avatarX: position.x,
      avatarY: position.y,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    if (!pointerActiveRef.current) return;
    const dx = e.clientX - dragStartRef.current.pointerX;
    const dy = e.clientY - dragStartRef.current.pointerY;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
      hasMovedPastThresholdRef.current = true;
      if (!isDragging) setIsDragging(true);
      const nextPos = clampPosition(
        dragStartRef.current.avatarX + dx,
        dragStartRef.current.avatarY + dy
      );
      setPosition(nextPos);
    }
  };

  const handlePointerUp = (e) => {
    if (!pointerActiveRef.current) return;
    pointerActiveRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (hasMovedPastThresholdRef.current) {
      // Finished dragging: persist position, do NOT toggle panel
      persistPosition(position);
    } else {
      // Clean click/tap: toggle panel
      togglePanel();
    }
  };

  const handlePointerCancel = (e) => {
    if (!pointerActiveRef.current) return;
    pointerActiveRef.current = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    persistPosition(position);
  };

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
          reaction: 'confused',
        };
      }
      return {
        text: `**Current Priority (Alpha Team)**:\n\n1. **Upload Deliverables**: Window closes at **${fmtT(deadline)} IST** today (${remDeadline > 0 ? `in ${hms(remDeadline)}` : 'closing now'}). You currently have ${uploadedFiles.length > 0 ? uploadedFiles.length : uploadCount} active files.\n2. **Review Schematics**: Inspect \`Alpha_schematic_v3.pdf\` in the Secure Vault.\n3. **Bench Status**: Meera Shah confirmed UART bench testing passed in \`# alpha\`.`,
        actions: [
          { label: 'Go to Uploads', nav: 'uploads' },
          { label: 'Check Vault', nav: 'vault' },
          { label: 'Open Task Queue', nav: 'dash' },
        ],
        reaction: 'working',
      };
    }

    // 2. Show upcoming deadlines
    if (/deadline|when|close|time left|timer/.test(q)) {
      const statusLabel =
        portalState === 'open' ? 'Open Window' : portalState === 'late' ? 'Soft Lockout' : 'Closed (423)';
      return {
        text: `**Live Deadline Telemetry (Server: ${timeFormatted} IST)**:\n\n• **Alpha Firmware Pack**: Closes at **${fmtT(deadline)} IST** today (${remDeadline > 0 ? `${hms(remDeadline)} remaining` : 'Expired'}). Status: **${statusLabel}**.\n• **Vertex Controller Schematics**: Sep 26, 12:00 AM IST.\n• **Firmware Build 4.10.2**: Sep 28, 3:30 PM IST (Confidential).`,
        actions: [
          { label: 'Open Uploads Portal', nav: 'uploads' },
          { label: 'View Dashboard', nav: 'dash' },
        ],
        reaction: 'happy',
      };
    }

    // 3. Help me upload a file
    if (/upload|file|deliverable|drop|submit/.test(q)) {
      if (portalState === 'closed') {
        return {
          text: `Uploads are currently **Locked (HTTP 423)**. The server has rejected new submissions because the deadline passed at ${fmtT(deadline)} IST. Contact an administrator via Team Chat to request an extension pass.`,
          actions: [
            { label: 'Ask Admin via Chat', nav: 'chat' },
            { label: 'View Submissions Log', nav: 'uploads' },
          ],
          reaction: 'confused',
        };
      }
      return {
        text: `Navigating you to the **Uploads Portal**. Drag and drop your deliverables (\`.bin\`, \`.hex\`, \`.zip\`, \`.pdf\`) up to 250 MB into the animated dropzone. Every submission generates a cryptographic SHA-256 server receipt.`,
        actions: [{ label: 'Go to Uploads Portal', nav: 'uploads' }],
        autoNavigate: 'uploads',
        reaction: 'working',
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
        reaction: 'confused',
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
        reaction: 'searching',
      };
    }

    // 6. Open Vertex AI
    if (/vertex ai|open vertex|intelligence|full ai|model/.test(q)) {
      return {
        text: `Navigating you to the **Full Vertex AI Workspace**. This dedicated intelligence environment provides neural code analysis, firmware telemetry review, and deep workspace diagnostics.`,
        actions: [{ label: 'Open Full Vertex AI', nav: 'ai' }],
        autoNavigate: 'ai',
        reaction: 'happy',
      };
    }

    // Greeting
    if (/hi|hello|hey|good morning|assist|who are you|freddy/.test(q)) {
      return {
        text: `Hey Maya! I'm **Freddy**, your workspace assistant companion. I'm connected to the Alpha firmware environment in real time. All telemetry systems are nominal. What would you like to review?`,
        actions: [
          { label: 'What should I do next?', action: 'next' },
          { label: 'Show deadlines', action: 'deadlines' },
        ],
        reaction: 'happy',
      };
    }

    // Milestone celebration
    if (/celebrate|success|congrat|milestone|done|finished/.test(q)) {
      return {
        text: `Outstanding work on the Alpha firmware pack! Your team has hit all verification milestones. Keep up the high standard of precision!`,
        actions: [{ label: 'View Dashboard', nav: 'dash' }],
        reaction: 'celebrate',
      };
    }

    // General honest fallback
    return {
      text: `I've checked the local workspace index and Alpha project telemetry. I don't have a direct answer for "${query}". You can choose one of the suggested actions below, or open the **Full Vertex AI Workspace** for advanced analysis.`,
      actions: [
        { label: 'Open Full Vertex AI', nav: 'ai' },
        { label: 'Upcoming Deadlines', action: 'deadlines' },
        { label: 'Upload Deliverables', nav: 'uploads' },
      ],
      reaction: 'curious',
    };
  };

  const handleSend = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isTyping) return;

    const userMsgId = 'msg-' + msgCounterRef.current++;
    const userTime = fmtT(now()).slice(0, 5);

    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', time: userTime, text }]);
    setInputVal('');
    setIsTyping(true);

    // Freddy switches to 'thinking' while preparing response
    triggerReaction('thinking', 0);

    setTimeout(() => {
      const resp = generateResponse(text);
      const botMsgId = 'bot-' + msgCounterRef.current++;
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

      // Freddy responds with appropriate animation reaction
      triggerReaction(resp.reaction || 'happy', 3500);

      if (resp.autoNavigate && onNavigate) {
        onNavigate(resp.autoNavigate);
        if (onToast) onToast(`Opened ${resp.autoNavigate} page`);
      }
    }, 450);
  };

  const handleSuggestedClick = (actionItem) => {
    if (actionItem.id === 'vertex_ai') {
      if (onNavigate) onNavigate('ai');
      closePanel();
      if (onToast) onToast('Opened Full Vertex AI workspace');
      return;
    }

    if (actionItem.nav) {
      if (onNavigate) onNavigate(actionItem.nav);
      if (onToast) onToast(`Navigated to ${actionItem.nav}`);
      return;
    }
    handleSend(actionItem.label);
  };

  const handleComposerKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const panelCoords = calculatePanelPosition(position);

  return (
    <>
      {/* 1. Premium Glassmorphism Assistant Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          id="freddy-assistant-panel"
          className="freddy-glass-panel"
          role="dialog"
          aria-label="Freddy AI Assistant"
          aria-modal="false"
          style={panelCoords ? { left: `${panelCoords.left}px`, top: `${panelCoords.top}px` } : undefined}
        >
          {/* Header */}
          <div className="freddy-panel-header">
            <div className="freddy-header-left">
              <div className="freddy-header-avatar" aria-hidden="true">
                <FreddyAvatarRender animation={animation} size={36} />
              </div>
              <div className="freddy-header-meta">
                <div className="freddy-header-title-row">
                  <h3 className="freddy-header-title">Freddy</h3>
                  <span className="freddy-header-status-pill">Ready</span>
                </div>
                <p className="freddy-header-subtitle">HV VERTEX AI Assistant</p>
              </div>
            </div>

            <div className="freddy-header-actions">
              <button
                type="button"
                className="freddy-icon-btn"
                onClick={handleResetPosition}
                title="Reset Freddy position to bottom-right"
                aria-label="Reset Freddy position to bottom-right"
              >
                <Icon name="reset" />
              </button>
              <button
                type="button"
                className="freddy-icon-btn"
                onClick={() => {
                  if (onNavigate) onNavigate('ai');
                  closePanel();
                  if (onToast) onToast('Opened full Vertex AI workspace');
                }}
                title="Open full Vertex AI workspace"
                aria-label="Open full Vertex AI workspace"
              >
                <Icon name="sparkles" />
              </button>
              <button
                type="button"
                className="freddy-icon-btn"
                onClick={closePanel}
                title="Close assistant (Esc)"
                aria-label="Close assistant"
              >
                <Icon name="x" />
              </button>
            </div>
          </div>

          {/* Conversation Body */}
          <div className="freddy-panel-body">
            {/* Greeting Hero */}
            <div className="freddy-greeting-hero">
              <div className="freddy-greeting-icon">
                <Icon name="sparkles" />
              </div>
              <div className="freddy-greeting-content">
                <span className="freddy-greeting-text">
                  Hey! I'm Freddy. How can I help you with your workspace?
                </span>
                <span className="freddy-greeting-sub">
                  Connected to Alpha firmware telemetry in real time.
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="freddy-messages-list" role="log" aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`freddy-msg-row ${m.sender}`}>
                  {m.sender === 'assistant' && (
                    <div className="freddy-msg-avatar" aria-hidden="true">
                      <FreddyAvatarRender animation={animation} size={24} />
                    </div>
                  )}
                  <div className="freddy-msg-bubble">
                    <div className="freddy-msg-meta">
                      <span className="freddy-msg-sender">
                        {m.sender === 'assistant' ? 'Freddy' : 'You'}
                      </span>
                      <span className="freddy-msg-time">{m.time}</span>
                    </div>

                    <div className="freddy-msg-text">
                      {m.text.split('\n').map((line, lIdx) => (
                        <p key={lIdx}>
                          {line.split('**').map((chunk, cIdx) =>
                            cIdx % 2 === 1 ? <strong key={cIdx}>{chunk}</strong> : chunk
                          )}
                        </p>
                      ))}
                    </div>

                    {/* Interactive Action Chips */}
                    {m.actions && m.actions.length > 0 && (
                      <div className="freddy-msg-actions">
                        {m.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            type="button"
                            className="freddy-action-chip"
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
                <div className="freddy-msg-row assistant">
                  <div className="freddy-msg-avatar" aria-hidden="true">
                    <FreddyAvatarRender animation="thinking" size={24} />
                  </div>
                  <div className="freddy-msg-bubble freddy-typing-bubble">
                    <span className="freddy-typing-dot" />
                    <span className="freddy-typing-dot" />
                    <span className="freddy-typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Actions */}
            <div className="freddy-suggested-section">
              <span className="freddy-suggested-label">SUGGESTED ACTIONS</span>
              <div className="freddy-suggested-grid">
                {SUGGESTED_ACTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="freddy-suggested-btn"
                    onClick={() => handleSuggestedClick(s)}
                  >
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Composer */}
          <div className="freddy-panel-footer">
            <form
              className="freddy-composer-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                className="freddy-textarea"
                placeholder="Ask Freddy about deadlines, files, or tasks..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleComposerKeyDown}
                onFocus={() => triggerReaction('listening', 0)}
                disabled={isTyping}
                aria-label="Message Freddy Assistant"
              />
              <button
                type="submit"
                className="freddy-send-btn"
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

      {/* 2. Draggable Floating Freddy Character */}
      <div
        className={`freddy-floating-container ${isDragging ? 'is-dragging' : ''}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          left: 0,
          top: 0,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <button
          ref={buttonRef}
          type="button"
          className={`freddy-avatar-btn ${isOpen ? 'panel-open' : 'idle-float'}`}
          onKeyDown={handleButtonKeyDown}
          aria-label={isOpen ? 'Close Freddy AI assistant' : 'Open Freddy AI assistant'}
          aria-expanded={isOpen}
          aria-controls="freddy-assistant-panel"
          title="Freddy · AI Assistant (Drag to reposition, click to open)"
        >
          {/* Subtle Emerald Ambient Glow */}
          <div className="freddy-glow-ring" aria-hidden="true" />

          {/* Procedural 3D Character Avatar */}
          <div className="freddy-graphic-wrapper">
            <FreddyAvatarRender animation={animation} size={64} />
          </div>

          {/* Online Ready Badge */}
          <span className="freddy-status-badge" aria-hidden="true">
            <span className="freddy-status-dot" />
            <span className="freddy-status-ping" />
          </span>

          {/* Tooltip */}
          {!isOpen && !isDragging && (
            <div className="freddy-tooltip" role="tooltip">
              <Icon name="sparkles" />
              <span>Freddy · AI Assistant</span>
            </div>
          )}
        </button>
      </div>
    </>
  );
}
