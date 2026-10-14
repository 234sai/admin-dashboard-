import React from 'react';
import Icon from '../components/Icon';
import SpotlightCard from '../components/SpotlightCard';
import { dhm } from '../utils/time';

export default function VaultPage({
  isReleased,
  onToggleRelease,
  releaseAt,
  serverTime,
  onOpenDownloadModal,
  onToast,
}) {
  const [unlockedClass, setUnlockedClass] = React.useState(isReleased);

  React.useEffect(() => {
    if (isReleased) {
      const timer = setTimeout(() => setUnlockedClass(true), 450);
      return () => clearTimeout(timer);
    } else {
      setUnlockedClass(false);
    }
  }, [isReleased]);

  return (
    <>
      <div className="head rise">
        <div>
          <h1>Vault</h1>
          <p className="sub">
            Confidential files unlock inside a release window. No file has a direct URL.
          </p>
        </div>
        <div className="acts">
          <button className="btn out" onClick={onToggleRelease}>
            <Icon name="clock" />
            {isReleased ? 'Reset release' : 'Simulate release'}
          </button>
        </div>
      </div>

      <SpotlightCard className="card rise" style={{ '--i': 1 }}>
        <div className="list">
          <div className="row">
            <div className="fi">
              <Icon name="file" />
            </div>
            <div className="grow">
              <b>Alpha_schematic_v3.pdf</b>
              <small>4.2 MB · Available until 31 Oct, 18:00</small>
            </div>
            <button
              className="btn pri sm"
              onClick={() => onOpenDownloadModal('Alpha_schematic_v3.pdf')}
            >
              <Icon name="download" />
              Download
            </button>
          </div>

          <div className={`row ${isReleased ? 'pre' : ''} ${unlockedClass ? 'unlocked' : ''}`}>
            <div className="fi">
              <Icon name={isReleased ? 'file' : 'lock'} />
            </div>
            <div className="grow">
              <b className="mask">motor_ctrl_codebase.zip</b>
              <small>
                {isReleased
                  ? '86 MB · Released. Available until 31 Oct, 18:00'
                  : `Unlocks on 20 Oct, 10:00 IST · in ${dhm(Math.max(0, releaseAt - serverTime))}`}
              </small>
            </div>
            {isReleased ? (
              <button
                className="btn pri sm"
                onClick={() => onOpenDownloadModal('motor_ctrl_codebase.zip')}
              >
                <Icon name="download" />
                Download
              </button>
            ) : (
              <button
                className="btn out sm"
                onClick={() => onToast('423 Locked. This file is not released yet.', 'bad')}
              >
                <Icon name="lock" />
                Locked
              </button>
            )}
          </div>

          <div className="row">
            <div className="fi">
              <Icon name="file" />
            </div>
            <div className="grow">
              <b>Q2_brief.docx</b>
              <small>Window closed 10 Oct, 18:00</small>
            </div>
            <span className="pill bad">Expired</span>
          </div>
        </div>
      </SpotlightCard>

      <div className="banner good rise" style={{ '--i': 2 }}>
        <Icon name="shield" />
        Each download uses a signed link that works for 300 seconds, then returns HTTP 410 Gone.
      </div>
    </>
  );
}
