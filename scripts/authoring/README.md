# Authoring sources and build scripts

The JSON under `data/` is generated from these sources. Edit the sources,
rebuild, then run the validator.

- `kana/build-kana.mjs`, `kana/build-katakana.mjs`: hiragana and katakana
  groups, mnemonics and words → `data/kana.json`, `data/katakana.json`
  (stroke counts from `data/strokes/*.json`). `kana/add-pitch.mjs` adds pitch
  accent numbers to kana-stage words.
- `n5/n5-kanji-src.mjs`, `n5/n5-vocab-src.mjs`, `n5/n5-grammar-src.mjs`,
  `n5/n5-readings-src.mjs`: the N5 curriculum sources.
- `n5/check-vocab.mjs`: verifies every word against JMdict (downloads the
  dictionary to a temp folder on first run) and writes `cache/jmdict-n5.json`.
- `n5/build-n5.mjs`: builds `data/n5/*.json`. Needs `cache/kanjidic-n5.json`
  (`node scripts/fetch-edrdg.mjs kanji "<all kanji>" scripts/authoring/cache/kanjidic-n5.json`)
  and `cache/jmdict-n5.json` from the check above.

`cache/` holds dictionary extracts and is not committed.
