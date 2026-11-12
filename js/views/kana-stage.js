/* Hiragana (and later katakana) stage: the list of character groups, each
   unlocked by passing the previous group's quiz, then the stage exam. */
import { h, append, icon, jp } from '../ui/dom.js';
import { kanaStatus } from '../content/kana.js';
import { stagePathFor } from '../content/kana.js';
import { progress } from '../store/progress.js';

export const title = 'Kana';

export async function render(el, ctx) {
  const levelId = ctx.levelId || 'kana';
  const { kana, passed, exam, nextGroup, total } = await kanaStatus(levelId);
  const records = new Map(((await progress.all()) || []).map((r) => [r.id, r]));
  const learned = kana.allChars.filter((c) => records.has(c.id)).length;

  append(el, [
    h('header', { class: 'page-head' },
      h('h1', null, kana.data.title),
      h('p', { class: 'lede' }, `${passed.size} of ${total} groups passed · ${learned} of ${kana.allChars.length} characters learned`)),
    h('div', { class: 'bar', style: { marginBottom: '20px' }, role: 'progressbar', 'aria-valuenow': passed.size, 'aria-valuemax': total, 'aria-label': 'Groups passed' }, h('span', { style: { width: `${(passed.size / total) * 100}%` } })),
    h('section', { class: 'card' },
      h('ol', { class: 'path' }, kana.groups.map((g, i) => {
        const isPassed = passed.has(g.id);
        const available = isPassed || g === nextGroup;
        const preview = g.chars.slice(0, 5).map((c) => c.char).join(' ');
        return h('li', null,
          h('span', { class: `step-no ${available ? 'is-available' : ''} ${isPassed ? 'is-passed' : ''}`, 'aria-hidden': 'true' }, isPassed ? icon('check') : String(i + 1)),
          h('div', null,
            h('div', { class: 'step-title' }, g.title),
            h('div', { class: 'step-sub' }, jp(preview + (g.chars.length > 5 ? ' …' : '')), ` · ${g.chars.length} characters, ${g.words.length} words`)
          ),
          available
            ? h('a', { class: `btn ${g === nextGroup ? 'btn-primary' : ''}`, href: `#/lesson/${levelId}/${g.id}`, 'aria-label': `${isPassed ? 'Review' : 'Start'} ${g.title}` }, isPassed ? 'Revisit' : 'Start')
            : h('span', { class: 'icon lock', title: 'Pass the previous group to unlock' }, icon('lock'))
        );
      }))
    ),
    h('section', { class: `card ${nextGroup ? '' : 'card-accent'}` },
      h('div', { class: 'card-title' }, h('h2', null, `${kana.data.title} exam`), exam ? h('span', { class: 'pill' }, `Passed ${exam.score}%`) : null),
      h('p', { class: 'muted' }, `${kana.data.exam.questions} questions over every character and word. Pass with ${kana.data.exam.passPercent}% to unlock ${kana.data.exam.unlocks}.`),
      nextGroup
        ? h('p', { class: 'small muted' }, `Unlocks after all ${total} groups are passed.`)
        : h('a', { class: 'btn btn-primary btn-lg', href: `#/exam/${levelId}` }, exam ? 'Take it again' : 'Take the exam')
    )
  ]);
}
