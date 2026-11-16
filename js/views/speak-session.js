/* A speaking practice session for one set (repeat, shadow, question, roleplay).
   Each "say" step: listen → speak (recognition with mora feedback) or record
   and compare → next. Keyboard: Space = play, Enter = continue. */
import { h, append, icon, jp } from '../ui/dom.js';
import { loadSpeaking, stepsFor, MODES } from '../content/speaking.js';
import { speak, canSpeak, initAudio, stopSpeaking } from '../ui/audio.js';
import { createRecognizer, recognitionSupported } from '../ui/recognizer.js';
import { startRecording, recordingSupported, micErrorMessage } from '../ui/recorder.js';
import { compare, bestOf, toMora } from '../engine/mora.js';
import { pitchDiagram, pitchName } from '../ui/pitch.js';
import { kanaWord } from '../ui/kanatext.js';
import { wordLevel } from '../engine/scaffold.js';
import { loadAllKana, recordsByGlyph, tokenize } from '../content/kana.js';
import { settings } from '../store/settings.js';
import { days } from '../store/days.js';
import { toast } from '../ui/toast.js';

export const title = 'Speak';

export async function render(el, ctx) {
  const setId = decodeURIComponent(ctx.segs[1]);
  const { setsById } = await loadSpeaking();
  const set = setsById.get(setId);
  if (!set) { append(el, [h('h1', null, 'Set not found'), h('a', { class: 'btn', href: '#/speak' }, 'Back to Speak')]); return; }
  await initAudio();
  const steps = stepsFor(set);
  const mode = MODES[set.mode];
  const startedAt = Date.now();
  let logged = false;
  const logTime = async () => { if (logged) return; logged = true; await days.log({ seconds: Math.round((Date.now() - startedAt) / 1000) }); };

  // Scaffolding level for phrases: weakest character; never below 1 (kana + romaji) for speaking.
  const levels = await loadAllKana();
  const glyphMap = new Map();
  for (const k of Object.values(levels)) for (const [g, c] of k.charByGlyph) glyphMap.set(g, c);
  const records = new Map();
  for (const k of Object.values(levels)) for (const [g, r] of await recordsByGlyph(k)) records.set(g, r);
  const levelFor = (text) => Math.max(1, wordLevel(tokenize(text.replace(/\[[^\]]+\]/g, ''), glyphMap).filter((u) => /[ぁ-ヿ]/.test(u)), records));

  const sr = recognitionSupported();
  const recOk = recordingSupported();
  const scores = [];
  let idx = set.tips?.length ? -1 : 0;
  let recognizer = null, recording = null;

  const bar = h('div', { class: 'bar' }, h('span', { style: { width: '0%' } }));
  const counter = h('span', { class: 'small muted' });
  const stage = h('div', { class: 'speak-stage' });
  append(el, [
    h('header', { class: 'page-head row', style: { justifyContent: 'space-between' } },
      h('div', null, h('h1', null, set.title), h('p', { class: 'lede' }, `${mode.title}${set.partner ? ` · you talk with ${set.partner}` : ''}`)),
      h('a', { class: 'btn', href: '#/speak', onClick: () => cleanup() }, 'Exit')),
    h('div', { class: 'row', style: { justifyContent: 'flex-end' } }, counter),
    bar,
    stage
  ]);

  function cleanup() { stopSpeaking(); recognizer?.abort(); recording?.stop?.(); logTime(); }

  const show = () => {
    stopSpeaking(); recognizer?.abort(); recognizer = null;
    if (idx >= steps.length) { summary(); return; }
    if (idx < 0) { counter.textContent = 'Before you start'; stage.replaceChildren(tipsCard()); window.scrollTo(0, 0); return; }
    const step = steps[idx];
    counter.textContent = `${idx + 1} / ${steps.length}`;
    bar.firstChild.style.width = `${(Math.max(0, idx) / steps.length) * 100}%`;
    stage.replaceChildren(step.kind === 'listen' ? listenCard(step) : sayCard(step));
    window.scrollTo(0, 0);
  };
  const nextBtn = (label = 'Continue') => h('button', { class: 'btn btn-primary btn-lg btn-block speak-next', type: 'button', onClick: () => { idx += 1; show(); } }, label);

  /* Cultural and language tips shown once, before the first line. */
  function tipsCard() {
    return h('section', { class: 'card' },
      h('h2', null, 'Good to know'),
      h('ul', { class: 'speak-tips' }, set.tips.map((t) => h('li', null, t))),
      h('p', { class: 'small muted' }, set.mode === 'roleplay' ? `${set.partner || 'The other person'} speaks first where it says so; your lines are marked "You say". Listen, then say the line.` : 'Listen, then speak along. Natural speed comes after the slow pass.'),
      h('div', { class: 'lesson-foot' }, nextBtn('Start')));
  }

  /* Partner line in a role-play: just listen. */
  function listenCard(step) {
    if (canSpeak() && settings.get('autoplayAudio')) setTimeout(() => speak(step.jp), 300);
    return h('section', { class: 'card' },
      h('div', { class: 'speak-who' }, set.partner || 'Partner', ' says:'),
      phraseBlock(step),
      h('div', { class: 'btn-row', style: { marginTop: '12px' } }, playButtons(step.jp)),
      h('div', { class: 'lesson-foot' }, nextBtn('Your turn'))
    );
  }

  /* Your line: listen, then speak or record. */
  function sayCard(step) {
    const isAnswer = step.kind === 'answer';
    const isShadow = step.kind === 'shadow';
    const target = step.jp;
    const resultBox = h('div', { class: 'speak-result' });
    const live = h('div', { class: 'speak-live jp', lang: 'ja', 'aria-live': 'polite' });
    const status = h('div', { class: 'small muted', 'aria-live': 'polite' });
    const foot = h('div', { class: 'lesson-foot' });

    const onFinal = (alts) => {
      const best = bestOf(target, alts);
      showResult(best, best.transcript);
    };
    const listenBtn = h('button', { class: 'btn btn-primary btn-lg', type: 'button' }, icon('speak'), isShadow ? 'Shadow (audio + mic)' : 'Speak');
    listenBtn.addEventListener('click', () => {
      if (recognizer?.active) { recognizer.stop(); return; }
      live.textContent = ''; resultBox.replaceChildren();
      recognizer = createRecognizer({
        onInterim: (t) => { live.textContent = t; },
        onFinal,
        onError: (code, msg) => { status.textContent = msg; listenBtn.classList.remove('is-listening'); listenBtn.lastChild.textContent = isShadow ? 'Shadow (audio + mic)' : 'Speak'; },
        onEnd: () => { listenBtn.classList.remove('is-listening'); listenBtn.lastChild.textContent = isShadow ? 'Shadow (audio + mic)' : 'Speak'; if (!live.textContent && !resultBox.childElementCount) status.textContent = status.textContent || 'Nothing heard. Try again.'; }
      });
      status.textContent = isShadow ? 'Listening… speak along with the audio.' : 'Listening… say the phrase.';
      listenBtn.classList.add('is-listening'); listenBtn.lastChild.textContent = 'Stop';
      recognizer.start();
      if (isShadow) speak(target.replace(/\[[^\]]+\]/g, ''), { rate: 0.7, interrupt: true });
    });

    // Record-and-compare (always available as the self-check path)
    const recBtn = h('button', { class: 'btn btn-lg', type: 'button', disabled: !recOk }, icon('install'), 'Record');
    const playback = h('div', { class: 'speak-playback' });
    recBtn.addEventListener('click', async () => {
      if (recording) {
        const r = await recording.stop(); recording = null;
        recBtn.lastChild.textContent = 'Record'; recBtn.classList.remove('is-listening');
        const audio = h('audio', { controls: true, src: r.url, style: { width: '100%' } });
        playback.replaceChildren(
          h('div', { class: 'small muted' }, `Your recording (${(r.duration / 1000).toFixed(1)} s). Play it, then the native voice, and compare the rhythm.`),
          audio,
          h('div', { class: 'btn-row' }, h('button', { class: 'btn', type: 'button', onClick: () => { audio.play(); } }, 'Play mine'), h('button', { class: 'btn', type: 'button', onClick: () => speak(target.replace(/\[[^\]]+\]/g, '')) }, icon('speak'), 'Play native'),
            !sr ? selfRate() : null));
        return;
      }
      try {
        recording = await startRecording();
        recBtn.lastChild.textContent = 'Stop'; recBtn.classList.add('is-listening');
        status.textContent = 'Recording… tap Stop when done.';
      } catch (err) { status.textContent = micErrorMessage(err); }
    });

    function selfRate() {
      return h('div', { class: 'row' }, h('span', { class: 'small muted' }, 'How close was it?'),
        [['Way off', 40], ['Close', 75], ['Spot on', 100]].map(([l, v]) => h('button', { class: 'btn', type: 'button', onClick: () => { scores.push({ id: step.id, score: v, self: true }); foot.replaceChildren(nextBtn()); } }, l)));
    }

    function showResult(res, transcript) {
      live.textContent = '';
      status.textContent = '';
      scores.push({ id: step.id, score: res.score });
      const chips = h('div', { class: 'mora-row', lang: 'ja', 'aria-label': 'Beat by beat result' });
      for (const o of res.ops) {
        if (o.type === 'match') chips.append(h('span', { class: 'mora is-ok' }, o.t));
        else if (o.type === 'sub') chips.append(h('span', { class: 'mora is-bad', title: `heard ${o.s}` }, o.t, h('small', null, o.s)));
        else if (o.type === 'del') chips.append(h('span', { class: 'mora is-bad is-missing', title: 'missing' }, o.t));
        else if (o.type === 'wild') chips.append(h('span', { class: 'mora is-wild' }, o.s));
        else if (o.type === 'ins') chips.append(h('span', { class: 'mora is-extra', title: 'extra' }, o.s));
      }
      const grade = res.score >= 90 ? 'Excellent' : res.score >= 75 ? 'Good' : res.score >= 50 ? 'Getting there' : 'Try again';
      resultBox.replaceChildren();
      append(resultBox, [
        h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('strong', { class: `speak-score ${res.score >= 75 ? 'is-good' : ''}` }, `${res.score}%`), h('span', null, grade)),
        chips,
        h('div', { class: 'small muted' }, 'Heard: ', h('span', { lang: 'ja' }, transcript || '—')),
        res.saidHasKanji ? h('div', { class: 'small muted' }, 'The recognizer wrote part of this in kanji, so a few beats could not be compared and are marked as mismatches. Read the tips with that in mind.') : null,
        res.tips.length ? h('ul', { class: 'speak-tips' }, res.tips.map((t) => h('li', null, t))) : h('p', { class: 'small', style: { color: 'var(--ok)' } }, 'Every beat landed.'),
        isAnswer ? h('p', { class: 'small muted' }, 'Your answer may legitimately differ from the model; the score compares only what overlaps.') : null,
        h('div', { class: 'btn-row' }, h('button', { class: 'btn', type: 'button', onClick: () => { resultBox.replaceChildren(); live.textContent = ''; } }, 'Try again'))
      ]);
      foot.replaceChildren(nextBtn());
    }

    if (canSpeak() && settings.get('autoplayAudio') && !isAnswer) setTimeout(() => speak(target.replace(/\[[^\]]+\]/g, '')), 300);
    if (isAnswer && canSpeak() && settings.get('autoplayAudio')) setTimeout(() => speak(step.q), 300);

    const card = h('section', { class: 'card' });
    if (isAnswer) {
      card.append(h('div', { class: 'speak-who' }, 'Question:'),
        h('div', { class: 'speak-q' }, kanaWord({ jp: step.q, romaji: step.qRomaji }, levelFor(step.q), { cls: 'jp' }), h('div', { class: 'muted' }, step.qEn)),
        h('div', { class: 'btn-row' }, playButtons(step.q)),
        h('details', { class: 'speak-model' }, h('summary', null, 'Show a model answer'), phraseBlock(step)));
    } else {
      append(card, [step.kind === 'say' && set.mode === 'roleplay' ? h('div', { class: 'speak-who' }, 'You say:') : null,
        phraseBlock(step),
        h('div', { class: 'btn-row' }, playButtons(target))]);
    }
    if (step.pair) {
      const other = steps.find((s) => s.id === step.pair);
      if (other) card.append(h('p', { class: 'small muted' }, 'Compare with ', jp(other.jp), ` (${other.en}).`));
    }
    card.append(
      h('hr'),
      h('div', { class: 'btn-row' }, sr ? listenBtn : null, recBtn),
      status, live, resultBox, playback,
      foot
    );
    if (!sr && !recOk) foot.replaceChildren(h('p', { class: 'small muted' }, 'Neither speech recognition nor recording is available here, so just say it aloud and continue.'), nextBtn());
    else if (!sr) foot.replaceChildren(nextBtn('Skip'));
    else foot.replaceChildren(h('button', { class: 'btn btn-block', type: 'button', onClick: () => { idx += 1; show(); } }, 'Skip'));
    return card;
  }

  function phraseBlock(step) {
    const text = step.jp;
    const block = h('div', { class: 'speak-phrase' },
      h('div', { class: 'speak-jp' }, kanaWord({ jp: text, romaji: step.romaji }, levelFor(text), { cls: 'jp' })),
      h('div', { class: 'muted' }, step.en));
    if (step.pitch !== undefined && !/[\[\s。、]/.test(text)) {
      block.append(h('div', { class: 'row', style: { marginTop: '8px' } }, pitchDiagram(text, step.pitch), h('span', { class: 'small muted' }, pitchName(step.pitch, toMora(text).length))));
    }
    return block;
  }

  function playButtons(text) {
    const clean = text.replace(/\[[^\]]+\]/g, '');
    if (!canSpeak()) return h('span', { class: 'small muted' }, 'No Japanese voice available.');
    return [
      h('button', { class: 'btn', type: 'button', onClick: () => speak(clean, { rate: 1 }) }, icon('speak'), 'Natural 1.0×'),
      h('button', { class: 'btn', type: 'button', onClick: () => speak(clean, { rate: 0.7 }) }, icon('speak'), 'Slow 0.7×')
    ];
  }

  async function summary() {
    await logTime();
    bar.firstChild.style.width = '100%';
    const spoken = scores.filter((s) => !s.self);
    const avg = scores.length ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length) : null;
    const weakest = [...scores].sort((a, b) => a.score - b.score).slice(0, 3).map((s) => steps.find((x) => x.id === s.id)).filter(Boolean);
    stage.replaceChildren(h('section', { class: 'card' },
      h('h2', null, 'Set complete'),
      h('div', { class: 'stat-grid' },
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, avg == null ? '—' : `${avg}%`), h('div', { class: 'stat-label' }, spoken.length ? 'average match' : scores.length ? 'self-rated' : 'no lines attempted')),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(scores.length)), h('div', { class: 'stat-label' }, `of ${steps.filter((s) => s.kind !== 'listen').length} lines attempted`))),
      weakest.length && avg != null && avg < 100 ? h('p', { style: { marginTop: '12px' } }, 'Worth another go: ', weakest.map((s) => h('span', { class: 'pill', lang: 'ja' }, s.jp))) : null,
      h('div', { class: 'btn-row', style: { marginTop: '16px' } },
        h('button', { class: 'btn btn-primary', type: 'button', onClick: () => { idx = 0; scores.length = 0; logged = false; show(); } }, 'Again'),
        h('a', { class: 'btn', href: '#/speak' }, 'All sets'))
    ));
  }

  const onKey = (e) => {
    if (e.target.tagName === 'INPUT' || document.querySelector('dialog[open]')) return;
    if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); stage.querySelector('.btn-row .btn')?.click(); }
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') { const b = stage.querySelector('.speak-next'); if (b) { e.preventDefault(); b.click(); } }
  };
  document.addEventListener('keydown', onKey);
  show();
  return () => { document.removeEventListener('keydown', onKey); cleanup(); };
}
