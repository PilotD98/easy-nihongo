/* Export / import of all device data as one JSON file.
   File shape (schema 1):
   {
     app: 'kotoba-path', schema: 1, appVersion, exportedAt,
     settings: { key: value, ... },
     progress: [ record, ... ],
     days:     [ row, ... ],
     meta:     [ { id, value }, ... ]
   } */
import { appearanceKeyFor } from './profiles.js';
import { db, STORES } from './db.js';
import { settings, DEFAULTS } from './settings.js';
import { APP_VERSION } from '../util/platform.js';

export const BACKUP_SCHEMA = 1;

export async function buildExport() {
  const [progress, daysRows, meta] = await Promise.all([db.getAll('progress'), db.getAll('days'), db.getAll('meta')]);
  return {
    app: 'kotoba-path',
    schema: BACKUP_SCHEMA,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    settings: settings.all(),
    progress: progress || [],
    days: daysRows || [],
    meta: meta || []
  };
}

/** Trigger a file download of the current data. Returns the filename. */
export async function downloadExport() {
  const data = await buildExport();
  const name = `easy-nihongo-backup-${data.exportedAt.slice(0, 10)}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return name;
}

/** Validate a parsed backup object. Returns { ok, errors, summary }. */
export function validateImport(obj) {
  const errors = [];
  if (!obj || typeof obj !== 'object') errors.push('File is not a JSON object.');
  else {
    if (obj.app !== 'kotoba-path') errors.push('This is not an Easy Nihongo backup (missing app marker).');
    if (typeof obj.schema !== 'number') errors.push('Missing schema number.');
    else if (obj.schema > BACKUP_SCHEMA) errors.push(`Backup schema ${obj.schema} is newer than this app understands (${BACKUP_SCHEMA}). Update the app first.`);
    if (obj.progress && !Array.isArray(obj.progress)) errors.push('"progress" must be a list.');
    if (obj.days && !Array.isArray(obj.days)) errors.push('"days" must be a list.');
    if (obj.settings && typeof obj.settings !== 'object') errors.push('"settings" must be an object.');
    for (const r of obj.progress || []) {
      if (!r || typeof r.id !== 'string') { errors.push('A progress record has no id.'); break; }
    }
    for (const r of obj.days || []) {
      if (!r || !/^\d{4}-\d{2}-\d{2}$/.test(r.id || '')) { errors.push('A study-day row has an invalid date id.'); break; }
    }
  }
  const summary = obj && typeof obj === 'object' ? {
    exportedAt: obj.exportedAt || null,
    appVersion: obj.appVersion || null,
    progress: Array.isArray(obj.progress) ? obj.progress.length : 0,
    days: Array.isArray(obj.days) ? obj.days.length : 0,
    settings: obj.settings ? Object.keys(obj.settings).length : 0
  } : null;
  return { ok: errors.length === 0, errors, summary };
}

/** Read a File object and parse it. Throws with a friendly message on failure. */
export async function readBackupFile(file) {
  if (file.size > 50 * 1024 * 1024) throw new Error('File is too large to be an Easy Nihongo backup.');
  const text = await file.text();
  try { return JSON.parse(text); }
  catch { throw new Error('The file is not valid JSON.'); }
}

/**
 * Apply a validated backup.
 * mode 'replace': wipe device data first, then load the file.
 * mode 'merge':   keep newer progress records, keep the larger daily totals, overwrite settings.
 */
export async function applyImport(obj, { mode = 'replace' } = {}) {
  const check = validateImport(obj);
  if (!check.ok) throw new Error(check.errors.join(' '));

  if (mode === 'replace') {
    await db.clearAll();
    if (obj.progress?.length) await db.putMany('progress', obj.progress);
    if (obj.days?.length) await db.putMany('days', obj.days);
    if (obj.meta?.length) await db.putMany('meta', obj.meta);
  } else {
    const existing = new Map(((await db.getAll('progress')) || []).map((r) => [r.id, r]));
    const merged = [];
    for (const r of obj.progress || []) {
      const cur = existing.get(r.id);
      if (!cur || Date.parse(r.updatedAt || 0) >= Date.parse(cur.updatedAt || 0)) merged.push(r);
    }
    if (merged.length) await db.putMany('progress', merged);

    const curDays = new Map(((await db.getAll('days')) || []).map((r) => [r.id, r]));
    const mergedDays = [];
    for (const r of obj.days || []) {
      const cur = curDays.get(r.id);
      if (!cur) { mergedDays.push(r); continue; }
      mergedDays.push({
        id: r.id,
        seconds: Math.max(cur.seconds || 0, r.seconds || 0),
        reviews: Math.max(cur.reviews || 0, r.reviews || 0),
        newItems: Math.max(cur.newItems || 0, r.newItems || 0),
        answered: Math.max(cur.answered || 0, r.answered || 0),
        correct: Math.max(cur.correct || 0, r.correct || 0)
      });
    }
    if (mergedDays.length) await db.putMany('days', mergedDays);
    if (obj.meta?.length) await db.putMany('meta', obj.meta);
  }

  const incoming = {};
  for (const [k, v] of Object.entries(obj.settings || {})) if (k in DEFAULTS) incoming[k] = v;
  if (mode === 'replace') await settings.resetToDefaults();
  if (Object.keys(incoming).length) await settings.setMany(incoming);
  window.dispatchEvent(new CustomEvent('kp:data-changed'));
  return check.summary;
}

/** Delete everything stored by the app on this device. */
export async function clearAllData() {
  await db.clearAll();
  for (const s of STORES) await db.clear(s);
  try { localStorage.removeItem(appearanceKeyFor()); } catch { /* ignore */ }
  await settings.resetToDefaults();
  window.dispatchEvent(new CustomEvent('kp:data-changed'));
}
