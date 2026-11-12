/* Progress records: one per learned item, keyed by the item's stable content ID.
   The scheduling fields follow FSRS so the review engine (added with the
   Hiragana stage) can work directly on these records.

   {
     id: 'kana:h:ka',          // content ID (see data/SCHEMA.md)
     type: 'kana',             // kana | kanji | vocab | grammar | sentence | reading
     state: 0,                 // 0 new, 1 learning, 2 review, 3 relearning (FSRS states)
     due: '2026-11-13T09:00:00.000Z' | null,
     stability: 0,             // FSRS stability (days)
     difficulty: 0,            // FSRS difficulty (1..10)
     reps: 0, lapses: 0,
     lastReview: ISO | null,
     stage: 'new',             // new | learning | familiar | mastered | burned (derived, cached)
     display: 0,               // script scaffolding level 0..4 for this item
     streak: 0,                // consecutive correct answers
     createdAt, updatedAt      // ISO timestamps
   } */
import { db } from './db.js';

export const STAGES = ['new', 'learning', 'familiar', 'mastered', 'burned'];
export const STAGE_LABELS = { new: 'New', learning: 'Learning', familiar: 'Familiar', mastered: 'Mastered', burned: 'Burned' };
export const ITEM_TYPES = ['kana', 'kanji', 'vocab', 'grammar', 'sentence', 'reading'];

export function newRecord(id, type) {
  const now = new Date().toISOString();
  return {
    id, type, state: 0, due: null, stability: 0, difficulty: 0, reps: 0, lapses: 0,
    lastReview: null, stage: 'new', display: 0, streak: 0, createdAt: now, updatedAt: now
  };
}

/** Derive the mastery stage shown in the UI from FSRS stability (days). */
export function stageFor(rec) {
  if (!rec || rec.reps === 0) return 'new';
  if (rec.stability < 7) return 'learning';
  if (rec.stability < 30) return 'familiar';
  if (rec.stability < 180) return 'mastered';
  return 'burned';
}

export const progress = {
  get: (id) => db.get('progress', id),
  all: () => db.getAll('progress'),
  async save(rec) {
    rec.stage = stageFor(rec);
    rec.updatedAt = new Date().toISOString();
    await db.put('progress', rec);
    return rec;
  },
  remove: (id) => db.remove('progress', id),
  count: () => db.count('progress'),

  /** Counts per mastery stage, plus number due now. */
  async summary(now = new Date()) {
    const rows = (await db.getAll('progress')) || [];
    const byStage = Object.fromEntries(STAGES.map((s) => [s, 0]));
    const byType = {};
    let due = 0, nextDue = null;
    const nowMs = now.getTime();
    for (const r of rows) {
      byStage[r.stage || stageFor(r)] += 1;
      byType[r.type] = (byType[r.type] || 0) + 1;
      if (r.due && Date.parse(r.due) <= nowMs) due += 1;
      else if (r.due && (!nextDue || Date.parse(r.due) < Date.parse(nextDue))) nextDue = r.due;
    }
    return { total: rows.length, byStage, byType, due, nextDue };
  }
};
