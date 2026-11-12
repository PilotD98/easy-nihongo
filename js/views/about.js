/* About & credits. Every open-licensed source used by the app is listed here
   and in README.md, with its license. */
import { h, jp } from '../ui/dom.js';
import { APP_VERSION } from '../util/platform.js';

export const title = 'About';

const SOURCES = [
  { name: 'Noto Sans JP, Noto Serif JP', use: 'Japanese typefaces', license: 'SIL Open Font License 1.1', url: 'https://fonts.google.com/noto', status: 'in use' },
  { name: 'KanjiVG', use: 'Kana and kanji stroke-order diagrams', license: 'CC BY-SA 3.0', url: 'https://kanjivg.tagaini.net/', status: 'from the Hiragana stage' },
  { name: 'KANJIDIC2 (EDRDG)', use: 'Kanji readings, meanings, stroke counts', license: 'EDRDG licence (CC BY-SA 4.0)', url: 'https://www.edrdg.org/wiki/index.php/KANJIDIC_Project', status: 'from the N5 stage' },
  { name: 'JMdict/EDICT (EDRDG)', use: 'Vocabulary readings and meanings', license: 'EDRDG licence (CC BY-SA 4.0)', url: 'https://www.edrdg.org/jmdict/j_jmdict.html', status: 'from the N5 stage' },
  { name: 'Tatoeba', use: 'Example sentences', license: 'CC BY 2.0 FR', url: 'https://tatoeba.org/', status: 'from the N5 stage' }
];

export async function render(el) {
  el.append(
    h('header', { class: 'page-head' }, h('h1', null, 'About Kotoba Path'), h('p', { class: 'lede' }, jp('言葉の道'), ' — “the path of words”. Version ', APP_VERSION, '.')),
    h('section', { class: 'card' },
      h('h2', null, 'What it is'),
      h('p', null, 'A serious, calm study tool for Japanese: from the first hiragana to advanced reading and speaking, with progress measured against JLPT N5 → N1. Spaced repetition decides what you review; script support (romaji, kana, furigana) fades per character as you master it.'),
      h('p', null, 'No accounts, no servers, no analytics. Everything is stored on your device and can be exported as a JSON file.')
    ),
    h('section', { class: 'card' },
      h('h2', null, 'Content sources and licenses'),
      h('p', { class: 'muted small' }, 'The JLPT has not published official vocabulary or kanji lists since 2010; level assignments follow commonly used community lists. No content is copied from commercial textbooks or apps.'),
      h('ul', { class: 'path' }, SOURCES.map((s) => h('li', { style: { gridTemplateColumns: '1fr auto' } },
        h('div', null, h('div', { class: 'step-title' }, h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, s.name)), h('div', { class: 'step-sub' }, `${s.use} · ${s.license}`)),
        h('span', { class: 'pill' }, s.status)
      )))
    ),
    h('section', { class: 'card' },
      h('h2', null, 'Privacy'),
      h('p', null, 'Kotoba Path makes no network requests except to load its own files, open-licensed curriculum data, and fonts. Speech synthesis and recognition use your browser’s built-in engines; on some platforms recognition is processed by the browser vendor’s service. Recordings never leave the device.')
    ),
    h('p', { class: 'small muted' }, 'Application code is released under the MIT License.')
  );
}
