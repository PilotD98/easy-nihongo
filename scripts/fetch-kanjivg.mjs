#!/usr/bin/env node
/* Downloads stroke-order data from KanjiVG (CC BY-SA 3.0, https://kanjivg.tagaini.net/)
   and extracts just the stroke paths and number positions into a compact JSON file.
   Only the `d` attribute of <path> elements and the stroke-number coordinates are
   kept; nothing else from the downloaded SVG is embedded in the app.

   Usage:
     node scripts/fetch-kanjivg.mjs hiragana            # U+3041..U+3093 -> data/strokes/hiragana.json
     node scripts/fetch-kanjivg.mjs katakana            # U+30A1..U+30F6 + ー -> data/strokes/katakana.json
     node scripts/fetch-kanjivg.mjs chars 日本語 out.json  # arbitrary characters

   Output format: { "あ": { "strokes": ["M…", "M…"], "numbers": [[x, y], …] }, … }
   KanjiVG's coordinate box is 0 0 109 109. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/';
const RAW_DIR = path.join(os.tmpdir(), 'kotoba-kanjivg-raw'); // untrusted downloads stay out of the repo

const [, , mode, arg, outArg] = process.argv;
let chars = [];
let outFile;
if (mode === 'hiragana') { chars = range(0x3041, 0x3093); outFile = 'data/strokes/hiragana.json'; }
else if (mode === 'katakana') { chars = [...range(0x30a1, 0x30f6), 'ー']; outFile = 'data/strokes/katakana.json'; }
else if (mode === 'chars' && arg && outArg) { chars = [...arg]; outFile = outArg; }
else { console.error('Usage: node scripts/fetch-kanjivg.mjs hiragana|katakana|chars <text> <out.json>'); process.exit(2); }

function range(a, b) { const out = []; for (let c = a; c <= b; c++) out.push(String.fromCodePoint(c)); return out; }
const codeOf = (ch) => ch.codePointAt(0).toString(16).padStart(5, '0');

fs.mkdirSync(RAW_DIR, { recursive: true });
const result = {};
let fetched = 0, cached = 0, missing = [];
for (const ch of chars) {
  const file = path.join(RAW_DIR, `${codeOf(ch)}.svg`);
  let svg;
  if (fs.existsSync(file)) { svg = fs.readFileSync(file, 'utf8'); cached++; }
  else {
    const res = await fetch(BASE + `${codeOf(ch)}.svg`);
    if (!res.ok) { missing.push(ch); continue; }
    svg = await res.text();
    fs.writeFileSync(file, svg);
    fetched++;
  }
  const strokes = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1].replace(/\s+/g, ' ').trim());
  const numbers = [...svg.matchAll(/<text[^>]*transform="matrix\([^)]*\s(-?[\d.]+)\s(-?[\d.]+)\)"[^>]*>(\d+)<\/text>/g)]
    .map((m) => [Number(m[1]), Number(m[2])]);
  // Only keep well-formed path data (letters, digits, punctuation used by SVG paths).
  if (strokes.length && strokes.every((d) => /^[MmLlHhVvCcSsQqTtAaZz0-9 .,\-eE]+$/.test(d))) result[ch] = { strokes, numbers };
  else missing.push(ch);
}

const outPath = path.join(ROOT, outFile);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(result));
console.log(`Wrote ${Object.keys(result).length} characters to ${outFile} (${fetched} downloaded, ${cached} from cache).`);
if (missing.length) console.log(`Not available: ${missing.join(' ')}`);
