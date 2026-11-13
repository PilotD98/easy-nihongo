/* Furigana alignment: split a surface form with kanji into segments that pair
   each kanji run with its reading, given the full kana reading.
     segments('食べる', 'たべる')  -> [{ text: '食', ruby: 'た' }, { text: 'べる' }]
     segments('今日', 'きょう')    -> [{ text: '今日', ruby: 'きょう' }]
   Also parses inline {漢字|かんじ} markup used in grammar and reading texts.
   Pure functions; used by the app and by the build/validation scripts. */

const isKanji = (ch) => /[一-鿿々〆ヶ]/.test(ch);
const toHira = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

/**
 * Align a surface string to its kana reading. Returns an array of segments
 * { text, ruby? }. If alignment fails, the whole surface gets the whole reading.
 */
export function segments(surface, reading, hints = null) {
  if (!reading || surface === reading) return [{ text: surface }];
  // Build a regex: kana runs must match literally (katakana/hiragana insensitive); kanji runs become lazy groups.
  const parts = [];
  let i = 0;
  while (i < surface.length) {
    const ch = surface[i];
    if (isKanji(ch)) {
      let j = i; while (j < surface.length && isKanji(surface[j])) j++;
      parts.push({ kanji: surface.slice(i, j) }); i = j;
    } else {
      let j = i; while (j < surface.length && !isKanji(surface[j])) j++;
      parts.push({ kana: surface.slice(i, j) }); i = j;
    }
  }
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // hints: Map from character offset of a kanji run -> its known reading (from vocabulary or markup),
  // which turns that run's wildcard into a literal and removes alignment ambiguity.
  let offset = 0;
  const pattern = '^' + parts.map((p, idx) => {
    const start = offset; offset += (p.kanji || p.kana).length;
    if (!p.kanji) return esc(toHira(p.kana));
    const hint = hints?.get(start);
    if (hint) return `(${esc(toHira(hint))})`;
    return idx === parts.length - 1 ? '(.+)' : '(.+?)';
  }).join('') + '$';
  const m = new RegExp(pattern).exec(toHira(reading));
  // A wrong hint (e.g. a compound read differently from its parts) makes the anchored pattern fail: retry without hints.
  if (!m) return hints ? segments(surface, reading, null) : [{ text: surface, ruby: reading }];
  let g = 1;
  return parts.map((p) => (p.kanji ? { text: p.kanji, ruby: m[g++] } : { text: p.kana }));
}

/** Parse "{漢字|かんじ}" markup into segments; plain text becomes { text }. */
export function parseMarkup(text) {
  const out = [];
  const re = /\{([^|}]+)\|([^}]+)\}/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[1], ruby: m[2], forced: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** Strip markup to plain surface text. */
export function stripMarkup(text) { return text.replace(/\{([^|}]+)\|[^}]+\}/g, '$1'); }

/** Markup -> kana-only reading. */
export function markupToKana(text) { return text.replace(/\{[^|}]+\|([^}]+)\}/g, '$1'); }

/**
 * Given a sentence surface, its full kana reading and a set of "known" kanji,
 * produce markup where every kanji run containing an unknown kanji is wrapped
 * as {run|reading}. Used by the build script for grammar examples and readings.
 */
export function markUnknown(surface, reading, isKnown, hints = null) {
  const segs = segments(surface, reading, hints);
  if (segs.length === 1 && segs[0].ruby && segs[0].text === surface && [...surface].some(isKanji) && !/^[一-鿿々]+$/.test(surface)) {
    return null; // alignment failed for a mixed sentence
  }
  return segs.map((s) => (s.ruby && [...s.text].some((c) => isKanji(c) && !isKnown(c)) ? `{${s.text}|${s.ruby}}` : s.text)).join('');
}

export { isKanji };
