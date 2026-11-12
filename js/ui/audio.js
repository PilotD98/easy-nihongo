/* Text-to-speech wrapper around the Web Speech API (speechSynthesis).
   Uses an installed ja-JP voice; falls back gracefully if none exists. */
import { settings } from '../store/settings.js';
import { japaneseVoices, waitForVoices } from '../util/platform.js';

let voice = null;
let ready = null;

const PREFERRED = [/google 日本語/i, /kyoko/i, /o-ren/i, /nanami/i, /ayumi/i, /haruka/i, /microsoft .* japan/i];

export function initAudio() {
  if (ready) return ready;
  ready = waitForVoices().then(() => {
    const voices = japaneseVoices();
    voice = PREFERRED.map((re) => voices.find((v) => re.test(v.name))).find(Boolean) || voices[0] || null;
    return !!voice;
  });
  return ready;
}

export function canSpeak() { return 'speechSynthesis' in window && !!voice; }

/** Speak Japanese text. Returns a promise that resolves when playback ends. */
export async function speak(text, { rate = null, interrupt = true } = {}) {
  await initAudio();
  if (!('speechSynthesis' in window)) return false;
  if (interrupt) speechSynthesis.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    if (voice) u.voice = voice;
    u.rate = rate ?? Number(settings.get('audioRate')) ?? 1;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    speechSynthesis.speak(u);
  });
}

export function stopSpeaking() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
