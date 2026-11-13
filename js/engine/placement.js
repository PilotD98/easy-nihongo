/* Placement: lets a learner who already knows some Japanese skip ahead.
   Two parts: what they say they know, then a short check. The result marks
   kana groups / exams / N5 units as passed and seeds the review queue with
   those items as already familiar, so they are reviewed lightly rather than
   taught from scratch. */
import { db } from '../store/db.js';
import { progress, newRecord } from '../store/progress.js';
import { loadKana, markGroupPassed, markExamPassed, markOrientationDone } from '../content/kana.js';
import { loadJlpt, markUnitPassed, unitItems } from '../content/n5.js';
import { State } from './fsrs.js';
import { isKanji } from './furigana.js';

const DAY = 86_400_000;

/** Seed records for items the learner already knows: review state, moderate stability, due over the next weeks. */
export async function seedKnown(items, { stabilityDays = 21, spreadDays = 21 } = {}) {
  const now = Date.now();
  let added = 0;
  for (const { id, type, display } of items) {
    if (await progress.get(id)) continue;
    const rec = newRecord(id, type);
    rec.state = State.Review;
    rec.stability = stabilityDays;
    rec.difficulty = 5;
    rec.reps = 1;
    rec.display = display ?? (type === 'kana' ? 2 : type === 'kanji' || type === 'grammar' ? 4 : 2);
    rec.streak = 4;
    const due = now + Math.floor(Math.random() * spreadDays) * DAY + DAY;
    rec.due = new Date(due).toISOString();
    rec.lastReview = new Date(now).toISOString();
    rec.scheduledDays = Math.round((due - now) / DAY);
    await progress.save(rec);
    added++;
  }
  return added;
}

/** Mark a whole kana stage known (groups + exam) and seed its items. */
export async function placeKana(levelId) {
  const kana = await loadKana(levelId);
  for (const g of kana.groups) await markGroupPassed(levelId, g.id);
  await markExamPassed(levelId, { date: new Date().toISOString(), score: 100, placement: true });
  return seedKnown([
    ...kana.allChars.map((c) => ({ id: c.id, type: 'kana', display: 2 })),
    ...kana.allWords.map((w) => ({ id: w.id, type: 'vocab', display: 2 }))
  ]);
}

/** Mark the first `count` N5 units known and seed their items. */
export async function placeN5(count) {
  const lv = await loadJlpt('n5');
  let added = 0;
  for (const u of lv.units.slice(0, count)) {
    await markUnitPassed('n5', u.id);
    added += await seedKnown(unitItems(lv, u).map((it) => ({ ...it, display: it.display === 3 ? 4 : it.display === 1 ? 2 : it.display })));
  }
  return added;
}

export async function markPlacementDone(summary) {
  await db.put('meta', { id: 'placement', value: { date: new Date().toISOString(), ...summary } });
}
export async function placementDone() { return (await db.get('meta', 'placement'))?.value || null; }

/** Apply a placement decision. level: 'none' | 'hiragana' | 'kana' | 'n5-half' | 'n5'. */
export async function applyPlacement(level, scores) {
  await markOrientationDone();
  let added = 0;
  if (level !== 'none') added += await placeKana('kana');
  if (['kana', 'n5-half', 'n5'].includes(level)) added += await placeKana('katakana');
  if (level === 'n5-half') added += await placeN5(10);
  if (level === 'n5') added += await placeN5(21);
  await markPlacementDone({ level, scores, added });
  return added;
}
