/* Review: the spaced-repetition queue. */
import { h, icon, jp } from '../ui/dom.js';
import { progress, STAGES, STAGE_LABELS } from '../store/progress.js';

export const title = 'Review';

export async function render(el) {
  const summary = await progress.summary();
  el.append(
    h('header', { class: 'page-head' },
      h('h1', null, 'Review'),
      h('p', { class: 'lede' }, 'Everything you learn enters a spaced-repetition queue. Reviews are capped per day and spread out, so a backlog never piles up.')
    ),
    h('section', { class: 'card' },
      h('div', { class: 'stat-grid' },
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(summary.due)), h('div', { class: 'stat-label' }, 'Due now')),
        h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(summary.total)), h('div', { class: 'stat-label' }, 'Items in queue'))
      ),
      h('div', { class: 'btn-row', style: { marginTop: '16px' } },
        h('button', { class: 'btn btn-primary', type: 'button', disabled: summary.due === 0 }, icon('review'), 'Start reviews')
      )
    ),
    summary.total === 0
      ? h('div', { class: 'empty' }, jp('復習', 'jp-xl'), h('p', null, 'Nothing to review yet. Items join this queue as you learn them in lessons.'), h('a', { class: 'btn', href: '#/learn' }, 'Go to the learning path'))
      : h('section', { class: 'card' },
        h('h2', null, 'Mastery stages'),
        STAGES.map((s) => h('div', { class: 'bar-row' }, h('span', null, STAGE_LABELS[s]), h('div', { class: 'bar' }, h('span', { style: { width: `${summary.total ? (summary.byStage[s] / summary.total) * 100 : 0}%` } })), h('span', { class: 'pct' }, String(summary.byStage[s]))))
      )
  );
}
