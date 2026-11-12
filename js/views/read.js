/* Read: graded reading passages and listening drills, per level. */
import { h, jp } from '../ui/dom.js';
import { availableLevels } from '../content/loader.js';

export const title = 'Read';

export async function render(el) {
  const levels = await availableLevels().catch(() => []);
  const withReadings = levels.filter((l) => l.files && (l.files.readings || l.files.listening));
  el.append(
    h('header', { class: 'page-head' },
      h('h1', null, 'Read & listen'),
      h('p', { class: 'lede' }, 'Graded passages and listening drills built only from words and grammar you have already learned. Tap any word to see its reading and meaning.')
    ),
    withReadings.length
      ? h('ul', { class: 'path' }, withReadings.map((l) => h('li', null, h('span', { class: 'step-no is-available' }, l.id.toUpperCase()), h('div', null, h('div', { class: 'step-title' }, l.title)), h('a', { class: 'btn', href: `#/read/${l.id}` }, 'Open'))))
      : h('div', { class: 'empty' }, jp('読む', 'jp-xl'), h('p', null, 'No readings are included in this build yet. They arrive with the N5 stage, after kana.'))
  );
}
