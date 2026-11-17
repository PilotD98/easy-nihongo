/* Real-world Japanese: short guides with audio. Routes: #/guides, #/guides/<id> */
import { h, append, icon, jp } from '../ui/dom.js';
import { loadLevel } from '../content/loader.js';
import { speak, canSpeak, initAudio } from '../ui/audio.js';

export const title = 'Real-world Japanese';

export async function render(el, ctx) {
  const level = await loadLevel('guides');
  const data = level.data.guides;
  await initAudio();
  const id = ctx.segs[1];
  const guide = id ? data.guides.find((g) => g.id === id) : null;
  if (id && !guide) { const nf = await import('./notfound.js'); return nf.render(el, ctx); }
  return guide ? renderGuide(el, data, guide) : renderIndex(el, data);
}

function renderIndex(el, data) {
  append(el, [
    h('header', { class: 'page-head' }, h('h1', null, data.title), h('p', { class: 'lede' }, data.intro)),
    h('section', { class: 'card' },
      h('ol', { class: 'path' }, data.guides.map((g, i) => h('li', null,
        h('span', { class: 'step-no is-available', 'aria-hidden': 'true' }, String(i + 1)),
        h('div', null, h('div', { class: 'step-title' }, g.title), h('div', { class: 'step-sub' }, `${g.summary} · about ${g.minutes} min`)),
        h('a', { class: 'btn btn-primary', href: `#/guides/${g.id}`, 'aria-label': `Open ${g.title}` }, 'Open'))))),
    h('p', { class: 'small muted' }, 'Practise the situations out loud in ', h('a', { href: '#/speak' }, 'Speak → Real-world situations'), '.')
  ]);
}

function renderGuide(el, data, guide) {
  const hideable = guide.sections.some((s) => s.items?.length);
  let hidden = false;
  const page = h('div', { class: 'guide' });
  const toggle = hideable ? h('button', { class: 'btn', type: 'button', 'aria-pressed': 'false', onClick: () => { hidden = !hidden; page.classList.toggle('is-hiding', hidden); toggle.setAttribute('aria-pressed', String(hidden)); toggle.lastChild.textContent = hidden ? 'Show meanings' : 'Hide meanings'; } }, icon('review'), h('span', null, 'Hide meanings')) : null;

  append(page, [
    h('header', { class: 'page-head' },
      h('h1', null, guide.title),
      h('p', { class: 'lede' }, `${guide.summary} · about ${guide.minutes} min`),
      toggle ? h('div', { class: 'btn-row' }, toggle, h('span', { class: 'small muted' }, 'Test yourself: hide the English, tap a line to hear it, then show.')) : null),
    guide.sections.map((s, i) => h('section', { class: `card ${s.style === 'signs' ? 'span-2' : ''}`, 'aria-labelledby': `g-${guide.id}-${i}` },
      h('h2', { id: `g-${guide.id}-${i}` }, s.title),
      (s.body || []).map((p) => h('p', null, p)),
      s.items?.length ? (s.style === 'signs' ? signGrid(s.items) : itemList(s.items)) : null,
      s.links?.length ? h('ul', { class: 'guide-links' }, s.links.map((l) => h('li', null,
        h('span', { class: 'pill' }, l.level), ' ',
        h('a', { href: l.url, target: '_blank', rel: 'noopener noreferrer' }, l.name),
        h('div', { class: 'small muted' }, l.note)))) : null)),
    h('div', { class: 'btn-row' }, h('a', { class: 'btn', href: '#/guides' }, 'All guides'), h('a', { class: 'btn btn-primary', href: '#/speak' }, icon('speak'), 'Practise out loud'))
  ]);
  el.append(page);
}

function sayable(item) { return (item.kana || item.jp || '').replace(/[→/].*$/, '').replace(/[〇…]/g, '').trim(); }
function sayOpts(item) { return { romaji: (item.romaji || '').replace(/[→/].*$/, ''), kanji: (item.jp || '').replace(/[→/].*$/, '').replace(/[〇…（）()]/g, '').trim() }; }

function itemList(items) {
  return h('ul', { class: 'guide-list' }, items.map((it) => h('li', { class: 'guide-item' },
    h('button', { class: 'guide-say', type: 'button', lang: 'ja', 'aria-label': `Listen: ${it.jp}`, disabled: !canSpeak() || !sayable(it) ? true : null, onClick: () => speak(sayable(it), sayOpts(it)) },
      h('span', { class: 'jp guide-jp' }, it.jp),
      it.kana && it.kana !== it.jp ? h('span', { class: 'jp guide-kana small' }, it.kana) : null,
      it.romaji ? h('span', { class: 'small muted guide-romaji', lang: 'en' }, it.romaji) : null),
    h('div', { class: 'guide-en' }, it.en, it.note ? h('div', { class: 'small muted' }, it.note) : null))));
}

function signGrid(items) {
  return h('div', { class: 'sign-grid' }, items.map((it) => h('button', { class: 'sign', type: 'button', lang: 'ja', 'aria-label': `${it.jp}, ${it.kana}: ${it.en}`, disabled: !canSpeak() ? true : null, onClick: () => speak(sayable(it), sayOpts(it)) },
    h('span', { class: 'sign-jp jp' }, it.jp),
    h('span', { class: 'sign-kana jp small' }, it.kana),
    h('span', { class: 'sign-en guide-en' }, it.en))));
}
