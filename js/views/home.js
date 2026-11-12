/* Home: today's plan, the current stage, and first-run setup. */
import { h, append, icon, formatMinutes } from '../ui/dom.js';
import { progress } from '../store/progress.js';
import { days } from '../store/days.js';
import { settings } from '../store/settings.js';
import { getManifest, availableLevels } from '../content/loader.js';
import { canPromptInstall, promptInstall, isStandalone, isIOS, onInstallAvailable } from '../util/platform.js';
import { toast } from '../ui/toast.js';

export const title = 'Today';

function greeting() {
  const hr = new Date().getHours();
  if (hr < 5) return 'Good night';
  if (hr < 12) return 'Good morning';
  if (hr < 18) return 'Good afternoon';
  return 'Good evening';
}

export async function render(el) {
  const [summary, today, streak, manifest, available] = await Promise.all([
    progress.summary(), days.get(), days.streak(),
    getManifest().catch(() => null), availableLevels().catch(() => [])
  ]);
  const dateLine = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  const dailyNew = settings.get('dailyNew');
  const hasContent = available.length > 0;
  const newToday = hasContent ? Math.max(0, dailyNew - today.newItems) : 0;

  append(el, [
    h('header', { class: 'page-head' },
      h('h1', null, `${greeting()}.`),
      h('p', { class: 'lede' }, dateLine)
    ),

    h('section', { class: 'card', 'aria-labelledby': 'plan-h' },
      h('div', { class: 'card-title' }, h('h2', { id: 'plan-h' }, "Today's plan"),
        h('span', { class: 'pill', title: 'Missing a day never costs you anything.' }, `${streak}-day streak`)),
      h('div', { class: 'stat-grid' },
        stat(summary.due, 'Reviews due'),
        stat(newToday, 'New items'),
        stat(formatMinutes(today.seconds), 'Studied today')
      ),
      h('div', { class: 'btn-row', style: { marginTop: '16px' } },
        h('a', { class: `btn btn-primary ${summary.due ? '' : 'is-disabled'}`, href: '#/review', 'aria-disabled': summary.due ? null : 'true', onClick: (e) => { if (!summary.due) { e.preventDefault(); toast('Nothing is due for review right now.'); } } }, icon('review'), 'Start reviews'),
        h('a', { class: 'btn', href: '#/learn' }, icon('learn'), 'Continue learning')
      ),
      h('p', { class: 'small muted', style: { marginTop: '12px', marginBottom: 0 } },
        'Your daily goal is ', String(dailyNew), ' new items plus everything due. Adjust it in Settings.')
    ),

    hasContent ? null : h('section', { class: 'notice', role: 'note' },
      icon('info'),
      h('div', null,
        h('p', null, h('strong', null, 'This is the foundation release. '), 'The app shell, offline mode, settings and data backup are in place. The Hiragana stage is the next release; there is nothing to study yet.'),
        h('p', null, h('a', { href: '#/learn' }, 'See the full learning path'))
      )
    ),

    setupCard()
  ]);

  if (manifest && manifest.note) {
    el.append(h('p', { class: 'small muted' }, manifest.note));
  }
}

function stat(value, label) {
  return h('div', { class: 'stat' }, h('div', { class: 'stat-value' }, String(value)), h('div', { class: 'stat-label' }, label));
}

function setupCard() {
  if (settings.get('onboarded')) return null;
  const list = h('ul', { class: 'stack', style: { listStyle: 'none', padding: 0 } });

  // Install
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
    h('li', { class: 'row' }, h('span', { class: 'grow' }, 'Your progress stays on this device. Back it up any time as a JSON file.'), h('a', { class: 'btn', href: '#/settings#data' }, 'Backup'))
  );

  const card = h('section', { class: 'card', 'aria-labelledby': 'setup-h' },
    h('div', { class: 'card-title' }, h('h2', { id: 'setup-h' }, 'Get set up'),
      h('button', { class: 'btn', type: 'button', onClick: async () => { await settings.set('onboarded', true); card.remove(); } }, 'Done')),
    list
  );
  return card;
}
