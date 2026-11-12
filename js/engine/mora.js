/* Mora segmentation and pronunciation comparison.
   A mora is one beat: a kana, a kana + small ゃゅょ (or ぁぃぅぇぉ), small っ, ん, or ー.
   compare(target, said) aligns the two mora sequences and returns, per target
   mora, whether it was matched, plus a score and targeted tips. */
import { toHiragana, kanaToRomaji } from './romaji.js';

const SMALL = 'ゃゅょぁぃぅぇぉゎ';
const PUNCT = /[\s、。，．・！？!?「」『』（）()\-–—～~…:：;；"'“”]/g;

/** Strip punctuation and spaces, convert katakana to hiragana. */
export function cleanKana(s) { return toHiragana(String(s || '')).replace(PUNCT, ''); }

/** Split kana text into mora. Characters that are not kana are kept as single tokens. */
export function toMora(text) {
  const s = cleanKana(text);
  const out = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const next = s[i + 1];
    if (next && SMALL.includes(next)) { out.push(ch + next); i += 1; }
    else out.push(ch);
  }
  return out;
}

export function hasKanji(s) { return /\p{Script=Han}/u.test(s); }

/** Vowel of a mora (a, i, u, e, o) or '' for っ/ん/ー. */
export function vowelOf(m) {
  if (m === 'っ' || m === 'ん') return '';
  if (m === 'ー') return 'ー';
  const r = kanaToRomaji(m).replace(/'/g, '');
  return 'aiueo'.includes(r.slice(-1)) ? r.slice(-1) : '';
}
function consonantOf(m) { const r = kanaToRomaji(m).replace(/'/g, ''); return r.replace(/[aiueo]+$/, ''); }
const VOICING = { k: 'g', s: 'z', t: 'd', h: 'b', sh: 'j', ch: 'j', ts: 'z', f: 'b', p: 'b' };
function voicingPair(a, b) {
  const ca = consonantOf(a), cb = consonantOf(b);
  return VOICING[ca] === cb || VOICING[cb] === ca || (ca === 'h' && cb === 'p') || (ca === 'p' && cb === 'h');
}

/**
 * Align target mora to said mora (Levenshtein with backtrace).
 * Target tokens equal to '*' are wildcards that match any run of said mora
 * (used for slots such as a name in a model answer).
 * Returns { ops: [{ type: 'match'|'sub'|'del'|'ins', t, s }], matched, total }.
 */
export function align(target, said) {
  const n = target.length, m = said.length;
  const D = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  const B = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(null));
  for (let i = 1; i <= n; i++) { D[i][0] = target[i - 1] === '*' ? D[i - 1][0] : i; B[i][0] = 'del'; }
  for (let j = 1; j <= m; j++) { D[0][j] = j; B[0][j] = 'ins'; }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const t = target[i - 1], s = said[j - 1];
      if (t === '*') {
        // wildcard: consume zero or more said mora at no cost
        const skip = D[i - 1][j];            // wildcard matches nothing here
        const eat = D[i][j - 1];             // wildcard eats said[j-1]
        if (eat <= skip) { D[i][j] = eat; B[i][j] = 'wild'; } else { D[i][j] = skip; B[i][j] = 'wildskip'; }
        continue;
      }
      const same = equalMora(t, s);
      const diag = D[i - 1][j - 1] + (same ? 0 : 1);
      const del = D[i - 1][j] + 1;
      const ins = D[i][j - 1] + 1;
      if (diag <= del && diag <= ins) { D[i][j] = diag; B[i][j] = same ? 'match' : 'sub'; }
      else if (del <= ins) { D[i][j] = del; B[i][j] = 'del'; }
      else { D[i][j] = ins; B[i][j] = 'ins'; }
    }
  }
  const ops = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    const b = i > 0 && j > 0 ? B[i][j] : i > 0 ? (target[i - 1] === '*' ? 'wildskip' : 'del') : 'ins';
    if (b === 'match' || b === 'sub') { ops.push({ type: b, t: target[i - 1], s: said[j - 1] }); i--; j--; }
    else if (b === 'del') { ops.push({ type: 'del', t: target[i - 1] }); i--; }
    else if (b === 'ins') { ops.push({ type: 'ins', s: said[j - 1] }); j--; }
    else if (b === 'wild') { ops.push({ type: 'wild', t: '*', s: said[j - 1] }); j--; }
    else { ops.push({ type: 'wildskip', t: '*' }); i--; }
  }
  ops.reverse();
  const scored = ops.filter((o) => o.type === 'match' || o.type === 'sub' || o.type === 'del');
  const matched = ops.filter((o) => o.type === 'match').length;
  return { ops, matched, total: scored.length };
}

function equalMora(a, b) {
  if (a === b) return true;
  // treat a long-vowel mark as equal to the vowel it lengthens (ー vs う after お, etc.) at mora level only loosely
  return false;
}

/**
 * Compare a target phrase with what was said (either may be kana or romaji).
 * Returns { score (0-100), ops, tips: [string], said, saidHasKanji }.
 */
export function compare(target, said) {
  const t = toMora(target.replace(/\[[^\]]+\]/g, '*'));  // [slot] -> wildcard token
  const tm = t.flatMap((x) => (x.includes('*') ? ['*'] : [x]));
  const saidClean = cleanKana(said);
  const sm = toMora(saidClean);
  const { ops, matched, total } = align(tm, sm);
  const score = total ? Math.round((matched / total) * 100) : 0;
  return { score, ops, tips: tipsFor(ops, tm), said: saidClean, saidHasKanji: hasKanji(said) };
}

/** Pick the best of several recognizer alternatives against a target. */
export function bestOf(target, alternatives) {
  let best = null;
  for (const alt of alternatives) {
    const r = compare(target, alt);
    if (!best || r.score > best.score) best = { ...r, transcript: alt };
  }
  return best;
}

function tipsFor(ops, target) {
  const tips = new Set();
  ops.forEach((o, idx) => {
    if (o.type === 'del') {
      const prev = idx > 0 ? ops[idx - 1].t : null;
      if (o.t === 'っ') tips.add('Small っ: stop the sound for one beat before the next consonant, as in がっこう (ga-[pause]-ko-o).');
      else if (o.t === 'ん') tips.add('ん is a full beat on its own: hold the nasal sound a little longer (ほ-ん, not "hon" in one beat).');
      else if (o.t === 'ー' || (prev && vowelOf(o.t) && vowelOf(o.t) === vowelOf(prev))) tips.add(`Long vowel: hold the ${prev ? prev + o.t : o.t} for two full beats.`);
      else if (o.t.length === 2) tips.add(`${o.t} is one beat: glide straight from the consonant into the "y" sound.`);
      else tips.add(`The beat ${o.t} was missing. Say every mora at the same length.`);
    } else if (o.type === 'sub') {
      if (voicingPair(o.t, o.s)) tips.add(`Voicing: ${o.t} and ${o.s} differ only in the voice box. Feel your throat buzz for the voiced one.`);
      else if (o.t.length === 2 && o.s.length === 1) tips.add(`${o.t} is one beat, not two: do not say the small ${o.t[1]} separately.`);
      else if (vowelOf(o.t) && vowelOf(o.t) !== vowelOf(o.s) && consonantOf(o.t) === consonantOf(o.s)) tips.add(`Vowel: ${o.t} came out as ${o.s}. Japanese vowels are short and pure; keep the mouth shape steady.`);
      else if (/^[らりるれろ]/.test(o.t) && /^[だでどらりるれろ]/.test(o.s) === false) tips.add('The Japanese r is a light tap of the tongue behind the teeth, between r, l and d.');
      else tips.add(`${o.t} was heard as ${o.s}.`);
    } else if (o.type === 'ins') {
      if (vowelOf(o.s) && idx > 0 && ops[idx - 1].t && vowelOf(ops[idx - 1].t) === vowelOf(o.s)) tips.add(`Too long: ${ops[idx - 1].t} should be a single short beat here.`);
      else tips.add(`Extra sound ${o.s}: keep the rhythm to exactly ${target.filter((x) => x !== '*').length} beats.`);
    }
  });
  return [...tips].slice(0, 4);
}
