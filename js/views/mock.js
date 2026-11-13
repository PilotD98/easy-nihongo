/* Mock JLPT exam: timed sections, no feedback until the end, scaled score
   breakdown and weak areas with one-tap practice. Route: #/mock/n5 */
import { h, append, icon } from '../ui/dom.js';
import { loadJlpt } from '../content/n5.js';
import { buildMockN5, scoreMock, SUB_LABELS } from '../ui/exam-n5.js';
import { renderQuestion } from '../ui/quiz.js';
import { markupText } from '../ui/kanjitext.js';
import { initAudio, stopSpeaking, canSpeak } from '../ui/audio.js';
import { db } from '../store/db.js';
import { days } from '../store/days.js';
import { isUnlocked } from '../content/kana.js';

export const title = 'Mock exam';

export async function examHistory(levelId = 'n5') { return (await db.get('meta', `${levelId}:mocks`))?.value || []; }

export async function render(el, ctx) {
  const levelId = ctx.segs[1] || 'n5';
  if (!(await isUnlocked(levelId))) { append(el, [h('h1', null, 'Mock exam'), h('div', { class: 'notice' }, icon('lock'), h('p', null, 'Unlock N5 first (pass the katakana exam or take the placement test).')), h('a', { class: 'btn', href: '#/learn' }, 'Learning path')]); return; }
  const lv = await loadJlpt(levelId);
  await initAudio();
  const history = await examHistory(levelId);
  const area = h('div');
  append(el, [
    h('header', { class: 'page-head' }, h('h1', null, `Mock JLPT ${lv.title.replace('JLPT ', '')}`), h('p', { class: 'lede' }, 'Three timed sections in the real exam\'s format. No feedback until the end. Scores are an estimate on the JLPT scale, not a prediction of the real result.')),
    area
  ]);
  intro();

  function intro() {
    const sections = buildMockN5(lv);
    area.replaceChildren();
    append(area, [h('section', { class: 'card' },
      h('ul', { class: 'path' }, sections.map((s) => h('li', null, h('span', { class: 'step-no is-available', 'aria-hidden': 'true' }, s.id), h('div', null, h('div', { class: 'step-title' }, s.title), h('div', { class: 'step-sub' }, `${s.questions.length} questions · ${s.minutes} minutes`)), h('span', null)))),
      canSpeak() ? null : h('div', { class: 'notice notice-warn' }, icon('info'), h('p', null, 'No Japanese voice is available, so the Listening section is left out and the estimate covers Language Knowledge and Reading only.')),
      h('p', { class: 'small muted' }, 'Each section is timed; when time runs out it is submitted as is. You can submit early. Pass mark (estimate): 80 of 180 overall, with at least 38 of 120 in Language Knowledge + Reading and 19 of 60 in Listening.'),
      h('div', { class: 'btn-row' }, h('button', { class: 'btn btn-primary btn-lg', type: 'button', onClick: () => run(sections) }, 'Begin'), h('a', { class: 'btn', href: `#/learn/${levelId}` }, 'Not now'))),
      history.length ? h('section', { class: 'card' }, h('h2', null, 'Previous attempts'), h('ul', { class: 'missed-list' }, history.slice(-5).reverse().map((x) => h('li', null, h('span', { class: 'grow' }, new Date(x.date).toLocaleDateString()), h('span', { class: `pill` }, `${x.total} / 180 · ${x.passed == null ? 'no listening' : x.passed ? 'pass' : 'fail'}`))))) : null]);
  }

  async function run(sections) {
    const startedAt = Date.now();
    const results = [];
    for (const s of sections) {
      const r = await runSection(s);
      results.push(...r);
    }
    await days.log({ seconds: Math.round((Date.now() - startedAt) / 1000), answered: results.length, correct: results.filter((r) => r.correct).length });
    showResults(sections, results);
  }

  function runSection(s) {
    return new Promise((resolve) => {
      const results = [];
      let idx = 0, cleanup = null, ended = false;
      const endsAt = Date.now() + s.minutes * 60_000;
      const clock = h('span', { class: 'exam-clock', 'aria-live': 'off' });
      const counter = h('span', { class: 'small muted' });
      const qArea = h('div', { class: 'q-area exam-area' });
      const next = h('button', { class: 'btn btn-primary btn-lg btn-block', type: 'button', hidden: true }, 'Next');
      const submit = h('button', { class: 'btn', type: 'button', onClick: () => finish() }, 'Submit section');
      area.replaceChildren(h('section', { class: 'card' },
        h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('strong', null, `Section ${s.id}: ${s.title}`), clock),
        h('div', { class: 'row', style: { justifyContent: 'space-between' } }, counter, submit),
        qArea, next));
      const tick = setInterval(() => {
        const left = Math.max(0, endsAt - Date.now());
        clock.textContent = `${Math.floor(left / 60000)}:${String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}`;
        clock.classList.toggle('is-low', left < 60_000);
        if (left <= 0) finish();
      }, 500);
      const finish = () => {
        if (ended) return; ended = true;
        clearInterval(tick); cleanup?.(); stopSpeaking();
        // unanswered questions count as wrong
        for (let k = idx; k < s.questions.length; k++) if (!results[k]) results[k] = { correct: false, q: s.questions[k], section: s.id, sub: s.questions[k].sub, itemId: s.questions[k].itemId, skipped: true };
        resolve(results.filter(Boolean));
      };
      const show = () => {
        if (idx >= s.questions.length) { finish(); return; }
        counter.textContent = `${idx + 1} / ${s.questions.length}`;
        next.hidden = true;
        cleanup?.();
        const q = s.questions[idx];
        cleanup = renderQuestion(qArea, q, { autoplay: true, silent: true, onAnswer: (r) => { results[idx] = { ...r, section: s.id, sub: q.sub, itemId: q.itemId }; next.hidden = false; next.focus({ preventScroll: true }); } });
        if (q.prompt.markupSub) qArea.querySelector('.q-prompt')?.append(h('div', { class: 'q-markup exam-sub' }, markupText(q.prompt.markupSub)));
        window.scrollTo(0, 0);
      };
      next.addEventListener('click', () => { idx += 1; show(); });
      show();
    });
  }

  async function showResults(sections, results) {
    const sc = scoreMock(sections, results);
    const entry = { date: new Date().toISOString(), level: levelId, total: sc.total, lk: sc.lk, listening: sc.listening, passed: sc.passed };
    const hist = await examHistory(levelId);
    await db.put('meta', { id: `${levelId}:mocks`, value: [...hist, entry].slice(-20) });
    const weak = Object.entries(sc.bySub).map(([k, v]) => ({ k, label: SUB_LABELS[k] || k, pct: v.total ? v.correct / v.total : 0, ids: v.ids.filter((id) => /^(kanji|vocab|gram):/.test(id)), raw: v.ids, total: v.total })).sort((a, b) => a.pct - b.pct);
    area.replaceChildren(
      h('section', { class: `card ${sc.passed ? 'card-accent' : ''}` },
        h('h2', null, sc.passed == null ? 'Result (no listening section)' : sc.passed ? 'Estimated pass' : 'Estimated fail'),
        h('div', { class: 'stat-grid' },
          h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, `${sc.total}`), h('div', { class: 'stat-label' }, 'of 180 overall (pass ≥ 80)')),
          h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, `${sc.lk}`), h('div', { class: 'stat-label' }, 'of 120 language + reading (≥ 38)')),
          h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, sc.listening == null ? '—' : `${sc.listening}`), h('div', { class: 'stat-label' }, 'of 60 listening (≥ 19)'))),
        h('p', { class: 'small muted', style: { marginTop: '12px' } }, 'Scaled from your percentage in each section. The real JLPT uses item-response scaling and more questions; treat this as a direction, not a verdict.')),
      h('section', { class: 'card' },
        h('h2', null, 'By question type'),
        weak.map((w) => h('div', { class: 'bar-row' }, h('span', null, w.label), h('div', { class: 'bar' }, h('span', { style: { width: `${Math.round(w.pct * 100)}%`, background: w.pct < 0.6 ? 'var(--err)' : undefined } })), h('span', { class: 'pct' }, `${Math.round(w.pct * 100)}%`))),
        weak.filter((w) => w.pct < 0.7 && w.raw.length).length ? h('div', { style: { marginTop: '12px' } }, h('h3', null, 'Weak areas'), weak.filter((w) => w.pct < 0.7 && w.raw.length).map((w) => h('div', { class: 'row', style: { marginBottom: '8px' } }, h('span', { class: 'grow' }, `${w.label}: ${w.raw.length} missed`), w.ids.length ? h('a', { class: 'btn', href: `#/review?start=1&items=${encodeURIComponent(w.ids.join(','))}` }, 'Practice') : h('a', { class: 'btn', href: '#/read' }, w.k.startsWith('C') ? 'Listening drills' : 'Readings')))) : h('p', { class: 'muted' }, 'No weak areas below 70%. Keep reviewing.')),
      h('div', { class: 'btn-row' }, h('button', { class: 'btn btn-primary', type: 'button', onClick: intro }, 'Take it again'), h('a', { class: 'btn', href: '#/progress' }, 'Progress'), h('a', { class: 'btn', href: `#/learn/${levelId}` }, 'Back to N5'))
    );
  }
  return () => stopSpeaking();
}
