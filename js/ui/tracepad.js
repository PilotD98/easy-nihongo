/* Trace-it drawing pad. Shows the character faintly from KanjiVG paths and
   lets the learner draw over it with finger, stylus or mouse. "Check" gives a
   rough score: stroke count, plus how much of the reference shape the ink
   covers. It is a practice aid, not handwriting recognition. */
import { h, icon } from './dom.js';

export function tracePad(data, { size = 260, onCheck = null, showGuide = true } = {}) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const canvas = h('canvas', { class: 'trace-canvas', width: size * dpr, height: size * dpr, style: { width: `${size}px`, height: `${size}px` }, 'aria-label': 'Drawing pad: trace the character', role: 'img' });
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const scale = size / 109;
  const refPaths = (data?.strokes || []).map((d) => new Path2D(d));
  const strokes = [];      // user strokes: arrays of {x, y} in 109-box units
  let current = null;
  let guide = showGuide;

  const css = () => getComputedStyle(document.documentElement);
  function draw() {
    ctx.clearRect(0, 0, size, size);
    // grid
    ctx.strokeStyle = css().getPropertyValue('--border'); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size); ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2); ctx.stroke();
    // reference
    if (guide) {
      ctx.save(); ctx.scale(scale, scale);
      ctx.strokeStyle = css().getPropertyValue('--text-3'); ctx.globalAlpha = 0.28;
      ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      refPaths.forEach((p) => ctx.stroke(p));
      ctx.restore();
    }
    // ink
    ctx.save(); ctx.scale(scale, scale);
    ctx.strokeStyle = css().getPropertyValue('--accent'); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const s of strokes.concat(current ? [current] : [])) {
      if (s.length < 2) { ctx.beginPath(); ctx.arc(s[0].x, s[0].y, 3, 0, Math.PI * 2); ctx.fillStyle = ctx.strokeStyle; ctx.fill(); continue; }
      ctx.beginPath(); ctx.moveTo(s[0].x, s[0].y);
      for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 109, y: ((e.clientY - r.top) / r.height) * 109 };
  }
  canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic or stale pointer id */ } current = [pos(e)]; draw(); });
  canvas.addEventListener('pointermove', (e) => { if (!current) return; current.push(pos(e)); draw(); });
  const end = () => { if (current) { strokes.push(current); current = null; draw(); counter(); } };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.style.touchAction = 'none';

  const count = h('span', { class: 'small muted', 'aria-live': 'polite' });
  const target = refPaths.length;
  function counter() { count.textContent = `${strokes.length} / ${target} strokes`; }
  counter();

  function check() {
    if (!strokes.length) return { score: 0, message: 'Draw the character first.' };
    // Sample reference points and see how many are near the ink.
    const refPts = [];
    const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    for (const d of data.strokes) {
      probe.setAttribute('d', d);
      const len = probe.getTotalLength();
      for (let t = 0; t <= len; t += 4) { const p = probe.getPointAtLength(t); refPts.push({ x: p.x, y: p.y }); }
    }
    const ink = strokes.flat();
    const near = (p) => ink.some((q) => (q.x - p.x) ** 2 + (q.y - p.y) ** 2 < 64); // within 8 units
    const covered = refPts.filter(near).length / Math.max(1, refPts.length);
    const stray = ink.filter((q) => !refPts.some((p) => (q.x - p.x) ** 2 + (q.y - p.y) ** 2 < 100)).length / Math.max(1, ink.length);
    const countOk = strokes.length === target;
    let score = Math.round(100 * (0.6 * covered + 0.25 * (1 - stray) + 0.15 * (countOk ? 1 : Math.max(0, 1 - Math.abs(strokes.length - target) / target))));
    score = Math.max(0, Math.min(100, score));
    let message;
    if (!countOk) message = strokes.length < target ? `Looks good so far, but ${target} strokes are expected and you drew ${strokes.length}.` : `Use ${target} strokes; you drew ${strokes.length}. Lift the pen only between strokes.`;
    else if (score >= 80) message = 'Nice shape and the right stroke count.';
    else if (score >= 55) message = 'Right stroke count. Follow the grey guide more closely.';
    else message = 'Stroke count is right, but the shape wanders. Replay the stroke order and try again.';
    return { score, message };
  }

  const result = h('div', { class: 'small', 'aria-live': 'polite', style: { minHeight: '1.4em' } });
  const undoBtn = h('button', { class: 'btn', type: 'button', onClick: () => { strokes.pop(); draw(); counter(); result.textContent = ''; } }, 'Undo');
  const clearBtn = h('button', { class: 'btn', type: 'button', onClick: () => { strokes.length = 0; draw(); counter(); result.textContent = ''; } }, 'Clear');
  const guideBtn = h('button', { class: 'btn', type: 'button', 'aria-pressed': String(guide), onClick: (e) => { guide = !guide; e.currentTarget.setAttribute('aria-pressed', String(guide)); draw(); } }, 'Guide');
  const checkBtn = h('button', { class: 'btn btn-primary', type: 'button', onClick: () => { const r = check(); result.textContent = `${r.score}% · ${r.message}`; onCheck?.(r); } }, icon('check'), 'Check');

  const el = h('div', { class: 'trace-pad' }, canvas,
    h('div', { class: 'row', style: { justifyContent: 'space-between', marginTop: '8px' } }, count, h('div', { class: 'btn-row' }, undoBtn, clearBtn, guideBtn, checkBtn)),
    result);
  requestAnimationFrame(draw);
  window.addEventListener('kp:settings', draw);
  return { el, check, clear: () => { strokes.length = 0; draw(); counter(); }, strokeCount: () => strokes.length };
}
