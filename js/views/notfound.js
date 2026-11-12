/* Fallback view for unknown routes and view load errors. */
import { h, icon } from '../ui/dom.js';

export const title = 'Not found';

export async function render(el, ctx) {
  const isError = !!ctx.error;
  el.append(
    h('header', { class: 'page-head' }, h('h1', null, isError ? 'Something went wrong' : 'Page not found')),
    h('div', { class: `notice ${isError ? 'notice-err' : ''}` }, icon('info'),
      h('div', null,
        h('p', null, isError
          ? 'This screen could not be loaded. If you are offline, it may not be cached yet; reconnect once and try again.'
          : `There is no page at “${location.hash}”.`),
        isError && ctx.error?.message ? h('p', { class: 'small muted' }, h('code', null, ctx.error.message)) : null
      )),
    h('div', { class: 'btn-row' },
      h('a', { class: 'btn btn-primary', href: '#/home' }, 'Go home'),
      isError ? h('button', { class: 'btn', type: 'button', onClick: () => location.reload() }, 'Try again') : null
    )
  );
}
