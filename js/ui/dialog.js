/* Modal sheets built on the native <dialog> element.
   openSheet({ title, body, actions }) returns { el, close }.
   confirm({...}) resolves true/false. */
import { h, icon } from './dom.js';

export function openSheet({ title, body, actions = [], onClose = null, labelledBy = null }) {
  const previouslyFocused = document.activeElement;
  const titleId = labelledBy || `sheet-${Math.random().toString(36).slice(2, 8)}`;
  const dlg = h('dialog', { class: 'sheet', 'aria-labelledby': titleId });
  const closeBtn = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Close', onClick: () => close() }, icon('close'));
  dlg.append(
    h('div', { class: 'sheet-head' }, h('h2', { id: titleId }, title), closeBtn),
    h('div', { class: 'sheet-body' }, body)
  );
  if (actions.length) {
    dlg.append(h('div', { class: 'sheet-foot' }, actions.map((a) =>
      h('button', {
        class: `btn ${a.primary ? 'btn-primary' : ''} ${a.danger ? 'btn-danger' : ''}`.trim(),
        type: 'button',
        onClick: () => { const r = a.onClick?.(); if (r !== false) close(a.value); }
      }, a.label)
    )));
  }
  let closed = false;
  function close(value) {
    if (closed) return;
    closed = true;
    try { dlg.close(); } catch { /* already closed */ }
    dlg.remove();
    onClose?.(value);
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
  }
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); }); // backdrop click
  document.body.append(dlg);
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open', '');
  return { el: dlg, close };
}

export function confirm({ title, body, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false }) {
  return new Promise((resolve) => {
    let result = false;
    openSheet({
      title,
      body: typeof body === 'string' ? h('p', null, body) : body,
      actions: [
        { label: cancelLabel, onClick: () => { result = false; } },
        { label: confirmLabel, primary: !danger, danger, onClick: () => { result = true; } }
      ],
      onClose: () => resolve(result)
    });
  });
}
