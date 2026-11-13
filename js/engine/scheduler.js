/* Daily plan and review queue on top of FSRS.
   - due reviews are capped per day (dailyReviewCap) and the rest wait for
     the next day, so a backlog never buries the learner;
   - the new-item allowance eases off when recent accuracy drops;
   - every answer is logged to the day row and to a rolling accuracy window. */
import { db } from '../store/db.js';
import { progress, newRecord } from '../store/progress.js';
import { days } from '../store/days.js';
import { settings } from '../store/settings.js';
import { schedule, Rating, State } from './fsrs.js';
import { afterAnswer } from './scaffold.js';

const ACC_WINDOW = 50;

export async function recentAccuracy() {
  const row = await db.get('meta', 'recentAnswers');
  const arr = row?.value || [];
  if (arr.length < 10) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

async function pushAnswer(correct) {
  const row = (await db.get('meta', 'recentAnswers')) || { id: 'recentAnswers', value: [] };
  row.value.push(correct ? 1 : 0);
  if (row.value.length > ACC_WINDOW) row.value = row.value.slice(-ACC_WINDOW);
  await db.put('meta', row);
}

/** Records due now, oldest first, within today's remaining cap. */
export async function dueQueue(now = new Date()) {
  const all = (await progress.all()) || [];
  const nowMs = now.getTime();
  const due = all.filter((r) => r.due && Date.parse(r.due) <= nowMs)
    .sort((a, b) => Date.parse(a.due) - Date.parse(b.due));
  const today = await days.get();
  const cap = Math.max(0, Number(settings.get('dailyReviewCap')) - today.reviews);
  return { queue: due.slice(0, cap), total: due.length, capped: Math.max(0, due.length - cap) };
}

/** Summary used by Home: what is due, how many new items are allowed today. */
export async function dailyPlan(now = new Date()) {
  const { queue, total, capped } = await dueQueue(now);
  const today = await days.get();
  const acc = await recentAccuracy();
  let allowance = Number(settings.get('dailyNew'));
  let eased = false;
  if (acc != null && acc < 0.7) { allowance = Math.max(1, Math.floor(allowance / 2)); eased = true; }
  const newLeft = Math.max(0, allowance - today.newItems);
  return { due: queue.length, dueTotal: total, capped, newAllowance: allowance, newLeft, accuracy: acc, eased, today };
}

/** Enter items into the SRS after a lesson: a first Good rating puts them on the learning steps. */
export async function learnItems(items, now = new Date()) {
  let added = 0;
  for (const { id, type, display } of items) {
    const existing = await progress.get(id);
    if (existing) continue;
    let rec = newRecord(id, type);
    rec = schedule(rec, Rating.Good, now);
    rec.display = display || (type === 'kanji' || type === 'grammar' ? 3 : 1);
    await progress.save(rec);
    added += 1;
  }
  if (added) await days.log({ newItems: added });
  return added;
}

/** Apply a rating to a record, persist it, and log the answer. */
export async function answer(rec, rating, now = new Date()) {
  let next = schedule(rec, rating, now);
  next = afterAnswer(next, rating);
  await progress.save(next);
  const correct = rating !== Rating.Again;
  await days.log({ reviews: 1, answered: 1, correct: correct ? 1 : 0 });
  await pushAnswer(correct);
  return next;
}

export function isLearning(rec) { return rec.state === State.Learning || rec.state === State.Relearning; }
