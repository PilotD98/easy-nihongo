/* Text preparation for speech.
   - ttsText(): what to hand the speech synthesiser so that particles は/へ are
     read "wa"/"e" (kana-only text is ambiguous to a TTS engine; kanji text is
     not, and the line's romaji tells us which は is a particle).
   - readingDict()/toKanaReading(): turn the recogniser's kanji back into kana
     so it can be compared beat by beat with the kana target. */
import { toHiragana, kanaToRomaji } from './romaji.js';

const HAN = /\p{Script=Han}/u;
// Runs the recogniser may spell differently from the kana target: kanji, digits, Latin letters.
const RUN = /[\p{Script=Han}0-9A-Za-z\-]/u;
const PUNCT = /[\s、。，．・！？!?「」『』（）()\-–—～~…:：;；"'“”]/g;
const SLOT = /\[[^\]]+\]/g;

export function hasKanji(s) { return HAN.test(String(s || '')); }

/** `{漢字|かんじ}` furigana markup -> plain kanji text. */
export function plainText(markup) { return String(markup || '').replace(/\{([^|}]+)\|[^}]*\}/g, '$1'); }

/* ---------- particles ---------- */

/** Normalise an authored romaji string for alignment: lowercase letters only, macrons expanded. */
function normRomaji(r) {
  return String(r || '').toLowerCase()
    .replace(/ā/g, 'aa').replace(/ī/g, 'ii').replace(/ū/g, 'uu').replace(/ē/g, 'ee').replace(/ō/g, 'ou')
    .replace(/[^a-z]/g, '');
}

/** Cheapest-path alignment of two strings; returns for each index of `a` the aligned char of `b` or null. */
function alignChars(a, b) {
  const n = a.length, m = b.length;
  const D = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) D[i][0] = i;
  for (let j = 1; j <= m; j++) D[0][j] = j;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    D[i][j] = Math.min(D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), D[i - 1][j] + 1, D[i][j - 1] + 1);
  }
  const map = new Array(n).fill(null);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    if (D[i][j] === D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) { map[i - 1] = b[j - 1]; i--; j--; }
    else if (D[i][j] === D[i - 1][j] + 1) { i--; }
    else { j--; }
  }
  return map;
}

/**
 * Rewrite particle は as わ and particle へ as え in kana text, using the
 * line's romaji ("wa"/"e") to tell particles from ordinary syllables. Without
 * romaji, only the safe patterns (こんにちは, では, は before punctuation) change.
 */
export function particleFix(kana, romaji) {
  let s = String(kana || '');
  if (!s) return s;
  if (romaji) {
    const target = normRomaji(romaji);
    // Generate romaji from the kana with every は/へ marked so we can find them after alignment.
    const marks = [];
    let gen = '';
    const hira = toHiragana(s);
    for (let i = 0; i < hira.length; i++) {
      const ch = hira[i];
      if (ch === 'は' || ch === 'へ') { marks.push({ idx: i, pos: gen.length, ch }); gen += ch === 'は' ? 'ha' : 'he'; continue; }
      const two = hira.slice(i, i + 2);
      const r = kanaToRomaji(two);
      if (two.length === 2 && 'ゃゅょぁぃぅぇぉ'.includes(two[1])) { gen += r.replace(/[^a-z]/g, ''); i++; continue; }
      gen += kanaToRomaji(ch).replace(/[^a-z]/g, '');
    }
    const map = alignChars(gen, target);
    const out = [...s];
    for (const m of marks) {
      const h = map[m.pos];
      const v = map[m.pos + 1];
      if (m.ch === 'は' && h === 'w') out[m.idx] = 'わ';
      if (m.ch === 'へ' && h === null && v === 'e') out[m.idx] = 'え';
      if (m.ch === 'へ' && h === 'e') out[m.idx] = 'え';
    }
    return out.join('');
  }
  return s.replace(/(こんにち|こんばん|で|それ|これ|あれ|わたし|ぼく)は/g, '$1わ').replace(/は(?=[、。，！？!?\s]|$)/g, 'わ');
}

/**
 * Text to send to the synthesiser. Kanji text (the line's `kanji` spelling,
 * if given) is preferred: engines read particles and accents correctly from
 * normal orthography. Otherwise the kana is particle-fixed from the romaji.
 */
export function ttsText(text, { romaji = null, kanji = null } = {}) {
  const t = String(text || '').replace(SLOT, '');
  if (hasKanji(t)) return t;
  const k = kanji ? plainText(kanji).replace(SLOT, '') : '';
  if (k && hasKanji(k)) return k;
  return particleFix(t, romaji);
}

/* ---------- recogniser output -> kana ---------- */

const NUM = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
/** 十九 -> "19", 二十一 -> "21", 三千 -> "3000". Returns null if not a kanji numeral. */
function kanjiNumeral(s) {
  if (!/^[一二三四五六七八九十百千]+$/.test(s)) return null;
  let total = 0, cur = 0;
  for (const ch of s) {
    if (ch in NUM) cur = NUM[ch];
    else { const unit = ch === '十' ? 10 : ch === '百' ? 100 : 1000; total += (cur || 1) * unit; cur = 0; }
  }
  return String(total + cur);
}

/**
 * Build kanji-run -> kana-reading pairs from a kanji spelling and its kana
 * reading of the same sentence (the authored `alt` and `jp` of a line).
 */
export function pairReadings(kanji, kana) {
  // Punctuation is a useful boundary between kanji runs (夜、十九時), so try with it first.
  const a = pairRuns(plainText(kanji).replace(SLOT, ''), String(kana || '').replace(SLOT, ''));
  const b = pairRuns(plainText(kanji).replace(SLOT, '').replace(PUNCT, ''), String(kana || '').replace(SLOT, '').replace(PUNCT, ''));
  return a.length >= b.length ? a : b;
}

function pairRuns(kIn, rIn) {
  const k = toHiragana(kIn), r = toHiragana(rIn);
  if (!k || !r || !RUN.test(k)) return [];
  const tokens = k.match(/[\p{Script=Han}0-9A-Za-z\-]+|[^\p{Script=Han}0-9A-Za-z\-]+/gu) || [];
  const out = [];
  let cursor = 0, pending = null;
  for (const tok of tokens) {
    if (RUN.test(tok)) { pending = tok; continue; }
    if (pending) {
      const pos = r.indexOf(tok, cursor + pending.length);
      if (pos < 0) return out;
      out.push([pending, r.slice(cursor, pos)]);
      cursor = pos + tok.length; pending = null;
    } else {
      const pos = r.indexOf(tok, cursor);
      if (pos < 0) return out;
      cursor = pos + tok.length;
    }
  }
  if (pending && cursor < r.length) out.push([pending, r.slice(cursor)]);
  return out;
}

/** A reading dictionary (Map kanji -> kana) from many {kanji, kana} pairs, with digit variants of kanji numerals. */
export function readingDict(pairs) {
  const dict = new Map();
  for (const { kanji, kana } of pairs) {
    for (const spelling of Array.isArray(kanji) ? kanji : [kanji]) {
      if (!spelling) continue;
      for (const [run, reading] of pairReadings(spelling, kana)) {
        if (!reading) continue;
        if (!dict.has(run)) dict.set(run, reading);
        // 一週間 -> also "1週間", 七時 -> "7時", 二人 -> "2人"
        const m = run.match(/^([一二三四五六七八九十百千]+)(.*)$/u);
        if (m) {
          const n = kanjiNumeral(m[1]);
          if (n) { const v = n + m[2]; if (!dict.has(v)) dict.set(v, reading); }
        }
      }
    }
  }
  return dict;
}

/** Replace kanji (and digit) runs in `said` with readings from the dictionary, longest first. */
export function toKanaReading(said, dict) {
  let s = String(said || '');
  if (!dict || !dict.size || !/[\p{Script=Han}0-9０-９]/u.test(s)) return s;
  s = s.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0)).replace(/(\d),(\d)/g, '$1$2');
  const keys = [...dict.keys()].sort((a, b) => b.length - a.length);
  for (const k of keys) if (s.includes(k)) s = s.split(k).join(dict.get(k));
  return s;
}
