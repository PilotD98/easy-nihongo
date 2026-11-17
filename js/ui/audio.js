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
/* iOS (especially an installed PWA) only plays speech when speak() is called
   synchronously inside the tap that requested it. Any await before it — even
   a resolved promise — can silently drop the utterance, so this is NOT async:
   when the voice list is already loaded it speaks immediately, and only waits
   for voices when there are none yet. */
let current = null; // keep a reference so the utterance isn't GC'd before onend fires
export function speak(text, { rate = null, interrupt = true, romaji = null, kanji = null } = {}) {
  if (!('speechSynthesis' in window)) return Promise.resolve(false);
  if (!voice) pickVoice();
  if (voice || speechSynthesis.getVoices().length) return speakNow(text, { rate, interrupt, romaji, kanji });
  return initAudio().then(() => speakNow(text, { rate, interrupt, romaji, kanji }));
}

function speakNow(text, { rate, interrupt, romaji, kanji }) {
  if (interrupt) speechSynthesis.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(ttsText(text, { romaji, kanji }));
    u.lang = 'ja-JP';
    if (voice) u.voice = voice;
    const r = rate ?? Number(settings.get('audioRate'));
    u.rate = Number.isFinite(r) && r > 0 ? r : 1;
    u.onend = () => { if (current === u) current = null; resolve(true); };
    u.onerror = (e) => { if (current === u) current = null; resolve(e?.error === 'interrupted' || e?.error === 'canceled'); };
    current = u;
    speechSynthesis.speak(u);
    // Safari sometimes leaves the engine paused after a cancel(); nudge it.
    if (speechSynthesis.paused) speechSynthesis.resume();
  });
}

export function stopSpeaking() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
