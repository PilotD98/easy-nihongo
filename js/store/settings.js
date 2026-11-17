/* User settings. Stored in the `settings` store as { id, value }.
   Appearance settings are mirrored to localStorage ('kp:appearance') so the
   inline script in index.html can apply them before first paint. */
import { db } from './db.js';
import { appearanceKeyFor } from './profiles.js';

export const DEFAULTS = Object.freeze({
  // Appearance
  theme: 'system',        // system | light | dark
  fontSize: 'medium',     // small | medium | large | xlarge
  jpFont: 'sans',         // sans | serif
  motion: 'system',       // system | reduce | full
  // Script scaffolding (per-item automatic levels can be overridden here)
  romaji: 'auto',         // auto | always | never
  furigana: 'auto',       // auto | always | never
  // Study plan
  dailyNew: 10,           // new items per day
  dailyReviewCap: 100,    // max reviews scheduled per day; the rest spill to later days
  audioRate: 1.0,         // 0.7 | 1.0
  voice: '',              // name of a speechSynthesis voice; '' = best available
  autoplayAudio: true,
  // Flags
  onboarded: false
});

export const OPTIONS = Object.freeze({
  theme: [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']],
  fontSize: [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large'], ['xlarge', 'Extra large']],
  jpFont: [['sans', 'Sans (Noto Sans JP)'], ['serif', 'Textbook serif (Noto Serif JP)']],
  motion: [['system', 'System'], ['reduce', 'Reduced'], ['full', 'Full']],
  romaji: [['auto', 'Automatic (recommended)'], ['always', 'Always show romaji'], ['never', 'Never show romaji (Japanese only)']],
  furigana: [['auto', 'Automatic (recommended)'], ['always', 'Always show furigana'], ['never', 'Never show furigana']],
  audioRate: [['0.7', '0.7× (slow)'], ['1', '1.0× (natural)']]
});

const state = { ...DEFAULTS };
let loaded = false;

export const settings = {
  async load() {
    const rows = await db.getAll('settings');
    for (const row of rows || []) {
      if (row && row.id in DEFAULTS) state[row.id] = row.value;
    }
    loaded = true;
    this.apply();
    return { ...state };
  },
  get(key) { return state[key]; },
  all() { return { ...state }; },
  isLoaded() { return loaded; },
  async set(key, value) {
    if (!(key in DEFAULTS)) throw new Error(`Unknown setting: ${key}`);
    state[key] = value;
    await db.put('settings', { id: key, value });
    this.apply();
    window.dispatchEvent(new CustomEvent('kp:settings', { detail: { key, value } }));
  },
  async setMany(obj) {
    for (const [k, v] of Object.entries(obj)) {
      if (k in DEFAULTS) { state[k] = v; await db.put('settings', { id: k, value: v }); }
    }
    this.apply();
    window.dispatchEvent(new CustomEvent('kp:settings', { detail: { key: null, value: null } }));
  },
  async resetToDefaults() {
    await db.clear('settings');
    Object.assign(state, DEFAULTS);
    this.apply();
    window.dispatchEvent(new CustomEvent('kp:settings', { detail: { key: null, value: null } }));
  },
  /** Push appearance settings onto <html> and mirror them for the pre-paint script. */
  apply() {
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root.dataset.fontSize = state.fontSize;
    root.dataset.jpFont = state.jpFont;
    root.dataset.motion = state.motion;
    try {
      localStorage.setItem(appearanceKeyFor(), JSON.stringify({
        theme: state.theme, fontSize: state.fontSize, jpFont: state.jpFont, motion: state.motion
      }));
    } catch { /* storage may be unavailable; harmless */ }
  }
};
