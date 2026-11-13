/* Read: the library of graded passages and listening drills, per level. */
import { h, append, icon, jp } from '../ui/dom.js';
import { availableLevels } from '../content/loader.js';
import { loadJlpt, passedUnits } from '../content/n5.js';
import { isUnlocked } from '../content/kana.js';

export const title = 'Read';

export async function render(el, ctx) {
  if (ctx.segs[1]) { const m = await import('./reading.js'); return m.render(el, ctx); }
  const levels = (await availableLevels().catch(() => [])).filter((l) => l.files && (l.files.readings || l.files.listening));
  const sections = [];
  for (const l of levels) {
    const unlocked = await isUnlocked(l.id);
    const lv = await loadJlpt(l.id).catch(() => null);
    if (!lv) continue;
    const passed = await passedUnits(l.id);
    const unitPassed = (unitNo) => [...passed].some((id) => Number(id.split(':').pop()) >= unitNo);
    sections.push(h('section', { class: 'card' },
      h('div', { class: 'card-title' }, h('h2', null, `${lv.title} readings`), unlocked ? null : h('span', { class: 'pill' }, 'Locked')),
      h('ol', { class: 'path' }, lv.readings.map((r, i) => {
        const open = unlocked && unitPassed(r.unit);
        return h('li', null,
          h('span', { class: `step-no ${open ? 'is-available' : ''}`, 'aria-hidden': 'true' }, String(i + 1)),
          h('div', null, h('div', { class: 'step-title' }, jp(r.title), ' · ', r.en), h('div', { class: 'step-sub' }, `Unit ${r.unit} · ${r.questions.length} questions`)),
          open ? h('a', { class: 'btn', href: `#/read/${l.id}/${encodeURIComponent(r.id)}` }, 'Read') : h('span', { class: 'icon lock', title: `Pass unit ${r.unit} to unlock` }, icon('lock')));
      }))),
      h('section', { class: 'card' },
        h('h2', null, `${lv.title} listening`),
        h('ol', { class: 'path' }, lv.listening.map((d, i) => {
          const open = unlocked && unitPassed(d.unit);
          return h('li', null,
            h('span', { class: `step-no ${open ? 'is-available' : ''}`, 'aria-hidden': 'true' }, icon('speak')),
            h('div', null, h('div', { class: 'step-title' }, d.title), h('div', { class: 'step-sub' }, `${d.type} · unit ${d.unit} · ${d.items.length} items`)),
            open ? h('a', { class: 'btn', href: `#/read/${l.id}/listen/${encodeURIComponent(d.id)}` }, 'Start') : h('span', { class: 'icon lock', title: `Pass unit ${d.unit} to unlock` }, icon('lock')));
        }))));
  }
  append(el, [
    h('header', { class: 'page-head' },
      h('h1', null, 'Read & listen'),
      h('p', { class: 'lede' }, 'Graded passages and listening drills built only from words and grammar you have already learned. Tap any word to see its reading and meaning.')),
    sections.length ? sections : h('div', { class: 'empty' }, jp('読む', 'jp-xl'), h('p', null, 'Readings unlock with the N5 stage, after the kana exams.'))
  ]);
}
