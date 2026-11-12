/* App entry point: load settings, start the router, register the service
   worker, wire global UI (offline badge, quick lookup, keyboard shortcuts). */
import { settings } from './store/settings.js';
import { startRouter } from './router.js';
import { toast } from './ui/toast.js';
import { openSearch } from './ui/search.js';
import { showShortcuts } from './ui/shortcuts.js';
import { onConnectivity } from './util/platform.js';

async function boot() {
  try { await settings.load(); }
  catch (err) { console.error('Settings failed to load; using defaults.', err); settings.apply(); }

  await startRouter(document.getElementById('view'));

  // Offline badge
  const badge = document.getElementById('offline-badge');
  onConnectivity((online) => { badge.hidden = online; });

  // Quick lookup
  document.getElementById('search-btn').addEventListener('click', openSearch);
  document.addEventListener('keydown', onGlobalKey);

  registerServiceWorker();
}

function onGlobalKey(e) {
  const t = e.target;
  const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
  if (document.querySelector('dialog[open]')) return;
  if (!typing && e.key === '/') { e.preventDefault(); openSearch(); }
  else if (!typing && e.key === '?') { e.preventDefault(); showShortcuts(); }
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  // Only register over https or localhost; file:// previews skip the worker.
  if (!(location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) return;
  const register = async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      // A new version is waiting: offer to reload.
      const offerUpdate = (worker) => {
        toast('A new version of Kotoba Path is ready.', {
          sticky: true,
          action: { label: 'Reload', onClick: () => worker.postMessage({ type: 'SKIP_WAITING' }) }
        });
      };
      if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(nw);
        });
      });
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        location.reload();
      });
    } catch (err) {
      console.warn('Service worker registration failed', err);
    }
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}

boot();
