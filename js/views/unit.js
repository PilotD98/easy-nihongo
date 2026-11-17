/* One JLPT unit: kanji cards → vocabulary → grammar (with exercises) → reading → quiz.
   Route: #/unit/n5/<no> */
import { h, append, icon, jp } from '../ui/dom.js';
import { loadJlpt, markUnitPassed, unitItems, recordsFor } from '../content/n5.js';
import { strokeDiagram } from '../ui/stroke.js';
import { tracePad } from '../ui/tracepad.js';
import { speak, canSpeak, initAudio, stopSpeaking } from '../ui/audio.js';
import { vocabWord, sentence, markupText } from '../ui/kanjitext.js';
import { runQuiz } from '../ui/quiz.js';
import { unitQuiz, qGrammar } from '../ui/quiz-n5.js';
import { learnItems } from '../engine/scheduler.js';
import { days } from '../store/days.js';
import { settings } from '../store/settings.js';
import { isTouch } from '../util/platform.js';
import { toast } from '../ui/toast.js';

export const title = 'Unit';
const VOCAB_PAGE = 10;

export async function render(el, ctx) {
  const levelId = ctx.segs[1] || 'n5';
  const no = Number(ctx.segs[2]);
  const lv = await loadJlpt(levelId);
  const unit = lv.units.find((u) => u.no === no);
  if (!unit) { append(el, [h('h1', null, 'Unit not found'), h('a', { class: 'btn', href: `#/learn/${levelId}` }, 'Back')]); return; }
  await initAudio();
  const records = await recordsFor(lv);
  const startedAt = Date.now();
  let logged = false;
  const logTime = async () => { if (logged) return; logged = true; await days.log({ seconds: Math.round((Date.now() - startedAt) / 1000) }); };

  const kanji = unit.kanji.map((id) => lv.byId.get(id));
  const vocab = unit.vocab.map((id) => lv.byId.get(id));
  const grammar = unit.grammar.map((id) => lv.byId.get(id));
  const readings = unit.readings.map((id) => lv.byId.get(id));

  const steps = ['intro', ...kanji.map((k) => ['kanji', k]), ...chunk(vocab, VOCAB_PAGE).map((c, i) => ['vocab', c, i]), ...grammar.map((g) => ['grammar', g]), ...(readings.length ? [['reading', readings[0]]] : []), 'quiz'];
  let stepIdx = 0;
  const stage = h('div', { class: 'lesson' });
  const bar = h('div', { class: 'bar', role: 'progressbar', 'aria-label': 'Unit progress' }, h('span', { style: { width: '0%' } }));
  const counter = h('span', { class: 'small muted' });
  append(el, [
    h('header', { class: 'page-head row', style: { justifyContent: 'space-between' } },
      h('div', null, h('h1', null, `Unit ${unit.no}: ${unit.title}`), h('p', { class: 'lede' }, `${lv.title} · ${kanji.length} kanji · ${vocab.length} words · ${grammar.length} grammar`)),
      h('a', { class: 'btn', href: `#/learn/${levelId}`, onClick: () => { stopSpeaking(); logTime(); } }, 'Exit')),
    h('div', { class: 'row', style: { justifyContent: 'flex-end' } }, counter),
    bar, stage
  ]);

  const show = () => {
    stopSpeaking();
    bar.firstChild.style.width = `${(stepIdx / steps.length) * 100}%`;
    counter.textContent = `${stepIdx + 1} / ${steps.length}`;
    const step = steps[stepIdx];
    stage.replaceChildren();
    if (step === 'intro') stage.append(introCard());
    else if (step[0] === 'kanji') stage.append(kanjiCard(step[1]));
    else if (step[0] === 'vocab') stage.append(vocabCard(step[1], step[2]));
    else if (step[0] === 'grammar') stage.append(grammarCard(step[1]));
    else if (step[0] === 'reading') stage.append(readingCard(step[1]));
    else if (step === 'quiz') runUnitQuiz();
    window.scrollTo(0, 0);
  };
  const nextBtn = (label = 'Continue') => h('div', { class: 'lesson-foot' }, h('button', { class: 'btn btn-primary btn-lg btn-block lesson-next', type: 'button', onClick: () => { stepIdx += 1; show(); } }, label));
  const onKey = (e) => { if (e.key === 'Enter' && !['INPUT', 'BUTTON'].includes(e.target.tagName) && !document.querySelector('dialog[open]')) { const b = stage.querySelector('.lesson-next'); if (b) { e.preventDefault(); b.click(); } } };
  document.addEventListener('keydown', onKey);

  function introCard() {
    return h('section', { class: 'card' },
      h('h2', null, 'In this unit'),
      h('div', { class: 'char-grid' }, kanji.map((k) => h('div', { class: 'char-chip' }, jp(k.char, 'jp-xl'), h('span', { class: 'small muted' }, k.meanings[0])))),
      h('p', { class: 'muted' }, `${vocab.length} words (written with these kanji, plus everyday words in kana), then ${grammar.length} grammar point${grammar.length === 1 ? '' : 's'}: ${grammar.map((g) => g.title).join('; ')}.${readings.length ? ' A short reading closes the unit.' : ''}`),
      h('p', { class: 'small muted' }, 'Kanji you have not learned yet always show furigana. Once you know a word, its furigana fades after four correct reviews in a row; tap any kanji to reveal it.'),
      nextBtn('Begin'));
  }

  function kanjiCard(k) {
    const data = lv.strokes[k.char];
    const diagram = data ? strokeDiagram(data, { size: 180, label: k.char }) : null;
    const examples = k.examples.map((id) => lv.allById.get(id)).filter(Boolean);
    if (canSpeak() && settings.get('autoplayAudio')) setTimeout(() => speak(k.kun[0]?.replace('･', '') || k.on[0] || k.char), 400);
    return h('section', { class: 'card' },
      h('div', { class: 'kanji-head' },
        h('div', { class: 'kanji-big', lang: 'ja' }, k.char),
        h('div', null,
          h('div', { class: 'kanji-meanings' }, k.meanings.join(', ')),
          h('dl', { class: 'kanji-readings' },
            h('dt', null, 'On readings'), h('dd', { lang: 'ja' }, k.on.join('・') || '—'),
            h('dt', null, 'Kun readings'), h('dd', { lang: 'ja' }, k.kun.join('・') || '—'),
            h('dt', null, `${k.strokes} stroke${k.strokes === 1 ? '' : 's'}${k.radicals.length ? ' · components' : ''}`), h('dd', { class: 'components' }, k.radicals.map((r) => h('span', { class: 'pill', lang: 'ja' }, r)))))),
      diagram ? h('div', { class: 'row', style: { alignItems: 'flex-start', marginTop: '12px' } }, diagram.el, h('div', { class: 'btn-row' }, h('button', { class: 'btn', type: 'button', onClick: () => diagram.play() }, 'Replay strokes'))) : null,
      h('p', { class: 'mnemonic' }, h('strong', null, 'Remember: '), k.mnemonic),
      h('h3', null, 'Words with ', jp(k.char)),
      h('ul', { class: 'vocab-list' }, examples.map((v) => h('li', null, vocabWord(v, records.get(v.id), { cls: 'vw' }), h('div', { class: 'vm' }, v.meanings[0], h('small', null, v.kana)), canSpeak() ? h('button', { class: 'icon-btn', type: 'button', 'aria-label': `Listen to ${v.kana}`, onClick: () => speak(v.kana, { romaji: v.romaji }) }, icon('speak')) : null))),
      data ? traceSection(data) : null,
      nextBtn());
  }

  function traceSection(data) {
    const details = h('details', { class: 'trace-details', open: isTouch() ? true : null });
    details.append(h('summary', null, 'Trace it'));
    let built = false;
    const build = () => { if (built) return; built = true; details.append(tracePad(data, { size: Math.min(280, window.innerWidth - 72) }).el); };
    if (details.open) build(); else details.addEventListener('toggle', build, { once: true });
    return details;
  }

  function vocabCard(words, page) {
    return h('section', { class: 'card' },
      h('h2', null, `Vocabulary ${page * VOCAB_PAGE + 1}–${page * VOCAB_PAGE + words.length} of ${vocab.length}`),
      h('ul', { class: 'vocab-list' }, words.map((v) => h('li', null,
        vocabWord(v, records.get(v.id), { cls: 'vw' }),
        h('div', { class: 'vm' }, v.meanings.join('; '), h('small', null, `${v.kana} · ${v.romaji}`, v.pos?.length ? h('span', { class: 'pos-tag' }, ` · ${POS[v.pos[0]] || v.pos[0]}`) : null)),
        canSpeak() ? h('button', { class: 'icon-btn', type: 'button', 'aria-label': `Listen to ${v.kana}`, onClick: () => speak(v.kana, { romaji: v.romaji }) }, icon('speak')) : null))),
      h('p', { class: 'small muted' }, 'Read each word aloud, then tap the speaker to compare.'),
      nextBtn());
  }

  function grammarCard(g) {
    const exArea = h('div');
    const card = h('section', { class: 'card' },
      h('h2', null, g.title),
      h('div', { class: 'gram-pattern', lang: 'ja' }, g.pattern),
      h('p', null, g.explanation),
      h('h3', null, 'Examples'),
      h('div', null, g.examples.map((ex) => h('div', { class: 'gram-example' },
        h('div', { class: 'row' }, sentence(ex.jp, { reading: ex.kana, records, lv, cls: 'ex-jp' }), canSpeak() ? h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Listen', onClick: () => speak(ex.kana, { kanji: ex.jp }) }, icon('speak')) : null),
        h('div', { class: 'ex-meta' }, ex.romaji, ' · ', ex.en)))),
      g.mistakes?.length ? h('div', null, h('h3', null, 'Common mistakes'), h('ul', { class: 'gram-mistakes' }, g.mistakes.map((m) => h('li', null, m)))) : null,
      h('h3', null, 'Try it'),
      exArea,
      nextBtn());
    runQuiz(exArea, g.exercises.map((x) => qGrammar(g, x)), { title: 'Practice' }).then((res) => {
      exArea.append(h('p', { class: 'small muted' }, `${res.correct} of ${res.total} correct.`));
    });
    return card;
  }

  function readingCard(r) {
    return h('section', { class: 'card' },
      h('h2', null, `Reading: ${r.title}`),
      h('p', { class: 'muted' }, 'Built only from words and grammar you have met. Tap any word for its reading and meaning.'),
      h('a', { class: 'btn btn-primary', href: `#/read/${levelId}/${encodeURIComponent(r.id)}` }, 'Open the passage'),
      h('p', { class: 'small muted', style: { marginTop: '12px' } }, 'Come back here to finish the unit with the quiz.'),
      nextBtn('Go to the quiz'));
  }

  async function runUnitQuiz() {
    const area = h('section', { class: 'card' });
    stage.append(area);
    const res = await runQuiz(area, unitQuiz(lv, unit, { n: 12 }), { title: `Unit ${unit.no} check` });
    const pct = Math.round((res.correct / res.total) * 100);
    const ok = pct >= 80;
    bar.firstChild.style.width = '100%';
    if (ok) {
      const added = await learnItems(unitItems(lv, unit));
      await markUnitPassed(levelId, unit.id);
      if (added) toast(`${added} items added to your reviews.`);
    }
    await logTime();
    const missed = [...new Set(res.missed)].map((id) => lv.byId.get(id)).filter(Boolean);
    const next = lv.units.find((u) => u.no === unit.no + 1);
    area.replaceChildren();
    append(area, [
      h('h2', null, ok ? 'Passed' : 'Not yet'),
      h('div', { class: 'stat-grid' },
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, `${pct}%`), h('div', { class: 'stat-label' }, `${res.correct} of ${res.total} correct`)),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(missed.length)), h('div', { class: 'stat-label' }, 'to look at again'))),
      missed.length ? h('div', { style: { marginTop: '12px' } }, h('strong', null, 'Missed: '), missed.map((it) => h('a', { class: 'pill', lang: 'ja', href: `#/learn/item/${encodeURIComponent(it.id)}` }, it.char || it.jp || it.title))) : null,
      h('p', { class: 'muted', style: { marginTop: '12px' } }, ok ? `Everything in this unit is now in your review queue (${kanji.length} kanji, ${vocab.length} words, ${grammar.length} grammar points).` : 'You need 80% to pass. Go back over the cards you missed and try again.'),
      h('div', { class: 'btn-row', style: { marginTop: '16px' } },
        ok && next ? h('a', { class: 'btn btn-primary btn-lg', href: `#/unit/${levelId}/${next.no}` }, `Next: unit ${next.no}`) : null,
        ok && !next ? h('a', { class: 'btn btn-primary btn-lg', href: `#/learn/${levelId}` }, 'Back to the level') : null,
        !ok ? h('button', { class: 'btn btn-primary btn-lg', type: 'button', onClick: () => { stepIdx = 1; logged = false; show(); } }, 'Review the cards') : null,
        !ok ? h('button', { class: 'btn', type: 'button', onClick: () => { stepIdx = steps.length - 1; logged = false; show(); } }, 'Retry the quiz') : null,
        h('a', { class: 'btn', href: `#/learn/${levelId}` }, 'Unit list'))
    ]);
  }

  show();
  return () => { document.removeEventListener('keydown', onKey); stopSpeaking(); logTime(); };
}

const POS = { n: 'noun', pn: 'pronoun', v5: 'godan verb', v1: 'ichidan verb', vs: 'suru verb', vk: 'irregular verb', 'adj-i': 'い-adjective', 'adj-na': 'な-adjective', adv: 'adverb', prt: 'particle', exp: 'expression', num: 'number', cnt: 'counter', int: 'interjection', conj: 'conjunction', 'pre-noun': 'pre-noun' };
function chunk(arr, n) { const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out; }
