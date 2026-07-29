/**
 * The frame every page sits inside: the coloured rule
 * and instance strip, the dark header bar, and the left navigation.
 *
 * A page calls `renderChrome()` into `<div id="chrome-root">`, which leaves it
 * an empty `#main-content` to fill.
 */
window.ERP = window.ERP || {};
(function (ERP) {
  'use strict';

  var esc = ERP.esc;
  var STUDENT = ERP.STUDENT;

  // Order matches the real Registration activity guide, including the
  // My Academic Requirements step -- without it that page highlights nothing.
  var SIDEBAR_ITEMS = [
    { key: 'view-my-classes', label: 'View My Classes', href: 'weekly-schedule.html' },
    { key: 'academic-requirements', label: 'My Academic Requirements', href: 'academic-requirements.html' },
    { key: 'add-classes', label: 'Enrollment:  Add Classes', href: 'enroll-results.html' },
    { key: 'swap-classes', label: 'Enrollment:  Swap Classes', href: '#' },
    { key: 'shopping-cart', label: 'Enrollment Shopping Cart', href: 'shopping-cart.html' }
  ];

  // The portal's own artwork, copied out of a saved page: the activity-guide
  // step icon in the sidebar and the white glyphs in the header bar.
  var SIDEBAR_ICON = '<img src="assets/img/side-step.svg" alt="">';

  var HEADER_ICONS = [
    { title: 'Search', img: 'hdr-search.svg' },
    { title: 'Notifications', img: 'hdr-alerts.svg' },
    { title: 'Actions', img: 'hdr-actions.svg' },
    { title: 'NavBar', img: 'hdr-navbar.svg' }
  ];

  function sidebarHtml(activeKey) {
    return SIDEBAR_ITEMS.map(function (item) {
      var isActive = item.key === activeKey;
      return '<a class="side-item' + (isActive ? ' active' : '') + '" href="' + item.href + '"' +
        (isActive ? ' aria-current="page"' : '') + '>' +
        '<span class="side-icon">' + SIDEBAR_ICON + '</span>' + esc(item.label) +
      '</a>';
    }).join('');
  }

  function headerIconsHtml() {
    return HEADER_ICONS.map(function (icon) {
      return '<a href="#" title="' + esc(icon.title) + '" aria-label="' + esc(icon.title) + '">' +
        '<img src="assets/img/' + icon.img + '" alt=""></a>';
    }).join('');
  }

  /**
   * @param {{ active?: string, pageName?: string }} options
   *   `active` is the sidebar key to highlight; `pageName` is the title shown
   *   in the middle of the dark header bar.
   */
  function renderChrome(options) {
    var opts = options || {};
    var root = document.getElementById('chrome-root');
    if (!root) return;

    root.innerHTML =
      '<div class="topline"></div>' +
      '<div class="sisprd">' + esc(STUDENT.instance) + '</div>' +
      '<header class="appheader">' +
        '<a class="home-link" href="student-homepage.html">' +
          '<img src="assets/img/hdr-back.svg" alt="">Student Homepage</a>' +
        '<div class="page-name">' + esc(opts.pageName || 'Registration') + '</div>' +
        '<div class="icons">' +
          '<a href="student-homepage.html" title="Home" aria-label="Home">' +
            '<img src="assets/img/hdr-home.svg" alt=""></a>' +
          headerIconsHtml() +
        '</div>' +
      '</header>' +
      '<div class="shell">' +
        '<nav class="sidebar" aria-label="Enrollment">' + sidebarHtml(opts.active) + '</nav>' +
        '<main class="main" id="main-content"></main>' +
      '</div>';
  }

  /** Clear the cart and enrolled classes so the walkthrough can be run again. */
  function resetWalkthrough() {
    ERP.clearAll();
    location.href = 'academic-requirements.html';
  }

  // Ctrl+X restarts the walkthrough. Ignored while a field has focus so the
  // browser's own cut keeps working there.
  document.addEventListener('keydown', function (event) {
    if (!(event.ctrlKey || event.metaKey) || event.key !== 'x') return;

    var focused = document.activeElement;
    if (focused && /^(INPUT|TEXTAREA|SELECT)$/.test(focused.tagName)) return;

    event.preventDefault();
    if (confirm('Reset the walkthrough? This clears your cart and enrolled classes.')) {
      resetWalkthrough();
    }
  });

  ERP.renderChrome = renderChrome;
  ERP.resetWalkthrough = resetWalkthrough;
})(window.ERP);
