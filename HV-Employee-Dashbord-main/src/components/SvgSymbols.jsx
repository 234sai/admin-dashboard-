import React from 'react';

export default function SvgSymbols() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="i-grid" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
        </symbol>
        <symbol id="i-upload" viewBox="0 0 24 24">
          <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
        </symbol>
        <symbol id="i-download" viewBox="0 0 24 24">
          <path d="M12 4v12M7 11l5 5 5-5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
        </symbol>
        <symbol id="i-lock" viewBox="0 0 24 24">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 018 0v3" />
        </symbol>
        <symbol id="i-chat" viewBox="0 0 24 24">
          <path d="M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1H10l-5 4v-4H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
        </symbol>
        <symbol id="i-bell" viewBox="0 0 24 24">
          <path d="M6 17v-6a6 6 0 1112 0v6l2 2H4zM10 21h4" />
        </symbol>
        <symbol id="i-shield" viewBox="0 0 24 24">
          <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </symbol>
        <symbol id="i-users" viewBox="0 0 24 24">
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.8a3.5 3.5 0 010 6.4M18 14.4c2 .8 3.5 2.6 3.5 5.6" />
        </symbol>
        <symbol id="i-table" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18M9 10v10" />
        </symbol>
        <symbol id="i-alert" viewBox="0 0 24 24">
          <path d="M12 4l9 16H3z" />
          <path d="M12 10v4M12 17.5v.01" />
        </symbol>
        <symbol id="i-search" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </symbol>
        <symbol id="i-clock" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path d="M7 17L17 7M9 7h8v8" />
        </symbol>
        <symbol id="i-palette" viewBox="0 0 24 24">
          <path d="M12 3a9 9 0 100 18c1.4 0 2-1 1.5-2.2-.5-1.3.2-2.8 1.8-2.8H17a4 4 0 004-4c0-4.9-4-9-9-9z" />
          <circle cx="7.5" cy="11" r="1" />
          <circle cx="10.5" cy="7" r="1" />
          <circle cx="15" cy="7.5" r="1" />
        </symbol>
        <symbol id="i-send" viewBox="0 0 24 24">
          <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />
        </symbol>
        <symbol id="i-file" viewBox="0 0 24 24">
          <path d="M7 3h7l5 5v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
          <path d="M14 3v5h5" />
        </symbol>
        <symbol id="i-stop" viewBox="0 0 24 24">
          <rect x="7" y="7" width="10" height="10" rx="2.5" style={{ fill: 'currentColor' }} />
        </symbol>
        <symbol id="i-bot" viewBox="0 0 24 24">
          <rect x="4" y="8" width="16" height="11" rx="3" />
          <path d="M12 4v4M9 13.5v.01M15 13.5v.01" />
        </symbol>
        <symbol id="i-x" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6L6 18" />
        </symbol>
        <symbol id="i-plus" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </symbol>
        <symbol id="i-laptop" viewBox="0 0 24 24">
          <rect x="5" y="5" width="14" height="10" rx="2" />
          <path d="M3 19h18" />
        </symbol>
        <symbol id="i-maximize" viewBox="0 0 24 24">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </symbol>
        <symbol id="i-minimize" viewBox="0 0 24 24">
          <path d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M10 4v6m0 0H4m6 0L3 3m10 7h6m-6 0V4m0 6l7-7" />
        </symbol>
        <symbol id="i-sparkles" viewBox="0 0 24 24">
          <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3zM18 15l1 2.2L21.2 18l-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1 1-2.2zM6 16l.8 1.7L8.5 18l-1.7.8-.8 1.7-.8-1.7L3.5 18l1.7-.8.8-1.7z" />
        </symbol>
        <symbol id="i-open-external" viewBox="0 0 24 24">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
        </symbol>
        <symbol id="i-chevron-down" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </symbol>
        <symbol id="i-dots" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="19" cy="12" r="1.5" fill="currentColor" />
        </symbol>
        <symbol id="i-help" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
        </symbol>
        <symbol id="i-shield-check" viewBox="0 0 24 24">
          <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </symbol>
        <symbol id="i-code" viewBox="0 0 24 24">
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </symbol>
        <symbol id="i-lightning" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </symbol>
        <symbol id="i-vertex-logo" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="6" fill="#10b981" />
          <path d="M13 6L7 13h5l-1 5 6-7h-5l1-5z" fill="#041b12" />
        </symbol>
        <symbol id="i-paperclip" viewBox="0 0 24 24">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
        </symbol>
        <symbol id="i-headphones" viewBox="0 0 24 24">
          <path d="M3 18v-6a9 9 0 0118 0v6" />
          <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
        </symbol>
        <symbol id="i-folder" viewBox="0 0 24 24">
          <path d="M3 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" />
        </symbol>
        <symbol id="i-sliders" viewBox="0 0 24 24">
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
        </symbol>
        <symbol id="i-menu" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </symbol>
        <symbol id="i-chevron-left" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </symbol>
        <symbol id="i-chevron-right" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </symbol>
        <symbol id="i-copy" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </symbol>
        <symbol id="i-reset" viewBox="0 0 24 24">
          <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </symbol>
      </defs>
    </svg>
  );
}
