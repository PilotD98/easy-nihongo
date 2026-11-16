/* Browser and device capability detection, PWA install handling, connectivity. */

export const APP_VERSION = '0.9.0';

const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

export function isIOS() {
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
export function isAndroid() { return /Android/.test(ua); }
export function isSafari() { return /Safari/.test(ua) && !/Chrome|CriOS|Chromium|Edg/.test(ua); }
export function isStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true;
}
export function isTouch() { return navigator.maxTouchPoints > 0 || 'ontouchstart' in window; }

export function osName() {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  if (/Windows/.test(ua)) return 'windows';
  if (/Mac OS X|Macintosh/.test(ua)) return 'macos';
  if (/Linux/.test(ua)) return 'linux';
  return 'other';
}

/** Feature support map used by Speak and Settings to show honest capability notes. */
export function supports() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return {
    indexedDB: typeof indexedDB !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    dialog: typeof HTMLDialogElement !== 'undefined',
    speechSynthesis: 'speechSynthesis' in window,
    speechRecognition: !!SR,
    mediaRecorder: typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
    storageEstimate: !!navigator.storage?.estimate,
    fileSystemAccess: 'showSaveFilePicker' in window
  };
}

/** Japanese voices currently installed for speechSynthesis (may be empty until voices load). */
export function japaneseVoices() {
  if (!('speechSynthesis' in window)) return [];
  return speechSynthesis.getVoices().filter((v) => /^ja(-|_|$)/i.test(v.lang));
}
/** Resolve once the voice list is populated (Chrome fills it asynchronously). */
export function waitForVoices(timeoutMs = 1500) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) { resolve([]); return; }
    const have = speechSynthesis.getVoices();
    if (have.length) { resolve(have); return; }
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(speechSynthesis.getVoices()); } };
    speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
    setTimeout(finish, timeoutMs);
  });
}

/* ---------- Install prompt ---------- */
let deferredPrompt = null;
const installListeners = new Set();
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installListeners.forEach((fn) => fn(true));
});
window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  installListeners.forEach((fn) => fn(false));
});
export function canPromptInstall() { return !!deferredPrompt; }
export function onInstallAvailable(fn) { installListeners.add(fn); return () => installListeners.delete(fn); }
export async function promptInstall() {
  if (!deferredPrompt) return 'unavailable';
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return choice?.outcome || 'dismissed';
}

/* ---------- Connectivity ---------- */
export function isOnline() { return navigator.onLine !== false; }
export function onConnectivity(fn) {
  const on = () => fn(true), off = () => fn(false);
  window.addEventListener('online', on);
  window.addEventListener('offline', off);
  fn(isOnline());
  return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
}
