# Authoring sources and build scripts

The JSON under `data/` is generated from these sources. Edit the sources,
rebuild, then run the validator.

- `kana/build-kana.mjs`, `kana/build-katakana.mjs`: hiragana and katakana
  groups, mnemonics and words → `data/kana.json`, `data/katakana.json`
  (stroke counts from `data/strokes/*.json`). `kana/add-pitch.mjs` adds pitch
  accent numbers to kana-stage words.
- `<level>/<level>-kanji-src.mjs` (kanji in teaching order with mnemonics and
  unit titles), `<level>-vocab-src.mjs`, `<level>-grammar-src.mjs`,
  `<level>-readings-src.mjs`: the curriculum sources for n5, n4, …
- `check-vocab.mjs <level>`: verifies every word against JMdict (downloads
  the dictionary to a temp folder on first run), reports words already taught
  at an earlier level, and writes `cache/jmdict-<level>.json`.
- `build-level.mjs <level>`: builds `data/<level>/*.json`. Needs
  `cache/kanjidic-<level>.json`
  (`node scripts/fetch-edrdg.mjs kanji "<all kanji>" scripts/authoring/cache/kanjidic-<level>.json`),
  `data/strokes/kanji-<level>.json` (`node scripts/fetch-kanjivg.mjs chars "<all kanji>" …`)
  and the JMdict cache from the check above. Earlier levels must be built
  first, since their kanji and words count as known.

`cache/` holds dictionary extracts and is not committed.
