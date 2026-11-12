# Stroke-order data

`hiragana.json` and `katakana.json` (and later `kanji-*.json`) contain stroke
paths extracted from **KanjiVG** by Ulrich Apel and contributors,
https://kanjivg.tagaini.net/, released under the
**Creative Commons Attribution-ShareAlike 3.0** license
(https://creativecommons.org/licenses/by-sa/3.0/).

Only the SVG path data and stroke-number positions are kept, in KanjiVG's
0 0 109 109 coordinate box. These files are derivative works of KanjiVG and
are redistributed under the same CC BY-SA 3.0 license.

Regenerate with:

```bash
node scripts/fetch-kanjivg.mjs hiragana
node scripts/fetch-kanjivg.mjs katakana
```
