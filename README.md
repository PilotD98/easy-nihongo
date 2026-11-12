# Kotoba Path (言葉の道)

A calm, serious Japanese study tool that runs entirely in your browser and
deploys as a static site on GitHub Pages. It takes a learner from zero to
advanced reading and speaking, measured against JLPT N5 → N1.

Think: Duolingo's ease of use + WaniKani's structure + Anki's memory science +
a real tutor's feedback. No hearts, no lives, no streak-shaming.

**Status: Phase 1 (foundation).** The deployable app shell is complete:
installable PWA, offline mode, device-local storage with export/import,
navigation, settings and theming, content loader, content validator and the
GitHub Pages deploy workflow. Curriculum stages ship in the following phases,
starting with Hiragana.

## Features

Available now (Phase 1):

- **Installable PWA** with offline support. The app shell and any loaded
  curriculum are cached by a service worker; a toast offers a reload when a
  new version is available.
- **Private by design.** No accounts, no server, no analytics, no trackers.
  All progress lives in IndexedDB on your device (localStorage fallback).
- **Export / Import** of all data as a JSON file, with replace or merge modes,
  so you can back up or move to another device.
- **Responsive, mobile-first UI**: bottom tab bar on phones, sidebar on
  desktop, safe-area aware on iPhone, 44px touch targets.
- **Accessibility**: light/dark themes that follow the system, four text sizes
  (Japanese text always a step larger), reduced-motion setting, keyboard
  navigation with visible focus, screen-reader labels, WCAG AA contrast.
- **Japanese fonts**: Noto Sans JP by default, Noto Serif JP (textbook style)
  as an option, with system fonts as offline fallback.
- **Settings** for script support (romaji / furigana: automatic, always,
  never), daily new-item goal, review cap, audio speed and autoplay.
- **Speak page capability check**: detects Japanese text-to-speech voices,
  speech recognition and recording support, with step-by-step voice-install
  instructions for iOS, Android, Windows and macOS.
- **Global quick lookup** (press `/`) that will search every kana, kanji, word
  and grammar point as content is added.
- **Content validator** (`scripts/validate-content.mjs`) that enforces unique
  IDs, required fields and "only use what has been taught" ordering.

Coming in later phases: hiragana and katakana stages with stroke order,
tracing, audio and quizzes; the FSRS review engine; speaking practice with
mora-level feedback; N5 → N1 kanji, vocabulary, grammar, reading and
listening; placement test; mock JLPT exams; progress analytics.

## Screenshots

Screenshots are added at the polish phase once the lesson screens exist. The
shell currently has Home (today's plan), Learn (the stage path), Review, Speak
(capability check), Read, Progress (dashboard) and Settings.

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
```

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
  in Safari 14.5+ and requires a network connection. Recording (MediaRecorder)
  works in Safari 14.1+.
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
js/ui/                   dom helpers, toast, dialog, search, shortcuts
js/content/              content loader (lazy per level) and ID helpers
js/util/platform.js      capability detection, install prompt, connectivity
js/views/                home, learn, review, speak, read, progress, settings, about
data/                    curriculum JSON per level (+ SCHEMA.md)
scripts/                 serve.mjs, validate-content.mjs, make-icons.mjs
.github/workflows/       GitHub Pages deployment
```

See `data/SCHEMA.md` for the content schema and `CONTRIBUTING.md` for how to
add or correct curriculum.

## Content credits and licenses

Application code: MIT License (see `LICENSE`).

Content sources are credited in the app's About page and here, with their
licenses. Phase 1 uses only the fonts; the others are listed because the
curriculum phases are built on them.

| Source | Used for | License |
|---|---|---|
| [Noto Sans JP, Noto Serif JP](https://fonts.google.com/noto) | Japanese typefaces | SIL Open Font License 1.1 |
| [KanjiVG](https://kanjivg.tagaini.net/) | Stroke-order diagrams | CC BY-SA 3.0 |
| [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) (EDRDG) | Kanji readings, meanings, stroke counts | EDRDG licence (CC BY-SA 4.0) |
| [JMdict/EDICT](https://www.edrdg.org/jmdict/j_jmdict.html) (EDRDG) | Vocabulary | EDRDG licence (CC BY-SA 4.0) |
| [Tatoeba](https://tatoeba.org/) | Example sentences | CC BY 2.0 FR |

The JLPT has not published official vocabulary or kanji lists since 2010;
level assignments follow commonly used community lists. Nothing is copied from
commercial textbooks or apps.

## Privacy

Kotoba Path makes no network requests except to load its own files, its
open-licensed curriculum data and the Noto fonts from Google Fonts (cached
after first use). There are no analytics, no trackers and no accounts. All
progress is stored on your device and only leaves it when you export a backup.
Speech synthesis and recognition use the browser's built-in engines; on some
platforms recognition is processed by the browser vendor's service. Recordings
stay on the device.

No API keys or credentials exist in this repository. If an optional feature
ever needs a key, you would enter it in Settings and it would be stored only
on your device.
