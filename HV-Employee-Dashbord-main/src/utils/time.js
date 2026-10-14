export const OFFSET = 37000;

export const now = () => Date.now() + OFFSET;

export const pad = (n) => String(n).padStart(2, '0');

export const fmtT = (t) =>
  new Date(t).toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
  });

export const hms = (ms) => {
  if (ms <= 0) return '00:00:00';
  const s = Math.floor(ms / 1000);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
};

export const dhm = (ms) => {
  if (ms <= 0) return '0d 00h 00m';
  const m = Math.floor(ms / 60000);
  return `${Math.floor(m / 1440)}d ${pad(Math.floor(m / 60) % 24)}h ${pad(m % 60)}m`;
};

export const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  }[c]));

export const save = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch (e) {
    // ignore
  }
};

export const load = (k) => {
  try {
    return localStorage.getItem(k);
  } catch (e) {
    return null;
  }
};

export const kb = (n) => {
  if (n > 1048576) return (n / 1048576).toFixed(1) + ' MB';
  return Math.max(1, Math.round(n / 1024)) + ' KB';
};

export const rid = (n) => {
  const a = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < n; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
};

export async function computeSha(file) {
  try {
    const b = await file.arrayBuffer();
    const d = await crypto.subtle.digest('SHA-256', b);
    return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return rid(64);
  }
}
