/* Pitch accent diagram: high/low line over the mora of a word.
   accent = 0 (heiban: low, then high and stays high), n = drop after mora n.
   Follows the standard Tokyo-dialect description used by NHK/OJAD. */
import { toMora } from '../engine/mora.js';

const NS = 'http://www.w3.org/2000/svg';

/** Returns an SVG element. mora may be a string or an array. */
export function pitchDiagram(word, accent, { size = 28 } = {}) {
  const mora = Array.isArray(word) ? word : toMora(word);
  const n = mora.length;
  // High/low per mora, plus the particle position after the word (n+1)
  const levels = [];
  for (let i = 1; i <= n + 1; i++) {
    let high;
    if (accent === 0) high = i >= 2;                 // heiban: L H H H (particle H)
    else if (accent === 1) high = i === 1;           // atamadaka: H L L (particle L)
    else high = i >= 2 && i <= accent;               // nakadaka/odaka: L H..H(drop after accent)
    levels.push(high);
  }
  const w = (n + 1) * size + size, h = size * 1.9;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', w); svg.setAttribute('height', h);
  svg.setAttribute('class', 'pitch');
  svg.setAttribute('role', 'img');
  const name = accent === 0 ? 'heiban (flat)' : accent === 1 ? 'atamadaka (drop after the first mora)' : accent === n ? 'odaka (drop after the last mora)' : `nakadaka (drop after mora ${accent})`;
  svg.setAttribute('aria-label', `Pitch accent ${accent}: ${name}`);
  const y = (high) => (high ? size * 0.45 : size * 1.15);
  const x = (i) => size * 0.6 + i * size;
  // line
  const path = document.createElementNS(NS, 'path');
  let d = '';
  levels.forEach((hi, i) => { d += `${i ? 'L' : 'M'}${x(i)} ${y(hi)} `; });
  path.setAttribute('d', d.trim());
  path.setAttribute('class', 'pitch-line');
  svg.append(path);
  // dots + labels
  levels.forEach((hi, i) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x(i)); c.setAttribute('cy', y(hi)); c.setAttribute('r', size * 0.17);
    c.setAttribute('class', i < n ? 'pitch-dot' : 'pitch-dot pitch-particle');
    svg.append(c);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', x(i)); t.setAttribute('y', size * 1.75); t.setAttribute('text-anchor', 'middle');
    t.setAttribute('class', 'pitch-label');
    t.textContent = i < n ? mora[i] : '〜';
    svg.append(t);
  });
  return svg;
}

export function pitchName(accent, moraCount) {
  if (accent === 0) return 'flat (heiban)';
  if (accent === 1) return 'head-high (atamadaka)';
  if (accent === moraCount) return 'tail-high (odaka)';
  return `middle-high, drop after beat ${accent} (nakadaka)`;
}
