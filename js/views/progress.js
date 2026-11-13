/* Progress dashboard: current level and progress toward the next, mastery
   stages, accuracy by item type and level, most-missed items with one-tap
   practice, readiness estimate, mock exam history, study history and items
   learned over time. Every number comes from the device. */
import { h, append, icon, formatMinutes } from '../ui/dom.js';
import { progress, STAGES, STAGE_LABELS } from '../store/progress.js';
import { days } from '../store/days.js';
import { db } from '../store/db.js';
import { getManifest } from '../content/loader.js';
import { loadAllKana } from '../content/kana.js';
import { parseId } from '../content/ids.js';

export const title = 'Progress';

const SKILLS = [['kanji', 'Kanji'], ['vocab', 'Vocabulary'], ['grammar', 'Grammar'], ['reading', 'Reading'], ['listening', 'Listening']];
const TYPE_LABELS = { kana: 'Kana', vocab: 'Vocabulary', kanji: 'Kanji', grammar: 'Grammar', sentence: 'Sentences', reading: 'Reading' };

export async function render(el) {
  const [summary, recent, longer, streak, totals, manifest, all, mocks] = await Promise.all([
    progress.summary(), days.recent(14), days.recent(56), days.streak(), days.totals(), getManifest().catch(() => null), progress.all(), mergedMocks()
  ]);
  const records = all || [];
  const levels = (manifest?.levels || []).filter((l) => /^n[1-5]$/.test(l.id));
  const glyphs = await glyphMap();

  // Mastered counts per skill for the current level (reading/listening count passage questions answered via days, approximated by coverage of grammar+vocab)
  const masteredByType = {};
  for (const r of records) if (r.stage === 'mastered' || r.stage === 'burned') masteredByType[r.type] = (masteredByType[r.type] || 0) + 1;
  const learnedByType = {};
  for (const r of records) learnedByType[r.type] = (learnedByType[r.type] || 0) + 1;

  let current = levels[0] || null;
  for (const l of levels) { if (coverage(l, masteredByType) < 0.8) { current = l; break; } current = l; }
  const accuracy = totals.answered ? Math.round((totals.correct / totals.answered) * 100) : null;
  const readiness = readinessEstimate(current, masteredByType, learnedByType, accuracy, totals.answered);

  append(el, [
    h('header', { class: 'page-head' }, h('h1', null, 'Progress'), h('p', { class: 'lede' }, 'Honest numbers, no pressure. Estimates are estimates.')),

    h('section', { class: 'card card-accent', 'aria-labelledby': 'lvl-h' },
      h('div', { class: 'card-title' }, h('h2', { id: 'lvl-h' }, current ? `Working toward ${current.title}` : 'Working toward JLPT N5'), h('span', { class: 'pill' }, readiness.label)),
      h('p', { class: 'muted', style: { marginBottom: '16px' } }, readiness.text),
      SKILLS.map(([key, label]) => {
        const target = current?.targets?.[key] || 0;
        const have = masteredByType[key] || 0;
        const learned = learnedByType[key] || 0;
        const pct = target ? Math.min(100, Math.round((have / target) * 100)) : 0;
        const lpct = target ? Math.min(100, Math.round((learned / target) * 100)) : 0;
        return h('div', { class: 'bar-row' },
          h('span', null, label),
          h('div', { class: 'bar bar-dual', role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': `${label}: ${pct}% mastered, ${lpct}% learned, toward ${current?.title || 'N5'}` },
            h('span', { class: 'bar-learned', style: { width: `${lpct}%` } }), h('span', { style: { width: `${pct}%` } })),
          h('span', { class: 'pct' }, `${pct}%`));
      }),
      h('p', { class: 'small muted', style: { marginTop: '8px', marginBottom: 0 } }, 'Solid bar: mastered. Faint bar: learned so far. Reading and listening fill as passages and drills enter your reviews.')),

    h('section', { class: 'card', 'aria-labelledby': 'stage-h' },
      h('h2', { id: 'stage-h' }, 'Mastery stages'),
      h('div', { class: 'stat-grid' }, STAGES.map((s) => h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(summary.byStage[s])), h('div', { class: 'stat-label' }, STAGE_LABELS[s]))))),

    accuracyCard(records, accuracy),

    mocks.length ? mockCard(mocks) : null,

    h('section', { class: 'card', 'aria-labelledby': 'hist-h' },
      h('div', { class: 'card-title' }, h('h2', { id: 'hist-h' }, 'Study time'), h('span', { class: 'pill', title: 'Missing a day never costs you anything.' }, `${streak}-day streak`)),
      sparkline(recent, (r) => r.seconds / 60, 'min', (r) => `${r.id}: ${Math.round(r.seconds / 60)} min`),
      h('div', { class: 'stat-grid', style: { marginTop: '16px' } },
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, formatMinutes(totals.seconds)), h('div', { class: 'stat-label' }, 'Total study time')),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(totals.activeDays)), h('div', { class: 'stat-label' }, 'Active days')),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(totals.reviews)), h('div', { class: 'stat-label' }, 'Reviews answered')))),

    h('section', { class: 'card', 'aria-labelledby': 'learned-h' },
      h('h2', { id: 'learned-h' }, 'Items learned, last 8 weeks'),
      weeklyLearned(records, longer),
      h('p', { class: 'small muted', style: { marginTop: '8px', marginBottom: 0 } }, `${records.length} items in your queue in total.`)),

    mostMissed(records, glyphs)
  ]);
}

/* ---------- pieces ---------- */
function coverage(level, masteredByType) {
  const t = level?.targets || {};
  const keys = Object.keys(t).filter((k) => t[k] > 0);
  if (!keys.length) return 0;
  return keys.reduce((acc, k) => acc + Math.min(1, (masteredByType[k] || 0) / t[k]), 0) / keys.length;
}

function readinessEstimate(level, mastered, learned, accuracy, answered) {
  if (!level) return { label: 'no level data', text: 'No JLPT level is loaded.' };
  const cov = coverage(level, mastered);
  const t = level.targets || {};
  const learnedCov = Object.keys(t).filter((k) => t[k] > 0).reduce((acc, k) => acc + Math.min(1, (learned[k] || 0) / t[k]), 0) / Math.max(1, Object.keys(t).filter((k) => t[k] > 0).length);
  const name = level.title.replace('JLPT ', '');
  if (answered < 50) return { label: 'estimate pending', text: `Not enough study data yet to estimate readiness. The estimate appears after about 50 answered reviews. So far ${Math.round(learnedCov * 100)}% of ${name} has been introduced.` };
  if (cov >= 0.85 && accuracy >= 85) return { label: `≈ ${name}-ready`, text: `Based on coverage (${Math.round(cov * 100)}% mastered) and accuracy (${accuracy}%), you are approximately ${name}-ready. This is an estimate, not a guarantee; a mock exam gives a closer look.` };
  if (cov >= 0.5) return { label: `≈ halfway to ${name}`, text: `About ${Math.round(cov * 100)}% of ${name} is mastered at ${accuracy}% accuracy. Keep going: mastery grows as reviews space out.` };
  return { label: `early ${name}`, text: `${Math.round(learnedCov * 100)}% of ${name} introduced, ${Math.round(cov * 100)}% mastered, accuracy ${accuracy}%. Readiness comes with time between reviews, not just more items.` };
}

function accuracyCard(records, overall) {
  const byType = {}, byLevel = {};
  for (const r of records) {
    const reps = r.reps || 0, wrong = r.wrong || 0;
    if (reps <= 1) continue; // first exposure in a lesson is not a review
    const add = (map, key) => { map[key] = map[key] || { reps: 0, wrong: 0 }; map[key].reps += reps - 1; map[key].wrong += wrong; };
    add(byType, r.type);
    const p = parseId(r.id);
    const level = p?.type === 'kanji' ? 'n5' : p?.scope === 'h' ? 'hiragana' : p?.scope === 'k' ? 'katakana' : p?.scope === 'kana' ? 'hiragana' : p?.scope === 'katakana' ? 'katakana' : p?.scope || 'other';
    add(byLevel, level);
  }
  const row = (label, v) => { const pct = v.reps ? Math.max(0, Math.round(((v.reps - v.wrong) / v.reps) * 100)) : null; return h('div', { class: 'bar-row' }, h('span', null, label), h('div', { class: 'bar' }, h('span', { style: { width: `${pct ?? 0}%`, background: pct != null && pct < 70 ? 'var(--err)' : undefined } })), h('span', { class: 'pct' }, pct == null ? '—' : `${pct}%`)); };
  const hasData = Object.keys(byType).length > 0;
  return h('section', { class: 'card', 'aria-labelledby': 'acc-h' },
    h('div', { class: 'card-title' }, h('h2', { id: 'acc-h' }, 'Accuracy'), h('span', { class: 'pill' }, overall == null ? 'no answers yet' : `${overall}% overall`)),
    hasData ? h('div', { class: 'acc-grid' },
      h('div', null, h('h3', null, 'By item type'), Object.entries(byType).map(([k, v]) => row(TYPE_LABELS[k] || k, v))),
      h('div', null, h('h3', null, 'By level'), Object.entries(byLevel).map(([k, v]) => row(k.toUpperCase(), v))))
      : h('p', { class: 'muted' }, 'Accuracy by item type and by level appears after your first review sessions.'));
}

async function mergedMocks() {
  const all = [];
  for (const id of ['n5', 'n4', 'n3', 'n2', 'n1']) { const row = await db.get('meta', `${id}:mocks`); for (const x of row?.value || []) all.push({ ...x, level: x.level || id }); }
  return all.sort((a, b) => a.date.localeCompare(b.date));
}

function mockCard(list) {
  const last = list[list.length - 1];
  return h('section', { class: 'card', 'aria-labelledby': 'mock-h' },
    h('div', { class: 'card-title' }, h('h2', { id: 'mock-h' }, 'Mock exams'), h('a', { class: 'btn', href: `#/mock/${last.level || 'n5'}` }, 'Take one')),
    h('div', { class: 'stat-grid' },
      h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, `${last.total}`), h('div', { class: 'stat-label' }, `of 180 · ${(last.level || 'n5').toUpperCase()} · ${last.passed == null ? 'no listening' : last.passed ? 'pass' : 'fail'} (latest)`)),
      h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, `${last.lk}`), h('div', { class: 'stat-label' }, 'language + reading / 120')),
      h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, last.listening == null ? '—' : `${last.listening}`), h('div', { class: 'stat-label' }, 'listening / 60'))),
    list.length > 1 ? h('div', { style: { marginTop: '12px' } }, sparkline(list.slice(-8).map((x) => ({ id: x.date.slice(0, 10), v: x.total })), (r) => r.v, '', (r) => `${r.id}: ${r.v}/180`, 180)) : null);
}

function mostMissed(all, glyphs) {
  const missed = all.filter((r) => (r.wrong || 0) > 0).sort((a, b) => (b.wrong || 0) - (a.wrong || 0) || (b.lapses || 0) - (a.lapses || 0)).slice(0, 10);
  if (!missed.length) return h('section', { class: 'card' }, h('h2', null, 'Most missed'), h('p', { class: 'muted' }, 'No misses yet.'));
  const ids = missed.map((r) => r.id);
  return h('section', { class: 'card', 'aria-labelledby': 'miss-h' },
    h('div', { class: 'card-title' }, h('h2', { id: 'miss-h' }, 'Most missed'), h('a', { class: 'btn btn-primary', href: `#/review?start=1&items=${encodeURIComponent(ids.join(','))}` }, 'Practice these')),
    h('ul', { class: 'missed-list' }, missed.map((r) => h('li', null,
      h('a', { href: `#/learn/item/${encodeURIComponent(r.id)}`, class: 'grow', lang: 'ja' }, glyphs.get(r.id) || r.id),
      h('span', { class: 'small muted' }, `${r.wrong} missed · ${STAGE_LABELS[r.stage] || r.stage}`)))));
}

async function glyphMap() {
  const map = new Map();
  const levels = await loadAllKana();
  for (const kana of Object.values(levels)) {
    for (const c of kana.allChars) map.set(c.id, `${c.char} (${c.romaji})`);
    for (const w of kana.allWords) map.set(w.id, `${w.jp} (${w.romaji}, ${w.meaning})`);
  }
  try {
    const { loadJlpt } = await import('../content/n5.js');
    for (const id of ['n5', 'n4', 'n3', 'n2', 'n1']) {
      let lv; try { lv = await loadJlpt(id); } catch { break; }
      for (const k of lv.kanji) map.set(k.id, `${k.char} (${k.meanings[0]})`);
      for (const v of lv.vocab) map.set(v.id, `${v.jp} (${v.kana}, ${v.meanings[0]})`);
      for (const g of lv.grammar) map.set(g.id, g.title);
    }
  } catch { /* level not in this build */ }
  return map;
}

function sparkline(rows, value, unit, label, fixedMax = null) {
  const max = fixedMax ?? Math.max(1, ...rows.map(value));
  const desc = rows.map(label).join(', ');
  const bars = h('div', { class: 'spark', role: 'img', 'aria-label': `${desc}` },
    rows.map((r) => h('div', { class: `spark-bar ${value(r) > 0 ? 'has-data' : ''}`, style: { height: `${Math.max(4, (value(r) / max) * 100)}%` }, title: label(r) })));
  const labels = h('div', { class: 'spark-labels', 'aria-hidden': 'true' },
    rows.map((r) => h('span', null, rows.length <= 16 ? new Date(r.id + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'narrow' }) : '')));
  return h('div', null, bars, labels);
}

function weeklyLearned(records, days56) {
  // bucket records by the week (Mon–Sun) they were created, over the last 8 weeks
  const start = new Date(days56[0].id + 'T00:00:00');
  const weeks = Array.from({ length: 8 }, (_, i) => ({ id: new Date(start.getTime() + i * 7 * 86400000).toISOString().slice(0, 10), n: 0 }));
  for (const r of records) {
    const t = Date.parse(r.createdAt || 0);
    const i = Math.floor((t - start.getTime()) / (7 * 86400000));
    if (i >= 0 && i < 8) weeks[i].n++;
  }
  const max = Math.max(1, ...weeks.map((w) => w.n));
  return h('div', null,
    h('div', { class: 'spark', role: 'img', 'aria-label': `Items learned per week: ${weeks.map((w) => `${w.id}: ${w.n}`).join(', ')}` },
      weeks.map((w) => h('div', { class: `spark-bar ${w.n ? 'has-data' : ''}`, style: { height: `${Math.max(4, (w.n / max) * 100)}%` }, title: `week of ${w.id}: ${w.n}` }))),
    h('div', { class: 'spark-labels', 'aria-hidden': 'true' }, weeks.map((w) => h('span', null, new Date(w.id + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })))));
}
