import React, { useRef, useState, useCallback } from 'react';
import Icon from './Icon';
import { kb } from '../utils/time';

/**
 * Aceternity UI GridPattern Component
 * Generates an animated, responsive grid of alternating subtle cells
 * masked with a radial gradient for a high-tech glowing look.
 */
export function GridPattern() {
  const columns = 38;
  const rows = 9;

  return (
    <div className="file-upload-grid" aria-hidden="true">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={`grid-row-${row}`} className="file-upload-grid-row">
          {Array.from({ length: columns }).map((_, col) => {
            const index = row * columns + col;
            const isHighlighted = (row + col) % 5 === 0;
            return (
              <div
                key={`grid-cell-${col}-${row}`}
                className={`file-upload-grid-cell ${
                  index % 2 === 0 ? 'cell-even' : 'cell-odd'
                } ${isHighlighted ? 'cell-accent' : ''}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

/**
 * File Extension Badge Helper
 */
function getFileExtension(filename) {
  if (!filename) return 'FILE';
  const parts = filename.split('.');
  if (parts.length <= 1) return 'FILE';
  const ext = parts.pop().toUpperCase();
  return ext.length > 5 ? ext.slice(0, 4) : ext;
}

/**
 * Aceternity UI Animated FileUpload Component
 * Features:
 * - Animated grid background with radial spotlight mask
 * - Drag-and-drop with spring hover and drag-active glow
 * - Full integration with HV VERTEX deadline lockout, SHA-256 calculation, and submission receipts
 * - File validation (0-byte check, 250 MB size cap, multiple files)
 * - Selected-file preview cards with real-time progress bar, hash display, copy button, and receipt confirmation
 */
export default function FileUpload({
  portalState = 'open',
  uploadedFiles = [],
  onFilesSelected,
  onToast,
  maxFileSize = 250 * 1024 * 1024, // 250 MB
  isShaking = false,
  onTriggerShake,
}) {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [copiedHashId, setCopiedHashId] = useState(null);
  const dragCounterRef = useRef(0);

  const isClosed = portalState === 'closed';

  const handleOpenPicker = () => {
    if (isClosed) {
      if (onTriggerShake) onTriggerShake();
      if (onToast) onToast('423 Locked. The deadline has passed on the server.', 'bad');
      return;
    }
    fileInputRef.current?.click();
  };

  const validateAndDispatchFiles = useCallback(
    (fileList) => {
      if (isClosed) {
        if (onTriggerShake) onTriggerShake();
        if (onToast) onToast('423 Locked. The deadline has passed on the server.', 'bad');
        return;
      }

      if (!fileList || fileList.length === 0) {
        if (onToast) onToast('No files detected in drop.', 'bad');
        return;
      }

      const rawFiles = Array.from(fileList);
      const validFiles = [];

      for (const file of rawFiles) {
        // Validation 1: 0-byte file check
        if (file.size === 0) {
          if (onToast) onToast(`Cannot upload empty file: ${file.name} (0 bytes)`, 'bad');
          continue;
        }

        // Validation 2: Max file size limit
        if (file.size > maxFileSize) {
          if (onToast) {
            onToast(
              `File exceeds 250 MB limit: ${file.name} (${kb(file.size)})`,
              'bad'
            );
          }
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length > 0 && onFilesSelected) {
        onFilesSelected(validFiles);
      }
    },
    [isClosed, maxFileSize, onFilesSelected, onToast, onTriggerShake]
  );

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndDispatchFiles(e.dataTransfer.files);
    } else {
      if (onToast) onToast('Invalid drop. Please drag and drop valid files.', 'bad');
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndDispatchFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenPicker();
    }
  };

  const handleCopyHash = async (id, hashText) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(hashText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = hashText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedHashId(id);
      if (onToast) onToast('SHA-256 hash copied to clipboard');
      setTimeout(() => setCopiedHashId(null), 2200);
    } catch {
      if (onToast) onToast('Failed to copy hash to clipboard', 'bad');
    }
  };

  return (
    <div className="aceternity-file-upload-wrapper">
      {/* Interactive Dropzone Card */}
      <div
        className={`file-upload-dropzone ${isDragActive ? 'is-drag-active' : ''} ${
          isShaking ? 'shake' : ''
        } ${isClosed ? 'is-closed' : ''}`}
        onClick={handleOpenPicker}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={
          isClosed
            ? 'File upload locked. The deadline has passed.'
            : 'Click or press Enter to upload firmware deliverables, or drag and drop files here.'
        }
      >
        {/* Background Animated Grid Pattern */}
        <div className="file-upload-grid-mask">
          <GridPattern />
        </div>

        {/* Radial Ambient Glow */}
        <div className="file-upload-spotlight" aria-hidden="true" />

        {/* Central Content Card */}
        <div className="file-upload-central-card">
          <div className="file-upload-icon-orb">
            <Icon name={isClosed ? 'lock' : isDragActive ? 'check' : 'upload'} />
          </div>

          <div className="file-upload-text-group">
            <h3 className="file-upload-title">
              {isClosed ? (
                'Uploads are locked'
              ) : isDragActive ? (
                'Drop deliverables here'
              ) : (
                'Drop firmware files here, or browse'
              )}
            </h3>

            <p className="file-upload-desc">
              {isClosed ? (
                'Server returned HTTP 423. Contact your project lead for an extension pass.'
              ) : (
                <>
                  <span>Supports .bin, .hex, .zip, .elf, and engineering deliverables</span>
                  <span className="file-upload-spec"> · Up to 250 MB · Multi-file supported</span>
                </>
              )}
            </p>
          </div>

          {!isClosed && (
            <div className="file-upload-cta-pill">
              <Icon name="plus" />
              <span>{isDragActive ? 'Release to upload' : 'Select deliverables'}</span>
            </div>
          )}
        </div>

        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          multiple
          className="file-upload-hidden-input"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* Selected & Uploaded File Preview Cards Section */}
      {uploadedFiles && uploadedFiles.length > 0 && (
        <div className="file-previews-container" aria-label="Selected file deliverables">
          <div className="file-previews-header">
            <h4>Active & Completed Deliverables ({uploadedFiles.length})</h4>
            <span className="file-previews-count-badge">
              {uploadedFiles.filter((f) => f.done).length} verified
            </span>
          </div>

          <div className="file-previews-list">
            {uploadedFiles.map((file) => {
              const ext = getFileExtension(file.name);
              const isDone = file.done === true;
              const isLate = file.late === true;
              const hasReceipt = Boolean(file.receiptId);

              return (
                <div
                  key={file.id}
                  className={`file-preview-card ${isDone ? 'is-verified' : 'is-processing'}`}
                >
                  <div className="file-preview-header-row">
                    <div className="file-type-badge-box" aria-label={`File type ${ext}`}>
                      <span className="file-type-text">{ext}</span>
                    </div>

                    <div className="file-preview-meta">
                      <b className="file-preview-name" title={file.name}>
                        {file.name}
                      </b>
                      <div className="file-preview-sub">
                        <span className="file-preview-size">{file.size}</span>
                        {isDone && file.ts && (
                          <span className="file-preview-timestamp"> · {file.ts} IST</span>
                        )}
                      </div>
                    </div>

                    <div className="file-preview-status-box">
                      {isDone ? (
                        <span className={`pill ${isLate ? 'warn' : 'good'}`}>
                          <Icon name={isLate ? 'alert' : 'check'} />
                          {isLate ? 'Late' : 'On time'}
                        </span>
                      ) : (
                        <span className="pill mute file-progress-pill">
                          <span className="upload-pulse-dot" />
                          Hashing {file.p}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Indicator (While processing/hashing) */}
                  {!isDone && (
                    <div className="file-progress-wrapper" aria-live="polite">
                      <div className="file-progress-track">
                        <div
                          className="file-progress-fill"
                          style={{ width: `${file.p}%` }}
                        >
                          <div className="file-progress-shimmer" />
                        </div>
                      </div>
                      <div className="file-progress-status-text">
                        <span>Simulating SHA-256 computation & server receipt</span>
                        <span className="mono">{file.p}%</span>
                      </div>
                    </div>
                  )}

                  {/* Receipt & Cryptographic Verification Details (When verified) */}
                  {isDone && (
                    <div className="file-receipt-container">
                      <div className="receipt-meta-grid">
                        <div className="receipt-meta-cell">
                          <span className="receipt-label">Receipt ID</span>
                          <span className="receipt-val mono highlight">
                            {hasReceipt ? file.receiptId : 'Pending receipt…'}
                          </span>
                        </div>

                        <div className="receipt-meta-cell">
                          <span className="receipt-label">Server Timestamp</span>
                          <span className="receipt-val mono">
                            {file.ts ? `${file.ts} IST` : '—'}
                          </span>
                        </div>

                        <div className="receipt-meta-cell full-width">
                          <div className="receipt-hash-header">
                            <span className="receipt-label">SHA-256 Digest</span>
                            <button
                              type="button"
                              className="copy-hash-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyHash(file.id, file.hash);
                              }}
                              title="Copy SHA-256 hash"
                              aria-label="Copy SHA-256 hash"
                            >
                              <Icon name="copy" />
                              <span>{copiedHashId === file.id ? 'Copied!' : 'Copy Hash'}</span>
                            </button>
                          </div>
                          <span className="receipt-hash-value mono">
                            {file.hash || 'Computing…'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
