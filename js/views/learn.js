/* Learn: the stage path from Orientation to N1, plus sub-routes:
     #/learn/orientation   Stage 0
     #/learn/hiragana      hiragana group list
     #/learn/item/<id>     item detail (from quick lookup)
   Stages become available as their content ships; data/index.json is the
   source of truth, and the kana meta store says what is unlocked. */
import { h, append, icon } from '../ui/dom.js';
import { getManifest } from '../content/loader.js';
import { isUnlocked, orientationDone, kanaStatus } from '../content/kana.js';
import { jlptStatus } from './../content/n5.js';

export const title = 'Learn';

const SUBVIEWS = {
  orientation: () => import('./orientation.js'),
  hiragana: () => import('./kana-stage.js'),
  katakana: () => import('./kana-stage.js'),
  n5: () => import('./n5-stage.js')
};

export async function render(el, ctx) {
  const sub = ctx.segs[1];
  if (sub === 'item') { const m = await import('./item.js'); return m.render(el, ctx.segs[2] || ''); }
  if (SUBVIEWS[sub]) { const m = await SUBVIEWS[sub](); return m.render(el, { ...ctx, levelId: sub === 'hiragana' ? 'kana' : sub }); }

  let manifest = null;
  try { manifest = await getManifest(); }
  catch (err) {
    append(el, [h('header', { class: 'page-head' }, h('h1', null, 'Learn')),
      h('div', { class: 'notice notice-err' }, icon('info'), h('p', null, 'The content index could not be loaded. If you are offline, reconnect once so it can be cached.'))]);
    return;
  }
  const levelsById = Object.fromEntries((manifest.levels || []).map((l) => [l.id, l]));
  const oDone = await orientationDone();
  const hira = await kanaStatus('kana').catch(() => null);
  const kata = (await isUnlocked('katakana')) ? await kanaStatus('katakana').catch(() => null) : null;
  const n5 = (await isUnlocked('n5')) ? await jlptStatus('n5').catch(() => null) : null;

  const items = [];
  for (const s of manifest.stages || []) {
    const level = s.level ? levelsById[s.level] : null;
    const hasContent = !!(level && level.files && Object.keys(level.files).length);
    const unlocked = hasContent && await isUnlocked(s.level);
    let status = '', href = null, sub = s.summary, done = false;
    if (!hasContent) status = 'Not yet in this build';
    else if (!unlocked) status = 'Locked';
    else if (s.id === 'orientation') { href = '#/learn/orientation'; done = oDone; status = oDone ? 'Read' : 'Start'; }
    else if (s.id === 'hiragana' && hira) {
      href = '#/learn/hiragana';
      done = !!hira.exam;
      status = hira.exam ? 'Passed' : hira.passed.size ? 'Continue' : 'Start';
      sub = `${hira.passed.size} of ${hira.total} groups passed` + (hira.exam ? ` · exam ${hira.exam.score}%` : '');
    } else if (s.id === 'katakana' && kata) {
      href = '#/learn/katakana';
      done = !!kata.exam;
      status = kata.exam ? 'Passed' : kata.passed.size ? 'Continue' : 'Start';
      sub = `${kata.passed.size} of ${kata.total} groups passed` + (kata.exam ? ` · exam ${kata.exam.score}%` : '');
    } else if (s.id === 'n5' && n5) {
      href = '#/learn/n5';
      done = !n5.nextUnit;
      status = done ? 'Complete' : n5.passed.size ? 'Continue' : 'Start';
      sub = `${n5.passed.size} of ${n5.total} units passed`;
    } else { href = `#/learn/${s.id}`; status = 'Open'; }
    items.push(h('li', null,
      h('span', { class: `step-no ${href ? 'is-available' : ''} ${done ? 'is-passed' : ''}`, 'aria-hidden': 'true' }, done ? icon('check') : String(s.no)),
      h('div', null,
        h('div', { class: 'step-title' }, s.title),
        h('div', { class: 'step-sub' }, sub),
        level && level.targets ? h('div', { class: 'step-sub' }, targetsLine(level.targets)) : null),
      href ? h('a', { class: `btn ${!done && status !== 'Read' ? 'btn-primary' : ''}`, href, 'aria-label': `${status} ${s.title}` }, status)
        : status === 'Locked' ? h('span', { class: 'icon lock', title: 'Pass the previous stage to unlock' }, icon('lock'))
          : h('span', { class: 'pill' }, status)
    ));
  }

  append(el, [
    h('header', { class: 'page-head' },
      h('h1', null, 'Learning path'),
      h('p', { class: 'lede' }, 'From zero to advanced reading and speaking, measured against JLPT N5 → N1. Each stage unlocks as you pass the one before.')),
    h('section', { class: 'card' }, h('ol', { class: 'path' }, items)),
    manifest.note ? h('p', { class: 'small muted' }, manifest.note) : null
  ]);
}

function targetsLine(t) {
  const parts = [];
  if (t.kanji) parts.push(`≈${t.kanji} kanji`);
  if (t.vocab) parts.push(`≈${t.vocab.toLocaleString()} words`);
  if (t.grammar) parts.push(`≈${t.grammar} grammar points`);
  return parts.join(' · ');
}
