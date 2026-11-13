/* Home: today's plan, where to continue, and first-run setup. */
import { h, append, icon, formatMinutes } from '../ui/dom.js';
import { days } from '../store/days.js';
import { settings } from '../store/settings.js';
import { getManifest } from '../content/loader.js';
import { dailyPlan } from '../engine/scheduler.js';
import { nextStep } from '../content/kana.js';
import { canPromptInstall, promptInstall, isStandalone, isIOS, onInstallAvailable } from '../util/platform.js';
import { toast } from '../ui/toast.js';
import { progress } from '../store/progress.js';
import { placementDone } from '../engine/placement.js';

export const title = 'Today';

function greeting() {
  const hr = new Date().getHours();
  if (hr < 5) return 'Good night';
  if (hr < 12) return 'Good morning';
  if (hr < 18) return 'Good afternoon';
  return 'Good evening';
}

export async function render(el) {
  const [plan, streak, manifest, step, itemCount, placed] = await Promise.all([
    dailyPlan(), days.streak(), getManifest().catch(() => null), nextStep().catch(() => null), progress.count(), placementDone()
  ]);
  const today = plan.today;
  const dateLine = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  append(el, [
    h('header', { class: 'page-head' },
      h('h1', null, `${greeting()}.`),
      h('p', { class: 'lede' }, dateLine)),

    h('section', { class: 'card', 'aria-labelledby': 'plan-h' },
      h('div', { class: 'card-title' }, h('h2', { id: 'plan-h' }, "Today's plan"),
        h('span', { class: 'pill', title: 'Missing a day never costs you anything.' }, `${streak}-day streak`)),
      h('div', { class: 'stat-grid' },
        stat(plan.due, 'Reviews due'),
        stat(plan.newLeft, 'New items left'),
        stat(formatMinutes(today.seconds), 'Studied today')),
      h('div', { class: 'btn-row', style: { marginTop: '16px' } },
        h('a', { class: `btn btn-primary ${plan.due ? '' : 'is-disabled'}`, href: '#/review?start=1', 'aria-disabled': plan.due ? null : 'true', onClick: (e) => { if (!plan.due) { e.preventDefault(); toast('Nothing is due for review right now.'); } } }, icon('review'), `Start reviews${plan.due ? ` (${plan.due})` : ''}`),
        step ? h('a', { class: `btn ${plan.due ? '' : 'btn-primary'}`, href: step.href }, icon('learn'), step.label) : h('a', { class: 'btn', href: '#/learn' }, icon('learn'), 'Continue learning')),
      step?.sub ? h('p', { class: 'small muted', style: { marginTop: '8px', marginBottom: 0 } }, step.sub) : null,
      h('p', { class: 'small muted', style: { marginTop: '12px', marginBottom: 0 } },
        plan.eased
          ? `Your recent accuracy is ${Math.round(plan.accuracy * 100)}%, so today's new-item goal is eased to ${plan.newAllowance}. Reviews come first.`
          : `Your daily goal is ${plan.newAllowance} new items plus everything due. Adjust it in Settings.`),
      plan.capped ? h('p', { class: 'small muted', style: { marginTop: '8px', marginBottom: 0 } }, `${plan.capped} more reviews wait for tomorrow (daily cap).`) : null),

    itemCount === 0 && !placed && !settings.get('onboarded') ? h('section', { class: 'card card-accent', 'aria-labelledby': 'place-h' },
      h('h2', { id: 'place-h' }, 'Already know some Japanese?'),
      h('p', null, 'A short placement check lets you skip hiragana, katakana or part of N5. It is optional; starting from zero is the default.'),
      h('div', { class: 'btn-row' }, h('a', { class: 'btn', href: '#/placement' }, 'Take the placement check'))) : null,
    setupCard()
  ]);

  if (manifest && manifest.note) el.append(h('p', { class: 'small muted' }, manifest.note));
}

function stat(value, label) {
  return h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(value)), h('div', { class: 'stat-label' }, label));
}

function setupCard() {
  if (settings.get('onboarded')) return null;
  const list = h('ul', { class: 'stack', style: { listStyle: 'none', padding: 0 } });

  if (!isStandalone()) {
    const row = h('li', { class: 'row' });
    const describe = () => {
      row.replaceChildren();
      if (canPromptInstall()) {
        row.append(h('span', { class: 'grow' }, 'Install Kotoba Path for full-screen, offline study.'),
          h('button', { class: 'btn', type: 'button', onClick: async () => { const r = await promptInstall(); if (r === 'accepted') toast('Installed. Open it from your home screen or app list.'); } }, icon('install'), 'Install'));
      } else if (isIOS()) {
        row.append(h('span', null, 'Install on iPhone or iPad: tap the Share button in Safari, then ', h('strong', null, 'Add to Home Screen'), '.'));
      } else {
        row.append(h('span', null, 'Install the app from your browser menu (look for “Install app” or “Add to Home screen”) for full-screen, offline study.'));
      }
    };
    describe();
    onInstallAvailable(describe);
    list.append(row);
  }

  list.append(
    h('li', { class: 'row' }, h('span', { class: 'grow' }, 'Pick a comfortable text size and Japanese font.'), h('a', { class: 'btn', href: '#/settings' }, 'Settings')),
    h('li', { class: 'row' }, h('span', { class: 'grow' }, 'Check that this device can speak Japanese; lessons use audio.'), h('a', { class: 'btn', href: '#/speak' }, 'Speak')),
    h('li', { class: 'row' }, h('span', { class: 'grow' }, 'Your progress stays on this device. Back it up any time as a JSON file.'), h('a', { class: 'btn', href: '#/settings#data' }, 'Backup'))
  );

  const card = h('section', { class: 'card', 'aria-labelledby': 'setup-h' },
    h('div', { class: 'card-title' }, h('h2', { id: 'setup-h' }, 'Get set up'),
      h('button', { class: 'btn', type: 'button', onClick: async () => { await settings.set('onboarded', true); card.remove(); } }, 'Done')),
    list
  );
  return card;
}
