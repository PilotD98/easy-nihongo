/* Self-check recording with MediaRecorder. Recordings live in memory for the
   session only (object URLs) and never leave the device. */

export function recordingSupported() {
  return typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
}

function pickMime() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/ogg'];
  return types.find((t) => MediaRecorder.isTypeSupported?.(t)) || '';
}

/**
 * startRecording() -> { stop(): Promise<{ blob, url, duration }> }
 * Throws if the microphone is unavailable or blocked.
 */
export async function startRecording({ maxMs = 20000 } = {}) {
  if (!recordingSupported()) throw new Error('Recording is not supported in this browser.');
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mime = pickMime();
  const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
  const chunks = [];
  const startedAt = Date.now();
  rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  const done = new Promise((resolve) => {
    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: rec.mimeType || mime || 'audio/webm' });
      resolve({ blob, url: URL.createObjectURL(blob), duration: Date.now() - startedAt });
    };
  });
  rec.start();
  const timer = setTimeout(() => { if (rec.state === 'recording') rec.stop(); }, maxMs);
  return {
    stop() { clearTimeout(timer); if (rec.state === 'recording') rec.stop(); return done; },
    get state() { return rec.state; }
  };
}

export function micErrorMessage(err) {
  const n = err?.name || '';
  if (n === 'NotAllowedError' || n === 'SecurityError') return 'Microphone access was blocked. Allow the microphone for this site and try again.';
  if (n === 'NotFoundError' || n === 'DevicesNotFoundError') return 'No microphone was found on this device.';
  if (n === 'NotReadableError') return 'The microphone is in use by another app.';
  return err?.message || 'Could not start recording.';
}
