import React, { useState, useEffect, useRef } from 'react';
import SvgSymbols from './components/SvgSymbols';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AppearancePopover from './components/AppearancePopover';
import ToastContainer from './components/ToastContainer';
import ExtensionPassModal from './components/Modals/ExtensionPassModal';
import DownloadModal from './components/Modals/DownloadModal';
import KillScreen from './components/Modals/KillScreen';
import SubmissionDetailPanel from './components/SubmissionDetailPanel';
import FloatingFreddyAssistant from './components/FloatingFreddyAssistant';

// Pages
import DashboardPage from './pages/DashboardPage';
import UploadsPage from './pages/UploadsPage';
import VaultPage from './pages/VaultPage';
import ChatPage from './pages/ChatPage';
import AlertsPage from './pages/AlertsPage';
import AdminOverviewPage from './pages/AdminOverviewPage';
import AdminSubmissionsPage from './pages/AdminSubmissionsPage';
import AdminSecurityPage from './pages/AdminSecurityPage';

import { now, fmtT, save, load } from './utils/time';

export default function App() {
  // Global App State
  const [role, setRole] = useState('emp'); // 'emp' | 'adm'
  const [page, setPage] = useState('dash'); // 'dash', 'uploads', 'vault', 'chat', 'alerts', 'adash', 'subs', 'sec'
  const [mode, setMode] = useState('hard'); // 'hard' | 'soft'
  const [deadline, setDeadline] = useState(() => now() + ((2 * 60 + 22) * 60 + 37) * 1000);
  const [releaseAt] = useState(() => now() + (6 * 86400 + 4 * 3600 + 12 * 60) * 1000);
  const [isReleased, setIsReleased] = useState(false);
  const [uploadCount, setUploadCount] = useState(16);
  const [seq, setSeq] = useState(20418);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Appearance State
  const [accent, setAccent] = useState(() => load('hv-accent') || 'forest');
  const [theme, setTheme] = useState(() => load('hv-theme') || 'system');
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals & Panels
  const [activeModal, setActiveModal] = useState(null); // 'pass' | 'download' | 'kill' | null
  const [downloadTargetFile, setDownloadTargetFile] = useState('');
  const [selectedSubmissionIdx, setSelectedSubmissionIdx] = useState(null);

  // Time & Clock
  const [serverTime, setServerTime] = useState(() => now());

  // Alerts State
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      tier: 'red',
      title: 'Alpha firmware upload closes today',
      body: 'Hard lockout applies. Files sent after the deadline are rejected with HTTP 423.',
      time: '16:02',
      read: false,
    },
    {
      id: 2,
      tier: 'blue',
      title: 'Code review approved on motor-ctrl',
      body: 'Ravi Kumar approved your pull request. Merge when ready.',
      time: '15:41',
      read: false,
    },
    {
      id: 3,
      tier: 'green',
      title: 'Town hall on Friday, 11:00',
      body: 'Mandatory broadcast. Acknowledge to confirm you have read it.',
      time: '12:10',
      read: false,
      ack: true,
    },
    {
      id: 4,
      tier: 'blue',
      title: 'Q2 brief expired from the vault',
      body: 'The release window closed on 10 Oct.',
      time: 'Yesterday',
      read: true,
    },
  ]);

  // Submissions State
  const [subs, setSubs] = useState([
    { n: 'Ravi Kumar', ts: '17:41:08.412', h: '9f3a1c4e…b72e', st: 'On time', g: 'A' },
    { n: 'Meera Shah', ts: '18:29:59.870', h: 'c41d92aa…07aa', st: 'On time', g: '' },
    { n: 'Priya Nair', ts: '17:12:44.301', h: '7be0aa31…19cd', st: 'On time', g: 'B' },
    { n: 'Sana Iqbal', ts: '18:02:51.774', h: 'e2c8f1b0…5a40', st: 'On time', g: '' },
    { n: 'Kiran Rao', ts: '18:30:00.004', h: '03aa9e72…cc12', st: 'Late +4 ms', g: '' },
    { n: 'Arun Prasad', ts: '18:31:02.115', h: '51be7d09…e903', st: 'Late +1 m', g: '' },
    { n: 'Dev Thomas', ts: '—', h: '—', st: 'Missing', g: '' },
  ]);
  const [subsFilter, setSubsFilter] = useState('All');

  // Defaulters State
  const [defaulters, setDefaulters] = useState([
    { n: 'Dev Thomas', why: 'Missed upload, Alpha firmware', st: 0 },
    { n: 'Nisha Verma', why: 'Missed mandatory download, Q2 brief', st: 0 },
    { n: 'Omar Haq', why: 'Missed upload, Motor control spec', st: 0 },
    { n: 'Lena George', why: 'Late upload, penalty pending', st: 0 },
  ]);

  // Security State
  const [incidents, setIncidents] = useState([
    {
      t: 'Yesterday 21:14',
      who: 'Test account (Employee)',
      what: 'GET /admin/submissions',
      res: '403, session revoked',
    },
    {
      t: '12 Oct 09:02',
      who: 'Unknown IP 103.21.x.x',
      what: 'Five failed MFA codes',
      res: 'Account locked 15 min',
    },
  ]);
  const [alertsSec, setAlertsSec] = useState(2);
  const [logins] = useState([
    ['Admin Rhea Menon', 'Chennai', 'MFA ok', '14:02:11'],
    ['Admin Rhea Menon', 'Chennai', 'Password ok', '14:01:48'],
    ['Ravi Kumar', 'Bengaluru', 'Employee login', '13:55:09'],
    ['Meera Shah', 'Coimbatore', 'Employee login', '13:40:32'],
    ['Unknown', '103.21.x.x', 'Failed MFA ×5', '12 Oct 09:02'],
  ]);

  // Chat State
  const [chatChan, setChatChan] = useState(0);
  const [chatTab, setChatTab] = useState('team');
  const [chatMessages, setChatMessages] = useState([
    { who: 'Ravi Kumar', t: '16:02', txt: 'UART fix is merged. Can someone test on the bench board?' },
    { who: 'Meera Shah', t: '16:04', txt: 'Running it now.', code: 'assign led_en = en & ~rst_n;' },
    { me: 1, t: '16:05', txt: 'I will upload the build before the deadline.', seen: 'Seen 16:05' },
  ]);
  const [botMessages, setBotMessages] = useState([
    { bot: 1, txt: 'Hi, I can answer questions about your deadlines, downloads and company policy.' },
  ]);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, kind = '') => {
    const id = Date.now() + Math.random();
    const newToast = { id, msg, kind, exiting: false };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 350);
    }, 3400);
  };

  // Portal computation
  const computePortal = (t, dl, m) => {
    return t < dl ? 'open' : m === 'hard' ? 'closed' : 'late';
  };

  const portalState = computePortal(serverTime, deadline, mode);
  const prevPortalRef = useRef(portalState);

  // Server clock ticking
  useEffect(() => {
    const interval = setInterval(() => {
      const current = now();
      setServerTime(current);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Monitor portal state changes for toast notifications
  useEffect(() => {
    if (prevPortalRef.current !== portalState) {
      const prev = prevPortalRef.current;
      prevPortalRef.current = portalState;

      if (prev) {
        if (portalState === 'closed') {
          addToast('Upload portal closed. Server returns HTTP 423.', 'bad');
        } else if (portalState === 'late') {
          addToast('Deadline passed. Soft lockout: late files are flagged.');
        } else {
          addToast('Upload portal is open again.');
        }
      }
    }
  }, [portalState]);

  // Apply theme & accent
  useEffect(() => {
    if (accent) {
      document.documentElement.dataset.accent = accent;
      save('hv-accent', accent);
    }
  }, [accent]);

  useEffect(() => {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.dataset.theme = theme;
    }
    save('hv-theme', theme);
  }, [theme]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
        setSelectedSubmissionIdx(null);
        setIsAppearanceOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation & Role switcher
  const navigateTo = (targetPage) => {
    setSelectedSubmissionIdx(null);
    setIsAppearanceOpen(false);
    if (targetPage === 'ai' || targetPage === 'vertex-ai') {
      setChatTab('bot');
      setPage('chat');
    } else if (targetPage === 'chat') {
      setChatTab('team');
      setPage('chat');
    } else {
      setPage(targetPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    navigateTo(newRole === 'adm' ? 'adash' : 'dash');
  };

  // Fast forward / Reset deadline
  const handleFastForward = () => {
    setDeadline(now() + 6000);
    addToast('Deadline set to 6 seconds from server time.');
  };

  const handleResetDeadline = () => {
    setDeadline(now() + ((2 * 60 + 22) * 60 + 37) * 1000);
    addToast('Deadline reset to 2 h 22 m.');
  };

  // Upload actions
  const handleAddUpload = (item) => {
    if (item.done) {
      const nextSeq = seq + 1;
      setSeq(nextSeq);
      const receiptId = `A-${nextSeq}`;
      const completedItem = { ...item, receiptId };

      setUploadedFiles((prev) => [completedItem, ...prev.filter((x) => x.id !== item.id)]);
      setUploadCount((c) => c + 1);

      const isLate = portalState !== 'open';
      const lateMinutes = Math.max(1, Math.round((item.completedAt - deadline) / 60000));
      const statusText = isLate ? `Late +${lateMinutes} m` : 'On time';

      setSubs((prev) => [
        {
          n: 'K. Hitesh Laahiri',
          ts: completedItem.ts,
          h: completedItem.hash ? `${completedItem.hash.slice(0, 8)}…${completedItem.hash.slice(-4)}` : '—',
          st: statusText,
          g: '',
        },
        ...prev,
      ]);

      addToast(`Upload received. Receipt ${receiptId}`);
    } else {
      setUploadedFiles((prev) => {
        const exists = prev.find((x) => x.id === item.id);
        if (exists) {
          return prev.map((x) => (x.id === item.id ? item : x));
        }
        return [item, ...prev];
      });
    }
  };

  // Vault release
  const handleToggleRelease = () => {
    setIsReleased((r) => !r);
    addToast(
      !isReleased
        ? 'Release window opened. motor_ctrl_codebase.zip is now available.'
        : 'Release window reset.'
    );
  };

  // Extension pass
  const handleIssuePass = (employee, extraMinutes) => {
    setActiveModal(null);
    if (employee === 'me') {
      const newDl = now() + extraMinutes * 60000;
      setDeadline(newDl);
      setAlerts((prev) => [
        {
          id: Date.now(),
          tier: 'green',
          title: 'Extension pass granted',
          body: `You may upload for ${extraMinutes} more minutes.`,
          time: fmtT(now()).slice(0, 5),
          read: false,
        },
        ...prev,
      ]);
      addToast(`Pass issued. Portal reopened for ${extraMinutes} minutes.`);
    } else {
      addToast(`Pass issued to ${employee} for ${extraMinutes} minutes.`);
    }
  };

  // Alerts actions
  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const handleMarkAlertRead = (id, isAck) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
    addToast(isAck ? 'Acknowledged. Your admin can see this.' : 'Marked read');
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts((prev) =>
      prev.map((a) => (a.ack ? a : { ...a, read: true }))
    );
    addToast('Marked all non-mandatory alerts as read');
  };

  // Chat message actions
  const handleSendChatMessage = (msgObj) => {
    if (msgObj.updateSeen) {
      setChatMessages((prev) => {
        const lastMe = [...prev].reverse().find((m) => m.me);
        if (!lastMe) return prev;
        return prev.map((m) =>
          m === lastMe ? { ...m, seen: msgObj.updateSeen } : m
        );
      });
    } else {
      setChatMessages((prev) => [...prev, msgObj]);
    }
  };

  const handleSendBotMessage = (msgObj) => {
    setBotMessages((prev) => [...prev, msgObj]);
  };

  // Defaulters
  const handleRemindDefaulter = (index) => {
    setDefaulters((prev) =>
      prev.map((d, i) => (i === index ? { ...d, st: 1 } : d))
    );
    addToast(`Reminder sent to ${defaulters[index].n}`);
  };

  const handlePenaltyDefaulter = (index) => {
    setDefaulters((prev) =>
      prev.map((d, i) => (i === index ? { ...d, st: 2 } : d))
    );
    addToast(`Penalty tagged for ${defaulters[index].n}`);
  };

  // Submissions grading
  const handleSaveGrade = (index, grade) => {
    setSubs((prev) =>
      prev.map((s, i) => (i === index ? { ...s, g: grade } : s))
    );
    setSelectedSubmissionIdx(null);
    addToast(`Grade saved for ${subs[index].n}`);
  };

  // Security 403 test
  const handleSimulateUnauthorizedAccess = () => {
    addToast('403 Forbidden. /admin/deadlines', 'bad');
    setActiveModal('kill');
    setTimeout(() => {
      setActiveModal(null);
      setIncidents((prev) => [
        {
          t: `Today ${fmtT(now()).slice(0, 5)}`,
          who: 'Test account (Employee)',
          what: 'GET /admin/deadlines',
          res: '403, session revoked',
        },
        ...prev,
      ]);
      setAlertsSec((c) => c + 1);
      navigateTo('sec');
      addToast('Incident recorded in the security log');
    }, 2600);
  };

  return (
    <>
      <SvgSymbols />

      <div className={`app ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`} data-portal={portalState}>
        <Sidebar
          role={role}
          currentPage={page}
          chatTab={chatTab}
          onNavigate={navigateTo}
          unreadCount={unreadAlertsCount}
          onToast={addToast}
          onToggleAppearance={() => setIsAppearanceOpen((open) => !open)}
          isAppearanceOpen={isAppearanceOpen}
          onRoleChange={handleRoleChange}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />

        <section className="main">
          <Topbar
            role={role}
            onRoleChange={handleRoleChange}
            serverTime={serverTime}
            unreadCount={unreadAlertsCount}
            onNavigate={navigateTo}
            onToggleAppearance={() => setIsAppearanceOpen((open) => !open)}
            onToast={addToast}
          />

          <div id="view">
            {page === 'dash' && (
              <DashboardPage
                uploadCount={uploadCount}
                isReleased={isReleased}
                deadline={deadline}
                releaseAt={releaseAt}
                serverTime={serverTime}
                portalState={portalState}
                onNavigate={navigateTo}
                onFastForward={handleFastForward}
              />
            )}

            {page === 'uploads' && (
              <UploadsPage
                deadline={deadline}
                serverTime={serverTime}
                portalState={portalState}
                uploadedFiles={uploadedFiles}
                onAddUpload={handleAddUpload}
                onFastForward={handleFastForward}
                onToast={addToast}
                onNavigate={navigateTo}
              />
            )}

            {page === 'vault' && (
              <VaultPage
                isReleased={isReleased}
                onToggleRelease={handleToggleRelease}
                releaseAt={releaseAt}
                serverTime={serverTime}
                onOpenDownloadModal={(name) => {
                  setDownloadTargetFile(name);
                  setActiveModal('download');
                }}
                onToast={addToast}
              />
            )}

            {page === 'chat' && (
              <ChatPage
                chatMessages={chatMessages}
                botMessages={botMessages}
                currentChannel={chatChan}
                currentTab={chatTab}
                onTabChange={setChatTab}
                onChannelChange={setChatChan}
                onSendMessage={handleSendChatMessage}
                onSendBotMessage={handleSendBotMessage}
                onToast={addToast}
                deadline={deadline}
                portalState={portalState}
              />
            )}

            {page === 'alerts' && (
              <AlertsPage
                alerts={alerts}
                onMarkRead={handleMarkAlertRead}
                onMarkAllRead={handleMarkAllAlertsRead}
              />
            )}

            {page === 'adash' && (
              <AdminOverviewPage
                deadline={deadline}
                serverTime={serverTime}
                portalState={portalState}
                lockoutMode={mode}
                defaulters={defaulters}
                securityAlertsCount={alertsSec}
                onModeChange={(m) => {
                  setMode(m);
                  addToast(
                    m === 'hard'
                      ? 'Hard lockout: uploads stop at the deadline.'
                      : 'Soft lockout: late uploads are flagged.'
                  );
                }}
                onOpenExtensionModal={() => setActiveModal('pass')}
                onFastForward={handleFastForward}
                onResetDeadline={handleResetDeadline}
                onRemindDefaulter={handleRemindDefaulter}
                onPenaltyDefaulter={handlePenaltyDefaulter}
                onNavigate={navigateTo}
              />
            )}

            {page === 'subs' && (
              <AdminSubmissionsPage
                submissions={subs}
                filter={subsFilter}
                onFilterChange={setSubsFilter}
                onSelectSubmission={(i) => setSelectedSubmissionIdx(i)}
              />
            )}

            {page === 'sec' && (
              <AdminSecurityPage
                logins={logins}
                incidents={incidents}
                onSimulateUnauthorizedAccess={handleSimulateUnauthorizedAccess}
              />
            )}
          </div>
        </section>

        {/* Slide-out Panel for Submissions */}
        <SubmissionDetailPanel
          submission={selectedSubmissionIdx !== null ? subs[selectedSubmissionIdx] : null}
          index={selectedSubmissionIdx}
          isOpen={selectedSubmissionIdx !== null}
          onClose={() => setSelectedSubmissionIdx(null)}
          onSaveGrade={handleSaveGrade}
        />

        {/* Appearance popover */}
        {isAppearanceOpen && (
          <AppearancePopover
            accent={accent}
            theme={theme}
            onAccentChange={(a) => setAccent(a)}
            onThemeChange={(t) => setTheme(t)}
            onClose={() => setIsAppearanceOpen(false)}
          />
        )}
      </div>

      {/* Floating Freddy AI Avatar & Premium Glassmorphism Assistant (Employee Workspace) */}
      {role === 'emp' && (
        <FloatingFreddyAssistant
          portalState={portalState}
          deadline={deadline}
          serverTime={serverTime}
          isReleased={isReleased}
          releaseAt={releaseAt}
          uploadCount={uploadCount}
          uploadedFiles={uploadedFiles}
          onNavigate={navigateTo}
          onToast={addToast}
        />
      )}

      {/* Modals & Overlays */}
      {activeModal === 'pass' && (
        <ExtensionPassModal
          onClose={() => setActiveModal(null)}
          onIssuePass={handleIssuePass}
        />
      )}

      {activeModal === 'download' && (
        <DownloadModal
          fileName={downloadTargetFile}
          onClose={() => setActiveModal(null)}
          onToast={addToast}
        />
      )}

      {activeModal === 'kill' && <KillScreen />}

      {/* Global Toast Stack */}
      <ToastContainer toasts={toasts} />
    </>
  );
}
