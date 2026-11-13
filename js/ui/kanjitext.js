/* Scaffolded Japanese text with furigana (display levels 3 and 4).
     3  kanji with furigana ruby above every kanji run
     4  kanji only; tap a kanji run to reveal its reading
   Furigana for a word comes from its reading (segments); forced {漢字|かな}
   markup is always shown. For sentences, the level of each kanji run is the
   weakest level among vocabulary records that contain it. */
import { h } from './dom.js';
import { segments, parseMarkup, isKanji } from '../engine/furigana.js';
import { effectiveLevel } from '../engine/scaffold.js';
import { tokenize } from '../content/n5.js';

function rubyEl(text, ruby, { level, forced }) {
  const l = forced ? 3 : effectiveLevel(level);
  const r = h('ruby', { class: `kt ${l >= 4 ? 'kt-hidden' : ''}`, lang: 'ja' }, text);
  r.append(h('rp', null, '('), h('rt', null, ruby), h('rp', null, ')'));
  if (l >= 4) {
    r.setAttribute('tabindex', '0'); r.setAttribute('role', 'button'); r.setAttribute('aria-label', `${text}, tap to show reading ${ruby}`);
    const toggle = () => r.classList.toggle('is-revealed');
    r.addEventListener('click', toggle);
    r.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  }
  return r;
}

/** A single vocabulary word with furigana according to its record. */
export function vocabWord(v, rec, { cls = '' } = {}) {
  const wrap = h('span', { class: `kw jp ${cls}`.trim(), lang: 'ja' });
  const level = v.furiganaException ? 3 : (rec?.display >= 3 ? rec.display : 3);
  for (const sg of segments(v.jp, v.kana)) wrap.append(sg.ruby ? rubyEl(sg.text, sg.ruby, { level, forced: v.furiganaException }) : sg.text);
  return wrap;
}

/**
 * A sentence (markup allowed) with furigana. `reading` is the full kana reading
 * used to align unmarked kanji; `records` maps vocab id -> progress record;
 * `lv` is the loaded level for tokenising.
 */
export function sentence(text, { reading = null, records = new Map(), lv = null, cls = '' } = {}) {
  const wrap = h('span', { class: `kt-sentence jp ${cls}`.trim(), lang: 'ja' });
  const parts = parseMarkup(text);
  const plain = parts.map((p) => p.text).join('');
  // Align the unmarked parts with the reading by removing the forced parts' readings.
  let aligned = null;
  if (reading && parts.some((p) => !p.forced && [...p.text].some(isKanji))) {
    // Known readings for kanji runs: from forced markup and from vocabulary tokens.
    const hints = new Map();
    { let p = 0; for (const part of parts) { if (part.forced) hints.set(p, part.ruby); p += part.text.length; } }
    if (lv) {
      let p = 0;
      for (const tok of tokenize(lv, plain)) {
        if (tok.vocab) { let q = p; for (const sg of segments(tok.vocab.jp, tok.vocab.kana)) { if (sg.ruby && !hints.has(q)) hints.set(q, sg.ruby); q += sg.text.length; } }
        p += tok.text.length;
      }
    }
    aligned = segments(plain, reading, hints);
    if (aligned.length === 1 && aligned[0].ruby) aligned = null; // alignment failed
  }
  // Level per kanji run: weakest vocab record covering it (default 3 = show furigana).
  const levelAt = (pos, len) => {
    if (!lv) return 3;
    let level = 4;
    let found = false;
    let i = 0;
    for (const tok of tokenize(lv, plain)) {
      const end = i + tok.text.length;
      if (tok.vocab && i < pos + len && end > pos) {
        found = true;
        const rec = records.get(tok.vocab.id);
        level = Math.min(level, tok.vocab.furiganaException ? 3 : (rec?.display >= 3 ? rec.display : 3));
      }
      i = end;
    }
    return found ? level : 3;
  };
  if (aligned) {
    let pos = 0;
    const forcedRanges = [];
    { let p = 0; for (const part of parts) { if (part.forced) forcedRanges.push([p, p + part.text.length, part.ruby]); p += part.text.length; } }
    for (const sg of aligned) {
      const forced = forcedRanges.find(([a, b]) => pos >= a && pos < b);
      if (sg.ruby) wrap.append(rubyEl(sg.text, forced ? forced[2] : sg.ruby, { level: levelAt(pos, sg.text.length), forced: !!forced }));
      else wrap.append(sg.text);
      pos += sg.text.length;
    }
    return wrap;
  }
  // No full reading: use markup for forced parts and vocabulary readings for the rest.
  let pos = 0;
  for (const part of parts) {
    if (part.forced) { wrap.append(rubyEl(part.text, part.ruby, { level: 3, forced: true })); pos += part.text.length; continue; }
    if (!lv) { wrap.append(part.text); pos += part.text.length; continue; }
    for (const tok of tokenize(lv, part.text)) {
      if (tok.vocab && [...tok.text].some(isKanji)) {
        const rec = records.get(tok.vocab.id);
        const level = tok.vocab.furiganaException ? 3 : (rec?.display >= 3 ? rec.display : 3);
        for (const sg of segments(tok.vocab.jp, tok.vocab.kana)) wrap.append(sg.ruby ? rubyEl(sg.text, sg.ruby, { level, forced: tok.vocab.furiganaException }) : sg.text);
      } else wrap.append(tok.text);
      pos += tok.text.length;
    }
  }
  return wrap;
}

/** Plain markup → ruby for every forced span, no scaffolding (exercise prompts). */
export function markupText(text, { cls = '' } = {}) {
  const wrap = h('span', { class: `jp ${cls}`.trim(), lang: 'ja' });
  for (const p of parseMarkup(text)) wrap.append(p.forced ? rubyEl(p.text, p.ruby, { level: 3, forced: true }) : p.text);
  return wrap;
}
