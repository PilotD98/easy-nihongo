// Run: node scripts/authoring/n5/check-vocab.mjs  -> verifies n5-vocab-src.mjs against JMdict, writes cache/jmdict-n5.json
// Parse the vocab source, run JMdict lookup, report problems.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dir = path.dirname(fileURLToPath(import.meta.url));

import { execSync } from 'node:child_process';
import { VOCAB } from './n5-vocab-src.mjs';
const S = path.join(__dir, '../cache');
const ROOT = path.resolve(__dir, '../../..');
const rows = VOCAB.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => { const [jp, kana, meaning, pos] = l.split('|'); return { jp, kana, meaning, pos }; });
const seen = new Map();
const dups = [];
for (const r of rows) { const k = r.jp + '|' + r.kana; if (seen.has(k)) dups.push(k); seen.set(k, r); }
console.log('entries', rows.length, 'unique', seen.size, 'dups', dups.join(', '));
fs.writeFileSync(`${S}/n5-words.json`, JSON.stringify([...seen.values()].map(({ jp, kana, pos }) => ({ jp, kana, pos }))));
fs.mkdirSync(S, { recursive: true });
execSync(`node "${path.join(ROOT, 'scripts/fetch-edrdg.mjs')}" words "${S}/n5-words.json" "${S}/jmdict-n5.json"`, { stdio: 'inherit' });
const jm = JSON.parse(fs.readFileSync(`${S}/jmdict-n5.json`, 'utf8'));
const missing = [];
for (const [k, v] of Object.entries(jm)) if (!v.found) missing.push(k);
console.log('NOT FOUND (' + missing.length + '):', missing.join('  '));
// Show glosses for a sample to eyeball meaning agreement
let shown = 0;
for (const r of seen.values()) {
  const e = jm[r.jp + '|' + r.kana];
  if (!e || !e.found) continue;
  const g = e.glosses.flat().join('; ').toLowerCase();
  const mine = r.meaning.toLowerCase().split(/[;(]/)[0].trim().replace(/^to /, '').replace(/^\(my\) /, '');
  if (!g.includes(mine.split(' ')[0].replace(/[^a-z]/g, ''))) { console.log('CHECK', r.jp, r.kana, '| mine:', r.meaning, '| jmdict:', e.glosses.flat().slice(0, 5).join('; ')); shown++; }
}
console.log('flagged for check:', shown);
