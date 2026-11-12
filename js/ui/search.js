/* Global quick lookup: searches every kana, kanji, word and grammar point in the
   loaded curriculum. Opens with the search button or the "/" key. */
import { h, jp } from './dom.js';
import { openSheet } from './dialog.js';
import { searchContent, availableLevels } from '../content/loader.js';

let open = false;

export function openSearch() {
  if (open) return;
  open = true;
  const input = h('input', {
    class: 'search-input', type: 'search', placeholder: 'Kana, kanji, word, or grammar…',
    'aria-label': 'Search the curriculum', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', enterkeyhint: 'search'
  });
  const list = h('ul', { class: 'search-results', role: 'listbox', 'aria-label': 'Results' });
  const status = h('div', { class: 'search-empty', role: 'status' });
  const body = h('div', null, input, status, list);
  const sheet = openSheet({ title: 'Quick lookup', body, onClose: () => { open = false; } });

  let timer = null, seq = 0;
  availableLevels().then((levels) => {
    if (!levels.length) status.textContent = 'No curriculum content is included in this build yet. Lookup will search everything once lessons are added.';
    else status.textContent = 'Type to search.';
  }).catch(() => { status.textContent = 'Could not load the content index.'; });

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const mine = ++seq;
      const q = input.value.trim();
      if (!q) { list.replaceChildren(); return; }
      const results = await searchContent(q).catch(() => []);
      if (mine !== seq) return;
      list.replaceChildren(...results.map((r) =>
        h('li', { role: 'option' }, h('a', { href: `#/learn/item/${encodeURIComponent(r.id)}`, onClick: () => sheet.close() },
          jp(r.jp, 'r-jp'),
          h('span', null, h('div', null, r.meaning || ''), h('div', { class: 'r-meta' }, [r.reading, r.type, r.level.toUpperCase()].filter(Boolean).join(' · ')))
        ))
      ));
      status.textContent = results.length ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'No matches.';
    }, 120);
  });
  setTimeout(() => input.focus(), 30);
}
