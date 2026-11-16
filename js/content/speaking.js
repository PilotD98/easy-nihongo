/* Speaking content: loads data/speaking.json and indexes its sets. */
import { loadLevel } from './loader.js';
import { isUnlocked } from './kana.js';

let cache = null;

export async function loadSpeaking() {
  if (!cache) {
    cache = Promise.all([loadLevel('speaking'), loadLevel('situations').catch(() => null)]).then(([base, real]) => {
      const data = base.data.speaking;
      const sets = [...data.sets, ...(real?.data?.speaking?.sets || [])];
      const setsById = new Map(sets.map((s) => [s.id, s]));
      return { data, sets, setsById };
    });
    cache.catch(() => { cache = null; });
  }
  return cache;
}

export const LEVEL_LABEL = Object.freeze({ kana: 'from hiragana', katakana: 'after katakana', n5: 'after katakana', n4: 'from N4', n3: 'from N3', n2: 'from N2', n1: 'from N1' });

export const MODES = Object.freeze({
  situations: { title: 'Real-world situations', blurb: 'Airport, trains, shops, restaurants, hotels, the pharmacy, friends and colleagues: role-plays, shadowing of natural speech, and the questions you will be asked.', icon: 'read' },
  repeat: { title: 'Repeat after me', blurb: 'Listen, then say it. Mora-level feedback shows which beats landed.', icon: 'speak' },
  shadow: { title: 'Shadowing', blurb: 'Speak along with the audio, slow first, then at natural speed.', icon: 'review' },
  question: { title: 'Answer a question', blurb: 'Hear a question, answer out loud, compare with a model answer.', icon: 'info' },
  roleplay: { title: 'Role-play', blurb: 'Short dialogues: ordering, directions, introductions. The app plays the other person.', icon: 'read' }
});

/** Sets grouped by mode, each flagged with whether its level is unlocked. */
export async function speakingMenu() {
  const { sets } = await loadSpeaking();
  const out = {};
  for (const s of sets) {
    const unlocked = await isUnlocked(s.level || 'kana');
    const key = s.group === 'situations' ? 'situations' : s.mode;
    (out[key] = out[key] || []).push({ ...s, unlocked });
  }
  return out;
}

/** Normalise a set into a list of practice steps the session view can run. */
export function stepsFor(set) {
  if (set.mode === 'roleplay') return set.turns.map((t, i) => ({ ...t, id: `${set.id}:${i + 1}`, kind: t.who === 'you' ? 'say' : 'listen' }));
  if (set.mode === 'question') return set.items.map((it) => ({ ...it, kind: 'answer', jp: it.model, romaji: it.modelRomaji }));
  return set.items.map((it) => ({ ...it, kind: set.mode === 'shadow' ? 'shadow' : 'say' }));
}
