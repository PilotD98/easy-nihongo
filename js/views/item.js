/* Item detail: a kana character or kana-stage word, with its progress. Route: #/learn/item/<id> */
import { h, append, icon, jp, formatDate } from '../ui/dom.js';
import { loadKana } from '../content/kana.js';
import { parseId } from '../content/ids.js';
import { progress, STAGE_LABELS } from '../store/progress.js';
import { strokeDiagram, strokeDiagrams } from '../ui/stroke.js';
import { speak, canSpeak, initAudio } from '../ui/audio.js';
import { kanaWord } from '../ui/kanatext.js';
import { kanaLevel } from '../engine/scaffold.js';
import { pitchDiagram, pitchName } from '../ui/pitch.js';
import { toMora } from '../engine/mora.js';
import { loadJlpt, recordsFor } from '../content/n5.js';
import { vocabWord, sentence } from '../ui/kanjitext.js';
import { isKanji } from '../engine/furigana.js';

async function renderJlptItem(el, id, p, levelId, rec) {
  let lv;
  try { lv = await loadJlpt(levelId); } catch { append(el, [h('h1', null, 'Item'), h('p', { class: 'muted' }, 'This level is not included in the app yet.'), h('a', { class: 'btn', href: '#/learn' }, 'Learning path')]); return; }
  let it = lv.byId.get(id);
  if (!it && p.type === 'kanji') it = lv.kanjiByChar.get(p.slug);
  if (!it) { append(el, [h('h1', null, 'Item not found'), h('a', { class: 'btn', href: '#/learn' }, 'Learning path')]); return; }
  const records = await recordsFor(lv);
  const unit = lv.units.find((u) => u.no === it.unit);
  const unitHref = `#/unit/${levelId}/${it.unit}`;
  if (p.type === 'kanji') {
    const data = lv.strokes[it.char];
    const diagram = data ? strokeDiagram(data, { size: 180, label: it.char }) : null;
    const examples = it.examples.map((x) => lv.byId.get(x)).filter(Boolean);
    append(el, [
      h('header', { class: 'page-head' }, h('h1', null, jp(it.char, 'jp-xl'), ' ', h('span', { class: 'muted' }, it.meanings.join(', '))), h('p', { class: 'lede' }, `${lv.title} · unit ${it.unit} · ${it.strokes} stroke${it.strokes === 1 ? '' : 's'}`)),
      h('section', { class: 'card' },
        h('dl', { class: 'kanji-readings' }, h('dt', null, 'On'), h('dd', { lang: 'ja' }, it.on.join('・') || '—'), h('dt', null, 'Kun'), h('dd', { lang: 'ja' }, it.kun.join('・') || '—'), it.radicals.length ? h('dt', null, 'Components') : null, it.radicals.length ? h('dd', { class: 'components' }, it.radicals.map((r) => h('span', { class: 'pill', lang: 'ja' }, r))) : null),
        diagram ? h('div', { class: 'row', style: { alignItems: 'flex-start', marginTop: '12px' } }, diagram.el, h('button', { class: 'btn', type: 'button', onClick: () => diagram.play() }, 'Replay strokes')) : null,
        h('p', { class: 'mnemonic' }, h('strong', null, 'Remember: '), it.mnemonic)),
      h('section', { class: 'card' }, h('h2', null, 'Words with ', jp(it.char)), h('ul', { class: 'vocab-list' }, examples.map((v) => h('li', null, h('a', { href: `#/learn/item/${encodeURIComponent(v.id)}`, class: 'vw' }, vocabWord(v, records.get(v.id))), h('div', { class: 'vm' }, v.meanings[0], h('small', null, v.kana)), canSpeak() ? h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Listen', onClick: () => speak(v.kana) }, icon('speak')) : null)))),
      progressCard(rec, unitHref)
    ]);
  } else if (p.type === 'vocab') {
    append(el, [
      h('header', { class: 'page-head' }, h('h1', null, vocabWord(it, rec, { cls: 'jp-xl' })), h('p', { class: 'lede' }, `${it.meanings.join('; ')} · ${it.kana} · ${it.romaji}`)),
      h('section', { class: 'card' },
        h('div', { class: 'btn-row' }, canSpeak() ? h('button', { class: 'btn', type: 'button', onClick: () => speak(it.kana) }, icon('speak'), 'Listen') : null, canSpeak() ? h('button', { class: 'btn', type: 'button', onClick: () => speak(it.kana, { rate: 0.7 }) }, icon('speak'), 'Slow') : null),
        h('p', { class: 'small muted', style: { marginTop: '12px' } }, `${lv.title} · unit ${it.unit}${it.furiganaException ? ' · uses kanji beyond this level, so furigana always shows' : ''}${it.verified ? ' · reading and meaning checked against JMdict' : ''}`),
        it.kanji.length ? h('div', null, h('h3', null, 'Kanji'), h('div', { class: 'char-grid' }, it.kanji.map((kid) => { const k = lv.byId.get(kid); return h('a', { class: 'char-chip', href: `#/learn/item/${encodeURIComponent(kid)}` }, jp(k.char, 'jp-xl'), h('span', { class: 'small muted' }, k.meanings[0])); }))) : null),
      progressCard(rec, unitHref)
    ]);
  } else {
    append(el, [
      h('header', { class: 'page-head' }, h('h1', null, it.title), h('p', { class: 'lede' }, `${it.summary} · ${lv.title} unit ${it.unit}`)),
      h('section', { class: 'card' },
        h('div', { class: 'gram-pattern', lang: 'ja' }, it.pattern),
        h('p', null, it.explanation),
        h('h3', null, 'Examples'),
        it.examples.map((ex) => h('div', { class: 'gram-example' }, h('div', { class: 'row' }, sentence(ex.jp, { reading: ex.kana, records, lv, cls: 'ex-jp' }), canSpeak() ? h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Listen', onClick: () => speak(ex.kana) }, icon('speak')) : null), h('div', { class: 'ex-meta' }, ex.romaji, ' · ', ex.en))),
        it.mistakes?.length ? h('div', null, h('h3', null, 'Common mistakes'), h('ul', null, it.mistakes.map((m) => h('li', null, m)))) : null),
      progressCard(rec, unitHref)
    ]);
  }
}

export const title = 'Item';

export async function render(el, id) {
  const p = parseId(id);
  const rec = await progress.get(id);
  await initAudio();
  const levelId = p?.type === 'kana' ? (p.scope === 'k' ? 'katakana' : 'kana') : p?.type === 'vocab' && (p.scope === 'kana' || p.scope === 'katakana') ? p.scope : null;
  if (!levelId) {
    const jlptLevel = p?.type === 'kanji' ? 'n5' : (p?.scope && /^n[1-5]$/.test(p.scope) ? p.scope : null);
    if (jlptLevel) return renderJlptItem(el, id, p, jlptLevel, rec);
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
        h('div', { class: 'btn-row' }, canSpeak() ? h('button', { class: 'btn', type: 'button', onClick: () => speak(word.jp) }, icon('speak'), 'Listen') : null, canSpeak() ? h('button', { class: 'btn', type: 'button', onClick: () => speak(word.jp, { rate: 0.7 }) }, icon('speak'), 'Slow') : null),
        word.pitch !== undefined ? h('div', { style: { marginTop: '12px' } }, h('h3', null, 'Pitch accent'), h('div', { class: 'row' }, pitchDiagram(word.jp, word.pitch), h('span', { class: 'small muted' }, `[${word.pitch}] ${pitchName(word.pitch, toMora(word.jp).length)}`))) : null,
        h('h3', { style: { marginTop: '12px' } }, 'Characters'),
        h('div', { class: 'char-grid' }, word.units.map((u) => { const c = kana.charByGlyph.get(u); return h('a', { class: 'char-chip', href: c ? `#/learn/item/${encodeURIComponent(c.id)}` : null }, jp(u, 'jp-xl'), h('span', { class: 'small muted' }, c ? c.romaji : '')); }))),
      progressCard(rec, `#/lesson/${levelId}/${group.id}`)
    ]);
  }
}

function progressCard(rec, lessonHref) {
  if (!rec) return h('section', { class: 'card' }, h('h2', null, 'Progress'), h('p', { class: 'muted' }, 'Not learned yet.'), h('a', { class: 'btn', href: lessonHref }, 'Open its lesson'));
  const levelNames = ['Romaji only', 'Kana with romaji', 'Kana only', 'Kanji with furigana', 'Kanji only'];
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
