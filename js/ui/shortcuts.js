/* Keyboard shortcut reference sheet (opened with "?" or from Settings). */
import { h } from './dom.js';
import { openSheet } from './dialog.js';

export function showShortcuts() {
  const rows = [
    ['/', 'Quick lookup'],
    ['?', 'This list'],
    ['Esc', 'Close a sheet or dialog'],
    ['Space', 'Reveal the answer (reviews)'],
    ['1 – 4', 'Grade a review: Again, Hard, Good, Easy'],
    ['Enter', 'Continue']
  ];
  const dl = h('dl', { class: 'kbd-list' }, rows.flatMap(([k, d]) => [h('dt', null, h('kbd', null, k)), h('dd', null, d)]));
  openSheet({
    title: 'Keyboard shortcuts',
    body: h('div', null, dl, h('p', { class: 'small muted', style: { marginTop: '12px' } }, 'Review shortcuts apply once lessons and reviews are available.'))
  });
}
