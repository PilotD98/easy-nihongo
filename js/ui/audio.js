/* Text-to-speech wrapper around the Web Speech API (speechSynthesis).
   Uses an installed ja-JP voice; falls back gracefully if none exists. */
import { settings } from '../store/settings.js';
import { japaneseVoices, waitForVoices } from '../util/platform.js';
import { ttsText } from '../engine/speech-text.js';

let voice = null;
let ready = null;

/* Higher-quality voices first: premium/enhanced downloads, then the natural
   system voices, then whatever else is installed. */
const PREFERRED = [/premium/i, /enhanced/i, /o-ren/i, /kyoko/i, /google 日本語/i, /nanami/i, /keita/i, /ayumi/i, /haruka/i, /ichiro/i, /hattori/i, /microsoft .* japan/i];

/** Installed Japanese voices, best first. */
export function rankedVoices() {
  const voices = japaneseVoices();
  const rank = (v) => { const i = PREFERRED.findIndex((re) => re.test(v.name)); return i < 0 ? PREFERRED.length : i; };
  return [...voices].sort((a, b) => rank(a) - rank(b) || (b.localService ? 1 : 0) - (a.localService ? 1 : 0));
}

function pickVoice() {
  const want = settings.get('voice');
  const ranked = rankedVoices();
  voice = (want && ranked.find((v) => v.name === want)) || ranked[0] || null;
  return voice;
}
window.addEventListener('kp:settings', (e) => { if (e.detail?.key === 'voice') pickVoice(); });

export function initAudio() {
  if (ready) return ready;
  ready = waitForVoices().then(() => {
    return !!pickVoice();
  });
  return ready;
}

export function canSpeak() { return 'speechSynthesis' in window && !!voice; }

/** Current voice (or null). */
export function currentVoice() { return voice; }

/**
 * Speak Japanese text. Returns a promise that resolves when playback ends.
 * Pass the line's `romaji` (to read particle は/へ as wa/e in kana text) and,
 * when there is one, its `kanji` spelling, which the engine reads most naturally.
 */
export async function speak(text, { rate = null, interrupt = true, romaji = null, kanji = null } = {}) {
  await initAudio();
  if (!('speechSynthesis' in window)) return false;
  if (interrupt) speechSynthesis.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(ttsText(text, { romaji, kanji }));
    u.lang = 'ja-JP';
    if (voice) u.voice = voice;
    u.rate = rate ?? Number(settings.get('audioRate')) ?? 1;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    speechSynthesis.speak(u);
  });
}

export function stopSpeaking() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
