// Builds data/situations.json from situations-src.mjs and everyday-src.mjs.
//   node scripts/authoring/speaking/build-situations.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SETS as SITUATIONS } from './situations-src.mjs';
import { SETS as EVERYDAY } from './everyday-src.mjs';
const SETS = [...SITUATIONS, ...EVERYDAY];

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const sets = SETS.map((s) => {
  const base = { id: s.id, mode: s.mode, level: s.level, group: 'situations', title: s.title, summary: s.summary };
  if (s.tips) base.tips = s.tips;
  if (s.mode === 'roleplay') {
    base.partner = s.partner;
    base.turns = s.turns.map(([who, jp, romaji, en, alt]) => ({ who: who === 'y' ? 'you' : 'partner', jp, romaji, en, ...(who === 'y' ? { alt: alt ? [alt] : [] } : {}) }));
  } else if (s.mode === 'question') {
    base.items = s.items.map(([q, qRomaji, qEn, model, modelRomaji, en, alt], i) => ({ id: `${s.id}:${String(i + 1).padStart(2, '0')}`, q, qRomaji, qEn, model, modelRomaji, en, alt: alt ? [alt] : [] }));
  } else {
    base.items = s.items.map(([jp, romaji, en, alt], i) => ({ id: `${s.id}:${String(i + 1).padStart(2, '0')}`, jp, romaji, en, alt: alt ? [alt] : [] }));
  }
  return base;
});
const out = { level: 'situations', note: 'Real-world speaking sets: situations in Japan, natural casual speech, service Japanese. Lines are kana so the recogniser compares by sound; alt holds the kanji spelling.', sets };
fs.writeFileSync(path.join(ROOT, 'data/situations.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`situations.json: ${sets.length} sets, ${sets.reduce((n, s) => n + (s.items || s.turns).length, 0)} lines`);
