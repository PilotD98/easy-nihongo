/* Speak: hub with capability check and the four practice modes.
   Routes: #/speak, #/speak/<setId> (session) */
import { h, append, icon, jp } from '../ui/dom.js';
import { supports, japaneseVoices, waitForVoices, osName, isIOS } from '../util/platform.js';
import { settings } from '../store/settings.js';
import { toast } from '../ui/toast.js';
import { speakingMenu, MODES } from '../content/speaking.js';
import { recognitionSupported } from '../ui/recognizer.js';
import { recordingSupported } from '../ui/recorder.js';

export const title = 'Speak';

export async function render(el, ctx) {
  if (ctx.segs[1]) { const m = await import('./speak-session.js'); return m.render(el, ctx); }

  const sup = supports();
  await waitForVoices();
  const voices = japaneseVoices();
  const sr = recognitionSupported();
  const recOk = recordingSupported();
  const allGood = voices.length > 0 && sr && recOk;

  const menu = await speakingMenu().catch(() => ({}));

  append(el, [
    h('header', { class: 'page-head' },
      h('h1', null, 'Speak'),
      h('p', { class: 'lede' }, 'Say it out loud. The app listens, compares beat by beat, and tells you exactly what to fix.')),

    !voices.length ? h('div', { class: 'notice notice-warn' }, icon('info'), h('p', null, 'No Japanese voice is installed, so examples cannot be played. See the setup steps below.')) : null,
    !sr ? h('div', { class: 'notice' }, icon('info'), h('p', null, 'This browser has no speech recognition, so practice uses record-and-compare: record yourself, play it back next to the native audio, and rate it yourself.')) : null,

    Object.entries(MODES).map(([mode, meta]) => {
      const sets = menu[mode] || [];
      return h('section', { class: 'card', 'aria-labelledby': `m-${mode}` },
        h('div', { class: 'card-title' }, h('h2', { id: `m-${mode}` }, meta.title)),
        h('p', { class: 'muted' }, meta.blurb),
        sets.length ? h('ul', { class: 'path' }, sets.map((s) => h('li', null,
          h('span', { class: `step-no ${s.unlocked ? 'is-available' : ''}`, 'aria-hidden': 'true' }, icon(meta.icon)),
          h('div', null, h('div', { class: 'step-title' }, s.title), h('div', { class: 'step-sub' }, `${s.summary} · ${(s.items || s.turns).length} ${mode === 'roleplay' ? 'lines' : 'items'} · ${s.level === 'katakana' ? 'after katakana' : 'from hiragana'}`)),
          s.unlocked ? h('a', { class: 'btn btn-primary', href: `#/speak/${encodeURIComponent(s.id)}` }, 'Start')
            : h('span', { class: 'icon lock', title: 'Unlocks with the katakana stage' }, icon('lock'))
        ))) : h('p', { class: 'small muted' }, 'No sets yet.')
      );
    }),

    h('details', { class: 'card', open: allGood ? null : true },
      h('summary', { style: { cursor: 'pointer', fontWeight: 600, minHeight: '44px', display: 'flex', alignItems: 'center' } }, allGood ? 'This browser supports everything' : 'What this browser supports'),
      h('ul', { class: 'stack', style: { listStyle: 'none', padding: 0, marginTop: '12px' } },
        cap(voices.length > 0, 'Japanese voice (text-to-speech)', voices.length ? `${voices.length} installed: ${voices.slice(0, 3).map((v) => v.name).join(', ')}${voices.length > 3 ? '…' : ''}` : sup.speechSynthesis ? 'No Japanese voice installed.' : 'No speech synthesis in this browser.'),
        cap(sr, 'Speech recognition (ja-JP)', sr ? 'Supported. Needs a network connection on most browsers.' : 'Not supported; record-and-compare is used instead.'),
        cap(recOk, 'Recording (self-check)', recOk ? 'Supported. Recordings stay in memory on this device.' : 'Not supported in this browser.')),
      h('div', { class: 'btn-row', style: { marginTop: '12px' } },
        h('button', { class: 'btn', type: 'button', disabled: !voices.length, onClick: () => testVoice(voices) }, icon('speak'), 'Test the Japanese voice'),
        h('span', { class: 'small muted' }, 'Plays ', jp('こんにちは'), ` at ${settings.get('audioRate')}× speed.`)),
      voices.length ? null : voiceGuide(),
      isIOS() ? h('p', { class: 'small muted', style: { marginTop: '12px' } }, 'On iPhone and iPad, speech recognition works in Safari and needs an internet connection. Text-to-speech and recording work offline.') : null)
  ]);
}

function cap(ok, label, detail) {
  return h('li', { class: 'row', style: { alignItems: 'flex-start' } },
    h('span', { class: 'pill', style: { background: ok ? 'var(--ok-soft)' : 'var(--warn-soft)', color: ok ? 'var(--ok)' : 'var(--warn)', flex: 'none', marginTop: '2px' } }, ok ? 'Ready' : 'Missing'),
    h('div', { class: 'grow' }, h('div', { style: { fontWeight: 500 } }, label), h('div', { class: 'small muted' }, detail)));
}

function testVoice(voices) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance('こんにちは');
    u.lang = 'ja-JP'; u.voice = voices[0]; u.rate = Number(settings.get('audioRate')) || 1;
    u.onerror = () => toast('The voice could not play. Try again or pick another voice in your system settings.');
    speechSynthesis.speak(u);
  } catch { toast('The voice could not play in this browser.'); }
}

function voiceGuide() {
  const os = osName();
  const steps = {
    ios: ['Open Settings → Accessibility → Spoken Content → Voices.', 'Choose Japanese and download a voice (for example Kyoko or O-ren).', 'Return to Easy Nihongo and reload this page.'],
    android: ['Open Settings → System → Languages & input → Text-to-speech output (the path varies by manufacturer).', 'Open the settings of your speech engine (usually Speech Services by Google) → Install voice data → Japanese.', 'Reload this page.'],
    windows: ['Open Settings → Time & Language → Language & region → Add a language → 日本語 (Japanese).', 'Tick “Text-to-speech” among the optional features and install.', 'Restart the browser. Microsoft Edge also offers higher-quality online Japanese voices.'],
    macos: ['Open System Settings → Accessibility → Spoken Content → System Voice → Manage Voices.', 'Choose Japanese and download a voice (for example Kyoko or O-ren).', 'Reload this page.'],
    linux: ['Install a Japanese voice for your speech engine (for example espeak-ng with Japanese data, or a browser with bundled voices).', 'Reload this page.'],
    other: ['Install a Japanese text-to-speech voice in your operating system, then reload this page.']
  };
  const names = { ios: 'iPhone / iPad', android: 'Android', windows: 'Windows', macos: 'macOS', linux: 'Linux', other: 'your device' };
  const order = [os, ...Object.keys(steps).filter((k) => k !== os && k !== 'other')];
  return h('div', { style: { marginTop: '12px' } },
    h('h3', null, 'Install a Japanese voice'),
    h('p', { class: 'muted' }, 'All example audio uses your device’s built-in Japanese voice, so it works offline and sends nothing anywhere.'),
    order.map((k, i) => h('details', { open: i === 0 ? true : null },
      h('summary', { style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', fontWeight: 500 } }, names[k]),
      h('ol', null, steps[k].map((s) => h('li', null, s))))));
}
