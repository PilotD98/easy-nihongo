/* Item detail: a kana character or kana-stage word, with its progress. Route: #/learn/item/<id> */
import { h, append, icon, jp, formatDate } from '../ui/dom.js';
import { loadKana } from '../content/kana.js';
import { parseId } from '../content/ids.js';
import { progress, STAGE_LABELS } from '../store/progress.js';
import { strokeDiagram, strokeDiagrams } from '../ui/stroke.js';
import { speak, canSpeak, initAudio } from '../ui/audio.js';
import { kanaWord } from '../ui/kanatext.js';
import { kanaLevel } from '../engine/scaffold.js';

export const title = 'Item';

export async function render(el, id) {
  const p = parseId(id);
  const rec = await progress.get(id);
  await initAudio();
  const levelId = p?.type === 'kana' ? (p.scope === 'k' ? 'katakana' : 'kana') : p?.type === 'vocab' && (p.scope === 'kana' || p.scope === 'katakana') ? p.scope : null;
  if (!levelId) {
    append(el, [h('h1', null, 'Item'), h('div', { class: 'notice' }, icon('info'), h('p', null, 'This item belongs to a stage that is not included in the app yet.')), h('a', { class: 'btn', href: '#/learn' }, 'Learning path')]);
    return;
  }
  const kana = await loadKana(levelId);
  const ch = kana.charsById.get(id);
  const word = kana.wordsById.get(id);
  if (!ch && !word) {
    append(el, [h('h1', null, 'Item not found'), h('a', { class: 'btn', href: '#/learn' }, 'Learning path')]);
    return;
  }
  const group = kana.groups.find((g) => g.id === (ch || word).group);

  if (ch) {
    const parts = ch.parts || [ch.char];
    const diagram = parts.every((x) => kana.strokes[x]) ? (parts.length === 1 ? strokeDiagram(kana.strokes[ch.char], { size: 180, label: ch.char }) : strokeDiagrams(parts, kana.strokes, { size: 130 })) : null;
    const words = kana.allWords.filter((w) => w.units.includes(ch.char)).slice(0, 8);
    append(el, [
      h('header', { class: 'page-head' }, h('h1', null, jp(ch.char, 'jp-xl'), ' ', h('span', { class: 'muted' }, ch.romaji)), h('p', { class: 'lede' }, `${kana.data.title} · ${group.title} · ${ch.strokes} stroke${ch.strokes === 1 ? '' : 's'}`)),
      h('section', { class: 'card' },
        diagram ? h('div', { class: 'row', style: { alignItems: 'flex-start' } }, diagram.el, h('div', { class: 'btn-row' }, h('button', { class: 'btn', type: 'button', onClick: () => diagram.play() }, 'Replay strokes'), canSpeak() ? h('button', { class: 'btn', type: 'button', onClick: () => speak(ch.char) }, icon('speak'), 'Listen') : null)) : null,
        h('p', { class: 'mnemonic' }, h('strong', null, 'Remember: '), ch.mnemonic)),
      words.length ? h('section', { class: 'card' }, h('h2', null, 'Words with ', jp(ch.char)), h('ul', { class: 'word-list' }, words.map((w) => h('li', null, h('a', { href: `#/learn/item/${encodeURIComponent(w.id)}`, class: 'jp word-jp', lang: 'ja' }, w.jp), h('span', { class: 'grow' }, w.meaning), h('span', { class: 'small muted' }, w.romaji))))) : null,
      progressCard(rec, `#/lesson/${levelId}/${group.id}`)
    ]);
  } else {
    append(el, [
      h('header', { class: 'page-head' }, h('h1', null, kanaWord(word, rec ? kanaLevel(rec) : 1, { cls: 'jp-xl' })), h('p', { class: 'lede' }, `${word.meaning} · ${word.romaji}`)),
      h('section', { class: 'card' },
        h('div', { class: 'btn-row' }, canSpeak() ? h('button', { class: 'btn', type: 'button', onClick: () => speak(word.jp) }, icon('speak'), 'Listen') : null),
        h('h3', { style: { marginTop: '12px' } }, 'Characters'),
        h('div', { class: 'char-grid' }, word.units.map((u) => { const c = kana.charByGlyph.get(u); return h('a', { class: 'char-chip', href: c ? `#/learn/item/${encodeURIComponent(c.id)}` : null }, jp(u, 'jp-xl'), h('span', { class: 'small muted' }, c ? c.romaji : '')); }))),
      progressCard(rec, `#/lesson/${levelId}/${group.id}`)
    ]);
  }
}

function progressCard(rec, lessonHref) {
  if (!rec) return h('section', { class: 'card' }, h('h2', null, 'Progress'), h('p', { class: 'muted' }, 'Not learned yet.'), h('a', { class: 'btn', href: lessonHref }, 'Open its lesson'));
  const levelNames = ['Romaji only', 'Kana with romaji', 'Kana only'];
  return h('section', { class: 'card' },
    h('h2', null, 'Progress'),
    h('div', { class: 'stat-grid' },
      h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, STAGE_LABELS[rec.stage] || rec.stage), h('div', { class: 'stat-label' }, 'Mastery stage')),
      h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, rec.due ? formatDate(rec.due, { dateStyle: 'medium' }) : '—'), h('div', { class: 'stat-label' }, 'Next review')),
      h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(rec.reps)), h('div', { class: 'stat-label' }, `reviews · ${rec.lapses} lapses`)),
      h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, `L${rec.display}`), h('div', { class: 'stat-label' }, levelNames[rec.display] || 'Display level'))),
    h('div', { class: 'btn-row', style: { marginTop: '12px' } }, h('a', { class: 'btn', href: `#/review?items=${encodeURIComponent(rec.id)}` }, 'Practice now'), h('a', { class: 'btn', href: lessonHref }, 'Open its lesson'))
  );
}
