# Curriculum data schema

All curriculum lives in `data/` as JSON. `data/index.json` is the manifest; it
lists stages (what the learner sees on the path) and levels (which files hold
the content). Levels are lazy-loaded by the app the first time they are needed.

`node scripts/validate-content.mjs` checks every rule below and exits non-zero
on any error. Run it before committing content.

## Stable IDs

Every item has an `id` that never changes once published. Progress records are
keyed on it, so renaming an ID would orphan learners' progress.

| Type | Format | Example |
|---|---|---|
| Kana | `kana:h:<romaji>` / `kana:k:<romaji>` | `kana:h:ka`, `kana:k:kya` |
| Kanji | `kanji:<character>` | `kanji:日` |
| Vocabulary | `vocab:<level>:<romaji>-<surface>` | `vocab:n5:taberu-食べる` |
| Grammar | `gram:<level>:<slug>` | `gram:n5:wa-ga` |
| Sentence | `sent:<level>:<nnnn>` | `sent:n5:0012` |
| Reading | `read:<level>:<nnn>` | `read:n5:001` |
| Listening | `listen:<level>:<nnn>` | `listen:n5:001` |

Levels, in teaching order: `kana` (hiragana), `katakana`, `n5`, `n4`, `n3`, `n2`, `n1`.
"Taught before" means an earlier level, or the same level with a smaller `order`.

## `data/index.json`

```json
{
  "schema": 1,
  "stages": [ { "id": "hiragana", "no": 1, "title": "Hiragana", "summary": "…", "level": "kana" } ],
  "levels": [
    { "id": "n5", "title": "JLPT N5",
      "targets": { "kanji": 100, "vocab": 800, "grammar": 80 },
      "files": { "kanji": "n5/kanji.json", "vocab": "n5/vocab.json", "grammar": "n5/grammar.json",
                 "readings": "n5/readings.json", "listening": "n5/listening.json" } }
  ]
}
```

A level with an empty `files` object is shown on the path as "not yet in this build".

## Kana (`kana.json`, `katakana.json`)

```json
{
  "script": "hiragana",
  "groups": [
    {
      "id": "h-a", "title": "あ row", "kind": "basic",
      "chars": [
        { "id": "kana:h:a", "char": "あ", "romaji": "a", "strokes": 3,
          "mnemonic": "…", "strokeSvg": "kanjivg/03042.svg" }
      ],
      "words": [
        { "id": "vocab:kana:aka-あか", "jp": "あか", "romaji": "aka", "meaning": "red" }
      ]
    }
  ]
}
```

Rules: `kind` is `basic | dakuten | handakuten | combo | special`. Every word in a
group may only use characters introduced in that group or an earlier one
(combination characters count as one unit, e.g. `きゃ`). Each group must have a
`quiz` section or the stage-level exam must reference it.

## Kanji (`<level>/kanji.json`)

```json
[
  { "id": "kanji:日", "char": "日", "level": "n5", "order": 1,
    "meanings": ["day", "sun"], "on": ["ニチ", "ジツ"], "kun": ["ひ", "-び", "-か"],
    "strokes": 4, "radicals": ["日"], "mnemonic": "…", "strokeSvg": "kanjivg/065e5.svg",
    "examples": ["vocab:n5:nichiyoubi-日曜日", "vocab:n5:kyou-今日"] }
]
```

Rules: `examples` must reference existing vocabulary IDs. The validator warns
when an example word uses kanji not yet taught at that point; that is allowed
only if the word is marked `furiganaException`.

## Vocabulary (`<level>/vocab.json`)

```json
[
  { "id": "vocab:n5:taberu-食べる", "jp": "食べる", "kana": "たべる", "romaji": "taberu",
    "level": "n5", "order": 30, "meanings": ["to eat"], "pos": ["v1"],
    "pitch": [2], "kanji": ["kanji:食"], "sentences": ["sent:n5:0012"],
    "furiganaException": false }
]
```

Rules: every kanji in `jp` must be taught before this word (same or earlier
level, smaller `order`), or the word must carry `furiganaException: true`
(it is then always shown with furigana until the kanji is learned). `kana` must
contain only kana. `pitch` is a list of accent nuclei (0 = heiban).

Extra N5 fields: `unit` (unit number), `verified` (reading and meaning found
in JMdict), `common` (JMdict priority entry). `kun` readings mark okurigana
with `･` (た･べる).

## Units (`<level>/units.json`)

```json
[ { "id": "unit:n5:01", "no": 1, "level": "n5", "title": "Numbers 1–5",
    "kanji": ["kanji:一", …], "vocab": ["vocab:n5:…", …], "grammar": ["gram:n5:desu", …],
    "readings": ["read:n5:001"], "listening": ["listen:n5:001"] } ]
```

A unit is the lesson the learner takes: its kanji first, then its words, then
its grammar points with exercises, then the reading, then a 12-question check.

## Grammar (`<level>/grammar.json`)

```json
[
  { "id": "gram:n5:wa-ga", "level": "n5", "order": 3, "title": "は vs が",
    "pattern": "[topic] は … / [subject] が …", "summary": "Marking the topic versus the subject",
    "explanation": "…plain-language explanation…",
    "examples": [ { "jp": "私は学生です。", "kana": "わたしはがくせいです。", "romaji": "watashi wa gakusei desu.", "en": "I am a student." } ],
    "mistakes": [ "…" ],
    "exercises": [ { "type": "fill", "prompt": "私＿学生です。", "answer": "は", "choices": ["は", "が", "を"], "why": "…" } ],
    "requires": ["vocab:n5:watashi-私"] }
]
```

Rules: at least three examples; every example uses only kanji taught by its
unit, or marks them with `{漢字|かんじ}` inline furigana (the build does this
automatically from the example's `kana`). Exercises may use any kanji of the
level; untaught ones are wrapped using vocabulary readings. Exercise `type` is
`fill | choose | order | produce`; `order` lists the pieces in `choices`;
`produce` carries `answerKana` so typed romaji is accepted.

## Readings and listening (`<level>/readings.json`, `<level>/listening.json`)

```json
[
  { "id": "read:n5:001", "level": "n5", "order": 1, "title": "わたしの一日",
    "text": "わたしは{毎日|まいにち}七時に起きます。…",
    "uses": ["vocab:n5:okiru-起きる"],
    "questions": [ { "q": "何時に起きますか。", "choices": ["六時", "七時", "八時"], "answer": 1 } ] }
]
```

`{漢字|かんじ}` marks inline furigana; the validator allows unknown kanji only
inside such braces. Readings also carry `kana` (full reading) and `enText`.
Listening drills have `type` (`dictation | comprehension | shadow`) and
`items`, each with `text`, `kana`, `en` and, for comprehension, `questions`.

## Speaking (`speaking.json`)

```json
{ "sets": [
  { "id": "spk:kana:greet", "mode": "repeat", "level": "kana", "title": "Greetings", "summary": "…",
    "items": [ { "id": "spk:kana:greet:02", "jp": "こんにちは", "romaji": "konnichiwa", "en": "Hello", "alt": ["今日は"], "pitch": 5, "pair": "spk:…" } ] },
  { "id": "spk:kana:qa1", "mode": "question", "level": "kana", "title": "…", "summary": "…",
    "items": [ { "id": "…", "q": "おなまえは？", "qRomaji": "…", "qEn": "…", "model": "[name]です。", "modelRomaji": "…", "en": "…", "alt": [] } ] },
  { "id": "spk:kana:rp-intro", "mode": "roleplay", "level": "kana", "title": "…", "summary": "…", "partner": "Tanaka",
    "turns": [ { "who": "partner", "jp": "…", "romaji": "…", "en": "…" }, { "who": "you", "jp": "…", "romaji": "…", "en": "…", "alt": [] } ] }
] }
```

`mode` is `repeat | shadow | question | roleplay`. `jp`, `q` and `model` are
kana only; `[slot]` marks a part the learner fills in (name, place, time) that
is not scored. `alt` lists spellings the speech recognizer commonly returns
for the phrase. `level` gates the set on the kana stage that teaches its
characters.

## Progress records (device storage, not in the repo)

```json
{ "id": "kana:h:ka", "type": "kana", "state": 2, "due": "2026-11-20T08:00:00.000Z",
  "stability": 12.4, "difficulty": 5.1, "reps": 6, "lapses": 1, "lastReview": "…",
  "stage": "familiar", "display": 2, "streak": 3, "createdAt": "…", "updatedAt": "…" }
```

`display` is the per-item script scaffolding level (0 romaji only → 4 kanji
only). `stage` is derived from FSRS stability: learning < 7 days ≤ familiar
< 30 ≤ mastered < 180 ≤ burned.
