import React, { useState } from 'react';
import Icon from './Icon';
import { fmtT } from '../utils/time';

export default function Topbar({
  role,
  onRoleChange,
  serverTime,
  unreadCount,
  onNavigate,
  onToggleAppearance,
  onToast,
}) {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    const v = query.trim().toLowerCase();
    const map = {
      upload: 'uploads',
      vault: 'vault',
      download: 'vault',
      chat: 'chat',
      alert: 'alerts',
      submission: 'subs',
      security: 'sec',
    };

    const matchedKey = Object.keys(map).find((x) => v.includes(x));
    if (matchedKey) {
      const targetPage = map[matchedKey];
      const isAdminPage = ['subs', 'sec'].includes(targetPage);

      if ((role === 'adm' && isAdminPage) || (role === 'emp' && !isAdminPage)) {
        onNavigate(targetPage);
        setQuery('');
      } else {
        onToast('That page belongs to the other view');
      }
    } else {
      onToast('No match. Try uploads, vault, chat or alerts.');
    }
  };

  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false
  );

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => { });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
    }
  };

  return (
    <header className="top">
      <label className="search">
        <Icon name="search" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search uploads, vault, chat"
          autoComplete="off"
          aria-label="Search"
        />
        <kbd>Enter</kbd>
      </label>

      <div className="seg" role="group" aria-label="Demo view">
        <button
          className={role === 'emp' ? 'on' : ''}
          onClick={() => onRoleChange('emp')}
        >
          Employee
        </button>
        <button
          className={role === 'adm' ? 'on' : ''}
          onClick={() => onRoleChange('adm')}
        >
          Admin
        </button>
      </div>

      <span
        className="chip"
        title="Every deadline check uses server time. Your device clock is ignored."
      >
        <Icon name="clock" />
        <span>
          Server <b className="mono">{fmtT(serverTime)}</b> IST
        </span>
      </span>

      <button
        className="ibtn"
        onClick={() => onNavigate('alerts')}
        aria-label="Alerts"
      >
        <Icon name="bell" />
        {role === 'emp' && unreadCount > 0 && <i className="dot" />}
      </button>

      <button
        className="ibtn"
        onClick={handleToggleFullscreen}
        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        <Icon name={isFullscreen ? 'minimize' : 'maximize'} />
      </button>

      <button
        className="ibtn"
        onClick={onToggleAppearance}
        aria-label="Appearance"
      >
        <Icon name="palette" />
      </button>

      <div className="me">
        <div className="ava">{role === 'adm' ? 'RM' : 'KH'}</div>
        <div>
          <b>{role === 'adm' ? 'Rhea Menon' : 'K. Hitesh Laahiri'}</b>
          <span>
            {role === 'adm'
              ? 'Super Admin, MFA verified'
              : 'Employee, Alpha team'}
          </span>
        </div>
      </div>
    </header>
  );
}
