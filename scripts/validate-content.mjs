#!/usr/bin/env node
/* Content validator. Run: node scripts/validate-content.mjs
   Checks data/index.json and every level file it references:
     - the manifest is well-formed and every referenced file exists and parses
     - every item has the required fields for its type
     - all IDs are unique across the whole curriculum and follow the ID format
     - kana group words use only characters already introduced
     - vocabulary uses only kanji taught earlier, unless marked furiganaException
     - grammar examples/exercises and readings use only taught kanji, unless wrapped in {漢字|かんじ}
     - kanji example words reference existing vocabulary (warns if the word comes later)
   Exit code 1 on errors. Warnings do not fail the build. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ID_RE } from '../js/content/ids.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'data');
const LEVEL_ORDER = ['orientation', 'kana', 'katakana', 'n5', 'n4', 'n3', 'n2', 'n1'];

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const isKanji = (ch) => /\p{Script=Han}/u.test(ch);
const isKana = (s) => /^[\p{Script=Hiragana}\p{Script=Katakana}ー]+$/u.test(s);

function readJSON(rel) {
  const file = path.join(DATA, rel);
  if (!fs.existsSync(file)) { err(rel, 'file does not exist'); return null; }
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { err(rel, `invalid JSON: ${e.message}`); return null; }
}

function requireFields(where, obj, fields) {
  for (const f of fields) {
    const v = obj[f];
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) err(where, `missing required field "${f}"`);
  }
}

/* ---------- manifest ---------- */
const manifest = readJSON('index.json');
if (!manifest) finish();
if (manifest.schema !== 1) err('index.json', `unsupported schema ${manifest.schema}`);
if (!Array.isArray(manifest.levels)) err('index.json', '"levels" must be a list');
if (!Array.isArray(manifest.stages)) err('index.json', '"stages" must be a list');
const levelIds = new Set();
for (const l of manifest.levels || []) {
  requireFields(`index.json level ${l.id}`, l, ['id', 'title']);
  if (levelIds.has(l.id)) err('index.json', `duplicate level id ${l.id}`);
  levelIds.add(l.id);
  if (!LEVEL_ORDER.includes(l.id)) err('index.json', `unknown level id ${l.id} (expected one of ${LEVEL_ORDER.join(', ')})`);
  if (l.files && typeof l.files !== 'object') err(`index.json level ${l.id}`, '"files" must be an object');
}
for (const s of manifest.stages || []) {
  requireFields(`index.json stage ${s.id}`, s, ['id', 'title', 'summary']);
  if (typeof s.no !== 'number') err(`index.json stage ${s.id}`, '"no" must be a number');
  if (s.level && !levelIds.has(s.level)) err(`index.json stage ${s.id}`, `references unknown level ${s.level}`);
}

/* ---------- gather all items ---------- */
const ids = new Map();              // id -> where
const kanjiTaught = new Map();      // char -> { level, order }
const vocabById = new Map();        // id -> { level, order, jp }
const levelData = {};

function registerId(id, where) {
  if (typeof id !== 'string' || !ID_RE.test(id)) { err(where, `invalid id "${id}"`); return; }
  if (ids.has(id)) err(where, `duplicate id "${id}" (also in ${ids.get(id)})`);
  else ids.set(id, where);
}

for (const level of manifest.levels || []) {
  const data = {};
  for (const [kind, rel] of Object.entries(level.files || {})) {
    const json = readJSON(rel);
    if (json) data[kind] = { rel, json };
  }
  levelData[level.id] = data;
}

// Pass 1: register IDs and taught kanji/vocab
for (const [levelId, data] of Object.entries(levelData)) {
  if (data.kana) {
    const { rel, json } = data.kana;
    requireFields(rel, json, ['script', 'groups']);
    for (const g of json.groups || []) {
      const where = `${rel} group ${g.id}`;
      requireFields(where, g, ['id', 'title', 'kind', 'chars']);
      for (const c of g.chars || []) {
        requireFields(`${where} char ${c.char}`, c, ['id', 'char', 'romaji', 'strokes', 'mnemonic']);
        registerId(c.id, `${where} char ${c.char}`);
      }
      for (const w of g.words || []) {
        requireFields(`${where} word ${w.jp}`, w, ['id', 'jp', 'romaji', 'meaning']);
        registerId(w.id, `${where} word ${w.jp}`);
      }
    }
  }
  if (data.kanji) {
    const { rel, json } = data.kanji;
    if (!Array.isArray(json)) err(rel, 'must be a list');
    for (const k of json || []) {
      const where = `${rel} ${k.char || k.id}`;
      requireFields(where, k, ['id', 'char', 'level', 'order', 'meanings', 'strokes', 'radicals', 'mnemonic', 'examples']);
      if (!k.on?.length && !k.kun?.length) err(where, 'needs at least one on or kun reading');
      if (k.level !== levelId) err(where, `level "${k.level}" does not match file level "${levelId}"`);
      if (k.char && k.id !== `kanji:${k.char}`) err(where, `id should be "kanji:${k.char}"`);
      registerId(k.id, where);
      if (k.char) {
        if (kanjiTaught.has(k.char)) err(where, `kanji ${k.char} is also taught in ${kanjiTaught.get(k.char).level}`);
        kanjiTaught.set(k.char, { level: levelId, order: k.order });
      }
    }
  }
  if (data.vocab) {
    const { rel, json } = data.vocab;
    if (!Array.isArray(json)) err(rel, 'must be a list');
    for (const v of json || []) {
      const where = `${rel} ${v.jp || v.id}`;
      requireFields(where, v, ['id', 'jp', 'kana', 'romaji', 'level', 'order', 'meanings', 'pos']);
      if (v.kana && !isKana(v.kana)) err(where, `"kana" must contain only kana: ${v.kana}`);
      if (v.level !== levelId) err(where, `level "${v.level}" does not match file level "${levelId}"`);
      registerId(v.id, where);
      vocabById.set(v.id, { level: levelId, order: v.order, jp: v.jp });
    }
  }
  if (data.grammar) {
    const { rel, json } = data.grammar;
    if (!Array.isArray(json)) err(rel, 'must be a list');
    for (const g of json || []) {
      const where = `${rel} ${g.id}`;
      requireFields(where, g, ['id', 'level', 'order', 'title', 'pattern', 'explanation', 'examples', 'exercises']);
      if ((g.examples || []).length < 3) err(where, 'needs at least 3 examples');
      for (const ex of g.examples || []) requireFields(`${where} example`, ex, ['jp', 'kana', 'romaji', 'en']);
      for (const x of g.exercises || []) {
        requireFields(`${where} exercise`, x, ['type', 'prompt', 'answer']);
        if (!['fill', 'choose', 'order', 'produce'].includes(x.type)) err(`${where} exercise`, `unknown exercise type ${x.type}`);
      }
      registerId(g.id, where);
    }
  }
  for (const kind of ['readings', 'listening']) {
    if (!data[kind]) continue;
    const { rel, json } = data[kind];
    if (!Array.isArray(json)) err(rel, 'must be a list');
    for (const r of json || []) {
      const where = `${rel} ${r.id}`;
      requireFields(where, r, ['id', 'level', 'order', 'title', 'text', 'questions']);
      registerId(r.id, where);
    }
  }
}

/* ---------- Pass 2: prerequisite checks ---------- */
function taughtBefore(ch, level, order) {
  const t = kanjiTaught.get(ch);
  if (!t) return false;
  const li = LEVEL_ORDER.indexOf(t.level), lj = LEVEL_ORDER.indexOf(level);
  return li < lj || (li === lj && t.order < order);
}
/** Kanji in `text` that are not taught before (level, order), ignoring {漢字|かんじ} spans. */
function untaughtKanji(text, level, order) {
  const stripped = String(text).replace(/\{[^|}]+\|[^}]+\}/g, '');
  const out = new Set();
  for (const ch of stripped) if (isKanji(ch) && !taughtBefore(ch, level, order)) out.add(ch);
  return [...out];
}

for (const [levelId, data] of Object.entries(levelData)) {
  // Kana words use only introduced characters
  if (data.kana) {
    const { rel, json } = data.kana;
    const known = new Set();
    for (const g of json.groups || []) {
      for (const c of g.chars || []) known.add(c.char);
      const units = [...known].sort((a, b) => b.length - a.length); // longest match first
      for (const w of g.words || []) {
        let rest = w.jp || '';
        while (rest.length) {
          const unit = units.find((u) => rest.startsWith(u));
          if (!unit) { err(`${rel} group ${g.id} word ${w.jp}`, `uses "${rest[0]}" before it is introduced`); break; }
          rest = rest.slice(unit.length);
        }
      }
    }
  }
  // Vocabulary: kanji taught earlier unless furiganaException
  if (data.vocab) {
    const { rel, json } = data.vocab;
    for (const v of json || []) {
      const missing = untaughtKanji(v.jp, levelId, v.order);
      if (missing.length && !v.furiganaException) err(`${rel} ${v.jp}`, `uses untaught kanji ${missing.join('')} (teach them first, reorder, or set furiganaException: true)`);
      for (const kid of v.kanji || []) if (!ids.has(kid)) err(`${rel} ${v.jp}`, `references unknown kanji id ${kid}`);
      for (const sid of v.sentences || []) if (!ids.has(sid)) warn(`${rel} ${v.jp}`, `references unknown sentence id ${sid}`);
    }
  }
  // Kanji examples reference existing vocab, ideally already known
  if (data.kanji) {
    const { rel, json } = data.kanji;
    for (const k of json || []) {
      for (const vid of k.examples || []) {
        const v = vocabById.get(vid);
        if (!v) { err(`${rel} ${k.char}`, `example ${vid} is not a known vocabulary id`); continue; }
        const li = LEVEL_ORDER.indexOf(v.level), lj = LEVEL_ORDER.indexOf(k.level);
        if (li > lj || (li === lj && v.order > k.order)) warn(`${rel} ${k.char}`, `example ${vid} is taught after this kanji`);
        if (!v.jp.includes(k.char)) err(`${rel} ${k.char}`, `example ${vid} (${v.jp}) does not contain ${k.char}`);
      }
    }
  }
  // Grammar examples and exercises
  if (data.grammar) {
    const { rel, json } = data.grammar;
    for (const g of json || []) {
      for (const ex of g.examples || []) {
        const missing = untaughtKanji(ex.jp, levelId, g.order);
        if (missing.length) err(`${rel} ${g.id} example "${ex.jp}"`, `uses untaught kanji ${missing.join('')} (wrap as {漢字|かんじ} or teach first)`);
      }
      for (const x of g.exercises || []) {
        const missing = untaughtKanji(`${x.prompt} ${x.answer}`, levelId, g.order);
        if (missing.length) err(`${rel} ${g.id} exercise "${x.prompt}"`, `uses untaught kanji ${missing.join('')}`);
      }
      for (const rid of g.requires || []) if (!ids.has(rid)) err(`${rel} ${g.id}`, `requires unknown id ${rid}`);
    }
  }
  // Readings and listening
  for (const kind of ['readings', 'listening']) {
    if (!data[kind]) continue;
    const { rel, json } = data[kind];
    for (const r of json || []) {
      const missing = untaughtKanji(r.text, levelId, Number.MAX_SAFE_INTEGER);
      if (missing.length) err(`${rel} ${r.id}`, `uses kanji not taught by the end of ${levelId}: ${missing.join('')} (wrap as {漢字|かんじ})`);
      for (const uid of r.uses || []) if (!ids.has(uid)) err(`${rel} ${r.id}`, `uses unknown id ${uid}`);
      for (const q of r.questions || []) {
        if (typeof q.answer !== 'number' || !Array.isArray(q.choices) || q.answer < 0 || q.answer >= q.choices.length) err(`${rel} ${r.id}`, 'question needs "choices" and a valid "answer" index');
      }
    }
  }
}

finish();

function finish() {
  const files = Object.values(levelData).reduce((n, d) => n + Object.keys(d).length, 0);
  console.log(`Checked ${files} content file(s), ${ids.size} item(s).`);
  for (const w of warnings) console.log(`warning  ${w}`);
  for (const e of errors) console.log(`error    ${e}`);
  console.log(errors.length ? `\n${errors.length} error(s), ${warnings.length} warning(s).` : `\nOK. ${warnings.length} warning(s).`);
  process.exit(errors.length ? 1 : 0);
}
