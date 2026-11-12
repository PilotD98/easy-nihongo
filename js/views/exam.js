/* Stage exam for a kana script. Route: #/exam/kana */
import { h, append, icon } from '../ui/dom.js';
import { loadKana, markExamPassed, examPassed, passedGroups } from '../content/kana.js';
import { stagePathFor } from '../content/kana.js';
import { kanaQuiz, runQuiz } from '../ui/quiz.js';
import { days } from '../store/days.js';
import { initAudio } from '../ui/audio.js';
import { toast } from '../ui/toast.js';

export const title = 'Exam';

export async function render(el, ctx) {
  const levelId = ctx.segs[1] || 'kana';
  const kana = await loadKana(levelId);
  const passed = await passedGroups(levelId);
  const backHref = `#/learn/${stagePathFor(levelId)}`;
  if (passed.size < kana.groups.length) {
    append(el, [h('h1', null, `${kana.data.title} exam`), h('div', { class: 'notice' }, icon('lock'), h('p', null, `Pass all ${kana.groups.length} groups first.`)), h('a', { class: 'btn', href: backHref }, 'Back')]);
    return;
  }
  await initAudio();
  const cfg = kana.data.exam;
  const prior = await examPassed(levelId);
  const area = h('section', { class: 'card' });
  append(el, [
    h('header', { class: 'page-head' }, h('h1', null, `${kana.data.title} exam`), h('p', { class: 'lede' }, `${cfg.questions} questions · pass mark ${cfg.passPercent}% · unlocks ${cfg.unlocks}`)),
    area
  ]);

  const start = h('button', { class: 'btn btn-primary btn-lg', type: 'button', onClick: begin }, 'Begin');
  append(area, [
    h('p', null, 'Recognition, recall, typed readings and listening, drawn from every group. Take your time; there is no timer, and you can retake it.'),
    prior ? h('p', { class: 'muted' }, `You passed on ${new Date(prior.date).toLocaleDateString()} with ${prior.score}%.`) : null,
    h('div', { class: 'btn-row' }, start, h('a', { class: 'btn', href: backHref }, 'Not now'))
  ]);

  async function begin() {
    const startedAt = Date.now();
    const questions = kanaQuiz(kana.allChars, kana.allWords, { n: cfg.questions, pool: kana.allChars, wordPool: kana.allWords });
    const res = await runQuiz(area, questions, { title: 'Exam' });
    await days.log({ seconds: Math.round((Date.now() - startedAt) / 1000) });
    const pct = Math.round((res.correct / res.total) * 100);
    const ok = pct >= cfg.passPercent;
    if (ok) { await markExamPassed(levelId, { date: new Date().toISOString(), score: pct }); toast(`${cfg.unlocks} unlocked.`); }
    const missed = [...new Set(res.missed)].map((id) => kana.charsById.get(id) || kana.wordsById.get(id)).filter(Boolean);
    area.replaceChildren();
    append(area, [
      h('h2', null, ok ? 'Passed' : 'Not this time'),
      h('div', { class: 'stat-grid' },
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, `${pct}%`), h('div', { class: 'stat-label' }, `${res.correct} of ${res.total}`)),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(missed.length)), h('div', { class: 'stat-label' }, 'items missed'))),
      missed.length ? h('p', { style: { marginTop: '12px' } }, missed.map((it) => h('span', { class: 'pill', lang: 'ja' }, it.char || it.jp, ' ', it.romaji))) : null,
      h('p', { class: 'muted' }, ok ? `${cfg.unlocks} is unlocked. Your reviews keep every hiragana fresh from here on.` : `You need ${cfg.passPercent}%. Review the missed items, keep doing your daily reviews, and come back.`),
      h('div', { class: 'btn-row' },
        ok ? h('a', { class: 'btn btn-primary', href: '#/learn' }, 'Learning path') : h('button', { class: 'btn btn-primary', type: 'button', onClick: begin }, 'Try again'),
        h('a', { class: 'btn', href: backHref }, 'Back')
      )
    ]);
  }
}
