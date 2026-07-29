/**
 * Small DOM helpers shared by every page.
 *
 * The pages build their markup as strings and hand it to `mount()`. That keeps
 * them readable, but it means anything interpolated has to be escaped -- see
 * `esc()` -- and it means click handlers cannot live in the markup, because a
 * re-render would throw them away. `onAction()` covers the second problem by
 * listening on the document and dispatching on `data-action`.
 */
window.ERP = window.ERP || {};
(function (ERP) {
  'use strict';

  var ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  /**
   * Escape a value for interpolation into HTML.
   *
   * The catalogue is static, so most of what the pages render is trusted. The
   * exceptions are anything sourced from the query string or from storage, and
   * it is not worth tracking which is which -- escape on the way in and the
   * question never comes up.
   */
  function esc(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, function (ch) { return ESCAPES[ch]; });
  }

  function qs(selector, root) { return (root || document).querySelector(selector); }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  /** Replace the page body. Every page renders through this one entry point. */
  function mount(html) {
    var main = document.getElementById('main-content');
    if (main) main.innerHTML = html;
  }

  function dispatch(handlers, event) {
    var target = event.target.closest('[data-action]');
    if (!target) return;
    var handler = handlers[target.dataset.action];
    if (!handler) return;
    if (event.type === 'click' && target.tagName === 'A') event.preventDefault();
    handler(target, event);
  }

  /**
   * Wire up click handlers by `data-action` name.
   *
   * Listening on the document rather than on the elements themselves means
   * handlers survive the innerHTML re-renders the pages do constantly, and it
   * means the markup carries no executable attributes -- which is what lets the
   * Content-Security-Policy forbid inline script outright.
   */
  function onAction(handlers) {
    document.addEventListener('click', function (event) { dispatch(handlers, event); });
  }

  /** The same, for radio buttons and other controls that report via `change`. */
  function onChangeAction(handlers) {
    document.addEventListener('change', function (event) { dispatch(handlers, event); });
  }

  ERP.esc = esc;
  ERP.qs = qs;
  ERP.qsa = qsa;
  ERP.mount = mount;
  ERP.onAction = onAction;
  ERP.onChangeAction = onChangeAction;
})(window.ERP);
