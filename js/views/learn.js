/* Learn: the stage path from Orientation to N1. Stages become available as
   their content ships; the manifest (data/index.json) is the source of truth. */
import { h, append, icon } from '../ui/dom.js';
import { getManifest } from '../content/loader.js';

export const title = 'Learn';

export async function render(el, ctx) {
  if (ctx.segs[1] === 'item') return renderItem(el, ctx.segs[2]);

  let manifest = null;
  try { manifest = await getManifest(); }
  catch (err) {
    el.append(h('header', { class: 'page-head' }, h('h1', null, 'Learn')),
      h('div', { class: 'notice notice-err' }, icon('info'), h('p', null, 'The content index could not be loaded. If you are offline, reconnect once so it can be cached.')));
    return;
  }
  const levelsById = Object.fromEntries((manifest.levels || []).map((l) => [l.id, l]));
  const stages = manifest.stages || [];

  append(el, [
    h('header', { class: 'page-head' },
      h('h1', null, 'Learning path'),
      h('p', { class: 'lede' }, 'From zero to advanced reading and speaking, measured against JLPT N5 → N1. Each stage unlocks as you pass the one before.')
    ),
    h('section', { class: 'card' },
      h('ol', { class: 'path' }, stages.map((s) => {
        const level = s.level ? levelsById[s.level] : null;
        const available = !!(level && level.files && Object.keys(level.files).length);
        return h('li', null,
          h('span', { class: `step-no ${available ? 'is-available' : ''}`, 'aria-hidden': 'true' }, String(s.no)),
          h('div', null,
            h('div', { class: 'step-title' }, s.title),
            h('div', { class: 'step-sub' }, s.summary),
            level && level.targets ? h('div', { class: 'step-sub' }, targetsLine(level.targets)) : null
          ),
          available
            ? h('a', { class: 'btn', href: `#/learn/${s.id}`, 'aria-label': `Open ${s.title}` }, icon('chevron'))
            : h('span', { class: 'pill', title: 'Not included in this build yet' }, 'Not yet in this build')
        );
      }))
    ),
    manifest.note ? h('p', { class: 'small muted' }, manifest.note) : null
  ]);
}

function targetsLine(t) {
  const parts = [];
  if (t.kanji) parts.push(`≈${t.kanji} kanji`);
  if (t.vocab) parts.push(`≈${t.vocab.toLocaleString()} words`);
  if (t.grammar) parts.push(`≈${t.grammar} grammar points`);
  return parts.join(' · ');
}

async function renderItem(el, id) {
  el.append(
    h('header', { class: 'page-head' }, h('h1', null, 'Item'), h('p', { class: 'lede' }, id ? decodeURIComponent(id) : '')),
    h('div', { class: 'notice' }, icon('info'), h('p', null, 'Item detail pages open once the stage that teaches this item is included in the app.')),
    h('a', { class: 'btn', href: '#/learn' }, 'Back to the learning path')
  );
}
