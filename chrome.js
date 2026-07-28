// Shared app chrome: black status bar, header, left sidebar nav.
// Each page calls renderChrome({ active: 'academic-requirements', pageName: 'My Academics' })
// into a <div id="chrome-root"></div> placed right after <body>.

var SIDEBAR_ITEMS = [
  { key: 'view-my-classes',   label: 'View My Classes',              href: 'weekly-schedule.html' },
  { key: 'academic-requirements', label: 'My Academic Requirements', href: 'academic-requirements.html' },
  { key: 'add-classes',       label: 'Enrollment: Add Classes',      href: 'academic-requirements.html' },
  { key: 'swap-classes',      label: 'Enrollment: Swap Classes',     href: '#' },
  { key: 'shopping-cart',     label: 'Enrollment Shopping Cart',     href: 'shopping-cart.html' },
  { key: 'advisors',          label: 'My Advisors',                  href: '#' },
  { key: 'course-history',    label: 'Course History',               href: '#' },
  { key: 'view-grades',       label: 'View Grades',                  href: '#' },
  { key: 'mid-sem-grades',    label: 'Mid Semester Grades',          href: '#' },
  { key: 'pre-compre',        label: 'Pre Compre Marks View',        href: '#' },
  { key: 'minor-progress',    label: 'Minor Program Progress Details', href: '#' },
  { key: 'academic-reports',  label: 'Academic Reports',             href: '#' },
  { key: 'intra-transfer',    label: 'Intra Campus Transfer View',   href: '#' },
  { key: 'feedback',          label: 'Student Feedback',             href: '#' },
  { key: 'attendance',        label: 'Attendance View Student',      href: '#' }
];

var SIDEBAR_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
  '<rect x="3" y="4" width="18" height="16" rx="1.5"/>' +
  '<line x1="3" y1="9" x2="21" y2="9"/>' +
  '<line x1="8" y1="4" x2="8" y2="9"/>' +
  '</svg>';

function renderChrome(opts) {
  opts = opts || {};
  var root = document.getElementById('chrome-root');
  if (!root) return;

  var items = SIDEBAR_ITEMS.map(function (it) {
    var cls = 'side-item' + (it.key === opts.active ? ' active' : '');
    return '<a class="' + cls + '" href="' + it.href + '">' +
      '<span class="side-icon">' + SIDEBAR_ICON + '</span>' + it.label + '</a>';
  }).join('');

  root.innerHTML =
    '<div class="statusbar">' + (opts.statusTime || 'Jul 28  06:56') + '</div>' +
    '<header class="appheader">' +
      '<a class="home-link" href="student-homepage.html">&#8592; Student Homepage</a>' +
      '<div class="page-name">' + (opts.pageName || 'My Academics') + '</div>' +
      '<div class="icons">' +
        '<a title="Home" href="student-homepage.html">&#8962;</a>' +
        '<a title="Search" href="#">&#128269;</a>' +
        '<a title="Notifications" href="#">&#128276;</a>' +
        '<a title="More" href="#">&#8942;</a>' +
        '<a title="Help" href="#">&#63;</a>' +
      '</div>' +
    '</header>' +
    '<div class="shell">' +
      '<nav class="sidebar">' + items + '</nav>' +
      '<main class="main" id="main-content"></main>' +
    '</div>';
}
