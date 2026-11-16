# Contributing to Easy Nihongo

Thank you for helping. Most contributions are curriculum content: a missing
word, a wrong reading, a better mnemonic, a new reading passage. This guide
explains how content is organised and how to check your change before opening
a pull request.

## Where content lives

All curriculum is JSON under `data/`, split by level so the app can load each
level only when needed:

```
data/index.json          manifest: stages, levels, targets, file list
data/SCHEMA.md           field-by-field reference for every file type
data/orientation.json    Stage 0 text
data/kana.json           hiragana groups, characters and first words
data/katakana.json       katakana groups, characters and loanwords
data/speaking.json       speaking sets: repeat, shadow, question, roleplay
data/strokes/*.json      stroke paths extracted from KanjiVG (regenerate, do not hand-edit)
data/n5/units.json       the interleaved units (which kanji, words, grammar, readings go together)
data/n5/kanji.json       kanji for N5 (and n4/, n3/, n2/, n1/ likewise)
data/n5/vocab.json       vocabulary
data/n5/grammar.json     grammar points
data/n5/readings.json    graded reading passages
data/n5/listening.json   listening drills
```

Read `data/SCHEMA.md` before editing. It is short.

## Rules that the validator enforces

Run the validator after every change:

```bash
node scripts/validate-content.mjs
```

It fails the build if:

- an `id` is missing, malformed, or used twice anywhere in the curriculum;
- an item lacks a required field (readings, meanings, stroke count, mnemonic…);
- a kana-stage word uses a character that has not been introduced yet;
- a kana character's `strokes` count disagrees with the KanjiVG stroke data;
- a vocabulary item uses a kanji that is taught later, unless it is marked
  `"furiganaException": true` (it then always shows furigana until the kanji is learned);
- a grammar example, exercise, or reading passage uses an untaught kanji
  outside an inline-furigana span written as `{漢字|かんじ}`;
- a kanji's example word does not exist or does not contain that kanji;
- a speaking phrase contains kanji (phrases stay in kana until the N5 stage;
  put kanji spellings the recognizer might return in `alt` instead).

It warns, without failing, when a kanji's example word is taught later than the
kanji itself. Prefer examples the learner already knows.

## JLPT levels: how the per-level files are made

Each level's files are generated from authored sources in
`scripts/authoring/<level>/` plus dictionary extracts (see
`scripts/authoring/README.md`):

1. `node scripts/fetch-edrdg.mjs kanji <chars> scripts/authoring/cache/kanjidic-<level>.json`
   pulls readings, meanings and stroke counts from KANJIDIC2.
2. `node scripts/fetch-kanjivg.mjs chars <chars> data/strokes/kanji-<level>.json`
   pulls stroke paths and component decompositions from KanjiVG.
3. `node scripts/authoring/check-vocab.mjs <level>` checks every authored
   word (surface + reading + part of speech) against JMdict, reports words
   already taught at an earlier level, and writes the cache the build reads.
4. `node scripts/authoring/build-level.mjs <level>` drops kanji already
   taught earlier, assigns each word to the unit where its last new kanji is
   taught, marks words that use kanji beyond the level with
   `furiganaException`, wraps not-yet-taught kanji in examples, exercises and
   readings as `{漢字|かな}` (anchored on vocabulary readings), picks example
   words from this and earlier levels, and writes `data/<level>/*.json`.

To correct an entry, edit the source, rebuild, and run the validator. Keep
example sentences and readings original; do not paste them from textbooks.

## Mnemonics

Memory hints are short, concrete, and tied to the shape and the sound. Write
your own; do not copy them from other apps or books. Keep them culturally
neutral and free of anything a learner might find off-putting.

## Never change an ID

Learners' progress is keyed on item IDs. If a word's spelling or reading was
wrong, fix the fields but keep the `id`. If an item must be removed, delete it;
do not reuse its ID for something else.

## Accuracy

- Readings and meanings must be checked against KANJIDIC2 / JMdict (links in
  the About page). Stroke counts follow KANJIDIC2.
- Romaji is modified Hepburn: `shi`, `chi`, `tsu`, `fu`, `ji`; long vowels are
  written out (`ou`, `uu`) rather than with macrons, so they type naturally.
- Pitch accent numbers follow the NHK/OJAD convention (0 = heiban). Only add
  a `pitch` value when the word is unambiguous and you have checked it.
- If you are not sure, say so in the pull request rather than guessing.

## What not to add

- Nothing copied from commercial textbooks, apps, or websites.
- No example sentences that are not your own or not from an openly licensed
  source (Tatoeba sentences are CC BY; credit the sentence ID in the item).
- No API keys, tokens, or credentials anywhere, even in comments or examples.

## Code changes

The app is plain ES modules with no build step and no dependencies. Keep it that
way unless there is a strong reason. Run the app locally with:

```bash
node scripts/serve.mjs
```

Then open http://localhost:5173/. Test on a 375px-wide viewport and on desktop,
with the browser offline after a first load, and with the console open: no
errors. If you change any file listed in `sw.js`, bump its `VERSION` so installed
apps pick up the change.

## Opening a pull request

1. Describe what you changed and why, and where you checked the facts.
2. Paste the validator output (`OK. 0 warning(s).` or the warnings you accept).
3. For content, one level or one topic per pull request keeps review easy.
