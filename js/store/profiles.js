/* Local profiles: several people (or one person with several tracks) sharing
   one device and browser. Each profile owns its own IndexedDB database (or
   localStorage namespace), settings and backups; nothing is shared between
   them and nothing leaves the device.

   The registry lives in localStorage under 'kp:profiles':
     { active: 'default', list: [{ id, name, created }] }
   The first profile keeps the original database name so data saved before
   profiles existed is kept. Switching profiles reloads the page, which is the
   simplest way to drop every in-memory cache. */

const KEY = 'kp:profiles';
const DEFAULT_ID = 'default';
const BASE_DB = 'kotoba-path';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const reg = JSON.parse(raw);
      if (reg && Array.isArray(reg.list) && reg.list.length) return reg;
    }
  } catch { /* fall through */ }
  return { active: DEFAULT_ID, list: [{ id: DEFAULT_ID, name: 'Me', created: Date.now() }] };
}

function write(reg) {
  try { localStorage.setItem(KEY, JSON.stringify(reg)); } catch { /* storage unavailable; profiles are then session-only */ }
}

export function listProfiles() { return read().list.slice(); }

export function activeProfileId() {
  const reg = read();
  return reg.list.some((p) => p.id === reg.active) ? reg.active : reg.list[0].id;
}

export function activeProfile() {
  const id = activeProfileId();
  return read().list.find((p) => p.id === id);
}

/** IndexedDB database name (and localStorage prefix) for a profile. */
export function dbNameFor(id = activeProfileId()) { return id === DEFAULT_ID ? BASE_DB : `${BASE_DB}--${id}`; }

/** localStorage key that mirrors appearance settings for the pre-paint script. */
export function appearanceKeyFor(id = activeProfileId()) { return id === DEFAULT_ID ? 'kp:appearance' : `kp:appearance:${id}`; }

export function createProfile(name) {
  const reg = read();
  const clean = (name || '').trim().slice(0, 40) || `Profile ${reg.list.length + 1}`;
  const id = `p-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  reg.list.push({ id, name: clean, created: Date.now() });
  write(reg);
  return id;
}

export function renameProfile(id, name) {
  const reg = read();
  const p = reg.list.find((x) => x.id === id);
  if (!p) return false;
  p.name = (name || '').trim().slice(0, 40) || p.name;
  write(reg);
  return true;
}

/** Make `id` the active profile. The caller reloads the page afterwards. */
export function switchProfile(id) {
  const reg = read();
  if (!reg.list.some((p) => p.id === id)) return false;
  reg.active = id;
  write(reg);
  return true;
}

/** Delete a profile and everything it stored. The active profile cannot be deleted. */
export async function deleteProfile(id) {
  const reg = read();
  if (id === activeProfileId() || reg.list.length < 2) return false;
  reg.list = reg.list.filter((p) => p.id !== id);
  write(reg);
  const dbName = dbNameFor(id);
  await new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') { resolve(); return; }
    let req;
    try { req = indexedDB.deleteDatabase(dbName); } catch { resolve(); return; }
    req.onsuccess = req.onerror = req.onblocked = () => resolve();
  });
  try {
    const prefix = `kp:db:${dbName}:`;
    const gone = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(prefix)) gone.push(k); }
    gone.forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem(appearanceKeyFor(id));
  } catch { /* ignore */ }
  return true;
}
