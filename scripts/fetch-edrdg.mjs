#!/usr/bin/env node
/* Pulls kanji and word data from the EDRDG dictionaries (KANJIDIC2 and JMdict,
   https://www.edrdg.org/, EDRDG licence: CC BY-SA 4.0) for the characters and
   words the curriculum uses. The full dictionaries are downloaded to a temp
   folder (never into the repo) and only the needed entries are extracted.

   Usage:
     node scripts/fetch-edrdg.mjs kanji "日本語..." out.json
       -> { "日": { strokes, grade, jlpt, freq, on: [], kun: [], meanings: [] }, ... }
     node scripts/fetch-edrdg.mjs words words.json out.json
       words.json: [ { "jp": "食べる", "kana": "たべる", "pos": "v1" }, ... ]  (pos optional, improves homograph choice)
       -> { "食べる|たべる": { found, pos: [], glosses: [], common }, ... }

   Output files are build inputs; the curriculum JSON that ships in data/ is
   produced by the build scripts and credits EDRDG. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import zlib from 'node:zlib';

const RAW = path.join(os.tmpdir(), 'kotoba-edrdg');
const SOURCES = {
  kanjidic: ['kanjidic2.xml.gz', 'http://ftp.edrdg.org/pub/Nihongo/kanjidic2.xml.gz'],
  jmdict: ['JMdict_e.gz', 'http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz']
};

async function load(which) {
  const [name, url] = SOURCES[which];
  fs.mkdirSync(RAW, { recursive: true });
  const file = path.join(RAW, name);
  if (!fs.existsSync(file)) {
    console.log(`Downloading ${url} …`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return zlib.gunzipSync(fs.readFileSync(file)).toString('utf8');
}

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
const all = (re, s) => [...s.matchAll(re)].map((m) => decode(m[1]));

const [, , mode, input, outFile] = process.argv;
if (!mode || !input || !outFile) { console.error('Usage: fetch-edrdg.mjs kanji <chars> <out.json> | words <words.json> <out.json>'); process.exit(2); }

if (mode === 'kanji') {
  const xml = await load('kanjidic');
  const want = new Set([...input].filter((c) => /\p{Script=Han}/u.test(c)));
  const out = {};
  for (const m of xml.matchAll(/<character>([\s\S]*?)<\/character>/g)) {
    const block = m[1];
    const lit = /<literal>(.*?)<\/literal>/.exec(block)?.[1];
    if (!want.has(lit)) continue;
    out[lit] = {
      strokes: Number(/<stroke_count>(\d+)<\/stroke_count>/.exec(block)?.[1] || 0),
      grade: Number(/<grade>(\d+)<\/grade>/.exec(block)?.[1] || 0) || null,
      jlpt: Number(/<jlpt>(\d+)<\/jlpt>/.exec(block)?.[1] || 0) || null,
      freq: Number(/<freq>(\d+)<\/freq>/.exec(block)?.[1] || 0) || null,
      on: all(/<reading r_type="ja_on">(.*?)<\/reading>/g, block),
      kun: all(/<reading r_type="ja_kun">(.*?)<\/reading>/g, block),
      meanings: all(/<meaning>([^<]*?)<\/meaning>/g, block) // English only: other languages carry m_lang
    };
  }
  const missing = [...want].filter((c) => !out[c]);
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
  console.log(`kanji: ${Object.keys(out).length} found${missing.length ? `, missing: ${missing.join('')}` : ''} -> ${outFile}`);
} else if (mode === 'words') {
  const words = JSON.parse(fs.readFileSync(input, 'utf8'));
  const xml = await load('jmdict');
  // Index entries by every keb and reb for quick lookup.
  const byKey = new Map();
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const block = m[1];
    const kebs = all(/<keb>(.*?)<\/keb>/g, block);
    const rebs = all(/<reb>(.*?)<\/reb>/g, block);
    const senses = [...block.matchAll(/<sense>([\s\S]*?)<\/sense>/g)].map((s) => ({
      pos: all(/<pos>&?(.*?);?<\/pos>/g, s[1]).map((p) => p.replace(/^&|;$/g, '')),
      misc: all(/<misc>&?(.*?);?<\/misc>/g, s[1]).map((p) => p.replace(/^&|;$/g, '')),
      gloss: all(/<gloss(?: xml:lang="eng")?>(.*?)<\/gloss>/g, s[1])
    })).filter((s) => s.gloss.length);
    const common = /<ke_pri>|<re_pri>/.test(block);
    const entry = { kebs, rebs, senses, common };
    for (const k of [...kebs, ...rebs]) { if (!byKey.has(k)) byKey.set(k, []); byKey.get(k).push(entry); }
  }
  // Map the curriculum's coarse pos to JMdict pos prefixes, to pick the right homograph.
  const POS_MAP = { n: ['n', 'n-adv', 'n-t'], pn: ['pn'], v5: ['v5'], v1: ['v1'], vs: ['vs', 'n'], vk: ['vk'], 'adj-i': ['adj-i', 'adj-ix'], 'adj-na': ['adj-na'], adv: ['adv', 'adv-to'], prt: ['prt'], exp: ['exp', 'int'], num: ['num'], cnt: ['ctr'], int: ['int'], conj: ['conj'], 'pre-noun': ['adj-pn'] };
  const posScore = (e, pos) => {
    const want = POS_MAP[pos] || [];
    const have = e.senses.flatMap((s) => s.pos);
    return want.some((p) => have.some((h) => h === p || h.startsWith(p + '-') || (p === 'v5' && h.startsWith('v5')))) ? 2 : 0;
  };
  const out = {};
  let found = 0;
  for (const w of words) {
    const key = `${w.jp}|${w.kana}`;
    let lookupJp = w.jp, lookupKana = w.kana;
    if (w.pos === 'vs' && w.jp.endsWith('する') && w.jp !== 'する') { lookupJp = w.jp.slice(0, -2); lookupKana = w.kana.slice(0, -2); }
    const exact = (byKey.get(lookupJp) || []).filter((e) => (e.kebs.length ? e.kebs.includes(lookupJp) && e.rebs.includes(lookupKana) : e.rebs.includes(lookupJp)));
    const kanaOnly = lookupJp === lookupKana ? (byKey.get(lookupKana) || []).filter((e) => e.rebs.includes(lookupKana)) : [];
    const pool = [...exact, ...kanaOnly.filter((e) => !exact.includes(e))];
    const uk = (e) => e.senses.some((s) => s.misc.includes('uk')) ? 1 : 0;
    const kanaWord = lookupJp === lookupKana;
    pool.sort((a, b) => (posScore(b, w.pos) - posScore(a, w.pos)) || (kanaWord ? (uk(b) + (b.kebs.length ? 0 : 1)) - (uk(a) + (a.kebs.length ? 0 : 1)) : 0) || ((b.common ? 1 : 0) - (a.common ? 1 : 0)));
    const e = pool[0];
    if (!e) { out[key] = { found: false }; continue; }
    found++;
    out[key] = {
      found: true, common: e.common,
      kebs: e.kebs, rebs: e.rebs,
      pos: [...new Set(e.senses.flatMap((s) => s.pos))],
      glosses: e.senses.slice(0, 3).map((s) => s.gloss.slice(0, 4))
    };
  }
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
  console.log(`words: ${found} of ${words.length} found -> ${outFile}`);
} else {
  console.error('Unknown mode'); process.exit(2);
}
