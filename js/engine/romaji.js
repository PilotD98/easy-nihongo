/* Romaji <-> kana conversion (modified Hepburn) and a live romaji IME for
   typed answers: "ka" -> か, "kya" -> きゃ, "kka" -> っか, "nn"/"n'" -> ん. */

// Hepburn table: romaji -> hiragana (also accepts common wapuro spellings)
const TABLE = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  sa: 'さ', shi: 'し', si: 'し', su: 'す', se: 'せ', so: 'そ',
  ta: 'た', chi: 'ち', ti: 'ち', tsu: 'つ', tu: 'つ', te: 'て', to: 'と',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', hu: 'ふ', he: 'へ', ho: 'ほ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を', nn: 'ん', "n'": 'ん',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  za: 'ざ', ji: 'じ', zi: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  da: 'だ', di: 'ぢ', du: 'づ', de: 'で', do: 'ど',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ',
  sha: 'しゃ', shu: 'しゅ', sho: 'しょ', sya: 'しゃ', syu: 'しゅ', syo: 'しょ',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ',
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ',
  mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
  gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ',
  ja: 'じゃ', ju: 'じゅ', jo: 'じょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ', zya: 'じゃ', zyu: 'じゅ', zyo: 'じょ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ',
  pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
  dya: 'ぢゃ', dyu: 'ぢゅ', dyo: 'ぢょ',
  xa: 'ぁ', xi: 'ぃ', xu: 'ぅ', xe: 'ぇ', xo: 'ぉ', la: 'ぁ', li: 'ぃ', lu: 'ぅ', le: 'ぇ', lo: 'ぉ',
  xya: 'ゃ', xyu: 'ゅ', xyo: 'ょ', lya: 'ゃ', lyu: 'ゅ', lyo: 'ょ',
  xtsu: 'っ', xtu: 'っ', ltsu: 'っ', ltu: 'っ',
  fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ', va: 'ゔぁ', vi: 'ゔぃ', vu: 'ゔ', ve: 'ゔぇ', vo: 'ゔぉ',
  wi: 'うぃ', we: 'うぇ', she: 'しぇ', che: 'ちぇ', je: 'じぇ', thi: 'てぃ', dhi: 'でぃ', twu: 'とぅ', dwu: 'どぅ',
  '-': 'ー', ',': '、', '.': '。', '?': '？', '!': '！', ' ': ' '
};
const MAX_KEY = 4;
const VOWELS = 'aiueo';

/**
 * Convert a romaji string to kana as far as possible.
 * Returns { kana, pending } where `pending` is the unconverted tail (e.g. "k").
 */
export function romajiToKana(input) {
  let s = input.toLowerCase();
  let out = '';
  let i = 0;
  while (i < s.length) {
    // "nn" and "n'" -> ん ; "n" before a consonant (not y) or at end stays pending
    if (s[i] === 'n') {
      const nx = s[i + 1];
      if (nx === 'n' || nx === "'") { out += 'ん'; i += 2; continue; }
      if (nx === undefined) break; // pending
      if (!VOWELS.includes(nx) && nx !== 'y') { out += 'ん'; i += 1; continue; }
    }
    // double consonant -> っ (e.g. "kka"), except "nn"
    if (i + 1 < s.length && s[i] === s[i + 1] && /[bcdfghjkmpqrstvwxyz]/.test(s[i]) && s[i] !== 'n') {
      out += 'っ'; i += 1; continue;
    }
    let matched = false;
    for (let len = Math.min(MAX_KEY, s.length - i); len >= 1; len--) {
      const chunk = s.slice(i, i + len);
      if (TABLE[chunk]) { out += TABLE[chunk]; i += len; matched = true; break; }
    }
    if (matched) continue;
    // No match: if it could still become a match with more letters, stop here (pending)
    const rest = s.slice(i);
    const couldMatch = Object.keys(TABLE).some((k) => k.startsWith(rest.slice(0, MAX_KEY)) && k.length > rest.length);
    if (couldMatch && rest.length < MAX_KEY) break;
    out += s[i]; i += 1; // pass through unknown characters
  }
  return { kana: out, pending: s.slice(i) };
}

// Reverse table for kana -> romaji (first Hepburn spelling wins)
const REVERSE = {};
for (const [r, k] of Object.entries(TABLE)) {
  if (['si', 'ti', 'tu', 'hu', 'zi', 'sya', 'syu', 'syo', 'tya', 'tyu', 'tyo', 'jya', 'jyu', 'jyo', 'zya', 'zyu', 'zyo', 'la', 'li', 'lu', 'le', 'lo', 'lya', 'lyu', 'lyo', 'ltsu', 'ltu', 'xtu', "n'", 'du', 'di'].includes(r)) continue;
  if (!REVERSE[k]) REVERSE[k] = r;
}
REVERSE['ん'] = 'n'; REVERSE['を'] = 'o'; REVERSE['ぢ'] = 'ji'; REVERSE['づ'] = 'zu';
REVERSE['てぃ'] = 'ti'; REVERSE['でぃ'] = 'di'; REVERSE['とぅ'] = 'tu'; REVERSE['どぅ'] = 'du'; REVERSE['でゅ'] = 'dyu';
TABLE.dhu = 'でゅ';

const VOWEL_KANA = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お' };
/** Replace each ー with the vowel kana it lengthens (こーひー -> こおひい), so comparisons are by sound. */
export function expandChoon(hira) {
  let out = '';
  for (let i = 0; i < hira.length; i++) {
    const ch = hira[i];
    if (ch !== 'ー') { out += ch; continue; }
    const prev = out.slice(-2);
    const r = REVERSE[prev] || REVERSE[out.slice(-1)] || '';
    const v = r.replace(/'$/, '').slice(-1);
    out += VOWEL_KANA[v] || '';
  }
  return out;
}

/** Hiragana (or katakana) -> Hepburn romaji. Long vowels are written out (ou, uu). */
export function kanaToRomaji(kana) {
  const s = toHiragana(kana);
  let out = '';
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === 'っ') {
      const next = s.slice(i + 1, i + 3);
      const r = REVERSE[next] || REVERSE[s[i + 1]] || '';
      out += r ? r[0] === 'c' ? 't' : r[0] : 'tsu';
      i += 1; continue;
    }
    if (ch === 'ー') { out += out[out.length - 1] || '-'; i += 1; continue; }
    const two = s.slice(i, i + 2);
    if (REVERSE[two]) { out += REVERSE[two]; i += 2; continue; }
    if (ch === 'ん') {
      const nx = s[i + 1];
      out += nx && (VOWELS.includes(REVERSE[nx]?.[0] || '') || nx === 'や' || nx === 'ゆ' || nx === 'よ') ? "n'" : 'n';
      i += 1; continue;
    }
    out += REVERSE[ch] ?? ch;
    i += 1;
  }
  return out;
}

export function toHiragana(s) {
  return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}
export function toKatakana(s) {
  return s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
}
export function isKanaOnly(s) { return /^[ぁ-ゖァ-ヶー\s]+$/.test(s); }

/** Normalise a typed answer for comparison: trim, lower-case, katakana -> hiragana, strip spaces and apostrophes. */
export function normalize(s) {
  return expandChoon(toHiragana(String(s || ''))).toLowerCase().replace(/[\s'’\-、。，．！？!?.,]/g, '');
}

/** Levenshtein distance (for the "typo?" prompt). */
export function distance(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const prev = new Array(n + 1).fill(0).map((_, j) => j);
  for (let i = 1; i <= m; i++) {
    let last = prev[0]; prev[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = tmp;
    }
  }
  return prev[n];
}

/**
 * Judge a typed answer against accepted answers (kana or romaji).
 * Returns 'exact' | 'close' | 'wrong'. Romaji input is also compared after
 * converting it to kana, so "ka" matches か.
 */
export function judge(input, accepted) {
  const raw = normalize(input);
  const conv = romajiToKana(String(input || '').toLowerCase());
  const asKana = normalize(conv.kana + (conv.pending === 'n' ? 'ん' : conv.pending));
  const targets = (Array.isArray(accepted) ? accepted : [accepted]).flatMap((t) => {
    const n = normalize(t);
    return [n, normalize(kanaToRomaji(t)), normalize(romajiToKana(String(t).toLowerCase()).kana)];
  });
  if (targets.some((t) => t && (t === raw || t === asKana))) return 'exact';
  const close = targets.some((t) => t && t.length >= 3 && (distance(t, raw) <= 1 || distance(t, asKana) <= 1));
  return close ? 'close' : 'wrong';
}
