/* Kana stage helpers: load a kana file, index its characters and words, and
   track which groups are passed. Works for hiragana now (data/kana.json) and
   katakana later (data/katakana.json). */
import { loadLevel } from './loader.js';
import { loadStrokes } from '../ui/stroke.js';
import { progress } from '../store/progress.js';
import { db } from '../store/db.js';

const cache = new Map();

/** levelId: 'kana' (hiragana) or 'katakana'. */
export async function loadKana(levelId = 'kana') {
  if (cache.has(levelId)) return cache.get(levelId);
  const p = (async () => {
    const level = await loadLevel(levelId);
    const data = level.data.kana;
    const strokes = await loadStrokes(data.script).catch(() => ({}));
    const charsById = new Map(), wordsById = new Map(), charByGlyph = new Map();
    const allChars = [], allWords = [];
    data.groups.forEach((g, gi) => {
      g.index = gi;
      g.chars.forEach((c) => { c.group = g.id; charsById.set(c.id, c); charByGlyph.set(c.char, c); allChars.push(c); });
      g.words.forEach((w) => { w.group = g.id; w.units = tokenize(w.jp, charByGlyph); wordsById.set(w.id, w); allWords.push(w); });
    });
    return { id: levelId, data, strokes, charsById, wordsById, charByGlyph, allChars, allWords, groups: data.groups };
  })();
  cache.set(levelId, p);
  p.catch(() => cache.delete(levelId));
  return p;
}

/** Split a kana string into the taught units (longest match: きゃ before き). */
export function tokenize(jp, charByGlyph) {
  const units = [...charByGlyph.keys()].sort((a, b) => b.length - a.length);
  const out = [];
  let rest = jp;
  while (rest.length) {
    const u = units.find((x) => rest.startsWith(x));
    if (!u) { out.push(rest[0]); rest = rest.slice(1); continue; }
    out.push(u); rest = rest.slice(u.length);
  }
  return out;
}

/** Progress records keyed by glyph, for display-level decisions. */
export async function recordsByGlyph(kana) {
  const map = new Map();
  const rows = (await progress.all()) || [];
  const byId = new Map(rows.map((r) => [r.id, r]));
  for (const c of kana.allChars) { const r = byId.get(c.id); if (r) map.set(c.char, r); }
  return map;
}

/* ---------- stage state (meta store) ---------- */
const key = (levelId, k) => `${levelId}:${k}`;

export async function passedGroups(levelId = 'kana') {
  const row = await db.get('meta', key(levelId, 'passed'));
  return new Set(row?.value || []);
}
export async function markGroupPassed(levelId, groupId) {
  const set = await passedGroups(levelId);
  set.add(groupId);
  await db.put('meta', { id: key(levelId, 'passed'), value: [...set] });
}
export async function examPassed(levelId = 'kana') {
  const row = await db.get('meta', key(levelId, 'exam'));
  return row?.value || null; // { date, score }
}
export async function markExamPassed(levelId, result) {
  await db.put('meta', { id: key(levelId, 'exam'), value: result });
  const unlocked = (await db.get('meta', 'unlocked'))?.value || [];
  const next = levelId === 'kana' ? 'katakana' : levelId === 'katakana' ? 'n5' : null;
  if (next && !unlocked.includes(next)) await db.put('meta', { id: 'unlocked', value: [...unlocked, next] });
}
export async function isUnlocked(levelId) {
  if (levelId === 'orientation' || levelId === 'kana') return true;
  const unlocked = (await db.get('meta', 'unlocked'))?.value || [];
  return unlocked.includes(levelId);
}
export async function orientationDone() { return !!(await db.get('meta', 'orientation:done'))?.value; }
export async function markOrientationDone() { await db.put('meta', { id: 'orientation:done', value: true }); }

/** Stage status for the path and for Home's "Continue learning". */
export async function kanaStatus(levelId = 'kana') {
  const kana = await loadKana(levelId);
  const passed = await passedGroups(levelId);
  const exam = await examPassed(levelId);
  const nextGroup = kana.groups.find((g) => !passed.has(g.id)) || null;
  return { kana, passed, exam, nextGroup, allPassed: !nextGroup, total: kana.groups.length };
}

/** Where "Continue learning" should go. */
export async function nextStep() {
  if (!(await orientationDone())) return { href: '#/learn/orientation', label: 'Start with Orientation', sub: 'How Japanese works · 8 min' };
  const s = await kanaStatus('kana');
  if (s.nextGroup) return { href: `#/lesson/kana/${s.nextGroup.id}`, label: `Hiragana: ${s.nextGroup.title}`, sub: `Group ${s.nextGroup.index + 1} of ${s.total}` };
  if (!s.exam) return { href: '#/exam/kana', label: 'Take the hiragana exam', sub: 'Unlocks katakana' };
  return { href: '#/learn', label: 'Learning path', sub: 'Katakana arrives in the next release' };
}
