/* Question generators for JLPT-level content: kanji, vocabulary, grammar. */
import { stripMarkup } from '../engine/furigana.js';

const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (arr, n, exclude) => shuffle(arr.filter((x) => x !== exclude)).slice(0, n);
const readingVariants = (k) => [...k.on, ...k.kun.map((r) => r.replace('･', '')), ...k.kun.map((r) => r.split('･')[0])].filter(Boolean);

/* ---------- kanji ---------- */
export function qKanjiMeaning(k, pool) {
  const distractors = pick(pool.filter((x) => x.id !== k.id).map((x) => x.meanings[0]), 3, k.meanings[0]);
  return { kind: 'choice', itemId: k.id, type: 'recognition', prompt: { jp: k.char }, options: shuffle([k.meanings[0], ...distractors]), answer: k.meanings[0], why: `${k.char} means ${k.meanings.join(', ')}. ${k.mnemonic}` };
}
export function qKanjiReading(k) {
  const readings = readingVariants(k);
  return { kind: 'typed', itemId: k.id, type: 'reading', prompt: { jp: k.char, hint: `type one reading (on: ${k.on.join('・') || '—'}; kun: ${k.kun.length} known)` }, accepted: readings, answer: readings[0], why: `${k.char}: on ${k.on.join('・') || '—'}; kun ${k.kun.join('・') || '—'}.`, kanaOnly: true };
}
export function qKanjiFromMeaning(k, pool) {
  const distractors = pick(pool.filter((x) => x.id !== k.id).map((x) => x.char), 3, k.char);
  return { kind: 'choice', itemId: k.id, type: 'recall', prompt: { text: k.meanings[0] }, options: shuffle([k.char, ...distractors]), optionsJp: true, answer: k.char, why: `${k.meanings[0]} is ${k.char}. ${k.mnemonic}` };
}

/* ---------- vocabulary ---------- */
export function qVocabMeaning(v, pool) {
  const distractors = pick(pool.filter((x) => x.id !== v.id).map((x) => x.meanings[0]), 3, v.meanings[0]);
  return { kind: 'choice', itemId: v.id, type: 'recognition', prompt: { jp: v.jp }, options: shuffle([v.meanings[0], ...distractors]), answer: v.meanings[0], why: `${v.jp}${v.jp === v.kana ? '' : ` (${v.kana})`} means ${v.meanings.join('; ')}.` };
}
export function qVocabReading(v) {
  return { kind: 'typed', itemId: v.id, type: 'reading', prompt: { jp: v.jp, hint: v.meanings[0] }, accepted: [v.kana], answer: v.kana, why: `${v.jp} is read ${v.kana} (${v.romaji}).`, kanaOnly: true };
}
export function qVocabRecall(v) {
  return { kind: 'typed', itemId: v.id, type: 'production', prompt: { text: v.meanings[0], hint: 'type the Japanese (romaji converts to kana)' }, accepted: [v.jp, v.kana], answer: v.jp, why: `"${v.meanings[0]}" is ${v.jp} (${v.kana}).` };
}
export function qVocabListen(v, pool) {
  const distractors = pick(pool.filter((x) => x.id !== v.id).map((x) => x.jp), 3, v.jp);
  return { kind: 'listen', itemId: v.id, type: 'listening', prompt: { audio: v.kana, hint: 'which word did you hear?' }, options: shuffle([v.jp, ...distractors]), optionsJp: true, answer: v.jp, why: `You heard ${v.kana}: ${v.jp} (${v.meanings[0]}).` };
}

/* ---------- grammar ---------- */
export function qGrammar(g, ex = null) {
  const x = ex || g.exercises[Math.floor(Math.random() * g.exercises.length)];
  const base = { itemId: g.id, type: 'grammar', why: `${x.why} (${g.title})` };
  if (x.type === 'fill' || x.type === 'choose') {
    return { ...base, kind: 'choice', prompt: { markup: x.prompt, hint: g.title }, options: shuffle(x.choices), optionsJp: true, optionsMarkup: true, answer: x.answer };
  }
  if (x.type === 'order') {
    return { ...base, kind: 'order', prompt: { text: x.prompt, hint: 'tap the pieces in order' }, tiles: shuffle(x.choices), answer: x.answer };
  }
  return { ...base, kind: 'typed', prompt: { text: x.prompt, hint: 'type the Japanese' }, accepted: [stripMarkup(x.answer), x.answerKana].filter(Boolean), answer: stripMarkup(x.answer) };
}

/** Mixed quiz for a unit. */
export function unitQuiz(lv, unit, { n = 12, strokes = null } = {}) {
  const kanji = unit.kanji.map((id) => lv.byId.get(id));
  const vocab = unit.vocab.map((id) => lv.byId.get(id));
  const grammar = unit.grammar.map((id) => lv.byId.get(id));
  const qs = [];
  const K = shuffle(kanji), V = shuffle(vocab), G = shuffle(grammar);
  let ki = 0, vi = 0, gi = 0;
  const nk = () => K[ki++ % K.length], nv = () => V[vi++ % V.length], ng = () => G[gi++ % G.length];
  for (let i = 0; qs.length < n && i < n * 3; i++) {
    const slot = i % 6;
    if (slot === 0 && K.length) qs.push(qKanjiMeaning(nk(), lv.kanji));
    else if (slot === 1 && V.length) qs.push(qVocabMeaning(nv(), lv.vocab));
    else if (slot === 2 && V.length) { const v = nv(); qs.push(v.jp === v.kana ? qVocabListen(v, lv.vocab) : qVocabReading(v)); }
    else if (slot === 3 && G.length) qs.push(qGrammar(ng()));
    else if (slot === 4 && K.length) qs.push(qKanjiReading(nk()));
    else if (V.length) qs.push(qVocabListen(nv(), lv.vocab));
    else if (K.length) qs.push(qKanjiMeaning(nk(), lv.kanji));
  }
  for (let k = 1; k < qs.length; k++) if (qs[k].itemId === qs[k - 1].itemId && k + 1 < qs.length) [qs[k], qs[k + 1]] = [qs[k + 1], qs[k]];
  return qs.slice(0, n);
}
