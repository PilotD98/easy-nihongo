/* Reading passages and listening drills.
   Routes: #/read/n5/<readingId>   #/read/n5/listen/<listeningId> */
import { h, append, icon, jp } from '../ui/dom.js';
import { loadJlpt, recordsFor, tokenize, lookup } from '../content/n5.js';
import { sentence, vocabWord, markupText } from '../ui/kanjitext.js';
import { parseMarkup, stripMarkup, isKanji } from '../engine/furigana.js';
import { speak, canSpeak, initAudio, stopSpeaking } from '../ui/audio.js';
import { openSheet } from '../ui/dialog.js';
import { runQuiz } from '../ui/quiz.js';
import { learnItems } from '../engine/scheduler.js';
import { days } from '../store/days.js';
import { toast } from '../ui/toast.js';

export const title = 'Read';

export async function render(el, ctx) {
  const levelId = ctx.segs[1];
  const isListen = ctx.segs[2] === 'listen';
  const id = decodeURIComponent(ctx.segs[isListen ? 3 : 2] || '');
  const lv = await loadJlpt(levelId);
  const item = lv.byId.get(id);
  if (!item) { append(el, [h('h1', null, 'Not found'), h('a', { class: 'btn', href: '#/read' }, 'Reading library')]); return; }
  await initAudio();
  const records = await recordsFor(lv);
  const startedAt = Date.now();
  const cleanup = () => { stopSpeaking(); days.log({ seconds: Math.round((Date.now() - startedAt) / 1000) }); };
  if (isListen) renderListening(el, lv, item, records); else renderPassage(el, lv, item, records);
  return cleanup;
}

/* ---------- passage ---------- */
function renderPassage(el, lv, r, records) {
  const plain = stripMarkup(r.text);
  // Split into sentences on 。 so each can be played and tokenised.
  const sentences = plain.split(/(?<=[。！？])/).filter((s) => s.trim());
  const kanaSentences = r.kana.split(/(?<=[。！？])/).filter((s) => s.trim());
  const markupSentences = r.text.split(/(?<=[。！？])/).filter((s) => s.trim());

  const passage = h('div', { class: 'passage', lang: 'ja' });
  sentences.forEach((s, i) => {
    const node = sentence(markupSentences[i] || s, { reading: kanaSentences[i] || null, records, lv });
    // make vocabulary tokens tappable: wrap the rendered sentence's text runs
    makeTappable(node, lv, records, s);
    passage.append(node, canSpeak() ? h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Listen to this sentence', onClick: () => speak(kanaSentences[i] || s, { kanji: markupSentences[i] || null }) }, icon('listen')) : null);
  });

  const translation = h('div', { class: 'translation', hidden: true }, r.enText);
  const quizArea = h('div');
  append(el, [
    h('header', { class: 'page-head' }, h('h1', null, r.title), h('p', { class: 'lede' }, `${r.en} · ${lv.title} unit ${r.unit} · tap a word to look it up`)),
    h('section', { class: 'card' }, passage,
      h('div', { class: 'btn-row', style: { marginTop: '12px' } },
        canSpeak() ? h('button', { class: 'btn', type: 'button', onClick: () => speak(r.kana, { kanji: r.text }) }, icon('listen'), 'Read aloud') : null,
        canSpeak() ? h('button', { class: 'btn', type: 'button', onClick: () => speak(r.kana, { rate: 0.7, kanji: r.text }) }, icon('listen'), 'Slow') : null,
        h('button', { class: 'btn', type: 'button', onClick: (e) => { translation.hidden = !translation.hidden; e.currentTarget.lastChild.textContent = translation.hidden ? 'Show translation' : 'Hide translation'; } }, icon('read'), h('span', null, 'Show translation'))),
      translation),
    h('section', { class: 'card' }, h('h2', null, 'Questions'), quizArea),
    h('a', { class: 'btn', href: '#/read' }, 'Reading library')
  ]);
  const qs = r.questions.map((q, i) => ({ kind: 'choice', itemId: r.id, type: 'reading', prompt: { markup: q.q }, options: q.choices, optionsJp: true, optionsMarkup: true, answer: q.answer === undefined ? q.choices[0] : q.choices[q.answer], why: q.why }));
  runQuiz(quizArea, qs, { title: 'Comprehension' }).then((res) => {
    days.log({ answered: res.total, correct: res.correct });
    quizArea.append(h('p', { class: 'muted', style: { marginTop: '12px' } }, `${res.correct} of ${res.total} correct.`));
  });
}

/** Wrap vocabulary matches inside a rendered sentence so they open a lookup sheet. */
function makeTappable(node, lv, records, plainText) {
  const tokens = tokenize(lv, plainText);
  // Walk text nodes and ruby elements, mapping character offsets to tokens.
  const parts = [];
  const walk = (n) => { for (const c of [...n.childNodes]) { if (c.nodeType === 3) parts.push(c); else if (c.tagName === 'RUBY') parts.push(c); else walk(c); } };
  walk(node);
  let pos = 0;
  const tokenAt = (p) => { let i = 0; for (const t of tokens) { if (p >= i && p < i + t.text.length) return t; i += t.text.length; } return null; };
  for (const part of parts) {
    const text = part.nodeType === 3 ? part.textContent : part.firstChild.textContent;
    const len = text.length;
    const tok = tokenAt(pos);
    if (tok && tok.vocab) {
      const btn = h('button', { class: 'tok', type: 'button', lang: 'ja', 'aria-label': `${tok.vocab.jp}: look up` });
      part.replaceWith(btn); btn.append(part);
      btn.addEventListener('click', (e) => { e.stopPropagation(); showLookup(tok.vocab, records); });
    }
    pos += len;
  }
}

function showLookup(v, records) {
  const rec = records.get(v.id);
  const body = h('div', null,
    h('div', { class: 'lookup-word' }, vocabWord(v, { display: 3 })),
    h('p', null, h('strong', null, v.meanings.join('; ')), h('div', { class: 'small muted' }, `${v.kana} · ${v.romaji}`)),
    h('div', { class: 'btn-row' },
      canSpeak() ? h('button', { class: 'btn', type: 'button', onClick: () => speak(v.kana) }, icon('listen'), 'Listen') : null,
      h('a', { class: 'btn', href: `#/learn/item/${encodeURIComponent(v.id)}` }, 'Details'),
      rec ? h('span', { class: 'pill' }, 'In your reviews') : h('button', { class: 'btn btn-primary', type: 'button', onClick: async (e) => { await learnItems([{ id: v.id, type: 'vocab', display: [...v.jp].some(isKanji) ? 3 : 1 }]); e.currentTarget.replaceWith(h('span', { class: 'pill' }, 'Added')); toast('Added to your reviews.'); } }, 'Add to reviews')));
  openSheet({ title: 'Word', body });
}

/* ---------- listening ---------- */
function renderListening(el, lv, l, records) {
  const area = h('div');
  append(el, [
    h('header', { class: 'page-head' }, h('h1', null, l.title), h('p', { class: 'lede' }, `${TYPES[l.type]} · ${lv.title} unit ${l.unit}`)),
    h('section', { class: 'card' }, area),
    h('a', { class: 'btn', href: '#/read' }, 'Reading library')
  ]);
  if (!canSpeak()) { area.append(h('div', { class: 'notice notice-warn' }, icon('info'), h('p', null, 'This drill needs a Japanese voice. See the Speak page to install one.'))); return; }

  let qs;
  if (l.type === 'dictation') {
    qs = l.items.map((it) => ({ kind: 'typed', itemId: l.id, type: 'listening', prompt: { audio: it.kana, hint: 'type what you hear (kana or romaji)' }, accepted: [it.kana, stripMarkup(it.text)], answer: stripMarkup(it.text), why: `${stripMarkup(it.text)} (${it.kana}): ${it.en}` }));
  } else if (l.type === 'comprehension') {
    qs = l.items.flatMap((it) => (it.questions || []).map((q) => ({ kind: 'choice', itemId: l.id, type: 'listening', prompt: { audio: it.kana, markup: q.q, hint: 'listen, then answer' }, options: q.choices, optionsJp: true, optionsMarkup: true, answer: q.choices[q.answer], why: `${q.why} — ${it.en}` })));
  } else {
    // shadowing: play, show text, self-check
    const list = h('div');
    l.items.forEach((it, i) => list.append(h('div', { class: 'gram-example' },
      h('div', { class: 'row' }, sentence(it.text, { reading: it.kana, records, lv, cls: 'ex-jp' }), h('button', { class: 'btn', type: 'button', onClick: () => speak(it.kana, { rate: 0.7 }) }, icon('listen'), 'Slow'), h('button', { class: 'btn', type: 'button', onClick: () => speak(it.kana) }, icon('listen'), 'Natural')),
      h('div', { class: 'ex-meta' }, it.en))));
    area.append(h('p', { class: 'muted' }, 'Play each line and speak along, first slowly, then at natural speed. For scored feedback use the Speak tab.'), list);
    return;
  }
  runQuiz(area, qs, { title: l.title }).then((res) => {
    days.log({ answered: res.total, correct: res.correct });
    area.append(h('p', { class: 'muted', style: { marginTop: '12px' } }, `${res.correct} of ${res.total} correct.`));
  });
}
const TYPES = { dictation: 'Dictation', comprehension: 'Comprehension', shadow: 'Shadowing' };
