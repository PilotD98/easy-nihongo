/* Script scaffolding: per-item display levels and how they move.
     0  romaji only            (kana not introduced yet)
     1  kana + romaji ruby     (introduced, not mastered)
     2  kana only, tap reveals (passed its reviews)
     3  kanji + furigana       (kanji introduced)
     4  kanji only, tap reveals (kanji mastered)
   Levels move up after consistent correct answers and back down after misses.
   Settings can force romaji/furigana always or never. */
import { settings } from '../store/settings.js';
import { Rating } from './fsrs.js';

export const PROMOTE_STREAK = 4;   // correct in a row to drop the ruby
export const DEMOTE_LAPSES = 2;    // misses at level 2 before ruby returns

/** Update the display level on a freshly scheduled record. Returns the record. */
export function afterAnswer(rec, rating) {
  const r = { ...rec };
  // Items that started at level 3 (kanji with furigana) move between 3 and 4; kana items between 1 and 2.
  const kanjiTrack = (r.display || 1) >= 3 || r.type === 'kanji' || r.type === 'grammar';
  const top = kanjiTrack ? 4 : 2;
  const base = kanjiTrack ? 3 : 1;
  if (rating === Rating.Again) {
    r.missStreak = (rec.missStreak || 0) + 1;
    if (r.display >= top && r.missStreak >= DEMOTE_LAPSES) { r.display = base; r.missStreak = 0; }
  } else {
    r.missStreak = 0;
    if ((r.streak || 0) >= PROMOTE_STREAK && r.display < top) r.display = top;
  }
  return r;
}

/** Level of one kana character given its record (undefined = not introduced). */
export function kanaLevel(rec) {
  if (!rec) return 0;
  return Math.min(2, Math.max(1, rec.display || 1));
}

/** Level of a kana word: the weakest of its characters. */
export function wordLevel(units, recordsByChar) {
  let level = 2;
  for (const u of units) level = Math.min(level, kanaLevel(recordsByChar.get(u)));
  return level;
}

/** Apply the user's romaji / furigana override to a computed level. */
export function effectiveLevel(level) {
  const romaji = settings.get('romaji');
  const furigana = settings.get('furigana');
  let l = level;
  if (l <= 2) {
    if (romaji === 'always') l = Math.min(l, 1);
    else if (romaji === 'never') l = Math.max(l, 2);
  } else {
    if (furigana === 'always') l = 3;
    else if (furigana === 'never') l = 4;
  }
  return l;
}
