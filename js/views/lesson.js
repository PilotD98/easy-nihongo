/* One kana group lesson: intro → character cards (stroke order, mnemonic,
   audio, tracing) → words → quiz → result. Route: #/lesson/kana/<groupId> */
import { h, append, icon, jp } from '../ui/dom.js';
import { loadKana, markGroupPassed, passedGroups } from '../content/kana.js';
import { stagePathFor } from '../content/kana.js';
import { strokeDiagram, strokeDiagrams } from '../ui/stroke.js';
import { tracePad } from '../ui/tracepad.js';
import { speak, canSpeak, initAudio, stopSpeaking } from '../ui/audio.js';
import { kanaWord } from '../ui/kanatext.js';
import { kanaQuiz, runQuiz } from '../ui/quiz.js';
import { learnItems } from '../engine/scheduler.js';
import { days } from '../store/days.js';
import { settings } from '../store/settings.js';
import { isTouch } from '../util/platform.js';
import { toast } from '../ui/toast.js';

export const title = 'Lesson';

export async function render(el, ctx) {
  const levelId = ctx.segs[1] || 'kana';
  const groupId = ctx.segs[2];
  const kana = await loadKana(levelId);
  const group = kana.groups.find((g) => g.id === groupId);
  if (!group) {
    append(el, [h('h1', null, 'Lesson not found'), h('a', { class: 'btn', href: `#/learn/${stagePathFor(levelId)}` }, 'Back')]);
    return;
  }
  await initAudio();
  const startedAt = Date.now();
  let logged = false;
  const logTime = async () => { if (logged) return; logged = true; await days.log({ seconds: Math.round((Date.now() - startedAt) / 1000) }); };

  const passed = await passedGroups(levelId);
  const prevChars = kana.groups.filter((g) => g.index < group.index).flatMap((g) => g.chars);
  const prevWords = kana.groups.filter((g) => g.index < group.index).flatMap((g) => g.words);

  // Steps: 'intro', ['char', i]..., 'words', 'quiz', 'result'
  const steps = ['intro', ...group.chars.map((_, i) => ['char', i]), 'words', 'quiz'];
  let stepIdx = 0;
  const stage = h('div', { class: 'lesson' });
  const progressBar = h('div', { class: 'bar', role: 'progressbar', 'aria-label': 'Lesson progress' }, h('span', { style: { width: '0%' } }));
  append(el, [
    h('header', { class: 'page-head row', style: { justifyContent: 'space-between' } },
      h('div', null, h('h1', null, group.title), h('p', { class: 'lede' }, `${kana.data.title} · group ${group.index + 1} of ${kana.groups.length}`)),
      h('a', { class: 'btn', href: `#/learn/${stagePathFor(levelId)}`, onClick: () => { stopSpeaking(); logTime(); } }, 'Exit')),
    progressBar,
    stage
  ]);

  const show = () => {
    stopSpeaking();
    progressBar.firstChild.style.width = `${(stepIdx / steps.length) * 100}%`;
    const step = steps[stepIdx];
    stage.replaceChildren();
    if (step === 'intro') stage.append(introCard());
    else if (step[0] === 'char') stage.append(charCard(group.chars[step[1]]));
    else if (step === 'words') stage.append(wordsCard());
    else if (step === 'quiz') runLessonQuiz();
    stage.querySelector('h2')?.focus?.();
    window.scrollTo(0, 0);
  };
  const nextBtn = (label = 'Continue') => h('button', { class: 'btn btn-primary btn-lg btn-block', type: 'button', onClick: () => { stepIdx += 1; show(); } }, label);
  const onKey = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !document.querySelector('dialog[open]')) {
      const b = stage.querySelector('.lesson-next'); if (b) { e.preventDefault(); b.click(); }
    }
  };
  document.addEventListener('keydown', onKey);

  function introCard() {
    return h('section', { class: 'card' },
      h('h2', { tabindex: '-1' }, `In this group`),
      group.intro ? h('p', null, group.intro) : null,
      h('div', { class: 'char-grid' }, group.chars.map((c) => h('div', { class: 'char-chip' }, jp(c.char, 'jp-xl'), h('span', { class: 'small muted' }, c.romaji)))),
      h('p', { class: 'muted' }, `You will meet each character with its stroke order and a memory hint, then ${group.words.length} real words that use only what you know, then a short quiz.`),
      wrapNext(nextBtn('Begin'))
    );
  }

  function charCard(c) {
    const parts = c.parts || [c.char];
    const hasStrokes = parts.every((p) => kana.strokes[p]);
    const diagram = hasStrokes ? (parts.length === 1 ? strokeDiagram(kana.strokes[c.char], { size: 180, label: c.char }) : strokeDiagrams(parts, kana.strokes, { size: 140 })) : null;
    const audioBtn = canSpeak() ? h('button', { class: 'btn', type: 'button', onClick: () => speak(speakable(c)) }, icon('listen'), 'Listen') : null;
    if (canSpeak() && settings.get('autoplayAudio')) setTimeout(() => speak(speakable(c)), 400);
    const card = h('section', { class: 'card char-card' },
      h('div', { class: 'char-head' },
        h('div', null, jp(c.char, 'jp-xl char-big'), h('div', { class: 'char-romaji' }, c.romaji)),
        h('div', { class: 'char-meta small muted' }, `${c.strokes} stroke${c.strokes === 1 ? '' : 's'}`, c.base ? h('div', null, 'From ', jp(c.base)) : null)
      ),
      diagram ? h('div', { class: 'row', style: { alignItems: 'flex-start' } }, diagram.el, h('div', { class: 'btn-row' }, h('button', { class: 'btn', type: 'button', onClick: () => diagram.play() }, 'Replay strokes'), audioBtn)) : h('div', { class: 'btn-row' }, audioBtn),
      h('p', { class: 'mnemonic' }, h('strong', null, 'Remember: '), c.mnemonic),
      hasStrokes && parts.length === 1 ? traceSection(c) : null,
      wrapNext(nextBtn())
    );
    return card;
  }

  function traceSection(c) {
    const details = h('details', { class: 'trace-details', open: isTouch() ? true : null });
    details.append(h('summary', null, 'Trace it'));
    let built = false;
    const build = () => { if (built) return; built = true; details.append(tracePad(kana.strokes[c.char], { size: Math.min(280, window.innerWidth - 72) }).el); };
    if (details.open) build(); else details.addEventListener('toggle', build, { once: true });
    return details;
  }

  function wordsCard() {
    const list = h('ul', { class: 'word-list' }, group.words.map((w) => h('li', null,
      kanaWord(w, 1, { cls: 'jp word-jp' }),
      h('span', { class: 'word-meaning grow' }, w.meaning),
      canSpeak() ? h('button', { class: 'icon-btn', type: 'button', 'aria-label': `Listen to ${w.romaji}`, onClick: () => speak(w.jp) }, icon('listen')) : null
    )));
    return h('section', { class: 'card' },
      h('h2', { tabindex: '-1' }, 'Real words you can now read'),
      h('p', { class: 'muted' }, 'Every word uses only characters you have learned. Read each one aloud before tapping the speaker.'),
      list,
      group.note ? h('div', { class: 'notice' }, icon('info'), h('p', null, group.note)) : null,
      wrapNext(nextBtn('Start the quiz'))
    );
  }

  async function runLessonQuiz() {
    const n = kana.data.quiz.questions;
    const questions = kanaQuiz(group.chars, group.words, { n, pool: [...prevChars, ...group.chars], wordPool: [...prevWords, ...group.words] });
    const area = h('section', { class: 'card' });
    stage.append(area);
    const res = await runQuiz(area, questions, { title: `${group.title} check` });
    const pct = Math.round((res.correct / res.total) * 100);
    const ok = pct >= kana.data.quiz.passPercent;
    progressBar.firstChild.style.width = '100%';
    if (ok) {
      const added = await learnItems([...group.chars.map((c) => ({ id: c.id, type: 'kana' })), ...group.words.map((w) => ({ id: w.id, type: 'vocab' }))]);
      await markGroupPassed(levelId, group.id);
      if (added) toast(`${added} items added to your reviews.`);
    }
    await logTime();
    const missedIds = [...new Set(res.missed)];
    const missedItems = missedIds.map((id) => kana.charsById.get(id) || kana.wordsById.get(id)).filter(Boolean);
    const next = kana.groups[group.index + 1];
    area.replaceChildren();
    append(area, [
      h('h2', { tabindex: '-1' }, ok ? 'Passed' : 'Not yet'),
      h('div', { class: 'stat-grid' },
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, `${pct}%`), h('div', { class: 'stat-label' }, `${res.correct} of ${res.total} correct`)),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(missedIds.length)), h('div', { class: 'stat-label' }, 'to look at again'))),
      missedItems.length ? h('div', { style: { marginTop: '12px' } }, h('strong', null, 'Missed: '), missedItems.map((it) => h('span', { class: 'pill', lang: 'ja' }, it.char || it.jp, ' ', it.romaji))) : null,
      h('p', { class: 'muted', style: { marginTop: '12px' } }, ok
        ? `All ${group.chars.length} characters and ${group.words.length} words are now in your spaced-repetition queue. They will come up for review in about 10 minutes, then at growing intervals.`
        : `You need ${kana.data.quiz.passPercent}% to pass. Go back over the characters you missed and try again; nothing is lost.`),
      h('div', { class: 'btn-row', style: { marginTop: '16px' } },
        ok && next ? h('a', { class: 'btn btn-primary btn-lg', href: `#/lesson/${levelId}/${next.id}` }, `Next: ${next.title}`) : null,
        ok && !next ? h('a', { class: 'btn btn-primary btn-lg', href: `#/exam/${levelId}` }, 'Take the exam') : null,
        !ok ? h('button', { class: 'btn btn-primary btn-lg', type: 'button', onClick: () => { stepIdx = 1; logged = false; show(); } }, 'Review the characters') : null,
        !ok ? h('button', { class: 'btn', type: 'button', onClick: () => { stepIdx = steps.length - 1; logged = false; show(); } }, 'Retry the quiz') : null,
        h('a', { class: 'btn', href: `#/learn/${stagePathFor(levelId)}` }, 'Back to the list')
      )
    ]);
  }

  function wrapNext(btn) { btn.classList.add('lesson-next'); return h('div', { class: 'lesson-foot' }, btn); }
  function speakable(c) { return c.char === 'っ' ? 'っ' : c.char; }

  show();
  return () => { document.removeEventListener('keydown', onKey); stopSpeaking(); logTime(); };
}
