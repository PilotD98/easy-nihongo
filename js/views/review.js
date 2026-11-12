/* Review: the spaced-repetition session. Due items come first; learning-step
   items that fall due during the session are re-queued. With ?items=id,id the
   session runs focused practice on those items instead.
   Keyboard: 1–4 pick an option / grade, Enter continues, Space reveals (drawing). */
import { h, append, icon, jp } from '../ui/dom.js';
import { progress, STAGES, STAGE_LABELS } from '../store/progress.js';
import { dueQueue, answer } from '../engine/scheduler.js';
import { previewIntervals, Rating } from '../engine/fsrs.js';
import { loadAllKana, kanaLevelFor } from '../content/kana.js';
import { parseId } from '../content/ids.js';
import { qCharToRomaji, qRomajiToChar, qWordTyped, qListenWord, qCharTyped, qDraw, renderQuestion } from '../ui/quiz.js';
import { canSpeak, initAudio, stopSpeaking } from '../ui/audio.js';
import { days } from '../store/days.js';

export const title = 'Review';
const SESSION_WINDOW_MS = 20 * 60_000;

export async function render(el, ctx) {
  const summary = await progress.summary();
  const focus = ctx.params.items ? ctx.params.items.split(',').filter(Boolean) : null;
  const { queue, total, capped } = await dueQueue();
  const session = focus ? (await Promise.all(focus.map((id) => progress.get(id)))).filter(Boolean) : queue;

  if (ctx.params.start === '1' && session.length) { const stop = await runSession(el, session, { focus: !!focus }); return () => { stopSpeaking(); stop?.(); }; }

  append(el, [
    h('header', { class: 'page-head' },
      h('h1', null, 'Review'),
      h('p', { class: 'lede' }, 'Everything you learn enters a spaced-repetition queue. Reviews are capped per day and spread out, so a backlog never piles up.')),
    h('section', { class: 'card' },
      h('div', { class: 'stat-grid' },
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(session.length)), h('div', { class: 'stat-label' }, focus ? 'Focused items' : 'Due now')),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(summary.total)), h('div', { class: 'stat-label' }, 'Items in queue'))),
      capped ? h('p', { class: 'small muted', style: { marginTop: '8px' } }, `${capped} more are due but wait for tomorrow (daily cap). Raise the cap in Settings if you want them today.`) : null,
      h('div', { class: 'btn-row', style: { marginTop: '16px' } },
        h('a', { class: `btn btn-primary btn-lg ${session.length ? '' : 'is-disabled'}`, href: `#/review?start=1${focus ? `&items=${encodeURIComponent(focus.join(','))}` : ''}`, 'aria-disabled': session.length ? null : 'true', onClick: (e) => { if (!session.length) e.preventDefault(); } }, icon('review'), focus ? 'Practice these' : 'Start reviews'),
        focus ? h('a', { class: 'btn', href: '#/review' }, 'All reviews') : null)),
    summary.total === 0
      ? h('div', { class: 'empty' }, jp('復習', 'jp-xl'), h('p', null, 'Nothing to review yet. Items join this queue as you learn them in lessons.'), h('a', { class: 'btn', href: '#/learn' }, 'Go to the learning path'))
      : h('section', { class: 'card' },
        h('h2', null, 'Mastery stages'),
        STAGES.map((s) => h('div', { class: 'bar-row' }, h('span', null, STAGE_LABELS[s]), h('div', { class: 'bar' }, h('span', { style: { width: `${summary.total ? (summary.byStage[s] / summary.total) * 100 : 0}%` } })), h('span', { class: 'pct' }, String(summary.byStage[s])))),
        session.length === 0 && !focus ? h('p', { class: 'small muted', style: { marginTop: '12px' } }, nextDueText(summary)) : null)
  ]);
  return cleanupFn;
}

function cleanupFn() { stopSpeaking(); }

function nextDueText(summary) {
  const soon = summary.nextDue ? ` Next one is due ${new Date(summary.nextDue).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}.` : '';
  return `Nothing is due right now.${soon} Keep learning new groups in the meantime.`;
}

/* ---------- session ---------- */
async function runSession(el, records, { focus }) {
  await initAudio();
  const kanaLevels = await loadAllKana();
  const startedAt = Date.now();
  const queue = records.slice();
  let done = 0, correctCount = 0;
  const totalPlanned = queue.length;
  let qCleanup = null;

  const counter = h('span', { class: 'small muted' });
  const bar = h('div', { class: 'bar' }, h('span', { style: { width: '0%' } }));
  const qArea = h('div', { class: 'q-area' });
  const grades = h('div', { class: 'grade-row', hidden: true });
  const card = h('section', { class: 'card' }, h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('strong', null, focus ? 'Focused practice' : 'Reviews'), counter), bar, qArea, grades);
  append(el, [
    h('header', { class: 'page-head row', style: { justifyContent: 'space-between' } }, h('h1', null, 'Review'), h('a', { class: 'btn', href: '#/review' }, 'End session')),
    card
  ]);

  const finishSession = async () => {
    qCleanup?.();
    await days.log({ seconds: Math.round((Date.now() - startedAt) / 1000) });
    const pct = done ? Math.round((correctCount / done) * 100) : 0;
    card.replaceChildren(
      h('h2', null, 'Session complete'),
      h('div', { class: 'stat-grid' },
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(done)), h('div', { class: 'stat-label' }, 'answers')),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, `${pct}%`), h('div', { class: 'stat-label' }, 'correct')),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, `${Math.max(1, Math.round((Date.now() - startedAt) / 60000))} min`), h('div', { class: 'stat-label' }, 'study time'))),
      h('div', { class: 'btn-row', style: { marginTop: '16px' } }, h('a', { class: 'btn btn-primary', href: '#/home' }, 'Home'), h('a', { class: 'btn', href: '#/learn' }, 'Keep learning'))
    );
  };

  const next = async () => {
    stopSpeaking();
    if (!queue.length) { await finishSession(); return; }
    const rec = queue.shift();
    counter.textContent = `${done + 1} / ${done + 1 + queue.length}`;
    bar.firstChild.style.width = `${(done / Math.max(totalPlanned, done + queue.length + 1)) * 100}%`;
    const q = questionFor(rec, kanaLevels[kanaLevelFor(rec.id)]);
    if (!q) { next(); return; }
    grades.hidden = true;
    qCleanup?.();
    qCleanup = renderQuestion(qArea, q, { onAnswer: (r) => showGrades(rec, r) });
    window.scrollTo(0, 0);
  };

  const showGrades = (rec, r) => {
    const suggested = r.correct ? (r.close ? Rating.Hard : Rating.Good) : Rating.Again;
    const iv = previewIntervals(rec);
    const labels = { 1: 'Again', 2: 'Hard', 3: 'Good', 4: 'Easy' };
    grades.replaceChildren();
    append(grades, [
      h('div', { class: 'small muted', style: { width: '100%' } }, 'How well did you know it? Enter accepts the suggestion.'),
      [1, 2, 3, 4].map((g) => h('button', { class: `btn grade-btn ${g === suggested ? 'is-suggested' : ''} grade-${g}`, type: 'button', dataset: { grade: String(g) }, onClick: () => grade(rec, g, r) },
        h('span', { class: 'grade-label' }, h('kbd', { class: 'q-key', 'aria-hidden': 'true' }, String(g)), labels[g]), h('span', { class: 'small muted' }, iv[g])))
    ]);
    grades.hidden = false;
    grades.querySelector('.is-suggested')?.focus({ preventScroll: true });
  };

  const grade = async (rec, g, r) => {
    const updated = await answer(rec, g);
    done += 1; if (g !== Rating.Again) correctCount += 1;
    const dueIn = Date.parse(updated.due) - Date.now();
    if (dueIn <= SESSION_WINDOW_MS) queue.push(updated);
    await next();
  };

  const onKey = (e) => {
    if (e.target.tagName === 'INPUT' || document.querySelector('dialog[open]')) return;
    if (grades.hidden) {
      if (e.key === ' ' ) { const b = qArea.querySelector('.btn-primary'); if (b && b.textContent.includes('Show')) { e.preventDefault(); b.click(); } }
      return;
    }
    const n = Number(e.key);
    if (n >= 1 && n <= 4) { e.preventDefault(); grades.querySelector(`[data-grade="${n}"]`)?.click(); }
    else if (e.key === 'Enter') { e.preventDefault(); grades.querySelector('.is-suggested')?.click(); }
  };
  document.addEventListener('keydown', onKey);
  await next();
  return () => { document.removeEventListener('keydown', onKey); qCleanup?.(); };
}

/** Pick a question type for a record, rotating by review count. */
function questionFor(rec, kana) {
  const p = parseId(rec.id);
  if (!p || !kana) return null;
  if (p.type === 'kana') {
    const ch = kana.charsById.get(rec.id);
    if (!ch) return null;
    const pool = kana.allChars.filter((c) => c.group === ch.group || Math.random() < 0.3);
    const types = ['recognition', 'recallTyped', 'recall', 'draw'];
    const t = types[rec.reps % types.length];
    const single = !ch.parts && kana.strokes[ch.char];
    if (t === 'recognition') return qCharToRomaji(ch, pool);
    if (t === 'recallTyped' && !/[()]/.test(ch.romaji)) return qCharTyped(ch);
    if (t === 'draw' && single) return qDraw(ch, kana.strokes[ch.char]);
    return qRomajiToChar(ch, pool);
  }
  if (p.type === 'vocab') {
    const w = kana.wordsById.get(rec.id);
    if (!w) return null;
    const types = ['reading', 'listen', 'meaning'];
    const t = types[rec.reps % types.length];
    if (t === 'listen' && canSpeak()) return qListenWord(w, kana.allWords);
    if (t === 'meaning') return { kind: 'typed', itemId: w.id, type: 'production', prompt: { text: w.meaning, hint: 'type the Japanese (romaji converts to kana)' }, accepted: [w.jp, w.romaji], answer: w.jp, why: `"${w.meaning}" is ${w.jp} (${w.romaji}).` };
    return qWordTyped(w);
  }
  return null;
}
