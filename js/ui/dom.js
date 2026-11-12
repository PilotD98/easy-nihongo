/* Tiny DOM helpers. No framework: views build elements with h() and return them. */

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * h('div', { class: 'card', onClick: fn, dataset: {...}, aria: {...} }, ...children)
 * Children may be strings, nodes, arrays, or null/false (skipped).
 */
export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class' || k === 'className') el.className = v;
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'aria' && typeof v === 'object') for (const [ak, av] of Object.entries(v)) el.setAttribute(`aria-${ak}`, av);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'html') el.innerHTML = v;
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
  }
  append(el, children);
  return el;
}

export function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

/** Inline SVG icon from the sprite in index.html. */
export function icon(name, cls = 'icon') {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', cls);
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}

export function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

/** Japanese text span with lang="ja" so screen readers switch voices. */
export function jp(text, cls = '') {
  return h('span', { class: `jp ${cls}`.trim(), lang: 'ja' }, text);
}

/** Ruby text: base with reading above. kind 'furigana' (kana) or 'romaji'. */
export function ruby(base, reading, kind = 'furigana') {
  const r = h('ruby', { lang: 'ja' }, base);
  r.append(h('rp', null, '('), h('rt', { class: kind === 'romaji' ? 'romaji' : '' }, reading), h('rp', null, ')'));
  return r;
}

export function formatMinutes(seconds) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const hrs = Math.floor(m / 60), rem = m % 60;
  return rem ? `${hrs} h ${rem} min` : `${hrs} h`;
}

export function formatBytes(n) {
  if (n == null) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(iso, opts = { dateStyle: 'medium' }) {
  try { return new Intl.DateTimeFormat(undefined, opts).format(new Date(iso)); }
  catch { return String(iso); }
}
