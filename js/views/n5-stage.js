/* JLPT level stage: the list of units (kanji + vocabulary + grammar + reading), unlocked in order. */
import { h, append, icon, jp } from '../ui/dom.js';
import { jlptStatus } from '../content/n5.js';
import { progress } from '../store/progress.js';

export const title = 'JLPT N5';

export async function render(el, ctx) {
  const levelId = ctx.levelId || 'n5';
  const { level: lv, passed, nextUnit, total, unlocked } = await jlptStatus(levelId);
  if (!unlocked) {
    append(el, [h('h1', null, lv.title), h('div', { class: 'notice' }, icon('lock'), h('p', null, levelId === 'n5' ? 'Pass the katakana exam to unlock this stage.' : 'Pass every unit of the previous level to unlock this stage.')), h('a', { class: 'btn', href: '#/learn' }, 'Learning path')]);
    return;
  }
  const records = new Map(((await progress.all()) || []).map((r) => [r.id, r]));
  const learnedKanji = lv.kanji.filter((k) => records.has(k.id)).length;
  const learnedVocab = lv.vocab.filter((v) => records.has(v.id)).length;
  const mocks = (await import('./mock.js')).examHistory ? await (await import('./mock.js')).examHistory(levelId) : [];

  append(el, [
    h('header', { class: 'page-head' },
      h('h1', null, lv.title),
      h('p', { class: 'lede' }, `${passed.size} of ${total} units passed · ${learnedKanji} of ${lv.kanji.length} kanji · ${learnedVocab} of ${lv.vocab.length} words · ${lv.grammar.length} grammar points`)),
    h('div', { class: 'bar', style: { marginBottom: '20px' }, role: 'progressbar', 'aria-valuenow': passed.size, 'aria-valuemax': total, 'aria-label': 'Units passed' }, h('span', { style: { width: `${(passed.size / total) * 100}%` } })),
    h('p', { class: 'small muted' }, 'Each unit mixes a handful of kanji, the words that use them, two or three grammar points and, every few units, a reading built only from what you know.'),
    h('section', { class: 'card' },
      h('ol', { class: 'path' }, lv.units.map((u) => {
        const isPassed = passed.has(u.id);
        const available = isPassed || u === nextUnit;
        const kanjiPreview = u.kanji.map((id) => lv.byId.get(id).char).join(' ');
        return h('li', null,
          h('span', { class: `step-no ${available ? 'is-available' : ''} ${isPassed ? 'is-passed' : ''}`, 'aria-hidden': 'true' }, isPassed ? icon('check') : String(u.no)),
          h('div', null,
            h('div', { class: 'step-title' }, u.title),
            h('div', { class: 'step-sub' }, h('span', { class: 'unit-kanji', lang: 'ja' }, kanjiPreview), ` · ${u.vocab.length} words · ${u.grammar.length} grammar${u.readings.length ? ' · reading' : ''}${u.listening.length ? ' · listening' : ''}`)),
          available
            ? h('a', { class: `btn ${u === nextUnit ? 'btn-primary' : ''}`, href: `#/unit/${levelId}/${u.no}`, 'aria-label': `${isPassed ? 'Revisit' : 'Start'} unit ${u.no}` }, isPassed ? 'Revisit' : 'Start')
            : h('span', { class: 'icon lock', title: 'Pass the previous unit to unlock' }, icon('lock'))
        );
      }))),
    h('section', { class: `card ${passed.size >= Math.ceil(total / 2) ? 'card-accent' : ''}` },
      h('div', { class: 'card-title' }, h('h2', null, `Mock JLPT ${lv.title.replace('JLPT ', '')}`), mocks.length ? h('span', { class: 'pill' }, `last: ${mocks[mocks.length - 1].total} / 180`) : null),
      h('p', { class: 'muted' }, 'Three timed sections in the real format: vocabulary, grammar and reading, listening. Take it any time; it is most useful once half the units are done.'),
      h('a', { class: 'btn btn-primary', href: `#/mock/${levelId}` }, mocks.length ? 'Take it again' : 'Take the mock exam')),
    h('section', { class: 'card' },
      h('h2', null, 'Read & listen'),
      h('p', { class: 'muted' }, 'Passages and listening drills open as their unit is passed.'),
      h('a', { class: 'btn', href: `#/read` }, 'Open the reading library'))
  ]);
}
