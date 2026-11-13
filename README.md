# Kotoba Path (言葉の道)

A calm, serious Japanese study tool that runs entirely in your browser and
deploys as a static site on GitHub Pages. It takes a learner from zero to
advanced reading and speaking, measured against JLPT N5 → N1.

Think: Duolingo's ease of use + WaniKani's structure + Anki's memory science +
a real tutor's feedback. No hearts, no lives, no streak-shaming.

**Status: Phase 5 (kana + Speaking + JLPT N5).** On top of the Phase 1
foundation (installable PWA, offline mode, device-local storage with
export/import, settings, theming, deploy workflow), the app teaches Stage 0,
the complete hiragana and katakana stages, speaking practice with mora-level
feedback, and the full JLPT N5 stage with furigana scaffolding. The progress
dashboard, placement test, N5 mock exam, and N4 → N1 content ship in the
following phases.

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
- **Progress**: mastery stages, 14-day study history, accuracy, a most-missed
  list with one-tap practice, and honest readiness estimates.
- **Installable PWA** with offline support (service worker precaches the app
  and curriculum; update toast on new versions).
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

Coming in later phases: placement test and N5 mock exam; N4 → N1 content,
one level per phase with its mock exam; speaking sets for each JLPT level.

## Screenshots

Screenshots are added at the polish phase. Screens today: Home (today's
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
js/engine/               fsrs (scheduler maths), scheduler (daily plan, queue), romaji (IME), scaffold (display levels), mora (beat alignment, tips)
js/content/              content loader (lazy per level), ID helpers, kana stage helpers
js/util/platform.js      capability detection, install prompt, connectivity
js/views/                home, learn, orientation, kana-stage, lesson, exam, n5-stage, unit, reading, item, review, speak, speak-session, read, progress, settings, about
data/                    curriculum JSON (orientation, kana, katakana, speaking, n5/, strokes/; SCHEMA.md)
scripts/                 serve.mjs, validate-content.mjs, make-icons.mjs, fetch-kanjivg.mjs, fetch-edrdg.mjs
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
| [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) (EDRDG) | N5 kanji readings, meanings, stroke counts (`data/n5/kanji.json`) | EDRDG licence (CC BY-SA 4.0) |
| [JMdict](https://www.edrdg.org/jmdict/j_jmdict.html) (EDRDG) | Verification of every N5 word's reading and meaning at build time (not redistributed) | EDRDG licence (CC BY-SA 4.0) |
| [Tatoeba](https://tatoeba.org/) | Not used yet; example sentences and readings are original | CC BY 2.0 FR |

The kanji data in `data/n5/kanji.json` is derived from KANJIDIC2 and is
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
