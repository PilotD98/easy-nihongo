/* JLPT-level content helpers (N5 now; the same shape serves N4–N1 later):
   load a level, index kanji/vocab/grammar/readings/listening/units, track
   passed units, and resolve readings for scaffolded text. */
import { loadLevel } from './loader.js';
import { loadStrokes } from '../ui/stroke.js';
import { progress } from '../store/progress.js';
import { db } from '../store/db.js';
import { isUnlocked } from './kana.js';
import { isKanji } from '../engine/furigana.js';

const cache = new Map();

export async function loadJlpt(levelId = 'n5') {
  if (cache.has(levelId)) return cache.get(levelId);
  const p = (async () => {
    const level = await loadLevel(levelId);
    const d = level.data;
    let strokes = {};
    try { strokes = await loadStrokes(`kanji-${levelId}`); } catch { /* optional */ }
    const kanji = d.kanji || [], vocab = d.vocab || [], grammar = d.grammar || [], readings = d.readings || [], listening = d.listening || [], units = d.units || [];
    const byId = new Map();
    for (const list of [kanji, vocab, grammar, readings, listening, units]) for (const it of list) byId.set(it.id, it);
    const kanjiByChar = new Map(kanji.map((k) => [k.char, k]));
    const vocabBySurface = new Map();
    for (const v of vocab) { if (!vocabBySurface.has(v.jp)) vocabBySurface.set(v.jp, []); vocabBySurface.get(v.jp).push(v); }
    const vocabByKana = new Map();
    for (const v of vocab) { if (!vocabByKana.has(v.kana)) vocabByKana.set(v.kana, []); vocabByKana.get(v.kana).push(v); }
    // longest-first surface list for tokenising sentences
    const surfaces = [...new Set(vocab.map((v) => v.jp))].sort((a, b) => b.length - a.length);
    return { id: levelId, title: level.title, targets: level.targets, strokes, kanji, vocab, grammar, readings, listening, units, byId, kanjiByChar, vocabBySurface, vocabByKana, surfaces };
  })();
  cache.set(levelId, p);
  p.catch(() => cache.delete(levelId));
  return p;
}

/* ---------- unit progress (meta store) ---------- */
export async function passedUnits(levelId = 'n5') {
  const row = await db.get('meta', `${levelId}:units`);
  return new Set(row?.value || []);
}
export async function markUnitPassed(levelId, unitId) {
  const set = await passedUnits(levelId);
  set.add(unitId);
  await db.put('meta', { id: `${levelId}:units`, value: [...set] });
}
export async function jlptStatus(levelId = 'n5') {
  const lv = await loadJlpt(levelId);
  const passed = await passedUnits(levelId);
  const nextUnit = lv.units.find((u) => !passed.has(u.id)) || null;
  return { level: lv, passed, nextUnit, total: lv.units.length, unlocked: await isUnlocked(levelId) };
}

/** Items of a unit as [{ id, type }] for the scheduler, with their initial display level. */
export function unitItems(lv, unit) {
  const out = [];
  for (const id of unit.kanji) out.push({ id, type: 'kanji', display: 3 });
  for (const id of unit.vocab) { const v = lv.byId.get(id); out.push({ id, type: 'vocab', display: [...v.jp].some(isKanji) ? 3 : 1 }); }
  for (const id of unit.grammar) out.push({ id, type: 'grammar', display: 3 });
  return out;
}

/** Tokenise a sentence into vocabulary matches: [{ text, vocab? }] (longest match first). */
export function tokenize(lv, text) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    const s = lv.surfaces.find((sf) => sf.length > 1 && text.startsWith(sf, i)) || lv.surfaces.find((sf) => text.startsWith(sf, i));
    if (s) { out.push({ text: s, vocab: lv.vocabBySurface.get(s)[0] }); i += s.length; }
    else { out.push({ text: text[i] }); i += 1; }
  }
  return out;
}

/** Look up a word by surface or reading (for tap-to-lookup in readings). */
export function lookup(lv, text) {
  return lv.vocabBySurface.get(text)?.[0] || lv.vocabByKana.get(text)?.[0] || null;
}

/** Display-level records for all items of a level, keyed by id. */
export async function recordsFor(lv) {
  const rows = (await progress.all()) || [];
  const map = new Map();
  for (const r of rows) if (lv.byId.has(r.id)) map.set(r.id, r);
  return map;
}
