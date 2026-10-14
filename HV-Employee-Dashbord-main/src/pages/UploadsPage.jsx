import React, { useState } from 'react';
import Icon from '../components/Icon';
import TimerCard from '../components/TimerCard';
import FileUpload from '../components/FileUpload';
import SpotlightCard from '../components/SpotlightCard';
import { kb, computeSha, fmtT, now } from '../utils/time';

export default function UploadsPage({
  deadline,
  serverTime,
  portalState,
  uploadedFiles,
  onAddUpload,
  onFastForward,
  onToast,
  onNavigate,
}) {
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleProcessFiles = (files) => {
    if (portalState === 'closed') {
      triggerShake();
      onToast('423 Locked. The deadline has passed on the server.', 'bad');
      return;
    }

    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file) => {
      // Validation: 0-byte file check
      if (file.size === 0) {
        onToast(`Cannot upload empty file: ${file.name} (0 bytes)`, 'bad');
        return;
      }

      // Validation: 250 MB size cap
      if (file.size > 250 * 1024 * 1024) {
        onToast(`File exceeds 250 MB limit: ${file.name} (${kb(file.size)})`, 'bad');
        return;
      }

      const uploadItem = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: kb(file.size),
        p: 0,
        done: false,
      };

      onAddUpload(uploadItem);

      const hash = await computeSha(file);

      // Simulate network upload & hashing progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress = Math.min(100, currentProgress + 8 + Math.random() * 14);
        if (currentProgress >= 100) {
          clearInterval(interval);
          const t = now();
          const isLate = portalState !== 'open';
          const timeFormatted = `${fmtT(t)}.${String(t % 1000).padStart(3, '0')}`;

          onAddUpload({
            ...uploadItem,
            p: 100,
            done: true,
            hash,
            ts: timeFormatted,
            late: isLate,
            fileRaw: file,
            completedAt: t,
          });
        } else {
          onAddUpload({
            ...uploadItem,
            p: Math.round(currentProgress),
            done: false,
          });
        }
      }, 180);
    });
  };

  return (
    <>
      <div className="head rise">
        <div>
          <h1>Uploads</h1>
          <p className="sub">
            Alpha firmware, final build. The deadline is enforced on the server.
          </p>
        </div>
      </div>

      <div className="banner bad only-closed rise">
        <Icon name="lock" />
        <div>
          <b>Portal closed</b>
          <div style={{ fontWeight: 500 }}>
            The deadline has passed. Uploads return HTTP 423 Locked. Ask an admin
            for an extension pass.
          </div>
        </div>
      </div>

      <div className="banner warn only-late rise">
        <Icon name="alert" />
        Soft lockout. Your file will be accepted and flagged late, with a penalty.
      </div>

      <div className="bento">
        <SpotlightCard className="c8 card rise" style={{ '--i': 1 }}>
          <FileUpload
            portalState={portalState}
            uploadedFiles={uploadedFiles}
            onFilesSelected={handleProcessFiles}
            onToast={onToast}
            isShaking={isShaking}
            onTriggerShake={triggerShake}
          />
        </SpotlightCard>

        <div className="c4">
          <TimerCard
            index={2}
            deadline={deadline}
            serverTime={serverTime}
            portalState={portalState}
            onGoUploads={() => onNavigate('uploads')}
            onFastForward={onFastForward}
          />
        </div>

        <SpotlightCard className="card c12 rise" style={{ '--i': 3 }}>
          <div className="ct">
            <h2>Earlier submissions</h2>
          </div>
          <div className="list">
            <div className="row">
              <div className="fi">
                <Icon name="check" />
              </div>
              <div className="grow">
                <b>sensor_driver_v1.bin</b>
                <small className="mono">SHA-256 4d2e9a10…c7f3 · Receipt A-20371</small>
              </div>
              <span className="pill good">On time</span>
            </div>

            <div className="row">
              <div className="fi">
                <Icon name="check" />
              </div>
              <div className="grow">
                <b>bootloader_notes.pdf</b>
                <small className="mono">SHA-256 88af03bc…1e52 · Receipt A-20302</small>
              </div>
              <span className="pill good">On time</span>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </>
  );
}
