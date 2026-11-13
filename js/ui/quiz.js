/* Question generation and a single-question renderer shared by lesson
   quizzes, the stage exam and review sessions.

   Question shape:
   { kind: 'choice' | 'typed' | 'listen' | 'draw',
     itemId, prompt: {jp|romaji|audio}, options: [..], answer, accepted: [..],
     why: 'short explanation shown on mistakes' } */
import { h, icon, jp } from './dom.js';
import { speak, canSpeak } from './audio.js';
import { romajiToKana, toKatakana, judge } from '../engine/romaji.js';
import { tracePad } from './tracepad.js';
import { markupText } from './kanjitext.js';
import { stripMarkup } from '../engine/furigana.js';

const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (arr, n, exclude) => shuffle(arr.filter((x) => x !== exclude)).slice(0, n);
const clean = (r) => r.replace(/\s*\(.*\)/, '');

/* ---------- generators (kana stage) ---------- */

/** Character recognition: see kana, pick the romaji. */
export function qCharToRomaji(ch, pool) {
  const distractors = pick(pool.filter((c) => c.id !== ch.id).map((c) => clean(c.romaji)), 3, clean(ch.romaji));
  return { kind: 'choice', itemId: ch.id, type: 'recognition', prompt: { jp: ch.char }, options: shuffle([clean(ch.romaji), ...distractors]), answer: clean(ch.romaji), why: `${ch.char} is ${clean(ch.romaji)}. ${ch.mnemonic}` };
}
/** Recall: see romaji, pick the kana. */
export function qRomajiToChar(ch, pool) {
  // Exclude look-alike readings (じ/ぢ, ず/づ) so there is exactly one right answer.
  const distractors = pick(pool.filter((c) => c.id !== ch.id && clean(c.romaji) !== clean(ch.romaji)).map((c) => c.char), 3, ch.char);
  return { kind: 'choice', itemId: ch.id, type: 'recall', prompt: { text: ch.romaji }, options: shuffle([ch.char, ...distractors]), optionsJp: true, answer: ch.char, why: `${ch.romaji} is written ${ch.char}. ${ch.mnemonic}` };
}
/** Typed reading of a word (romaji or kana input accepted). */
export function qWordTyped(word) {
  return { kind: 'typed', itemId: word.id, type: 'reading', prompt: { jp: word.jp, hint: word.meaning }, accepted: [word.jp, word.romaji], answer: word.romaji, why: `${word.jp} is read "${word.romaji}" and means "${word.meaning}".` };
}
/** Listening: hear the word, pick the kana. */
export function qListenWord(word, pool) {
  const distractors = pick(pool.filter((w) => w.id !== word.id).map((w) => w.jp), 3, word.jp);
  return { kind: 'listen', itemId: word.id, type: 'listening', prompt: { audio: word.jp, hint: word.meaning }, options: shuffle([word.jp, ...distractors]), optionsJp: true, answer: word.jp, why: `You heard "${word.romaji}": ${word.jp} (${word.meaning}).` };
}
/** Recall by typing: see romaji (and meaning), type the kana via the romaji IME. */
export function qCharTyped(ch) {
  return { kind: 'typed', itemId: ch.id, type: 'recall', prompt: { text: clean(ch.romaji), hint: 'type it: the box converts romaji to kana' }, accepted: [ch.char], answer: ch.char, why: `${clean(ch.romaji)} is written ${ch.char}.`, kanaOnly: true };
}
/** Handwriting: draw the character on the pad, then self-grade. */
export function qDraw(ch, strokeData) {
  return { kind: 'draw', itemId: ch.id, type: 'handwriting', prompt: { text: clean(ch.romaji), hint: 'draw it' }, answer: ch.char, strokeData, why: `${clean(ch.romaji)} is ${ch.char}. ${ch.mnemonic}` };
}

/** A mixed quiz for one or more kana groups. */
export function kanaQuiz(chars, words, { n = 12, pool = chars, wordPool = words, listening = canSpeak() } = {}) {
  const qs = [];
  const cs = shuffle(chars);
  const ws = shuffle(words);
  // Cycle through every character and word before any repeats.
  let ci = 0, wi = 0;
  const nextChar = () => cs[ci++ % cs.length];
  const nextWord = () => ws[wi++ % ws.length];
  let i = 0;
  while (qs.length < n && (cs.length || ws.length)) {
    const slot = i % 4;
    if (slot === 0 && cs.length) qs.push(qCharToRomaji(nextChar(), pool));
    else if (slot === 1 && cs.length) qs.push(qRomajiToChar(nextChar(), pool));
    else if (slot === 2 && ws.length) qs.push(qWordTyped(nextWord()));
    else if (ws.length) { const w = nextWord(); qs.push(listening && wordPool.length >= 4 ? qListenWord(w, wordPool) : qWordTyped(w)); }
    else qs.push(qCharToRomaji(nextChar(), pool));
    i++;
  }
  // avoid the same item twice in a row
  for (let k = 1; k < qs.length; k++) if (qs[k].itemId === qs[k - 1].itemId && k + 1 < qs.length) [qs[k], qs[k + 1]] = [qs[k + 1], qs[k]];
  return qs.slice(0, n);
}

/* ---------- renderer ---------- */

/**
 * renderQuestion(container, q, { onAnswer(result) })
 * result: { correct: boolean, close: boolean, given, q }
 * Returns a cleanup function.
 */
export function renderQuestion(container, q, { onAnswer, autoplay = true, number = null, silent = false } = {}) {
  container.replaceChildren();
  let answered = false;
  const keyHandlers = [];

  // Prompt
  const promptEl = h('div', { class: 'q-prompt' });
  if (q.prompt.node) promptEl.append(q.prompt.node);
  if (q.prompt.markup) promptEl.append(markupText(q.prompt.markup, { cls: 'q-jp q-markup' }));
  if (q.prompt.jp) promptEl.append(jp(q.prompt.jp, 'jp-xl q-jp'));
  if (q.prompt.text) promptEl.append(h('div', { class: 'q-text' }, q.prompt.text));
  if (q.prompt.audio) {
    const play = h('button', { class: 'btn btn-lg', type: 'button', onClick: () => speak(q.prompt.audio) }, icon('speak'), 'Play again');
    promptEl.append(play);
    if (autoplay) setTimeout(() => speak(q.prompt.audio), 150);
  }
  if (q.prompt.hint) promptEl.append(h('div', { class: 'q-hint muted' }, q.prompt.hint));
  if (q.prompt.jp && !q.prompt.audio && canSpeak()) {
    promptEl.append(h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Listen', onClick: () => speak(q.prompt.jp) }, icon('speak')));
  }
  container.append(promptEl);

  const feedback = h('div', { class: 'q-feedback', 'aria-live': 'assertive' });
  const finish = (correct, given, { close = false } = {}) => {
    if (answered) return;
    answered = true;
    if (silent) { onAnswer?.({ correct, close, given, q }); return; }
    feedback.className = `q-feedback ${correct ? 'is-correct' : 'is-wrong'}`;
    feedback.replaceChildren(
      h('div', { class: 'q-verdict' }, icon(correct ? 'check' : 'close'), correct ? (close ? 'Correct (small typo)' : 'Correct') : 'Not quite'),
      h('div', { class: 'q-why' }, q.why)
    );
    if (q.prompt.jp && canSpeak() && autoplay) speak(q.prompt.jp);
    onAnswer?.({ correct, close, given, q });
  };

  if (q.kind === 'choice' || q.kind === 'listen') {
    const list = h('div', { class: 'q-options', role: 'group', 'aria-label': 'Answers' });
    q.options.forEach((opt, idx) => {
      const b = h('button', { class: `btn btn-lg q-option ${q.optionsJp ? 'jp' : ''}`, type: 'button', lang: q.optionsJp ? 'ja' : null, dataset: { idx: String(idx + 1), value: stripMarkup(opt) } }, h('kbd', { class: 'q-key', 'aria-hidden': 'true' }, String(idx + 1)), q.optionsMarkup ? markupText(opt) : h('span', null, opt));
      b.addEventListener('click', () => {
        if (answered) return;
        const correct = stripMarkup(opt) === stripMarkup(q.answer);
        if (!silent) b.classList.add(correct ? 'is-correct' : 'is-wrong'); else b.classList.add('is-chosen');
        if (!correct && !silent) [...list.children].find((c) => c.dataset.value === stripMarkup(q.answer))?.classList.add('is-correct');
        [...list.children].forEach((c) => { c.disabled = true; });
        finish(correct, opt);
      });
      list.append(b);
    });
    container.append(list);
    keyHandlers.push((e) => { const n = Number(e.key); if (n >= 1 && n <= q.options.length && !answered) { list.children[n - 1].click(); } });
  } else if (q.kind === 'typed') {
    const input = h('input', { class: 'input q-input', type: 'text', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', 'aria-label': 'Your answer', enterkeyhint: 'done', lang: 'ja' });
    const preview = h('div', { class: 'q-ime jp', lang: 'ja', 'aria-live': 'polite' });
    let composing = false;
    input.addEventListener('compositionstart', () => { composing = true; });
    input.addEventListener('compositionend', () => { composing = false; });
    input.addEventListener('input', () => {
      if (composing) return;
      const { kana, pending } = romajiToKana(input.value);
      const wantsKatakana = /[ァ-ー]/.test([q.answer, q.prompt.jp, ...(q.accepted || [])].join(''));
      const shown = wantsKatakana ? toKatakana(kana) : kana;
      preview.textContent = /[a-z]/i.test(input.value) ? shown + pending : '';
    });
    const typoRow = h('div', { class: 'row', hidden: true });
    const submit = () => {
      if (answered) return;
      const given = input.value.trim();
      if (!given) return;
      const verdict = judge(given, q.accepted);
      if (verdict === 'exact') { input.classList.add('is-correct'); finish(true, given); }
      else if (verdict === 'close' && typoRow.hidden) {
        typoRow.hidden = false;
        typoRow.replaceChildren(h('span', { class: 'muted' }, 'Almost. Typo?'),
          h('button', { class: 'btn', type: 'button', onClick: () => { input.classList.add('is-correct'); finish(true, given, { close: true }); } }, 'Yes, typo'),
          h('button', { class: 'btn', type: 'button', onClick: () => { input.classList.add('is-wrong'); finish(false, given); } }, 'No, mark wrong'));
      } else { input.classList.add('is-wrong'); finish(false, given); }
      if (answered) input.disabled = true;
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
    const go = h('button', { class: 'btn btn-primary', type: 'button', onClick: submit }, 'Check');
    const dontKnow = h('button', { class: 'btn', type: 'button', onClick: () => { input.classList.add('is-wrong'); input.disabled = true; finish(false, ''); } }, "Don't know");
    container.append(h('div', { class: 'q-typed' }, input, preview, typoRow, h('div', { class: 'btn-row' }, go, dontKnow)));
    setTimeout(() => input.focus(), 50);
  } else if (q.kind === 'order') {
    const chosen = [];
    const answerLine = h('div', { class: 'q-order-line jp', lang: 'ja', 'aria-live': 'polite' });
    const tiles = h('div', { class: 'q-tiles', role: 'group', 'aria-label': 'Pieces' });
    const refresh = () => { answerLine.replaceChildren(...chosen.map((t) => markupText(t))); if (!chosen.length) answerLine.textContent = ''; };
    q.tiles.forEach((t) => {
      const b = h('button', { class: 'btn q-tile jp', type: 'button', lang: 'ja' }, markupText(t));
      b.addEventListener('click', () => { if (answered) return; if (b.classList.toggle('is-used')) chosen.push(t); else chosen.splice(chosen.indexOf(t), 1); refresh(); });
      tiles.append(b);
    });
    const check = h('button', { class: 'btn btn-primary', type: 'button', onClick: () => {
      if (answered) return;
      const given = chosen.map(stripMarkup).join('');
      const correct = given === stripMarkup(q.answer);
      if (!silent) answerLine.classList.add(correct ? 'is-correct' : 'is-wrong');
      if (!correct && !silent) answerLine.append(h('div', { class: 'small muted' }, 'Answer: ', markupText(q.answer)));
      finish(correct, given);
    } }, 'Check');
    const reset = h('button', { class: 'btn', type: 'button', onClick: () => { if (answered) return; chosen.length = 0; tiles.querySelectorAll('.is-used').forEach((b) => b.classList.remove('is-used')); refresh(); } }, 'Reset');
    container.append(answerLine, tiles, h('div', { class: 'btn-row' }, check, reset));
  } else if (q.kind === 'draw') {
    const pad = tracePad(q.strokeData, { size: Math.min(280, window.innerWidth - 64), showGuide: false });
    const reveal = h('div', { class: 'row', style: { marginTop: '8px' } },
      h('button', { class: 'btn btn-primary', type: 'button', onClick: () => {
        reveal.replaceChildren(jp(q.answer, 'jp-xl'), h('span', { class: 'muted' }, 'Did you get it?'),
          h('button', { class: 'btn', type: 'button', onClick: () => finish(true, 'self') }, icon('check'), 'Yes'),
          h('button', { class: 'btn', type: 'button', onClick: () => finish(false, 'self') }, icon('close'), 'No'));
      } }, 'Show answer'));
    container.append(pad.el, reveal);
  }

  container.append(feedback);
  const onKey = (e) => { if (e.target.tagName === 'INPUT') return; keyHandlers.forEach((fn) => fn(e)); };
  document.addEventListener('keydown', onKey);
  return () => document.removeEventListener('keydown', onKey);
}

/**
 * Run a list of questions with a progress bar and a Continue button.
 * Resolves with { correct, total, missed: [itemId], results: [...] }.
 */
export function runQuiz(container, questions, { title = 'Quiz', onProgress = null } = {}) {
  return new Promise((resolve) => {
    const results = [];
    let idx = 0;
    let cleanup = null;
    const bar = h('div', { class: 'bar' }, h('span', { style: { width: '0%' } }));
    const counter = h('span', { class: 'small muted' });
    const qArea = h('div', { class: 'q-area' });
    const next = h('button', { class: 'btn btn-primary btn-lg btn-block', type: 'button', hidden: true }, 'Continue');
    const wrap = h('div', { class: 'quiz' }, h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('strong', null, title), counter), bar, qArea, next);
    container.replaceChildren(wrap);

    const show = () => {
      if (idx >= questions.length) {
        cleanup?.();
        const correct = results.filter((r) => r.correct).length;
        resolve({ correct, total: questions.length, missed: results.filter((r) => !r.correct).map((r) => r.q.itemId), results });
        return;
      }
      counter.textContent = `${idx + 1} / ${questions.length}`;
      bar.firstChild.style.width = `${(idx / questions.length) * 100}%`;
      next.hidden = true;
      cleanup?.();
      cleanup = renderQuestion(qArea, questions[idx], {
        onAnswer: (r) => { results.push(r); onProgress?.(r); next.hidden = false; next.focus({ preventScroll: true }); }
      });
      qArea.scrollIntoView?.({ block: 'nearest' });
    };
    next.addEventListener('click', () => { idx += 1; show(); });
    const onKey = (e) => { if (e.key === 'Enter' && !next.hidden && e.target.tagName !== 'INPUT') { e.preventDefault(); next.click(); } };
    document.addEventListener('keydown', onKey);
    const origResolve = resolve;
    resolve = (v) => { document.removeEventListener('keydown', onKey); origResolve(v); };
    show();
  });
}
