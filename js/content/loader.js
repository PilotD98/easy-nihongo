/* Curriculum loader. data/index.json lists levels and their files; each level
   is fetched only when first needed and then kept in memory. The service worker
   caches data files after first load, so lessons work offline afterwards. */

const DATA_BASE = 'data/';
let manifestPromise = null;
const levelCache = new Map();

export async function getManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch(`${DATA_BASE}index.json`, { cache: 'no-cache' })
      .then((r) => { if (!r.ok) throw new Error(`Could not load content index (${r.status})`); return r.json(); })
      .catch((err) => { manifestPromise = null; throw err; });
  }
  return manifestPromise;
}

/** Load every file of one level. Returns { id, title, ...manifestEntry, data: { kanji: [...], ... } } */
export async function loadLevel(levelId) {
  if (levelCache.has(levelId)) return levelCache.get(levelId);
  const p = (async () => {
    const manifest = await getManifest();
    const entry = (manifest.levels || []).find((l) => l.id === levelId);
    if (!entry) throw new Error(`Unknown level: ${levelId}`);
    const data = {};
    await Promise.all(Object.entries(entry.files || {}).map(async ([kind, path]) => {
      const r = await fetch(`${DATA_BASE}${path}`);
      if (!r.ok) throw new Error(`Could not load ${path} (${r.status})`);
      data[kind] = await r.json();
    }));
    return { ...entry, data };
  })();
  levelCache.set(levelId, p);
  p.catch(() => levelCache.delete(levelId));
  return p;
}

export function loadedLevels() {
  return [...levelCache.keys()];
}

/** Levels that have at least one content file available in this build. */
export async function availableLevels() {
  const manifest = await getManifest();
  return (manifest.levels || []).filter((l) => l.files && Object.keys(l.files).length > 0);
}

/* ---------- Quick lookup ----------
   Searches all levels that have content. Results are light objects used by
   the search sheet; each links to the item's detail page. */
function normalize(s) { return (s || '').toString().toLowerCase().normalize('NFKC').trim(); }

function* itemsOf(level) {
  const d = level.data || {};
  for (const group of d.kana?.groups || []) {
    for (const c of group.chars || []) yield { id: c.id, jp: c.char, reading: c.romaji, meaning: `${d.kana.script} · ${group.title}`, type: 'kana', level: level.id, keys: [c.char, c.romaji] };
    for (const w of group.words || []) yield { id: w.id, jp: w.jp, reading: w.romaji, meaning: w.meaning, type: 'vocab', level: level.id, keys: [w.jp, w.romaji, w.meaning] };
  }
  for (const k of d.kanji || []) yield { id: k.id, jp: k.char, reading: [...(k.on || []), ...(k.kun || [])].join('、'), meaning: (k.meanings || []).join(', '), type: 'kanji', level: level.id, keys: [k.char, ...(k.on || []), ...(k.kun || []), ...(k.meanings || [])] };
  for (const v of d.vocab || []) yield { id: v.id, jp: v.jp, reading: v.kana, meaning: (v.meanings || []).join(', '), type: 'vocab', level: level.id, keys: [v.jp, v.kana, v.romaji, ...(v.meanings || [])] };
  for (const g of d.grammar || []) yield { id: g.id, jp: g.title, reading: g.pattern, meaning: g.summary || '', type: 'grammar', level: level.id, keys: [g.title, g.pattern, g.summary] };
}

export async function searchContent(query, { limit = 30 } = {}) {
  const q = normalize(query);
  if (!q) return [];
  const levels = await availableLevels();
  const loaded = await Promise.all(levels.map((l) => loadLevel(l.id).catch(() => null)));
  const results = [];
  for (const level of loaded) {
    if (!level) continue;
    for (const item of itemsOf(level)) {
      const keys = item.keys.map(normalize);
      let score = 0;
      for (const k of keys) {
        if (!k) continue;
        if (k === q) { score = Math.max(score, 3); break; }
        if (k.startsWith(q)) score = Math.max(score, 2);
        else if (k.includes(q)) score = Math.max(score, 1);
      }
      if (score) results.push({ ...item, score });
    }
  }
  results.sort((a, b) => b.score - a.score || a.jp.length - b.jp.length);
  return results.slice(0, limit).map(({ keys, score, ...rest }) => rest);
}
