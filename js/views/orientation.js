/* Stage 0: how Japanese works. Short, visual, with romaji under every example. */
import { h, append, icon, jp, ruby } from '../ui/dom.js';
import { loadLevel } from '../content/loader.js';
import { markOrientationDone, orientationDone } from '../content/kana.js';
import { speak, canSpeak, initAudio } from '../ui/audio.js';

export const title = 'Orientation';

const SCRIPT_CLASS = { hiragana: 'ex-hira', katakana: 'ex-kata', kanji: 'ex-kanji', topic: 'ex-topic', object: 'ex-object', verb: 'ex-verb' };

export async function render(el) {
  const level = await loadLevel('orientation');
  const o = level.data.orientation;
  const done = await orientationDone();
  await initAudio();

  append(el, [
    h('header', { class: 'page-head' }, h('h1', null, o.title), h('p', { class: 'lede' }, `Stage 0 · about ${o.minutes} minutes · read once, come back any time.`)),
    o.sections.map((s) => h('section', { class: 'card', 'aria-labelledby': `o-${s.id}` },
      h('h2', { id: `o-${s.id}` }, s.title),
      s.body.map((p) => h('p', null, p)),
      s.example ? example(s.example) : null
    )),
    h('div', { class: 'card card-accent' },
      h('p', null, done ? 'You have completed Orientation.' : 'That is all the theory you need for now. Everything else is learned by doing.'),
      h('div', { class: 'btn-row' },
        h('a', { class: 'btn btn-primary btn-lg', href: '#/lesson/kana/h-a', onClick: () => markOrientationDone() }, 'Start hiragana: あ row'),
        done ? null : h('button', { class: 'btn', type: 'button', onClick: async () => { await markOrientationDone(); location.hash = '#/learn'; } }, 'Mark as read')
      )
    )
  ]);
}

function example(ex) {
  const box = h('div', { class: 'example' });
  if (ex.parts) {
    const line = h('div', { class: 'jp jp-xl ex-line', lang: 'ja' }, ex.parts.map(([text, cls]) => h('span', { class: SCRIPT_CLASS[cls] || '', title: cls }, text)));
    box.append(line, h('div', { class: 'ex-legend' }, [...new Set(ex.parts.map((p) => p[1]))].map((k) => h('span', { class: `pill ${SCRIPT_CLASS[k] || ''}` }, k))));
  } else if (ex.beats) {
    box.append(h('div', { class: 'ex-beats', lang: 'ja' }, ex.beats.map((b) => h('span', { class: 'ex-beat jp' }, b))));
  } else {
    box.append(jp(ex.jp, 'jp-xl ex-line'));
  }
  box.append(h('div', { class: 'ex-romaji' }, ex.romaji), h('div', { class: 'muted' }, ex.en));
  if (canSpeak() && ex.jp) box.append(h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Listen', onClick: () => speak(ex.jp.replace(/→.*/, '')) }, icon('speak')));
  return box;
}
