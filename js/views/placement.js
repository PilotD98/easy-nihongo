/* Placement test: self-report, then a short check, then skip ahead. Route: #/placement */
import { h, append, icon, jp } from '../ui/dom.js';
import { loadKana } from '../content/kana.js';
import { loadJlpt } from '../content/n5.js';
import { qCharToRomaji, qRomajiToChar, runQuiz } from '../ui/quiz.js';
import { qKanjiMeaning, qVocabMeaning, qGrammar } from '../ui/quiz-n5.js';
import { applyPlacement, placementDone } from '../engine/placement.js';
import { progress } from '../store/progress.js';
import { initAudio } from '../ui/audio.js';
import { toast } from '../ui/toast.js';

export const title = 'Placement';
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export async function render(el) {
  const done = await placementDone();
  const existing = await progress.count();
  await initAudio();
  const stage = h('div');
  append(el, [
    h('header', { class: 'page-head' }, h('h1', null, 'Where should you start?'), h('p', { class: 'lede' }, 'Optional. If you already know some Japanese, a short check lets you skip what you know. Skipped items still enter your review queue, lightly, so nothing is lost.')),
    stage
  ]);
  if (done) stage.append(h('div', { class: 'notice' }, icon('info'), h('p', null, `You placed on ${new Date(done.date).toLocaleDateString()} (${LABELS[done.level] || done.level}). You can take the check again; it only ever unlocks more, never less.`)));
  if (existing > 0 && !done) stage.append(h('div', { class: 'notice' }, icon('info'), h('p', null, 'You already have progress. Placement adds unlocks and known items on top of it; it never removes anything.')));
  stage.append(chooser());

  function chooser() {
    return h('section', { class: 'card' },
      h('h2', null, 'What do you already know?'),
      h('ul', { class: 'path' }, [
        ['none', 'Nothing yet', 'Start from Orientation and the あ row.'],
        ['hiragana', 'Hiragana', 'I can read all hiragana comfortably.'],
        ['kana', 'Hiragana and katakana', 'I can read both scripts, including combinations and ー.'],
        ['n5', 'Some kanji, words and grammar (N5-level)', 'I know basic sentences like 私は学生です and some kanji.']
      ].map(([key, t, s]) => h('li', null,
        h('span', { class: 'step-no is-available', 'aria-hidden': 'true' }, icon(key === 'none' ? 'learn' : 'check')),
        h('div', null, h('div', { class: 'step-title' }, t), h('div', { class: 'step-sub' }, s)),
        h('button', { class: `btn ${key === 'none' ? '' : 'btn-primary'}`, type: 'button', onClick: () => key === 'none' ? finish('none', {}) : check(key) }, key === 'none' ? 'Start' : 'Check'))))
    );
  }

  async function check(claim) {
    stage.replaceChildren();
    const area = h('section', { class: 'card' });
    stage.append(h('p', { class: 'muted' }, 'A quick check: about 2 to 5 minutes. Answer honestly; guessing only puts you in the wrong place.'), area);
    const scores = {};
    // Hiragana
    const hira = await loadKana('kana');
    const hq = shuffle(hira.allChars).slice(0, 10).map((c, i) => (i % 2 ? qRomajiToChar(c, hira.allChars) : qCharToRomaji(c, hira.allChars)));
    const hr = await runQuiz(area, hq, { title: 'Hiragana check' });
    scores.hiragana = hr.correct / hr.total;
    if (scores.hiragana < 0.9) return finish('none', scores, 'Hiragana is not solid yet, so the path starts from the beginning. It goes quickly when you already know some.');
    if (claim === 'hiragana') return finish('hiragana', scores);
    // Katakana
    const kata = await loadKana('katakana');
    const kq = shuffle(kata.allChars.filter((c) => !c.parts || c.parts.length === 1)).slice(0, 10).map((c, i) => (i % 2 ? qRomajiToChar(c, kata.allChars) : qCharToRomaji(c, kata.allChars)));
    const kr = await runQuiz(area, kq, { title: 'Katakana check' });
    scores.katakana = kr.correct / kr.total;
    if (scores.katakana < 0.9) return finish('hiragana', scores, 'Hiragana is done; katakana needs work, so the path starts there.');
    if (claim === 'kana') return finish('kana', scores);
    // N5
    const lv = await loadJlpt('n5');
    const nq = [
      ...shuffle(lv.kanji).slice(0, 8).map((k) => qKanjiMeaning(k, lv.kanji)),
      ...shuffle(lv.vocab.filter((v) => v.kanji.length)).slice(0, 8).map((v) => qVocabMeaning(v, lv.vocab)),
      ...shuffle(lv.grammar).slice(0, 8).map((g) => qGrammar(g, g.exercises.find((x) => x.type === 'fill' || x.type === 'choose') || g.exercises[0]))
    ];
    const nr = await runQuiz(area, shuffle(nq), { title: 'N5 check' });
    scores.n5 = nr.correct / nr.total;
    if (scores.n5 >= 0.8) return finish('n5', scores, 'N5 looks solid. All 21 units are marked known; their items enter your reviews over the next weeks.');
    if (scores.n5 >= 0.5) return finish('n5-half', scores, 'You know a good part of N5. The first 10 units are marked known; continue from unit 11.');
    return finish('kana', scores, 'Kana are solid; N5 is where the work is, so the path starts at unit 1.');
  }

  async function finish(level, scores, note) {
    stage.replaceChildren(h('section', { class: 'card' }, h('p', null, 'Setting things up…')));
    const added = await applyPlacement(level, scores);
    const dest = level === 'none' ? '#/learn/orientation' : level === 'hiragana' ? '#/learn/katakana' : level === 'kana' ? '#/unit/n5/1' : level === 'n5-half' ? '#/unit/n5/11' : '#/learn/n5';
    stage.replaceChildren(h('section', { class: 'card card-accent' },
      h('h2', null, 'Placed: ', LABELS[level]),
      note ? h('p', null, note) : null,
      Object.keys(scores).length ? h('p', { class: 'small muted' }, Object.entries(scores).map(([k, v]) => `${k}: ${Math.round(v * 100)}%`).join(' · ')) : null,
      added ? h('p', { class: 'small muted' }, `${added} items added to your reviews as already known.`) : null,
      h('div', { class: 'btn-row' }, h('a', { class: 'btn btn-primary btn-lg', href: dest }, 'Continue'), h('a', { class: 'btn', href: '#/home' }, 'Home'))));
    if (added) toast(`${added} items marked as known.`);
  }
}
const LABELS = { none: 'start from zero', hiragana: 'hiragana known', kana: 'hiragana and katakana known', 'n5-half': 'half of N5 known', n5: 'N5 known' };
