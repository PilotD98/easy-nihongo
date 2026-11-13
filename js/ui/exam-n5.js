/* Mock JLPT N5: question generators in the real exam's section format.
   Section A  Language knowledge (vocabulary): kanji reading, orthography, context
   Section B  Language knowledge (grammar) + Reading: sentence grammar, sentence
              composition (★), passage comprehension
   Section C  Listening: word recognition, comprehension
   Scoring follows the JLPT structure: A+B scaled to 0–120, C to 0–60; pass at 80/180
   with sectional minimums 38 and 19. Everything here is an estimate. */
import { stripMarkup, isKanji } from '../engine/furigana.js';
import { canSpeak } from './audio.js';

const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (arr, n, exclude) => shuffle(arr.filter((x) => x !== exclude)).slice(0, n);

/* ---- Section A ---- */
function qReading(v, pool) {
  const same = pool.filter((x) => x.id !== v.id && x.kana.length === v.kana.length).map((x) => x.kana);
  const distractors = pick(same.length >= 3 ? same : pool.filter((x) => x.id !== v.id).map((x) => x.kana), 3, v.kana);
  return { kind: 'choice', section: 'A', sub: 'reading', itemId: v.id, prompt: { jp: v.jp, hint: 'How is this word read?' }, options: shuffle([v.kana, ...distractors]), optionsJp: true, answer: v.kana, why: `${v.jp} is read ${v.kana} (${v.meanings[0]}).` };
}
function qOrthography(v, pool) {
  const same = pool.filter((x) => x.id !== v.id && x.jp.length === v.jp.length).map((x) => x.jp);
  const distractors = pick(same, 3, v.jp);
  return { kind: 'choice', section: 'A', sub: 'orthography', itemId: v.id, prompt: { jp: v.kana, hint: 'Which is the correct writing?' }, options: shuffle([v.jp, ...distractors]), optionsJp: true, answer: v.jp, why: `${v.kana} is written ${v.jp} (${v.meanings[0]}).` };
}
/** Context: a grammar example with one vocabulary word blanked out. */
function qContext(lv, ex, pool) {
  const toks = tokenizeWords(lv, stripMarkup(ex.jp));
  const cands = toks.filter((t) => t.vocab && t.text.length >= 2 && !['です', 'ます'].includes(t.text));
  if (!cands.length) return null;
  const target = cands[Math.floor(Math.random() * cands.length)];
  const blanked = stripMarkup(ex.jp).replace(target.text, '（　）');
  const samePos = pool.filter((x) => x.id !== target.vocab.id && x.pos[0] === target.vocab.pos[0]).map((x) => x.jp);
  const distractors = pick(samePos.length >= 3 ? samePos : pool.map((x) => x.jp), 3, target.text);
  return { kind: 'choice', section: 'A', sub: 'context', itemId: target.vocab.id, prompt: { jp: blanked, hint: ex.en }, options: shuffle([target.text, ...distractors]), optionsJp: true, answer: target.text, why: `${stripMarkup(ex.jp)}: ${target.text} = ${target.vocab.meanings[0]}.` };
}
function tokenizeWords(lv, text) {
  const out = []; let i = 0;
  while (i < text.length) {
    const s = lv.surfaces.find((sf) => sf.length > 1 && text.startsWith(sf, i));
    if (s) { out.push({ text: s, vocab: lv.vocabBySurface.get(s)[0] }); i += s.length; } else { out.push({ text: text[i] }); i++; }
  }
  return out;
}

/* ---- Section B ---- */
function qGrammarFill(g) {
  const x = g.exercises.find((e) => e.type === 'fill' || e.type === 'choose');
  if (!x) return null;
  return { kind: 'choice', section: 'B', sub: 'grammar', itemId: g.id, prompt: { markup: x.prompt }, options: shuffle(x.choices), optionsJp: true, optionsMarkup: true, answer: x.answer, why: `${x.why} (${g.title})` };
}
function qCompose(g) {
  const x = g.exercises.find((e) => e.type === 'order');
  if (!x) return null;
  return { kind: 'order', section: 'B', sub: 'composition', itemId: g.id, prompt: { text: x.prompt, hint: 'Put the pieces in the right order (★)' }, tiles: shuffle(x.choices), answer: x.answer, why: `${x.why} (${g.title})` };
}
function qPassage(r, q) {
  return { kind: 'choice', section: 'B', sub: 'reading', itemId: r.id, prompt: { markup: r.text, markupSub: q.q, hint: r.title }, options: q.choices, optionsJp: true, optionsMarkup: true, answer: q.choices[q.answer], why: q.why };
}

/* ---- Section C ---- */
function qListenWord(v, pool) {
  const distractors = pick(pool.filter((x) => x.id !== v.id).map((x) => x.jp), 3, v.jp);
  return { kind: 'listen', section: 'C', sub: 'word', itemId: v.id, prompt: { audio: v.kana, hint: 'Which word did you hear?' }, options: shuffle([v.jp, ...distractors]), optionsJp: true, answer: v.jp, why: `You heard ${v.kana}: ${v.jp} (${v.meanings[0]}).` };
}
function qListenComp(l, it, q) {
  return { kind: 'listen', section: 'C', sub: 'comprehension', itemId: l.id, prompt: { audio: it.kana, markup: q.q, hint: 'Listen, then answer' }, options: q.choices, optionsJp: true, optionsMarkup: true, answer: q.choices[q.answer], why: `${q.why} (${it.en})` };
}

/** Build the three sections. Counts are smaller than the real exam; times are scaled to match. */
export function buildMockN5(lv) {
  const kanjiWords = lv.vocab.filter((v) => v.kanji.length && !v.furiganaException);
  const exWithWords = lv.grammar.flatMap((g) => g.examples);
  const A = [
    ...shuffle(kanjiWords).slice(0, 8).map((v) => qReading(v, kanjiWords)),
    ...shuffle(kanjiWords).slice(0, 6).map((v) => qOrthography(v, kanjiWords)),
    ...shuffle(exWithWords).map((ex) => qContext(lv, ex, lv.vocab)).filter(Boolean).slice(0, 6)
  ];
  const fills = shuffle(lv.grammar).map(qGrammarFill).filter(Boolean).slice(0, 10);
  const orders = shuffle(lv.grammar).map(qCompose).filter(Boolean).slice(0, 4);
  const passages = shuffle(lv.readings).slice(0, 2).flatMap((r) => r.questions.map((q) => qPassage(r, q)));
  const B = [...fills, ...orders, ...passages];
  const comps = lv.listening.filter((l) => l.type === 'comprehension').flatMap((l) => l.items.flatMap((it) => (it.questions || []).map((q) => qListenComp(l, it, q))));
  const C = canSpeak() ? [...shuffle(lv.vocab).slice(0, 6).map((v) => qListenWord(v, lv.vocab)), ...shuffle(comps).slice(0, 6)] : [];
  return [
    { id: 'A', title: 'Language knowledge: vocabulary', minutes: 15, questions: A },
    { id: 'B', title: 'Language knowledge: grammar · Reading', minutes: 25, questions: B },
    { id: 'C', title: 'Listening', minutes: 15, questions: C }
  ].filter((s) => s.questions.length);
}

/** Score sections into the JLPT-style scaled estimate. */
export const PASS = { n5: { total: 80, lk: 38, listening: 19 }, n4: { total: 90, lk: 38, listening: 19 }, n3: { total: 95, lk: 19, listening: 19 }, n2: { total: 90, lk: 19, listening: 19 }, n1: { total: 100, lk: 19, listening: 19 } };

export function scoreMock(sections, results, levelId = 'n5') {
  const pass = PASS[levelId] || PASS.n5;
  const pct = (id) => { const qs = results.filter((r) => r.section === id); return qs.length ? qs.filter((r) => r.correct).length / qs.length : null; };
  const a = pct('A'), b = pct('B'), c = pct('C');
  const lk = Math.round((((a ?? 0) + (b ?? 0)) / ((a != null ? 1 : 0) + (b != null ? 1 : 0) || 1)) * 120);
  const listening = c == null ? null : Math.round(c * 60);
  const total = lk + (listening ?? 0);
  const passed = listening == null ? null : total >= pass.total && lk >= pass.lk && listening >= pass.listening;
  const bySub = {};
  for (const r of results) { const k = `${r.section}:${r.sub}`; bySub[k] = bySub[k] || { correct: 0, total: 0, ids: new Set() }; bySub[k].total++; if (r.correct) bySub[k].correct++; else bySub[k].ids.add(r.itemId); }
  return { a, b, c, lk, listening, total, passed, bySub: Object.fromEntries(Object.entries(bySub).map(([k, v]) => [k, { ...v, ids: [...v.ids] }])) };
}

export const SUB_LABELS = { 'A:reading': 'Kanji reading', 'A:orthography': 'Orthography', 'A:context': 'Words in context', 'B:grammar': 'Sentence grammar', 'B:composition': 'Sentence composition', 'B:reading': 'Reading comprehension', 'C:word': 'Listening: words', 'C:comprehension': 'Listening: comprehension' };
