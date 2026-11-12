/* Progress dashboard: current level, progress toward the next level, mastery
   stage counts, accuracy, and study history. All numbers come from the device. */
import { h, append, formatMinutes } from '../ui/dom.js';
import { progress, STAGES, STAGE_LABELS } from '../store/progress.js';
import { days } from '../store/days.js';
import { getManifest } from '../content/loader.js';
import { loadAllKana } from '../content/kana.js';

export const title = 'Progress';

const SKILLS = [['kanji', 'Kanji'], ['vocab', 'Vocabulary'], ['grammar', 'Grammar'], ['reading', 'Reading'], ['listening', 'Listening']];

export async function render(el) {
  const [summary, recent, streak, totals, manifest, all] = await Promise.all([
    progress.summary(), days.recent(14), days.streak(), days.totals(), getManifest().catch(() => null), progress.all()
  ]);
  const levels = (manifest?.levels || []).filter((l) => /^n[1-5]$/.test(l.id));
  const masteredByType = {};
  for (const r of all || []) {
    if (r.stage === 'mastered' || r.stage === 'burned') masteredByType[r.type] = (masteredByType[r.type] || 0) + 1;
  }

  // Current level: the first JLPT level whose targets are not yet ~80% mastered.
  let current = levels[0] || null;
  for (const l of levels) {
    const cov = coverage(l, masteredByType);
    if (cov < 0.8) { current = l; break; }
    current = l;
  }
  const accuracy = totals.answered ? Math.round((totals.correct / totals.answered) * 100) : null;

  append(el, [
    h('header', { class: 'page-head' }, h('h1', null, 'Progress'), h('p', { class: 'lede' }, 'Honest numbers, no pressure. Estimates are estimates.')),

    h('section', { class: 'card card-accent', 'aria-labelledby': 'lvl-h' },
      h('h2', { id: 'lvl-h' }, current ? `Working toward ${current.title}` : 'Working toward JLPT N5'),
      h('p', { class: 'muted', style: { marginBottom: '16px' } }, totals.answered < 50
        ? 'Not enough study data yet to estimate readiness. The estimate appears after about 50 answered reviews.'
        : `Readiness estimate: based on coverage and accuracy, you are approximately ${readiness(current, masteredByType, accuracy)}. This is an estimate, not a guarantee.`),
      SKILLS.map(([key, label]) => {
        const target = current?.targets?.[key] || 0;
        const have = masteredByType[key] || 0;
        const pct = target ? Math.min(100, Math.round((have / target) * 100)) : 0;
        return h('div', { class: 'bar-row' },
          h('span', null, label),
          h('div', { class: 'bar', role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': `${label} toward ${current?.title || 'N5'}` }, h('span', { style: { width: `${pct}%` } })),
          h('span', { class: 'pct' }, `${pct}%`)
        );
      })
    ),

    h('section', { class: 'card', 'aria-labelledby': 'stage-h' },
      h('h2', { id: 'stage-h' }, 'Mastery stages'),
      h('div', { class: 'stat-grid' }, STAGES.map((s) => h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(summary.byStage[s])), h('div', { class: 'stat-label' }, STAGE_LABELS[s]))))
    ),

    h('section', { class: 'card', 'aria-labelledby': 'hist-h' },
      h('div', { class: 'card-title' }, h('h2', { id: 'hist-h' }, 'Last 14 days'), h('span', { class: 'pill' }, `${streak}-day streak`)),
      sparkline(recent),
      h('div', { class: 'stat-grid', style: { marginTop: '16px' } },
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, formatMinutes(totals.seconds)), h('div', { class: 'stat-label' }, 'Total study time')),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(totals.activeDays)), h('div', { class: 'stat-label' }, 'Active days')),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, accuracy == null ? '—' : `${accuracy}%`), h('div', { class: 'stat-label' }, 'Accuracy'))
      )
    ),

    summary.total === 0 ? h('p', { class: 'small muted' }, 'Accuracy by item type, by level, and the most-missed list appear here once you have reviewed items.') : mostMissed(all, await glyphMap())
  ]);
}

async function glyphMap() {
  const map = new Map();
  const levels = await loadAllKana();
  for (const kana of Object.values(levels)) {
    for (const c of kana.allChars) map.set(c.id, `${c.char} (${c.romaji})`);
    for (const w of kana.allWords) map.set(w.id, `${w.jp} (${w.romaji}, ${w.meaning})`);
  }
  return map;
}

function mostMissed(all, glyphs) {
  const missed = (all || []).filter((r) => (r.wrong || 0) > 0).sort((a, b) => (b.wrong || 0) - (a.wrong || 0) || (b.lapses || 0) - (a.lapses || 0)).slice(0, 10);
  if (!missed.length) return h('section', { class: 'card' }, h('h2', null, 'Most missed'), h('p', { class: 'muted' }, 'No misses yet.'));
  const ids = missed.map((r) => r.id);
  return h('section', { class: 'card', 'aria-labelledby': 'miss-h' },
    h('div', { class: 'card-title' }, h('h2', { id: 'miss-h' }, 'Most missed'), h('a', { class: 'btn btn-primary', href: `#/review?start=1&items=${encodeURIComponent(ids.join(','))}` }, 'Practice these')),
    h('ul', { class: 'missed-list' }, missed.map((r) => h('li', null,
      h('a', { href: `#/learn/item/${encodeURIComponent(r.id)}`, class: 'grow', lang: 'ja' }, glyphs.get(r.id) || labelFor(r.id)),
      h('span', { class: 'small muted' }, `${r.wrong} missed · ${STAGE_LABELS[r.stage] || r.stage}`)))));
}

function labelFor(id) {
  const parts = id.split(':');
  const slug = parts[parts.length - 1] || id;
  const jp = slug.includes('-') ? slug.slice(slug.indexOf('-') + 1) : null;
  return jp && /[぀-ヿ一-鿿]/.test(jp) ? jp : parts[0] === 'kana' ? `kana “${slug}”` : id;
}

function coverage(level, masteredByType) {
  const t = level.targets || {};
  const keys = Object.keys(t).filter((k) => t[k] > 0);
  if (!keys.length) return 0;
  return keys.reduce((acc, k) => acc + Math.min(1, (masteredByType[k] || 0) / t[k]), 0) / keys.length;
}

function readiness(level, masteredByType, accuracy) {
  const cov = coverage(level, masteredByType);
  if (cov >= 0.85 && accuracy >= 85) return `${level.title}-ready`;
  if (cov >= 0.5) return `halfway to ${level.title}`;
  return `early in ${level.title}`;
}

function sparkline(rows) {
  const max = Math.max(60, ...rows.map((r) => r.seconds));
  const desc = rows.map((r) => `${r.id}: ${Math.round(r.seconds / 60)} min`).join(', ');
  const bars = h('div', { class: 'spark', role: 'img', 'aria-label': `Study minutes per day, last 14 days. ${desc}` },
    rows.map((r) => h('div', { class: `spark-bar ${r.seconds > 0 ? 'has-data' : ''}`, style: { height: `${Math.max(4, (r.seconds / max) * 100)}%` }, title: `${r.id}: ${Math.round(r.seconds / 60)} min` })));
  const labels = h('div', { class: 'spark-labels', 'aria-hidden': 'true' },
    rows.map((r) => h('span', null, new Date(r.id + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'narrow' }))));
  return h('div', null, bars, labels);
}
