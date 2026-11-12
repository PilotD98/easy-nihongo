/* Animated stroke-order diagram from KanjiVG path data (0 0 109 109 box).
   Each stroke is drawn in order with a dash-offset animation; a faint copy
   of the whole character sits underneath. Reduced motion shows the finished
   character with stroke numbers. */
import { h } from './dom.js';

const NS = 'http://www.w3.org/2000/svg';
let strokeCache = new Map();

/** Load stroke data for a script ('hiragana' | 'katakana') once. */
export async function loadStrokes(script) {
  if (strokeCache.has(script)) return strokeCache.get(script);
  const p = fetch(`data/strokes/${script}.json`).then((r) => { if (!r.ok) throw new Error('strokes'); return r.json(); });
  strokeCache.set(script, p);
  p.catch(() => strokeCache.delete(script));
  return p;
}

function motionReduced() {
  const m = document.documentElement.dataset.motion;
  if (m === 'reduce') return true;
  if (m === 'full') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
}

/**
 * strokeDiagram(data, { size, numbers })
 * data = { strokes: [d, …], numbers: [[x, y], …] }
 * Returns { el, play } where play() replays the animation.
 */
export function strokeDiagram(data, { size = 160, numbers = true, label = '' } = {}) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 109 109');
  svg.setAttribute('width', size); svg.setAttribute('height', size);
  svg.setAttribute('class', 'stroke-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label ? `Stroke order for ${label}` : 'Stroke order');

  // guide lines
  const guide = document.createElementNS(NS, 'path');
  guide.setAttribute('d', 'M54.5 0V109M0 54.5H109');
  guide.setAttribute('class', 'stroke-guide');
  svg.append(guide);

  const ghost = document.createElementNS(NS, 'g');
  ghost.setAttribute('class', 'stroke-ghost');
  const live = document.createElementNS(NS, 'g');
  live.setAttribute('class', 'stroke-live');
  const paths = [];
  (data?.strokes || []).forEach((d) => {
    const g = document.createElementNS(NS, 'path'); g.setAttribute('d', d); ghost.append(g);
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); live.append(p); paths.push(p);
  });
  svg.append(ghost, live);

  if (numbers) {
    const nums = document.createElementNS(NS, 'g');
    nums.setAttribute('class', 'stroke-numbers');
    (data?.numbers || []).forEach(([x, y], i) => {
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x); t.setAttribute('y', y); t.textContent = String(i + 1);
      nums.append(t);
    });
    svg.append(nums);
  }

  let timers = [];
  function play() {
    timers.forEach(clearTimeout); timers = [];
    if (motionReduced() || !paths.length) { paths.forEach((p) => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; p.style.transition = ''; }); return; }
    let t = 0;
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.transition = 'none';
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });
    // force layout so the reset applies before animating
    void svg.getBoundingClientRect();
    paths.forEach((p) => {
      const len = p.getTotalLength();
      const dur = Math.max(260, Math.min(900, len * 9));
      timers.push(setTimeout(() => {
        p.style.transition = `stroke-dashoffset ${dur}ms ease-out`;
        p.style.strokeDashoffset = '0';
      }, t));
      t += dur + 140;
    });
  }
  // start once in the DOM
  requestAnimationFrame(() => play());
  return { el: svg, play, strokeCount: paths.length };
}

/** A diagram for a character that may be made of several parts (e.g. きゃ). */
export function strokeDiagrams(parts, strokeData, opts = {}) {
  const wrap = h('div', { class: 'stroke-row' });
  const items = parts.map((ch) => strokeDiagram(strokeData[ch], { ...opts, label: ch }));
  items.forEach((it) => wrap.append(it.el));
  return { el: wrap, play: () => items.forEach((it) => it.play()) };
}
