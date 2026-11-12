/* Non-blocking notifications, announced politely to screen readers. */
import { h, icon } from './dom.js';

const region = () => document.getElementById('toast-region');

/**
 * toast('Saved.') or toast('Update ready', { action: { label: 'Reload', onClick } , sticky: true })
 * Returns a function that dismisses the toast.
 */
export function toast(message, { action = null, duration = 5000, sticky = false } = {}) {
  const el = h('div', { class: 'toast', role: 'status' }, h('span', { class: 'grow' }, message));
  let timer = null;
  const dismiss = () => { clearTimeout(timer); if (el.isConnected) el.remove(); };
  if (action) {
    el.append(h('button', { class: 'btn', type: 'button', onClick: () => { action.onClick?.(); dismiss(); } }, action.label));
  }
  el.append(h('button', { class: 'icon-btn toast-close', type: 'button', 'aria-label': 'Dismiss', onClick: dismiss }, icon('close')));
  region().append(el);
  if (!sticky) timer = setTimeout(dismiss, duration);
  return dismiss;
}
