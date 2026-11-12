/* Scaffolded kana text: renders a kana word at display level 0, 1 or 2.
     0  romaji only
     1  kana with romaji ruby underneath
     2  kana only; tap or hover reveals the romaji
   Uses real <ruby> markup. */
import { h, ruby } from './dom.js';
import { effectiveLevel } from '../engine/scaffold.js';

/**
 * kanaWord({ jp, romaji }, level) -> element
 * level is the item's computed level (0..2) before user overrides.
 */
export function kanaWord(word, level, { cls = '' } = {}) {
  const l = effectiveLevel(level);
  if (l <= 0) return h('span', { class: `kw kw-l0 ${cls}`, 'aria-label': word.jp }, word.romaji);
  if (l === 1) {
    const r = ruby(word.jp, word.romaji, 'romaji');
    r.className = `kw kw-l1 ${cls}`;
    return r;
  }
  const btn = h('button', { type: 'button', class: `kw kw-l2 ${cls}`, lang: 'ja', 'aria-label': `${word.jp}. Tap to reveal romaji`, 'aria-pressed': 'false' }, word.jp);
  const tip = h('span', { class: 'kw-tip', 'aria-hidden': 'true' }, word.romaji);
  btn.append(tip);
  btn.addEventListener('click', () => { const on = btn.classList.toggle('is-revealed'); btn.setAttribute('aria-pressed', String(on)); });
  return btn;
}
