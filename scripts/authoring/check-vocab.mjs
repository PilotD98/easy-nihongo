// Verifies a level's vocabulary source against JMdict and writes cache/jmdict-<level>.json.
//   node scripts/authoring/check-vocab.mjs n4
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, '../..');
const CACHE = path.join(__dir, 'cache');
const LEVEL = process.argv[2];
if (!/^n[1-5]$/.test(LEVEL || '')) { console.error('Usage: node scripts/authoring/check-vocab.mjs n5|n4|n3|n2|n1'); process.exit(2); }

const { VOCAB } = await import(`file:///${path.join(__dir, LEVEL, `${LEVEL}-vocab-src.mjs`).replace(/\\/g, '/')}`);
const rows = VOCAB.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => { const [jp, kana, meaning, pos] = l.split('|'); return { jp, kana, meaning, pos }; });
const seen = new Map();
const dups = [];
for (const r of rows) { const k = r.jp + '|' + r.kana; if (seen.has(k)) dups.push(k); seen.set(k, r); }
// Words already taught at earlier levels
const order = ['n5', 'n4', 'n3', 'n2', 'n1'];
const prior = new Set();
for (const lv of order.slice(0, order.indexOf(LEVEL))) for (const v of JSON.parse(fs.readFileSync(path.join(ROOT, 'data', lv, 'vocab.json'), 'utf8'))) prior.add(v.jp + '|' + v.kana);
const repeats = [...seen.keys()].filter((k) => prior.has(k));
console.log('entries', rows.length, 'unique', seen.size, 'dups', dups.join(', ') || '-', 'already taught earlier:', repeats.join(', ') || '-');

fs.mkdirSync(CACHE, { recursive: true });
fs.writeFileSync(path.join(CACHE, `${LEVEL}-words.json`), JSON.stringify([...seen.values()].map(({ jp, kana, pos }) => ({ jp, kana, pos }))));
execSync(`node "${path.join(ROOT, 'scripts/fetch-edrdg.mjs')}" words "${path.join(CACHE, `${LEVEL}-words.json`)}" "${path.join(CACHE, `jmdict-${LEVEL}.json`)}"`, { stdio: 'inherit' });
const jm = JSON.parse(fs.readFileSync(path.join(CACHE, `jmdict-${LEVEL}.json`), 'utf8'));
const missing = Object.entries(jm).filter(([, v]) => !v.found).map(([k]) => k);
console.log('NOT FOUND (' + missing.length + '):', missing.join('  ') || '-');
let shown = 0;
for (const r of seen.values()) {
  const e = jm[r.jp + '|' + r.kana];
  if (!e || !e.found) continue;
  const g = e.glosses.flat().join('; ').toLowerCase();
  const mine = r.meaning.toLowerCase().split(/[;(]/)[0].trim().replace(/^to /, '').replace(/^\(my\) /, '');
  if (!g.includes(mine.split(' ')[0].replace(/[^a-z]/g, ''))) { console.log('CHECK', r.jp, r.kana, '| mine:', r.meaning, '| jmdict:', e.glosses.flat().slice(0, 5).join('; ')); shown++; }
}
console.log('flagged for check:', shown);
