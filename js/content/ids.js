/* Stable content IDs.
   Format: `type:scope:slug` (scope is optional for kanji).
     kana:h:ka              hiragana か        kana:k:ka  katakana カ
     kanji:日               one kanji, keyed by the character itself
     vocab:n5:taberu-食べる  romaji + surface form, so homophones stay distinct
     gram:n5:wa-ga          grammar point
     sent:n5:0012           example sentence
     read:n5:001            reading passage
     listen:n5:001          listening drill
     spk:kana:greet:01      speaking phrase (set:item)
   IDs never change once published; progress records are keyed on them. */

export const ID_TYPES = ['kana', 'kanji', 'vocab', 'gram', 'sent', 'read', 'listen', 'spk'];
export const ID_RE = /^(kana|kanji|vocab|gram|sent|read|listen|spk):([^:\s]+)(?::([^\s]+))?$/u;

export function parseId(id) {
  const m = ID_RE.exec(id || '');
  if (!m) return null;
  if (m[1] === 'kanji') return { type: 'kanji', scope: null, slug: m[2] };
  return { type: m[1], scope: m[2], slug: m[3] ?? null };
}

export function isValidId(id) { return ID_RE.test(id || ''); }

/** Map an ID type to the progress record type used in storage. */
export function progressTypeFor(id) {
  const p = parseId(id);
  if (!p) return null;
  return { kana: 'kana', kanji: 'kanji', vocab: 'vocab', gram: 'grammar', sent: 'sentence', read: 'reading', listen: 'reading' }[p.type];
}
