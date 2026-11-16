/* Device-local storage.
   IndexedDB with four object stores, each keyed on `id`:
     progress  - one record per learned item (see progress.js)
     settings  - { id: settingKey, value }
     days      - { id: 'YYYY-MM-DD', seconds, reviews, newItems, answered, correct }
     meta      - small app bookkeeping ({ id, value })
   If IndexedDB is unavailable (some private modes, very old browsers) the same
   API is backed by localStorage. Nothing ever leaves the device. */

import { dbNameFor } from './profiles.js';

// Each local profile has its own database; see profiles.js.
const DB_NAME = dbNameFor();
const DB_VERSION = 1;
export const STORES = ['progress', 'settings', 'days', 'meta'];

let dbPromise = null;
let localMode = false;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') { localMode = true; resolve(null); return; }
    let req;
    try { req = indexedDB.open(DB_NAME, DB_VERSION); }
    catch (e) { localMode = true; resolve(null); return; }
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      db.onversionchange = () => { db.close(); dbPromise = null; };
      resolve(db);
    };
    req.onerror = () => { localMode = true; resolve(null); };
    req.onblocked = () => { /* another tab holds an old version open; we still resolve on success */ };
  });
  return dbPromise;
}

/** Run `fn(objectStore)` inside a transaction; resolves with the request result. */
async function run(store, mode, fn) {
  const db = await openDB();
  if (!db) return runLocal(store, mode, fn);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    let result;
    try {
      const req = fn(tx.objectStore(store));
      if (req && 'onsuccess' in req) req.onsuccess = () => { result = req.result; };
      else result = req;
    } catch (e) { reject(e); return; }
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
  });
}

/* ---------- localStorage fallback ---------- */
const LS_PREFIX = `kp:db:${DB_NAME === 'kotoba-path' ? '' : DB_NAME + ':'}`;
function lsKey(store, id) { return `${LS_PREFIX}${store}:${id}`; }
function lsRead(key) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : undefined; }
  catch { return undefined; }
}
function lsWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}
function lsKeysFor(store) {
  const out = [];
  const prefix = `${LS_PREFIX}${store}:`;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) out.push(k);
  }
  return out;
}
/** A tiny shim so the same `fn(objectStore)` callbacks work against localStorage. */
function runLocal(store, mode, fn) {
  const fake = {
    get: (id) => ({ result: lsRead(lsKey(store, id)) }),
    getAll: () => ({ result: lsKeysFor(store).map(lsRead).filter((v) => v !== undefined) }),
    put: (v) => { lsWrite(lsKey(store, v.id), v); return { result: v.id }; },
    delete: (id) => { localStorage.removeItem(lsKey(store, id)); return { result: undefined }; },
    clear: () => { lsKeysFor(store).forEach((k) => localStorage.removeItem(k)); return { result: undefined }; },
    count: () => ({ result: lsKeysFor(store).length })
  };
  return Promise.resolve(fn(fake).result);
}

/* ---------- Public API ---------- */
export const db = {
  get: (store, id) => run(store, 'readonly', (s) => s.get(id)),
  getAll: (store) => run(store, 'readonly', (s) => s.getAll()),
  put: (store, value) => run(store, 'readwrite', (s) => s.put(value)),
  putMany: (store, values) => run(store, 'readwrite', (s) => { values.forEach((v) => s.put(v)); return null; }),
  remove: (store, id) => run(store, 'readwrite', (s) => s.delete(id)),
  clear: (store) => run(store, 'readwrite', (s) => s.clear()),
  count: (store) => run(store, 'readonly', (s) => s.count()),
  async clearAll() { for (const s of STORES) await this.clear(s); },
  async isLocalMode() { await openDB(); return localMode; },

  /** Best-effort storage information for the Settings page. */
  async storageInfo() {
    const info = { quota: null, usage: null, persisted: null, localMode: await this.isLocalMode() };
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();
        info.quota = est.quota ?? null; info.usage = est.usage ?? null;
      }
      if (navigator.storage && navigator.storage.persisted) info.persisted = await navigator.storage.persisted();
    } catch { /* ignore */ }
    return info;
  },

  /** Ask the browser not to evict our data under storage pressure. */
  async requestPersist() {
    try {
      if (navigator.storage && navigator.storage.persist) return await navigator.storage.persist();
    } catch { /* ignore */ }
    return false;
  }
};
