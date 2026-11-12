/* Speak: speaking practice. This release ships the capability check and voice
   setup guide; the practice modes arrive with the Speaking module. */
import { h, append, icon, jp } from '../ui/dom.js';
import { supports, japaneseVoices, waitForVoices, osName, isIOS } from '../util/platform.js';
import { settings } from '../store/settings.js';
import { toast } from '../ui/toast.js';

export const title = 'Speak';

export async function render(el) {
  const sup = supports();
  await waitForVoices();
  const voices = japaneseVoices();

  const rows = [
    cap(sup.speechSynthesis && voices.length > 0,
      'Japanese voice (text-to-speech)',
      voices.length ? `${voices.length} Japanese voice${voices.length === 1 ? '' : 's'} installed: ${voices.slice(0, 3).map((v) => v.name).join(', ')}${voices.length > 3 ? '…' : ''}`
        : sup.speechSynthesis ? 'No Japanese voice is installed in this browser. See the setup steps below.' : 'This browser has no speech synthesis.'),
    cap(sup.speechRecognition,
      'Speech recognition (ja-JP)',
      sup.speechRecognition ? 'Supported. Pronunciation feedback compares what you said with the target, mora by mora.' : 'Not supported here. Practice falls back to record-and-compare self-assessment.'),
    cap(sup.mediaRecorder,
      'Recording (self-check)',
      sup.mediaRecorder ? 'Supported. Recordings stay on this device.' : 'Not supported in this browser.')
  ];

  const testBtn = h('button', { class: 'btn', type: 'button', disabled: !voices.length, onClick: () => speakTest(voices) }, icon('speak'), 'Test the Japanese voice');

  append(el, [
    h('header', { class: 'page-head' },
      h('h1', null, 'Speak'),
      h('p', { class: 'lede' }, 'Repeat-after-me, shadowing, question practice and role-plays with mora-level feedback. First, make sure this device can speak Japanese.')
    ),
    h('section', { class: 'card', 'aria-labelledby': 'cap-h' },
      h('h2', { id: 'cap-h' }, 'What this browser supports'),
      h('ul', { class: 'stack', style: { listStyle: 'none', padding: 0 } }, rows),
      h('div', { class: 'btn-row', style: { marginTop: '16px' } }, testBtn,
        h('span', { class: 'small muted' }, 'Plays ', jp('こんにちは'), ` at ${settings.get('audioRate')}× speed.`))
    ),
    voices.length ? null : voiceGuide(),
    isIOS() ? h('p', { class: 'small muted' }, 'On iPhone and iPad, speech recognition works in Safari and needs an internet connection. Text-to-speech and recording work offline.') : null,
    h('div', { class: 'empty' }, jp('話す', 'jp-xl'), h('p', null, 'Practice modes are not included in this build yet. They arrive with the Speaking module, after kana.'))
  ]);
}

function cap(ok, label, detail) {
  return h('li', { class: 'row', style: { alignItems: 'flex-start' } },
    h('span', { class: `pill`, style: { background: ok ? 'var(--ok-soft)' : 'var(--warn-soft)', color: ok ? 'var(--ok)' : 'var(--warn)', flex: 'none', marginTop: '2px' } }, ok ? 'Ready' : 'Missing'),
    h('div', { class: 'grow' }, h('div', { style: { fontWeight: 500 } }, label), h('div', { class: 'small muted' }, detail))
  );
}

function speakTest(voices) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance('こんにちは');
    u.lang = 'ja-JP';
    u.voice = voices[0];
    u.rate = Number(settings.get('audioRate')) || 1;
    u.onerror = () => toast('The voice could not play. Try again or pick another voice in your system settings.');
    speechSynthesis.speak(u);
  } catch {
    toast('The voice could not play in this browser.');
  }
}

function voiceGuide() {
  const os = osName();
  const steps = {
    ios: ['Open Settings → Accessibility → Spoken Content → Voices.', 'Choose Japanese and download a voice (for example Kyoko or O-ren).', 'Return to Kotoba Path and reload this page.'],
    android: ['Open Settings → System → Languages & input → Text-to-speech output (the path varies by manufacturer).', 'Open the settings of your speech engine (usually Speech Services by Google) → Install voice data → Japanese.', 'Reload this page.'],
    windows: ['Open Settings → Time & Language → Language & region → Add a language → 日本語 (Japanese).', 'Tick “Text-to-speech” among the optional features and install.', 'Restart the browser. Microsoft Edge also offers higher-quality online Japanese voices.'],
    macos: ['Open System Settings → Accessibility → Spoken Content → System Voice → Manage Voices.', 'Choose Japanese and download a voice (for example Kyoko or O-ren).', 'Reload this page.'],
    linux: ['Install a Japanese voice for your speech engine (for example espeak-ng with Japanese data, or a browser with bundled voices).', 'Reload this page.'],
    other: ['Install a Japanese text-to-speech voice in your operating system, then reload this page.']
  };
  const names = { ios: 'iPhone / iPad', android: 'Android', windows: 'Windows', macos: 'macOS', linux: 'Linux', other: 'your device' };
  const order = [os, ...Object.keys(steps).filter((k) => k !== os && k !== 'other')];
  return h('section', { class: 'card', 'aria-labelledby': 'voice-h' },
    h('h2', { id: 'voice-h' }, 'Install a Japanese voice'),
    h('p', { class: 'muted' }, 'All example audio uses your device’s built-in Japanese voice, so it works offline and sends nothing anywhere.'),
    order.map((k, i) => h('details', { open: i === 0 ? true : null },
      h('summary', { style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', fontWeight: 500 } }, names[k]),
      h('ol', null, steps[k].map((s) => h('li', null, s)))
    ))
  );
}
