/* FSRS (Free Spaced Repetition Scheduler), v5 formulas with the published
   default weights. Pure functions: they take a progress record and return a
   new one; nothing here touches storage.

   States: 0 new, 1 learning, 2 review, 3 relearning.
   Ratings: 1 Again, 2 Hard, 3 Good, 4 Easy. */

export const Rating = Object.freeze({ Again: 1, Hard: 2, Good: 3, Easy: 4 });
export const State = Object.freeze({ New: 0, Learning: 1, Review: 2, Relearning: 3 });

export const W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192,
  1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
const DECAY = -0.5;
const FACTOR = Math.pow(0.9, 1 / DECAY) - 1; // 19/81

export const DEFAULTS = Object.freeze({
  retention: 0.9,           // desired recall probability at review time
  maxInterval: 365,         // days
  learningSteps: [1, 10],   // minutes, for new cards
  relearningSteps: [10]     // minutes, after a lapse
});

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const MIN = 60_000, DAY = 86_400_000;

export function retrievability(elapsedDays, stability) {
  if (!stability || stability <= 0) return 0;
  return Math.pow(1 + FACTOR * elapsedDays / stability, DECAY);
}

export function intervalFor(stability, retention = DEFAULTS.retention, maxInterval = DEFAULTS.maxInterval) {
  const days = (stability / FACTOR) * (Math.pow(retention, 1 / DECAY) - 1);
  return clamp(Math.round(days), 1, maxInterval);
}

function initStability(g) { return Math.max(W[g - 1], 0.1); }
function initDifficulty(g) { return clamp(W[4] - Math.exp(W[5] * (g - 1)) + 1, 1, 10); }
function nextDifficulty(d, g) {
  const delta = -W[6] * (g - 3);
  const dPrime = d + delta * ((10 - d) / 9);
  return clamp(W[7] * initDifficulty(4) + (1 - W[7]) * dPrime, 1, 10);
}
function stabilityAfterRecall(d, s, r, g) {
  const hard = g === Rating.Hard ? W[15] : 1;
  const easy = g === Rating.Easy ? W[16] : 1;
  return s * (Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy + 1);
}
function stabilityAfterLapse(d, s, r) {
  const sf = W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r));
  return Math.min(sf, s);
}
function stabilityShortTerm(s, g) {
  return s * Math.exp(W[17] * (g - 3 + W[18]));
}

/**
 * Schedule a record after a rating. Returns a new record.
 * Extra fields used on the record: `step` (index into learning steps),
 * `wrong` (count of Again answers, for the most-missed list).
 */
export function schedule(rec, rating, now = new Date(), opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const nowMs = now.getTime();
  const next = { ...rec };
  const g = clamp(rating, 1, 4);
  const elapsedDays = rec.lastReview ? Math.max(0, (nowMs - Date.parse(rec.lastReview)) / DAY) : 0;

  const graduate = (stability) => {
    next.state = State.Review;
    next.step = 0;
    const days = intervalFor(stability, o.retention, o.maxInterval);
    next.scheduledDays = days;
    next.due = new Date(nowMs + days * DAY).toISOString();
  };
  const stepTo = (steps, idx, state) => {
    next.state = state;
    next.step = idx;
    next.scheduledDays = 0;
    next.due = new Date(nowMs + steps[idx] * MIN).toISOString();
  };

  if (rec.state === State.New || rec.reps === 0) {
    next.difficulty = initDifficulty(g);
    next.stability = initStability(g);
    if (g === Rating.Easy) graduate(next.stability);
    else if (g === Rating.Good && o.learningSteps.length <= 1) graduate(next.stability);
    else stepTo(o.learningSteps, g === Rating.Good ? 1 : 0, State.Learning);
  } else if (rec.state === State.Learning || rec.state === State.Relearning) {
    const steps = rec.state === State.Learning ? o.learningSteps : o.relearningSteps;
    next.difficulty = nextDifficulty(rec.difficulty, g);
    next.stability = stabilityShortTerm(rec.stability, g);
    const step = rec.step || 0;
    if (g === Rating.Again) { next.wrong = (rec.wrong || 0) + 1; stepTo(steps, 0, rec.state); }
    else if (g === Rating.Hard) stepTo(steps, step, rec.state);
    else if (g === Rating.Good) { if (step + 1 >= steps.length) graduate(next.stability); else stepTo(steps, step + 1, rec.state); }
    else graduate(next.stability);
  } else {
    const r = retrievability(elapsedDays, rec.stability);
    next.difficulty = nextDifficulty(rec.difficulty, g);
    if (g === Rating.Again) {
      next.stability = stabilityAfterLapse(rec.difficulty, rec.stability, r);
      next.lapses = (rec.lapses || 0) + 1;
      next.wrong = (rec.wrong || 0) + 1;
      stepTo(o.relearningSteps, 0, State.Relearning);
    } else {
      next.stability = stabilityAfterRecall(rec.difficulty, rec.stability, r, g);
      graduate(next.stability);
    }
  }

  next.reps = (rec.reps || 0) + 1;
  next.elapsedDays = elapsedDays;
  next.lastReview = now.toISOString();
  next.streak = g === Rating.Again ? 0 : (rec.streak || 0) + 1;
  return next;
}

/** Human-readable next-interval labels for the four rating buttons. */
export function previewIntervals(rec, now = new Date(), opts = {}) {
  const out = {};
  for (const g of [1, 2, 3, 4]) {
    const n = schedule(rec, g, now, opts);
    const ms = Date.parse(n.due) - now.getTime();
    out[g] = formatSpan(ms);
  }
  return out;
}

export function formatSpan(ms) {
  const m = Math.round(ms / MIN);
  if (m < 60) return `${Math.max(1, m)} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} d`;
  const mo = Math.round(d / 30);
  if (mo < 12) return `${mo} mo`;
  return `${(d / 365).toFixed(1)} y`;
}
