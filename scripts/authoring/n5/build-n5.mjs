// Run: node scripts/authoring/n5/build-n5.mjs  (after check-vocab.mjs has produced cache/jmdict-n5.json
// and fetch-edrdg.mjs kanji has produced cache/kanjidic-n5.json)
// Builds data/n5/{kanji,vocab,grammar,readings,listening,units}.json from the
// authored sources plus KANJIDIC2 / JMdict / KanjiVG extracts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dir = path.dirname(fileURLToPath(import.meta.url));

import { KANJI } from './n5-kanji-src.mjs';
import { VOCAB } from './n5-vocab-src.mjs';
import { GRAMMAR } from './n5-grammar-src.mjs';
import { READINGS, LISTENING } from './n5-readings-src.mjs';
import { kanaToRomaji } from '../../../js/engine/romaji.js';
import { markUnknown, segments, isKanji, markupToKana } from '../../../js/engine/furigana.js';

const ROOT = path.resolve(__dir, '../../..');
const S = path.join(__dir, '../cache'); // build inputs from fetch-edrdg (gitignored)
const kanjidic = JSON.parse(fs.readFileSync(`${S}/kanjidic-n5.json`, 'utf8'));
const strokes = JSON.parse(fs.readFileSync(`${ROOT}/data/strokes/kanji-n5.json`, 'utf8'));
const jm = JSON.parse(fs.readFileSync(`${S}/jmdict-n5.json`, 'utf8'));
const UNIT_SIZE = 5;
const problems = [];

/* ---------- kanji ---------- */
const kanjiUnit = new Map();
const kanji = KANJI.map(([char, mnemonic], i) => {
  const unit = Math.floor(i / UNIT_SIZE) + 1;
  kanjiUnit.set(char, unit);
  const kd = kanjidic[char];
  if (!kd) problems.push(`no kanjidic for ${char}`);
  const kun = (kd?.kun || []).map((k) => k.replace(/^-/, '').replace(/-$/, '').replace('.', '･')).filter((k, idx, arr) => arr.indexOf(k) === idx);
  const components = (strokes[char]?.components || []).filter((c) => c !== char).slice(0, 4);
  return {
    id: `kanji:${char}`, char, level: 'n5', unit, order: unit * 100 + (i % UNIT_SIZE),
    meanings: (kd?.meanings || []).filter((m) => !/radical \(no\./.test(m)).slice(0, 3), on: (kd?.on || []).slice(0, 3), kun: kun.slice(0, 4),
    strokes: kd?.strokes, radicals: components, mnemonic,
    examples: [] // filled after vocab
  };
});
const kanjiSet = new Set(kanjiUnit.keys());

/* ---------- vocab ---------- */
const rows = VOCAB.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => { const [jp, kana, meaning, pos] = l.split('|'); return { jp, kana, meaning, pos }; });
const totalUnits = Math.ceil(KANJI.length / UNIT_SIZE);
const seenIds = new Set();
const vocab = [];
rows.forEach((r, i) => {
  const chars = [...r.jp].filter(isKanji);
  const n5chars = chars.filter((c) => kanjiSet.has(c));
  const foreign = chars.filter((c) => !kanjiSet.has(c));
  const themeUnit = Math.min(totalUnits, Math.max(1, Math.ceil(((i + 1) / rows.length) * totalUnits)));
  const unit = n5chars.length ? Math.max(...n5chars.map((c) => kanjiUnit.get(c))) : themeUnit;
  const romaji = kanaToRomaji(r.kana);
  let id = `vocab:n5:${romaji.replace(/[^a-z]/g, '')}-${r.jp}`;
  if (seenIds.has(id)) { problems.push(`duplicate id ${id}`); }
  seenIds.add(id);
  const ref = jm[`${r.jp}|${r.kana}`];
  const entry = {
    id, jp: r.jp, kana: r.kana, romaji, level: 'n5', unit, order: unit * 100 + 20 + (i % 40) / 100,
    meanings: r.meaning.split(';').map((m) => m.trim()).filter(Boolean), pos: [r.pos],
    kanji: n5chars.map((c) => `kanji:${c}`),
    furiganaException: foreign.length > 0 ? true : undefined,
    verified: ref?.found ? true : undefined,
    common: ref?.common ? true : undefined
  };
  if (segments(r.jp, r.kana).some((s) => s.ruby === r.kana && s.text !== r.jp)) problems.push(`furigana alignment failed for ${r.jp} / ${r.kana}`);
  vocab.push(entry);
});
// Kanji examples: words containing the kanji, earliest unit first, prefer verified/common words
for (const k of kanji) {
  const cands = vocab.filter((v) => v.jp.includes(k.char)).sort((a, b) => a.unit - b.unit || (b.common ? 1 : 0) - (a.common ? 1 : 0) || a.jp.length - b.jp.length);
  const early = cands.filter((v) => v.unit <= k.unit).slice(0, 4);
  const later = cands.filter((v) => v.unit > k.unit).slice(0, Math.max(0, 2 - early.length));
  k.examples = [...early, ...later].map((v) => v.id);
  if (!k.examples.length) problems.push(`no example word for ${k.char}`);
}

const taughtBy = (unit) => (c) => kanjiSet.has(c) && kanjiUnit.get(c) <= unit;

/* ---------- exercise annotation: wrap untaught kanji using vocabulary readings ---------- */
// Map every kanji run that appears inside a vocabulary word to its reading.
const runMap = new Map();
for (const v of vocab) for (const sg of segments(v.jp, v.kana)) if (sg.ruby && [...sg.text].every(isKanji) && !runMap.has(sg.text)) runMap.set(sg.text, sg.ruby);
// 来る is irregular: the reading of 来 depends on what follows.
const KURU = [['来ま', 'き'], ['来た', 'き'], ['来て', 'き'], ['来な', 'こ'], ['来れ', 'こ'], ['来い', 'こ'], ['来よ', 'こ'], ['来る', 'く']];
function annotate(text, unit) {
  if (!text) return text;
  const known = taughtBy(unit);
  let out = '', i = 0;
  while (i < text.length) {
    if (!isKanji(text[i])) { out += text[i]; i++; continue; }
    let j = i; while (j < text.length && isKanji(text[j])) j++;
    let run = text.slice(i, j);
    // longest sub-run from the start that we know the reading of
    let found = null;
    // Context-dependent readings that the vocabulary map cannot decide alone.
    const before = text[i - 1] || '', after = text[j] || '';
    const digit = /[一二三四五六七八九十百千何]/;
    const CONTEXT = [
      [run[0] === '時' && digit.test(before), '時', 'じ'], [run[0] === '分' && digit.test(before), '分', 'ふん'], [run[0] === '人' && digit.test(before), '人', 'にん'],
      [run[0] === '月' && digit.test(before), '月', 'がつ'], [run[0] === '日' && digit.test(before) && !/曜/.test(after), '日', 'にち'], [run[0] === '回' && digit.test(before), '回', 'かい'],
      [run[0] === '何' && /[でじ時人番階冊本枚回月日]/.test(run[1] || after), '何', 'なん'], [run[0] === '何', '何', 'なに']
    ];
    for (const [cond, sub, ruby] of CONTEXT) if (cond && !found) found = [sub, ruby];
    for (let len = run.length; len >= 1 && !found; len--) {
      const sub = run.slice(0, len);
      if (sub === '来') { const k = KURU.find(([pat]) => text.startsWith(pat, i)); if (k) found = [sub, k[1]]; }
      else if (runMap.has(sub)) found = [sub, runMap.get(sub)];
    }
    if (!found) { problems.push(`no vocabulary covers "${run}" in exercise "${text}"`); out += run; i = j; continue; }
    const [sub, ruby] = found;
    out += [...sub].every(known) ? sub : `{${sub}|${ruby}}`;
    i += sub.length;
  }
  return out;
}

/* ---------- alignment hints from vocabulary: offset of each kanji run -> its reading ---------- */
const surfacesLongest = [...new Set(vocab.map((v) => v.jp))].sort((a, b) => b.length - a.length);
function hintsFor(text) {
  const hints = new Map();
  let i = 0;
  while (i < text.length) {
    const sf = surfacesLongest.find((w) => w.length > 1 && text.startsWith(w, i)) || surfacesLongest.find((w) => text.startsWith(w, i));
    if (!sf) { i++; continue; }
    const v = vocab.find((x) => x.jp === sf);
    let q = i;
    for (const sg of segments(v.jp, v.kana)) { if (sg.ruby && !hints.has(q)) hints.set(q, sg.ruby); q += sg.text.length; }
    i += sf.length;
  }
  return hints;
}
// Align sentence by sentence so one ambiguous sentence cannot derail the whole passage.
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
  return { id: `gram:n5:${g.id}`, level: 'n5', unit: g.unit, order, title: g.title, pattern: g.pattern, summary: g.summary, explanation: g.explanation, examples, mistakes: g.mistakes, exercises };
});

/* ---------- readings & listening ---------- */
const readings = READINGS.map((r, i) => {
  const marked = mark(r.text, r.kana, r.unit);
  if (marked == null) problems.push(`reading ${r.id}: cannot align text with kana`);
  const questions = r.questions.map((q) => ({ ...q, q: mark(q.q, q.qKana, r.unit) ?? q.q }));
  return { id: r.id, level: 'n5', unit: r.unit, order: r.unit * 100 + 90, title: r.title, en: r.en, text: marked ?? r.text, kana: r.kana, enText: r.enText, questions };
});
const listening = LISTENING.map((l) => ({
  id: l.id, level: 'n5', unit: l.unit, order: l.unit * 100 + 95, type: l.type, title: l.title,
  text: l.items.map((it) => it.text).join(' '),
  items: l.items.map((it) => ({ ...it, text: mark(it.text, it.kana, l.unit) ?? it.text, questions: it.questions?.map((q) => ({ ...q, q: mark(q.q, q.qKana, l.unit) ?? q.q })) })),
  questions: l.items.flatMap((it) => it.questions || [])
}));

/* ---------- units ---------- */
const UNIT_TITLES = ['Numbers 1–5', 'Numbers 6–10', 'Big numbers, money, year', 'Days: sun, moon, fire, water, tree', 'Gold, earth, book, person', 'Size and place', 'Nature and body', 'Body and people', 'Family', 'School', 'Time', 'Before, after, every', 'Directions and countries', 'Movement', 'Perception', 'Actions', 'Transport and places', 'Society and weather', 'Colours and sky', 'Living things', 'Standing, town, safety'];
const units = [];
for (let u = 1; u <= totalUnits; u++) {
  units.push({
    id: `unit:n5:${String(u).padStart(2, '0')}`, no: u, level: 'n5', title: UNIT_TITLES[u - 1] || `Unit ${u}`,
    kanji: kanji.filter((k) => k.unit === u).map((k) => k.id),
    vocab: vocab.filter((v) => v.unit === u).map((v) => v.id),
    grammar: grammar.filter((g) => g.unit === u).map((g) => g.id),
    readings: readings.filter((r) => r.unit === u).map((r) => r.id),
    listening: listening.filter((l) => l.unit === u).map((l) => l.id)
  });
}

fs.mkdirSync(`${ROOT}/data/n5`, { recursive: true });
const write = (name, data) => fs.writeFileSync(`${ROOT}/data/n5/${name}.json`, JSON.stringify(data, null, 1), 'utf8');
write('kanji', kanji); write('vocab', vocab); write('grammar', grammar); write('readings', readings); write('listening', listening); write('units', units);
console.log(`kanji ${kanji.length}, vocab ${vocab.length} (${vocab.filter((v) => v.furiganaException).length} furigana exceptions, ${vocab.filter((v) => v.verified).length} verified), grammar ${grammar.length}, readings ${readings.length}, listening ${listening.length}, units ${units.length}`);
console.log('vocab per unit:', units.map((u) => u.vocab.length).join(' '));
if (problems.length) { console.log('PROBLEMS:\n' + problems.join('\n')); process.exit(1); }
