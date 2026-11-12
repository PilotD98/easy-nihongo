/* Daily study log, one row per local calendar day:
   { id: 'YYYY-MM-DD', seconds, reviews, newItems, answered, correct } */
import { db } from './db.js';

export function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function emptyDay(id) { return { id, seconds: 0, reviews: 0, newItems: 0, answered: 0, correct: 0 }; }

export const days = {
  async get(id = dayKey()) { return (await db.get('days', id)) || emptyDay(id); },

  /** Add study activity to today's row. All fields optional. */
  async log({ seconds = 0, reviews = 0, newItems = 0, answered = 0, correct = 0 } = {}, id = dayKey()) {
    const row = await this.get(id);
    row.seconds += seconds; row.reviews += reviews; row.newItems += newItems;
    row.answered += answered; row.correct += correct;
    await db.put('days', row);
    return row;
  },

  all: () => db.getAll('days'),

  /** Last `n` days ending today, oldest first, with zero rows filled in. */
  async recent(n = 14) {
    const rows = (await db.getAll('days')) || [];
    const map = new Map(rows.map((r) => [r.id, r]));
    const out = [];
    const d = new Date();
    d.setDate(d.getDate() - (n - 1));
    for (let i = 0; i < n; i++) {
      const id = dayKey(d);
      out.push(map.get(id) || emptyDay(id));
      d.setDate(d.getDate() + 1);
    }
    return out;
  },

  /** Consecutive active days ending today or yesterday. Purely informational: no penalties. */
  async streak() {
    const rows = (await db.getAll('days')) || [];
    const active = new Set(rows.filter((r) => r.seconds > 0 || r.reviews > 0 || r.newItems > 0).map((r) => r.id));
    const d = new Date();
    if (!active.has(dayKey(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (active.has(dayKey(d))) { n += 1; d.setDate(d.getDate() - 1); }
    return n;
  },

  async totals() {
    const rows = (await db.getAll('days')) || [];
    return rows.reduce((acc, r) => {
      acc.seconds += r.seconds; acc.reviews += r.reviews; acc.newItems += r.newItems;
      acc.answered += r.answered; acc.correct += r.correct; acc.activeDays += (r.seconds > 0 || r.reviews > 0 || r.newItems > 0) ? 1 : 0;
      return acc;
    }, { seconds: 0, reviews: 0, newItems: 0, answered: 0, correct: 0, activeDays: 0 });
  }
};
