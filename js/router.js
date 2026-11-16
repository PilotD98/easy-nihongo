/* Hash router. Routes look like #/learn/hiragana?group=ka.
   Each view module exports { title, render(container, ctx) } and may return a
   cleanup function. Views are lazy-loaded (and precached by the service worker). */

const routes = {
  home: () => import('./views/home.js'),
  learn: () => import('./views/learn.js'),
  review: () => import('./views/review.js'),
  speak: () => import('./views/speak.js'),
  read: () => import('./views/read.js'),
  progress: () => import('./views/progress.js'),
  settings: () => import('./views/settings.js'),
  about: () => import('./views/about.js'),
  lesson: () => import('./views/lesson.js'),
  unit: () => import('./views/unit.js'),
  placement: () => import('./views/placement.js'),
  mock: () => import('./views/mock.js'),
  exam: () => import('./views/exam.js'),
  guides: () => import('./views/guides.js')
};

let cleanup = null;
let renderSeq = 0;
let container = null;

export function parseHash(hash = location.hash) {
  const raw = hash.replace(/^#\/?/, '');
  const [pathPart, query = ''] = raw.split('?');
  const segs = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  const params = Object.fromEntries(new URLSearchParams(query));
  return { route: segs[0] || 'home', segs, params };
}

export function navigate(path, { replace = false } = {}) {
  const hash = path.startsWith('#') ? path : `#/${path.replace(/^\//, '')}`;
  if (replace) history.replaceState(null, '', hash);
  else location.hash = hash;
  if (replace) render();
}

export function currentRoute() { return parseHash().route; }

function setActiveNav(route) {
  document.querySelectorAll('[data-route]').forEach((a) => {
    if (a.dataset.route === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

async function render() {
  const seq = ++renderSeq;
  const ctx = parseHash();
  const loader = routes[ctx.route];
  container.setAttribute('aria-busy', 'true');
  container.dataset.route = ctx.route === 'learn' && ctx.segs[1] === 'item' ? 'item' : ctx.route;
  let mod;
  try {
    mod = loader ? await loader() : await import('./views/notfound.js');
  } catch (err) {
    console.error(err);
    mod = await import('./views/notfound.js').catch(() => null);
    ctx.error = err;
  }
  if (seq !== renderSeq) return; // a newer navigation won

  if (typeof cleanup === 'function') { try { cleanup(); } catch (e) { console.error(e); } }
  cleanup = null;
  container.replaceChildren();
  window.scrollTo(0, 0);

  try {
    const result = mod ? await mod.render(container, { ...ctx, navigate }) : null;
    if (seq !== renderSeq) return;
    if (typeof result === 'function') cleanup = result;
  } catch (err) {
    console.error(err);
    container.replaceChildren();
    const nf = await import('./views/notfound.js');
    await nf.render(container, { ...ctx, navigate, error: err });
  }
  document.title = mod && mod.title ? `${mod.title} · Easy Nihongo` : 'Easy Nihongo';
  setActiveNav(ctx.route);
  container.setAttribute('aria-busy', 'false');

  // Move focus to the page heading for screen-reader and keyboard users.
  const heading = container.querySelector('h1');
  if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  else container.focus({ preventScroll: true });
}

export function startRouter(el) {
  container = el;
  if (!location.hash) history.replaceState(null, '', '#/home');
  window.addEventListener('hashchange', render);
  return render();
}
