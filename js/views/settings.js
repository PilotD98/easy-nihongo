/* Settings: appearance, script support, study plan, app, data, help.
   Every change saves immediately to the device. */
import { h, icon, jp, formatBytes, formatDate } from '../ui/dom.js';
import { settings, OPTIONS } from '../store/settings.js';
import { db } from '../store/db.js';
import { downloadExport, readBackupFile, validateImport, applyImport, clearAllData } from '../store/backup.js';
import { toast } from '../ui/toast.js';
import { openSheet, confirm } from '../ui/dialog.js';
import { showShortcuts } from '../ui/shortcuts.js';
import { offlineStatus, downloadAllContent } from '../content/loader.js';
import { listProfiles, activeProfileId, createProfile, renameProfile, switchProfile, deleteProfile } from '../store/profiles.js';
import { APP_VERSION, canPromptInstall, promptInstall, isStandalone, isIOS, onInstallAvailable, supports } from '../util/platform.js';

export const title = 'Settings';

export async function render(el, ctx) {
  el.append(
    h('header', { class: 'page-head' }, h('h1', null, 'Settings'), h('p', { class: 'lede' }, 'Everything here is stored on this device only.')),

    group('Appearance', [
      segField('Theme', 'theme'),
      segField('Text size', 'fontSize', 'Japanese text is always shown a little larger than English.'),
      selectField('Japanese font', 'jpFont', h('span', null, 'Sample: ', jp('言葉の道を歩く'), ' — recognising kanji across fonts matters, so try both.')),
      segField('Motion', 'motion', 'Reduced motion turns off animations.')
    ]),

    group('Script support', [
      selectField('Romaji', 'romaji', 'Romaji is a temporary support, not a goal. “Automatic” fades it per character as you master each kana.'),
      selectField('Furigana', 'furigana', '“Automatic” shows readings above kanji until each one is mastered, then hides them (tap to reveal).')
    ]),

    group('Study plan', [
      stepperField('New items per day', 'dailyNew', 1, 50, 1, 'Eases off automatically when your accuracy drops.'),
      stepperField('Review cap per day', 'dailyReviewCap', 20, 500, 10, 'Reviews beyond the cap are spread over the following days.'),
      segField('Audio speed', 'audioRate'),
      switchField('Play audio automatically', 'autoplayAudio')
    ]),

    group('App', [appCard()]),
    group('Profiles', [profilesCard()]),
    group('Data', [await dataCard(ctx), await offlineCard()]),
    group('Help', [
      h('div', { class: 'btn-row' },
        h('a', { class: 'btn', href: '#/placement' }, 'Placement test'),
        h('button', { class: 'btn', type: 'button', onClick: showShortcuts }, 'Keyboard shortcuts'),
        h('a', { class: 'btn', href: '#/about' }, 'About & credits')
      )
    ])
  );
  if (location.hash.endsWith('#data')) {
    const target = el.querySelector('#data');
    if (target) setTimeout(() => target.scrollIntoView({ block: 'start' }), 50);
  }
}

/* ---------- field builders ---------- */
function group(titleText, children) {
  const id = `sg-${titleText.toLowerCase().replace(/\W+/g, '-')}`;
  return h('section', { class: 'settings-group', 'aria-labelledby': id }, h('h2', { id }, titleText), children);
}

function segField(label, key, hint) {
  const name = `seg-${key}`;
  const current = String(settings.get(key));
  const seg = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': label },
    OPTIONS[key].map(([value, text]) => h('label', null,
      h('input', { type: 'radio', name, value, checked: value === current ? true : null, onChange: () => settings.set(key, coerce(key, value)) }),
      h('span', null, text)
    ))
  );
  return h('div', { class: 'field' }, h('span', { class: 'label' }, label), seg, hint ? h('span', { class: 'hint' }, hint) : null);
}

function selectField(label, key, hint) {
  const id = `sel-${key}`;
  const current = String(settings.get(key));
  const sel = h('select', { class: 'select', id, onChange: (e) => settings.set(key, coerce(key, e.target.value)) },
    OPTIONS[key].map(([value, text]) => h('option', { value, selected: value === current ? true : null }, text)));
  return h('div', { class: 'field' }, h('label', { for: id }, label), sel, hint ? h('span', { class: 'hint' }, hint) : null);
}

function stepperField(label, key, min, max, step, hint) {
  const out = h('output', { 'aria-live': 'polite' }, String(settings.get(key)));
  const update = async (delta) => {
    const next = Math.min(max, Math.max(min, Number(settings.get(key)) + delta));
    await settings.set(key, next);
    out.textContent = String(next);
  };
  return h('div', { class: 'field' },
    h('span', { class: 'label', id: `lbl-${key}` }, label),
    h('div', { class: 'stepper', role: 'group', 'aria-labelledby': `lbl-${key}` },
      h('button', { type: 'button', 'aria-label': `Decrease ${label}`, onClick: () => update(-step) }, '−'),
      out,
      h('button', { type: 'button', 'aria-label': `Increase ${label}`, onClick: () => update(step) }, '+')
    ),
    hint ? h('span', { class: 'hint' }, hint) : null
  );
}

function switchField(label, key) {
  const id = `sw-${key}`;
  return h('label', { class: 'switch field', for: id },
    h('span', null, label),
    h('input', { type: 'checkbox', id, role: 'switch', checked: settings.get(key) ? true : null, onChange: (e) => settings.set(key, e.target.checked) })
  );
}

function coerce(key, value) {
  if (key === 'audioRate') return Number(value);
  return value;
}

/* ---------- App card ---------- */
function appCard() {
  const sup = supports();
  const installRow = h('div', { class: 'row' });
  const renderInstall = () => {
    installRow.replaceChildren();
    if (isStandalone()) installRow.append(h('span', { class: 'muted' }, 'Installed as an app on this device.'));
    else if (canPromptInstall()) installRow.append(h('span', { class: 'grow' }, 'Install for full-screen, offline study.'), h('button', { class: 'btn', type: 'button', onClick: async () => { const r = await promptInstall(); if (r === 'accepted') renderInstall(); } }, icon('install'), 'Install app'));
    else if (isIOS()) installRow.append(h('span', null, 'To install on iPhone or iPad: tap Share in Safari, then “Add to Home Screen”.'));
    else installRow.append(h('span', null, 'To install: use your browser’s menu and choose “Install app” or “Add to Home screen”.'));
  };
  renderInstall();
  onInstallAvailable(renderInstall);

  return h('div', { class: 'card' },
    installRow,
    h('hr'),
    h('div', { class: 'small muted' },
      h('div', null, `Version ${APP_VERSION}`),
      h('div', null, `Offline support: ${sup.serviceWorker ? 'available' : 'not available in this browser'}`)
    )
  );
}

/* ---------- Data card ---------- */
async function dataCard(ctx) {
  const info = await db.storageInfo();
  const [progressCount, dayCount] = await Promise.all([db.count('progress'), db.count('days')]);

  const fileInput = h('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only', 'aria-label': 'Choose a backup file', onChange: (e) => onImportFile(e.target.files?.[0], ctx) });

  const storageLine = info.localMode
    ? 'IndexedDB is unavailable here, so data is kept in localStorage (smaller, but works).'
    : `Using ${formatBytes(info.usage)}${info.quota ? ` of ${formatBytes(info.quota)} available` : ''}.`;

  const persistBtn = info.persisted === false
    ? h('button', { class: 'btn', type: 'button', onClick: async (e) => {
        const ok = await db.requestPersist();
        toast(ok ? 'The browser will keep your data even under storage pressure.' : 'The browser declined. Installing the app usually grants this automatically.');
        if (ok) e.currentTarget.remove();
      } }, 'Keep data persistent')
    : null;

  return h('div', { class: 'card', id: 'data' },
    h('p', null, `${progressCount} progress record${progressCount === 1 ? '' : 's'}, ${dayCount} study day${dayCount === 1 ? '' : 's'}. `, h('span', { class: 'muted' }, storageLine)),
    info.persisted === true ? h('p', { class: 'small muted' }, 'Storage is marked persistent.') : null,
    h('div', { class: 'btn-row' },
      h('button', { class: 'btn', type: 'button', onClick: async () => { const name = await downloadExport(); toast(`Saved ${name}`); } }, icon('download'), 'Export backup'),
      h('button', { class: 'btn', type: 'button', onClick: () => fileInput.click() }, icon('upload'), 'Import backup'),
      persistBtn
    ),
    fileInput,
    h('hr'),
    h('div', { class: 'row' },
      h('span', { class: 'grow small muted' }, 'Delete all progress, study history and settings from this device.'),
      h('button', { class: 'btn btn-danger', type: 'button', onClick: () => onClear(ctx) }, icon('trash'), 'Clear all data')
    )
  );
}

function profilesCard() {
  const card = h('div', { class: 'card', id: 'profiles' });
  const nameSheet = (title, initial, onSave) => {
    const input = h('input', { type: 'text', class: 'input', value: initial || '', maxlength: 40, autocomplete: 'off', 'aria-label': 'Profile name', placeholder: 'Name' });
    const sheet = openSheet({ title, body: h('div', null, h('label', { class: 'field' }, h('span', { class: 'field-label' }, 'Profile name'), input)),
      actions: [{ label: 'Cancel' }, { label: 'Save', primary: true, onClick: () => { const v = input.value.trim(); if (!v) { input.focus(); return false; } onSave(v); } }] });
    setTimeout(() => input.focus(), 50);
    return sheet;
  };
  const rebuild = () => {
    const active = activeProfileId();
    const list = listProfiles();
    card.replaceChildren(
      h('p', { class: 'small muted' }, 'Each profile keeps its own progress, settings and backups on this device. Switching reloads the app. Nothing is shared between profiles and nothing leaves the device.'),
      h('ul', { class: 'profile-list', 'aria-label': 'Profiles' }, list.map((p) => h('li', { class: 'row' },
        h('span', { class: 'grow' }, p.name, p.id === active ? h('span', { class: 'pill', style: { marginLeft: '8px' } }, 'Active') : null),
        p.id === active ? null : h('button', { class: 'btn', type: 'button', onClick: () => { switchProfile(p.id); location.hash = '#/home'; location.reload(); } }, 'Switch'),
        h('button', { class: 'icon-btn', type: 'button', 'aria-label': `Rename ${p.name}`, onClick: () => nameSheet('Rename profile', p.name, (v) => { renameProfile(p.id, v); rebuild(); }) }, icon('edit')),
        p.id === active ? null : h('button', { class: 'icon-btn', type: 'button', 'aria-label': `Delete ${p.name}`, onClick: async () => {
          const ok = await confirm({ title: `Delete ${p.name}?`, body: "This deletes that profile's progress, study history and settings from this device. It cannot be undone.", confirmLabel: 'Delete profile', danger: true });
          if (!ok) return; await deleteProfile(p.id); toast(`Deleted ${p.name}.`); rebuild();
        } }, icon('trash'))
      ))),
      h('div', { class: 'btn-row' }, h('button', { class: 'btn', type: 'button', onClick: () => nameSheet('New profile', '', (v) => { createProfile(v); toast(`Added ${v}. Switch to it from this list.`); rebuild(); }) }, icon('plus'), 'Add profile'))
    );
  };
  rebuild();
  return card;
}

async function offlineCard() {
  const status = await offlineStatus();
  const line = h('p', { class: 'small muted' });
  const describe = (st) => { line.textContent = !st.supported ? 'This browser cannot store content for offline use.' : st.stored >= st.total ? `All ${st.total} content files are stored on this device.` : `${st.stored} of ${st.total} content files stored. Kana and N5 are always kept; higher levels are stored when you first open them, or all at once here (about 5 MB).`; };
  describe(status);
  const btn = h('button', { class: 'btn', type: 'button', disabled: !status.supported || status.stored >= status.total ? true : null, onClick: async () => {
    btn.disabled = true;
    const label = btn.querySelector('span');
    try {
      const res = await downloadAllContent((done, total) => { label.textContent = `Downloading… ${done} / ${total}`; });
      describe(await offlineStatus());
      label.textContent = 'Download all levels';
      toast(res.failed.length ? `${res.failed.length} file(s) could not be downloaded. Try again when online.` : 'Every level is now available offline.');
      if (res.failed.length) btn.disabled = false;
    } catch (err) { label.textContent = 'Download all levels'; btn.disabled = false; toast(`Download failed: ${err.message}`); }
  } }, icon('download'), h('span', null, 'Download all levels'));
  return h('div', { class: 'card', id: 'offline', 'aria-live': 'polite' },
    h('h3', null, 'Offline content'),
    line,
    h('div', { class: 'btn-row' }, btn));
}

async function onImportFile(file, ctx) {
  if (!file) return;
  let obj;
  try { obj = await readBackupFile(file); }
  catch (err) { toast(err.message); return; }
  const check = validateImport(obj);
  if (!check.ok) {
    openSheet({ title: 'Cannot import this file', body: h('ul', null, check.errors.map((e) => h('li', null, e))) });
    return;
  }
  const s = check.summary;
  let mode = 'replace';
  const body = h('div', null,
    h('p', null, `Backup from ${s.exportedAt ? formatDate(s.exportedAt, { dateStyle: 'medium', timeStyle: 'short' }) : 'an unknown date'}${s.appVersion ? ` (app ${s.appVersion})` : ''}: ${s.progress} progress records, ${s.days} study days, ${s.settings} settings.`),
    h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Import mode' },
      h('label', null, h('input', { type: 'radio', name: 'imode', value: 'replace', checked: true, onChange: () => { mode = 'replace'; } }), h('span', null, 'Replace device data')),
      h('label', null, h('input', { type: 'radio', name: 'imode', value: 'merge', onChange: () => { mode = 'merge'; } }), h('span', null, 'Merge (keep newest)'))
    ),
    h('p', { class: 'small muted', style: { marginTop: '12px' } }, 'Replace deletes what is on this device first. Merge keeps the newer record for each item and the larger daily totals.')
  );
  openSheet({
    title: 'Import backup',
    body,
    actions: [
      { label: 'Cancel' },
      { label: 'Import', primary: true, onClick: async () => {
        try {
          await applyImport(obj, { mode });
          toast(`Imported ${s.progress} records (${mode}).`);
          ctx.navigate('settings', { replace: true });
        } catch (err) { toast(`Import failed: ${err.message}`); }
      } }
    ]
  });
}

async function onClear(ctx) {
  const ok = await confirm({
    title: 'Clear all data?',
    body: h('div', null, h('p', null, 'This deletes every progress record, your study history and your settings from this device. It cannot be undone.'), h('p', null, 'Export a backup first if you might want this data back.')),
    confirmLabel: 'Delete everything', danger: true
  });
  if (!ok) return;
  await clearAllData();
  toast('All data cleared.');
  ctx.navigate('settings', { replace: true });
}
