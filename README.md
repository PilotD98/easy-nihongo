# Kotoba Path (言葉の道)

A calm, serious Japanese study tool that runs entirely in your browser and
deploys as a static site on GitHub Pages. It takes a learner from zero to
advanced reading and speaking, measured against JLPT N5 → N1.

Think: Duolingo's ease of use + WaniKani's structure + Anki's memory science +
a real tutor's feedback. No hearts, no lives, no streak-shaming.

**Status: 1.0 — all eight phases complete.** On top of the Phase 1
foundation (installable PWA, offline mode, device-local storage with
export/import, settings, theming, deploy workflow), the app teaches Stage 0,
the complete hiragana and katakana stages, speaking practice with mora-level
feedback, and all five JLPT stages (N5 to N1, about 1,950 kanji and 5,500
words) with furigana scaffolding, measured by a progress dashboard, an
optional placement test and timed mock exams. Phase 8 was an accessibility,
performance and cross-device pass (see below).

## Features

Available now:

- **Orientation (Stage 0)**: the three scripts, mora, word order and
  politeness, in about eight minutes with voiced examples.
- **Hiragana stage**: 19 groups (the ten basic rows, dakuten/handakuten,
  two combination groups, small っ, long vowels), 110 characters and 217 real
  words built only from characters already taught. Each character has an
  animated **stroke-order diagram** (KanjiVG), a memory hint, audio, and a
  **trace-it pad** with a rough shape-and-stroke-count check. Each group ends
  with a 12-question check; a 50-question **exam** unlocks katakana.
- **Katakana stage**: the same path with 19 groups, 121 characters (including
  the long-vowel mark ー, small ッ, and extended combinations such as ファ, ティ,
  ウェ, ヴァ) and 223 loanwords, with loanword rules explained group by group
  (consonant clusters, ー for long vowels and -er endings, ッ for clipped
  vowels, l/r, v/b). Its exam unlocks N5.
- **JLPT N5 stage**: 21 interleaved units, each with five kanji (104 in
  all, with KANJIDIC2 readings and meanings, KanjiVG stroke order and
  component decomposition, original mnemonics and example words), the
  vocabulary that uses them (792 words, every reading checked against JMdict),
  two to four grammar points (69, each with a plain explanation, pattern,
  three examples with audio, common mistakes and exercises: fill, choose,
  order the pieces, produce), ten graded readings and eight listening drills
  (dictation, comprehension, shadowing) built only from material already
  taught. Words that use kanji beyond N5 always show furigana.
- **JLPT N4 stage**: 29 units with 174 further kanji (the same KANJIDIC2 /
  KanjiVG pipeline and original mnemonics), 670 new words verified against
  JMdict, 63 grammar points (て-form patterns, potential, volitional,
  conditionals, passive, causative, honorific and humble verbs, and more),
  7 readings and 6 listening drills. N4 unlocks when every N5 unit is passed
  (or by placement), and its mock exam uses the N4 pass mark.
- **JLPT N3 stage**: 60 units with 360 further kanji, 990 new words verified
  against JMdict, 119 grammar points (〜によって, 〜に対して, 〜わけ, 〜ばかり,
  〜たびに, 〜ように, 〜っぽい, 〜に違いない, 〜ことにする, 〜次第, 〜を問わず
  and more), 7 readings and 6 listening drills. N3 unlocks when every N4 unit
  is passed (or by placement), and its mock exam uses the N3 pass mark.
- **JLPT N2 stage**: 60 units with 360 further kanji (every remaining
  old-JLPT-level-2 kanji plus ten frequent extras), 966 new words verified
  against JMdict, 120 grammar points (〜上で, 〜一方だ, 〜うちに, 〜ざるを得ない,
  〜にもかかわらず, 〜ものの, 〜をめぐって, 〜かねない and more), 7 readings
  and 6 listening drills. N2 unlocks when every N3 unit is passed (or by
  placement), and its mock exam uses the N2 pass mark.
- **JLPT N1 stage**: 119 units of eight kanji covering all 946 remaining
  jōyō kanji (about 1,950 kanji across the course), 1,545 new words verified
  against JMdict, 119 grammar points (〜あっての, 〜いかんでは, 〜ざるを得ない
  review, 〜ずにはおかない, 〜べからず, 〜を余儀なくされる, 〜んばかりに,
  〜ならでは and more), 8 essay-style readings and 6 listening drills. N1
  unlocks when every N2 unit is passed (or by placement), and its mock exam
  uses the N1 pass mark.
- **Furigana scaffolding (L3–L4)**: kanji show their reading above until a
  word has been answered correctly four times in a row, then the reading
  hides and a tap reveals it; it comes back after repeated misses. Readings
  are aligned per kanji run and anchored on vocabulary, with real `<ruby>`.
  Tap any word in a passage for its reading, meaning and "add to reviews".
- **Review engine**: FSRS-5 scheduling with learning steps, a per-day review
  cap that spreads backlogs out, and a new-item goal that eases off when
  recent accuracy drops. Review types rotate: recognition, recall (typed and
  multiple choice), word reading, listening, production and handwriting.
- **Romaji scaffolding (L0–L2)** per character: romaji only before a kana is
  introduced, kana with romaji ruby while learning, kana only (tap to reveal)
  after four correct answers in a row; it steps back down after repeated
  misses. Settings can force romaji always or never.
- **Japanese typing**: typed answers convert romaji to kana live
  (`ka` → か, `kka` → っか, `nn` → ん); near-misses get a "typo?" prompt
  instead of a hard fail.
- **Quick lookup** (`/`): search any character or word by kana, romaji or
  meaning; results open an item page with stroke order, progress and
  one-tap focused practice.
- **Progress dashboard**: current JLPT level with separate kanji, vocabulary,
  grammar, reading and listening bars (mastered and learned), mastery stage
  counts, accuracy by item type and by level, a most-missed list with one-tap
  practice, a readiness estimate based on coverage and accuracy (presented as
  an estimate), mock exam history, study time per day and items learned per
  week, and a streak with no penalties.
- **Placement test** (optional, offered at first launch and in Settings):
  say what you know, take a short check (hiragana, katakana, N5), and skip
  ahead. Skipped stages are marked passed and their items enter the review
  queue as already familiar, spread over the following weeks, so nothing is
  lost and nothing is drilled from scratch.
- **Mock JLPT N5**: three timed sections in the real exam's format
  (vocabulary: kanji reading, orthography, words in context; grammar and
  reading: sentence grammar, sentence composition ★, passages; listening:
  words and comprehension), no feedback until the end, early submit, auto
  submit on time-out, a scaled estimate on the JLPT scale (0–120 + 0–60,
  pass at 80 with sectional minimums) and weak areas with one-tap practice.
- **Installable PWA** with offline support: the service worker stores the app
  shell plus the kana and N5 curriculum at install (about 1 MB), caches
  higher levels the first time they are opened, and Settings → Offline
  content downloads every level at once (about 5 MB more). An update toast
  appears when a new version is ready.
- **Private by design**: no accounts, no server, no analytics. Progress lives
  in IndexedDB (localStorage fallback) with JSON export/import.
- **Responsive, accessible UI**: bottom tab bar on phones, sidebar on desktop,
  safe-area aware, 44px targets, light/dark themes, four text sizes,
  sans/serif Japanese fonts, reduced motion, keyboard shortcuts
  (`/` search, `?` shortcuts, `1–4` grade, `Enter` continue, `Space` reveal).
- **Speaking practice** in four modes: repeat-after-me, shadowing (speak
  along with slow audio), answer-a-question (compare with a model answer that
  can contain slots such as your name), and role-plays (self-introduction,
  ordering a coffee, asking the way) where the app voices the other person.
  Speech recognition (`ja-JP`, interim results) shows the live transcript,
  then the phrase is compared **beat by beat**: matched mora in green, missed
  or wrong ones in red, a percentage, and specific tips ("Long vowel: hold
  the ばあ for two full beats", "Small っ: stop the sound for one beat",
  "Voicing: ざ and さ differ only in the voice box"). The best of the
  recognizer's alternatives is used, and common kanji spellings the
  recognizer returns are mapped back to kana.
- **Record and compare** (self-check): record yourself with MediaRecorder and
  play it back next to the native voice. Recordings stay in memory on the
  device. Where speech recognition is unavailable this is the main path, with
  self-rating; nothing broken is ever shown.
- **Pitch accent** diagrams (high/low line over the mora) for 125 kana-stage
  words, on item pages and in speaking sets, with the standard pattern names.
- **Audio** at natural (1.0×) and slow (0.7×) speed everywhere, plus a
  capability check with Japanese voice-install instructions per platform.
- **Content validator** enforcing unique IDs, required fields, stroke counts
  that match the stroke data, and "only use what has been taught" ordering.

Not included: speaking sets written specifically for each JLPT level (the
speaking module ships with kana-stage sets; JLPT examples are voiced in the
lessons and readings instead).

## Accessibility, performance and devices

The 1.0 polish pass checked every screen, including in-progress lessons,
reviews, placement and mock exams, in light and dark mode at phone (375 px),
tablet (768 px) and desktop widths:

- Every control has an accessible name, every input a label, every page one
  `h1` and no skipped heading levels; focus moves to the page heading on
  navigation, dialogs restore focus, quiz feedback and toasts are live
  regions, and everything works from the keyboard (the trace pad is optional
  practice, never required to continue).
- Text contrast meets WCAG AA in both themes (checked programmatically on
  every rendered text node); touch targets are 44 px; `prefers-reduced-motion`
  and the in-app motion setting disable animations.
- No horizontal overflow at any width; safe-area insets are respected.
- Performance: the shell is 71 small files with no build step; a cached load
  completes in well under 100 ms, and parsing the largest level (N1, about
  2 MB of JSON) takes under 100 ms on a laptop. Levels are loaded lazily and
  kept in memory; stroke data is loaded per level.

## Screens

The app's screens: Home (today's
plan), Learn (stage path → hiragana groups → lesson: stroke order, tracing,
words, quiz), Review (session with grading), Speak (capability check), Read,
Progress (dashboard, most-missed), Settings, item pages and quick lookup,
Speak (hub, session with live transcript and mora feedback).

## Run it locally

Requirements: Node.js 18 or newer (only for the tiny dev server and the
scripts; the app itself has no build step and no dependencies).

```bash
node scripts/serve.mjs
```

Then open http://localhost:5173/. Any static file server works too, but the
service worker needs `localhost` or HTTPS.

Other scripts:

```bash
node scripts/validate-content.mjs   # check curriculum data
node scripts/make-icons.mjs         # regenerate PWA icons
node scripts/fetch-kanjivg.mjs hiragana   # refresh stroke data from KanjiVG (also: katakana, chars …)
node scripts/fetch-edrdg.mjs kanji 日本 out.json   # pull KANJIDIC2 entries (build input, see CONTRIBUTING)
```

On `localhost` the service worker is network-first, so edits show on reload.
In production it is cache-first; bump `VERSION` in `sw.js` when shell files
change so installed apps pick up the update.

## Deploy to GitHub Pages (step by step)

You do not need any prior GitHub experience.

1. **Create a GitHub account** at https://github.com if you do not have one.
2. **Create a new repository**: click the "+" in the top-right → "New
   repository". Name it, for example, `kotoba-path`. Keep it Public (GitHub
   Pages is free for public repositories). Do not add a README; this project
   already has one. Click "Create repository".
3. **Upload the project.** Either:
   - *With git on your computer:* open a terminal in this folder and run
     ```bash
     git init
     git add .
     git commit -m "Kotoba Path: foundation"
     git branch -M main
     git remote add origin https://github.com/YOUR-USER/kotoba-path.git
     git push -u origin main
     ```
   - *Without git:* on the repository page click "uploading an existing file",
     drag the whole project folder in, and click "Commit changes". Make sure
     hidden folders (`.github`) are included; on macOS press ⌘⇧. in Finder to
     show them.
4. **Turn on GitHub Pages**: in the repository, open **Settings → Pages**.
   Under "Build and deployment", set **Source** to **GitHub Actions**.
5. **Wait for the deploy**: open the **Actions** tab. The "Deploy to GitHub
   Pages" workflow runs automatically on every push to `main`. The first run
   takes about a minute. When it shows a green check, the site is live.
6. **Open the app** at `https://YOUR-USER.github.io/kotoba-path/`. On a phone,
   add it to the home screen (see "Browser support").

Every later push to `main` redeploys automatically. The workflow validates the
curriculum and scans for accidentally committed secrets before deploying.

## Browser support

- **Chrome / Edge (Android, Windows, macOS, Linux)**: everything, including
  install prompts, speech recognition and recording.
- **Safari on iPhone / iPad**: install via Share → "Add to Home Screen".
  Text-to-speech works offline once a Japanese voice is installed (Settings →
  Accessibility → Spoken Content → Voices → Japanese). Speech recognition works
  in Safari 14.5+ and requires a network connection; iOS asks for microphone
  permission the first time, and the installed (home-screen) app may ask again
  separately from Safari. Recording (MediaRecorder) works in Safari 14.1+ and
  produces `audio/mp4`.
- **Speech recognition accuracy**: the browser's recognizer may return kanji
  (今日は for こんにちは). Kotoba Path compares by sound using the best of up
  to five alternatives and a list of common spellings per phrase, and tells
  you when part of a result could not be compared.
- **Firefox**: everything except speech recognition (it falls back to
  record-and-compare self-assessment) and the automatic install prompt.
- Storage: browsers may evict site data under pressure if the app is not
  installed; Settings offers a "Keep data persistent" request, and installing
  the app usually grants it. Export a backup now and then regardless.

## Project structure

```
index.html               app shell
manifest.webmanifest     PWA manifest
sw.js                    service worker (precache shell, cache data and fonts)
css/                     tokens (theme, sizes), base, layout, components
js/app.js                boot
js/router.js             hash router with lazy-loaded views
js/store/                db (IndexedDB + fallback), settings, progress, days, backup
js/ui/                   dom helpers, toast, dialog, search, shortcuts, audio, stroke diagrams, trace pad, quiz, kana text, recognizer, recorder, pitch
js/engine/               fsrs (scheduler maths), scheduler (daily plan, queue), romaji (IME), scaffold (display levels), mora (beat alignment, tips), furigana (alignment, markup), placement
js/content/              content loader (lazy per level), ID helpers, kana stage helpers
js/util/platform.js      capability detection, install prompt, connectivity
js/views/                home, learn, orientation, kana-stage, lesson, exam, n5-stage, unit, reading, item, review, speak, speak-session, read, progress, placement, mock, settings, about
data/                    curriculum JSON (orientation, kana, katakana, speaking, n5/ … n1/, strokes/; SCHEMA.md)
scripts/                 serve.mjs, validate-content.mjs, make-icons.mjs, fetch-kanjivg.mjs, fetch-edrdg.mjs
scripts/authoring/       per-level sources (kanji, vocab, grammar, readings) and the build-level / check-vocab pipeline
.github/workflows/       GitHub Pages deployment
```

See `data/SCHEMA.md` for the content schema and `CONTRIBUTING.md` for how to
add or correct curriculum.

## Content credits and licenses

Application code: MIT License (see `LICENSE`).

Content sources are credited in the app's About page and here, with their
licenses. Kana mnemonics, example words, loanword notes, speaking phrases,
dialogues and the Orientation text were written for this project. Pitch
accent numbers follow the Tokyo standard as listed in NHK and OJAD references;
they were entered by hand and should be checked against those sources before
being relied on. Stroke data in `data/strokes/` is derived from
KanjiVG and stays under CC BY-SA 3.0 (see `data/strokes/README.md`).

| Source | Used for | License |
|---|---|---|
| [Noto Sans JP, Noto Serif JP](https://fonts.google.com/noto) | Japanese typefaces | SIL Open Font License 1.1 |
| [KanjiVG](https://kanjivg.tagaini.net/) | Stroke-order diagrams | CC BY-SA 3.0 |
| [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) (EDRDG) | N5–N1 kanji readings, meanings, stroke counts (`data/n5/kanji.json` … `data/n1/kanji.json`) | EDRDG licence (CC BY-SA 4.0) |
| [JMdict](https://www.edrdg.org/jmdict/j_jmdict.html) (EDRDG) | Verification of every N5–N1 word's reading and meaning at build time (not redistributed) | EDRDG licence (CC BY-SA 4.0) |
| [Tatoeba](https://tatoeba.org/) | Not used yet; example sentences and readings are original | CC BY 2.0 FR |

The kanji data in `data/n5/kanji.json` and `data/n4/kanji.json` is derived from KANJIDIC2 and is
redistributed under the EDRDG licence (CC BY-SA 4.0); see
https://www.edrdg.org/edrdg/licence.html. The N5 word list, meanings,
grammar explanations, example sentences, readings and listening scripts were
written for this project; readings and meanings were checked against JMdict.

The JLPT has not published official vocabulary or kanji lists since 2010;
level assignments follow commonly used community lists. Nothing is copied from
commercial textbooks or apps.

## Privacy

Kotoba Path makes no network requests except to load its own files, its
open-licensed curriculum data and the Noto fonts from Google Fonts (cached
after first use). There are no analytics, no trackers and no accounts. All
progress is stored on your device and only leaves it when you export a backup.
Speech synthesis and recognition use the browser's built-in engines; on some
platforms (Chrome, Safari) recognition sends audio to the browser vendor's
service while you are using the Speak feature, and only then. Recordings stay
in memory on the device and are discarded when you leave the page.

No API keys or credentials exist in this repository. If an optional feature
ever needs a key, you would enter it in Settings and it would be stored only
on your device.
