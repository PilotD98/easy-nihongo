// Builds data/<level>/{kanji,vocab,grammar,readings,listening,units}.json for a JLPT
// level from its authored sources plus KANJIDIC2 / JMdict / KanjiVG extracts.
//   node scripts/authoring/build-level.mjs n5
// Needs: cache/kanjidic-<level>.json (fetch-edrdg kanji), cache/jmdict-<level>.json
// (check-vocab.mjs <level>) and data/strokes/kanji-<level>.json (fetch-kanjivg chars).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kanaToRomaji } from '../../js/engine/romaji.js';
import { markUnknown, segments, isKanji, markupToKana } from '../../js/engine/furigana.js';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, '../..');
const CACHE = path.join(__dir, 'cache');
const LEVEL = process.argv[2];
if (!/^n[1-5]$/.test(LEVEL || '')) { console.error('Usage: node scripts/authoring/build-level.mjs n5|n4|n3|n2|n1'); process.exit(2); }
const LEVEL_ORDER = ['n5', 'n4', 'n3', 'n2', 'n1'];
const PREVIOUS = LEVEL_ORDER.slice(0, LEVEL_ORDER.indexOf(LEVEL));

const src = (name) => import(`file:///${path.join(__dir, LEVEL, name).replace(/\\/g, '/')}`);
const { KANJI, UNIT_TITLES: KANJI_UNIT_TITLES } = await src(`${LEVEL}-kanji-src.mjs`);
const { VOCAB } = await src(`${LEVEL}-vocab-src.mjs`);
const { GRAMMAR } = await src(`${LEVEL}-grammar-src.mjs`);
const { READINGS, LISTENING } = await src(`${LEVEL}-readings-src.mjs`);
const UNIT_SIZE = Number(process.env.UNIT_SIZE || (LEVEL === 'n5' ? 5 : 6));
const UNIT_TITLES = KANJI_UNIT_TITLES || (await src(`${LEVEL}-kanji-src.mjs`)).UNIT_TITLES || [];

const kanjidic = JSON.parse(fs.readFileSync(path.join(CACHE, `kanjidic-${LEVEL}.json`), 'utf8'));
const strokes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/strokes', `kanji-${LEVEL}.json`), 'utf8'));
const jm = JSON.parse(fs.readFileSync(path.join(CACHE, `jmdict-${LEVEL}.json`), 'utf8'));
const problems = [];

// Kanji taught at earlier levels count as known from unit 0.
const priorKanji = new Set();
for (const lv of PREVIOUS) for (const k of JSON.parse(fs.readFileSync(path.join(ROOT, 'data', lv, 'kanji.json'), 'utf8'))) priorKanji.add(k.char);
const priorVocab = PREVIOUS.flatMap((lv) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', lv, 'vocab.json'), 'utf8')));

/* ---------- kanji ---------- */
const kanjiUnit = new Map();
const kanji = KANJI.filter(([char]) => !priorKanji.has(char)).map(([char, mnemonic], i) => {
  const unit = Math.floor(i / UNIT_SIZE) + 1;
  kanjiUnit.set(char, unit);
  const kd = kanjidic[char];
  if (!kd) problems.push(`no kanjidic for ${char}`);
  const kun = (kd?.kun || []).map((k) => k.replace(/^-/, '').replace(/-$/, '').replace('.', '･')).filter((k, idx, arr) => arr.indexOf(k) === idx);
  const components = (strokes[char]?.components || []).filter((c) => c !== char).slice(0, 4);
  return {
    id: `kanji:${char}`, char, level: LEVEL, unit, order: unit * 100 + (i % UNIT_SIZE),
    meanings: (kd?.meanings || []).filter((m) => !/radical \(no\./.test(m)).slice(0, 3), on: (kd?.on || []).slice(0, 3), kun: kun.slice(0, 4),
    strokes: kd?.strokes, radicals: components, mnemonic, examples: []
  };
});
const kanjiSet = new Set(kanjiUnit.keys());
const taughtBy = (unit) => (c) => priorKanji.has(c) || (kanjiSet.has(c) && kanjiUnit.get(c) <= unit);

/* ---------- vocab ---------- */
const rows = VOCAB.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => { const [jp, kana, meaning, pos] = l.split('|'); return { jp, kana, meaning, pos }; });
const totalUnits = Math.max(1, Math.ceil(kanji.length / UNIT_SIZE));
const seenIds = new Set(priorVocab.map((v) => v.id));
const vocab = [];
rows.forEach((r, i) => {
  const chars = [...r.jp].filter(isKanji);
  const levelChars = chars.filter((c) => kanjiSet.has(c));
  const foreign = chars.filter((c) => !kanjiSet.has(c) && !priorKanji.has(c));
  const themeUnit = Math.min(totalUnits, Math.max(1, Math.ceil(((i + 1) / rows.length) * totalUnits)));
  const unit = levelChars.length ? Math.max(...levelChars.map((c) => kanjiUnit.get(c))) : themeUnit;
  const romaji = kanaToRomaji(r.kana);
  const id = `vocab:${LEVEL}:${romaji.replace(/[^a-z]/g, '')}-${r.jp}`;
  if (seenIds.has(id)) problems.push(`duplicate id ${id}`);
  if (priorVocab.some((v) => v.jp === r.jp && v.kana === r.kana)) problems.push(`${r.jp} already taught at an earlier level`);
  seenIds.add(id);
  const ref = jm[`${r.jp}|${r.kana}`];
  vocab.push({
    id, jp: r.jp, kana: r.kana, romaji, level: LEVEL, unit, order: unit * 100 + 20 + (i % 40) / 100,
    meanings: r.meaning.split(';').map((m) => m.trim()).filter(Boolean), pos: [r.pos],
    kanji: [...levelChars, ...chars.filter((c) => priorKanji.has(c))].map((c) => `kanji:${c}`),
    furiganaException: foreign.length > 0 ? true : undefined,
    verified: ref?.found ? true : undefined,
    common: ref?.common ? true : undefined
  });
});

/* ---------- readings for kanji runs, from this level's and earlier vocabulary ---------- */
const allVocab = [...vocab, ...priorVocab];
// Example words for each kanji: this level's words first, then words from earlier levels (already known).
for (const k of kanji) {
  const unitOf = (v) => (v.level === LEVEL ? v.unit : 0);
  const cands = allVocab.filter((v) => v.jp.includes(k.char)).sort((a, b) => unitOf(a) - unitOf(b) || (b.common ? 1 : 0) - (a.common ? 1 : 0) || a.jp.length - b.jp.length);
  const early = cands.filter((v) => unitOf(v) <= k.unit).slice(0, 4);
  const later = cands.filter((v) => unitOf(v) > k.unit).slice(0, Math.max(0, 2 - early.length));
  k.examples = [...early, ...later].map((v) => v.id);
  if (!k.examples.length) problems.push(`no example word for ${k.char}`);
}
const runMap = new Map();
for (const v of allVocab) for (const sg of segments(v.jp, v.kana)) if (sg.ruby && [...sg.text].every(isKanji) && !runMap.has(sg.text)) runMap.set(sg.text, sg.ruby);
const KURU = [['来ま', 'き'], ['来た', 'き'], ['来て', 'き'], ['来な', 'こ'], ['来れ', 'こ'], ['来い', 'こ'], ['来よ', 'こ'], ['来る', 'く']];
function annotate(text, unit) {
  if (!text) return text;
  const known = taughtBy(unit);
  let out = '', i = 0;
  while (i < text.length) {
    if (!isKanji(text[i])) { out += text[i]; i++; continue; }
    let j = i; while (j < text.length && isKanji(text[j])) j++;
    const run = text.slice(i, j);
    let found = null;
    const before = text[i - 1] || '', after = text[j] || '';
    const digit = /[一二三四五六七八九十百千何]/;
    const CONTEXT = [
      [run[0] === '時' && digit.test(before), '時', 'じ'], [run[0] === '分' && digit.test(before), '分', 'ふん'], [run[0] === '人' && digit.test(before), '人', 'にん'],
      [run[0] === '月' && digit.test(before), '月', 'がつ'], [run[0] === '日' && digit.test(before) && !/曜/.test(after), '日', 'にち'], [run[0] === '回' && digit.test(before), '回', 'かい'],
      [run[0] === '何' && /[でじ時人番階冊本枚回月日]/.test(run[1] || after), '何', 'なん'], [run[0] === '何', '何', 'なに'],
      [run === '来' && after === '＿', '来', 'き']
    ];
    for (const [cond, sub, ruby] of CONTEXT) if (cond && !found) found = [sub, ruby];
    for (let len = run.length; len >= 1 && !found; len--) {
      const sub = run.slice(0, len);
      if (sub === '来') { const k = KURU.find(([pat]) => text.startsWith(pat, i)); if (k) found = [sub, k[1]]; }
      else if (runMap.has(sub)) found = [sub, runMap.get(sub)];
    }
    if (!found) { problems.push(`no vocabulary covers "${run}" in "${text}"`); out += run; i = j; continue; }
    const [sub, ruby] = found;
    out += [...sub].every(known) ? sub : `{${sub}|${ruby}}`;
    i += sub.length;
  }
  return out;
}
const surfacesLongest = [...new Set(allVocab.map((v) => v.jp))].sort((a, b) => b.length - a.length);
function hintsFor(text) {
  const hints = new Map();
  let i = 0;
  while (i < text.length) {
    const sf = surfacesLongest.find((w) => w.length > 1 && text.startsWith(w, i)) || surfacesLongest.find((w) => text.startsWith(w, i));
    if (!sf) { i++; continue; }
    const v = allVocab.find((x) => x.jp === sf);
    let q = i;
    for (const sg of segments(v.jp, v.kana)) { if (sg.ruby && !hints.has(q)) hints.set(q, sg.ruby); q += sg.text.length; }
    i += sf.length;
  }
  return hints;
}
function mark(surface, reading, unit) {
  const split = (t) => t.split(/(?<=[。！？])/).filter((x) => x.length);
  const ss = split(surface), rs = split(reading);
  if (ss.length !== rs.length || ss.length <= 1) return markUnknown(surface, reading, taughtBy(unit), hintsFor(surface));
  const out = ss.map((part, i) => markUnknown(part, rs[i], taughtBy(unit), hintsFor(part)));
  return out.some((x) => x == null) ? null : out.join('');
}

/* ---------- grammar ---------- */
const grammar = GRAMMAR.map((g, j) => {
  const order = g.unit * 100 + 50 + (j % 10);
  const examples = g.ex.map(([jp, kana, romaji, en]) => {
    const marked = mark(jp, kana, g.unit);
    if (marked == null) problems.push(`grammar ${g.id}: cannot align "${jp}" with "${kana}"`);
    return { jp: marked ?? jp, kana, romaji, en };
  });
  const exercises = g.exercises.map((x) => ({ ...x, prompt: annotate(x.prompt, g.unit), answer: annotate(x.answer, g.unit), answerKana: markupToKana(annotate(x.answer, 0)), choices: x.choices?.map((c) => annotate(c, g.unit)) }));
  return { id: `gram:${LEVEL}:${g.id}`, level: LEVEL, unit: g.unit, order, title: g.title, pattern: g.pattern, summary: g.summary, explanation: g.explanation, examples, mistakes: g.mistakes, exercises };
});

/* ---------- readings & listening ---------- */
const readings = READINGS.map((r) => {
  const marked = mark(r.text, r.kana, r.unit);
  if (marked == null) problems.push(`reading ${r.id}: cannot align text with kana`);
  const questions = r.questions.map((q) => ({ ...q, q: mark(q.q, q.qKana, r.unit) ?? q.q }));
  return { id: r.id, level: LEVEL, unit: r.unit, order: r.unit * 100 + 90, title: r.title, en: r.en, text: marked ?? r.text, kana: r.kana, enText: r.enText, questions };
});
const listening = LISTENING.map((l) => ({
  id: l.id, level: LEVEL, unit: l.unit, order: l.unit * 100 + 95, type: l.type, title: l.title,
  text: l.items.map((it) => it.text).join(' '),
  items: l.items.map((it) => ({ ...it, text: mark(it.text, it.kana, l.unit) ?? it.text, questions: it.questions?.map((q) => ({ ...q, q: mark(q.q, q.qKana, l.unit) ?? q.q })) })),
  questions: l.items.flatMap((it) => it.questions || [])
}));

/* ---------- units ---------- */
const units = [];
for (let u = 1; u <= totalUnits; u++) {
  units.push({
    id: `unit:${LEVEL}:${String(u).padStart(2, '0')}`, no: u, level: LEVEL, title: UNIT_TITLES[u - 1] || `Unit ${u}`,
    kanji: kanji.filter((k) => k.unit === u).map((k) => k.id),
    vocab: vocab.filter((v) => v.unit === u).map((v) => v.id),
    grammar: grammar.filter((g) => g.unit === u).map((g) => g.id),
    readings: readings.filter((r) => r.unit === u).map((r) => r.id),
    listening: listening.filter((l) => l.unit === u).map((l) => l.id)
  });
}
for (const g of grammar) if (g.unit > totalUnits) problems.push(`grammar ${g.id} unit ${g.unit} beyond ${totalUnits}`);

const outDir = path.join(ROOT, 'data', LEVEL);
fs.mkdirSync(outDir, { recursive: true });
const write = (name, data) => fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(data, null, 1), 'utf8');
write('kanji', kanji); write('vocab', vocab); write('grammar', grammar); write('readings', readings); write('listening', listening); write('units', units);
console.log(`${LEVEL}: kanji ${kanji.length}, vocab ${vocab.length} (${vocab.filter((v) => v.furiganaException).length} furigana exceptions, ${vocab.filter((v) => v.verified).length} verified), grammar ${grammar.length}, readings ${readings.length}, listening ${listening.length}, units ${units.length}`);
console.log('vocab per unit:', units.map((u) => u.vocab.length).join(' '));
if (problems.length) { console.log('PROBLEMS:\n' + [...new Set(problems)].join('\n')); process.exit(1); }
