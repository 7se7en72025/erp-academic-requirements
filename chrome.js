// Shared app chrome: gradient rule, SISPRD strip, dark header, left sidebar nav.
// Pages call renderChrome({ active: '<key>', pageName: 'My Academics' })
// into <div id="chrome-root"></div>, then fill #main-content.

var SIDEBAR_ITEMS = [
  { key: 'advisors',              label: 'My Advisors',                    href: '#' },
  { key: 'academic-requirements', label: 'My Academic Requirements',       href: 'academic-requirements.html' },
  { key: 'course-history',        label: 'Course History',                 href: '#' },
  { key: 'view-grades',           label: 'View Grades',                    href: '#' },
  { key: 'mid-sem-grades',        label: 'Mid Semester Grades',            href: '#' },
  { key: 'pre-compre',            label: 'Pre Compre Marks View',          href: '#' },
  { key: 'minor-progress',        label: 'Minor Program Progress Details', href: '#' },
  { key: 'academic-reports',      label: 'Academic  Reports',              href: '#' },
  { key: 'intra-transfer',        label: 'Intra Campus Transfer View',     href: '#' },
  { key: 'feedback',              label: 'Student Feedback',               href: '#' },
  { key: 'attendance',            label: 'Attendance View Student',        href: '#' },
  { key: 'shopping-cart',         label: 'Enrollment Shopping Cart',       href: 'shopping-cart.html' },
  { key: 'view-my-classes',       label: 'View My Classes',                href: 'weekly-schedule.html' }
];

var SIDEBAR_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' +
  '<rect x="3" y="4" width="18" height="16" rx="1.5"/>' +
  '<line x1="3" y1="9" x2="21" y2="9"/>' +
  '<line x1="9" y1="9" x2="9" y2="20"/>' +
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
    '<div class="topline"></div>' +
    '<div class="sisprd">' + (opts.instance || '11120241312  -  SISPRD') + '</div>' +
    '<header class="appheader">' +
      '<a class="home-link" href="student-homepage.html">&#8249; Student Homepage</a>' +
      '<div class="page-name">' + (opts.pageName || 'My Academics') + '</div>' +
      '<div class="icons">' +
        '<a title="Home" href="student-homepage.html">&#8962;</a>' +
        '<a title="Search" href="#">&#9906;</a>' +
        '<a title="Notifications" href="#">&#128276;</a>' +
        '<a title="Actions" href="#">&#8942;</a>' +
        '<a title="Sign out" href="#">&#8856;</a>' +
      '</div>' +
    '</header>' +
    '<div class="shell">' +
      '<nav class="sidebar">' + items + '</nav>' +
      '<main class="main" id="main-content"></main>' +
    '</div>';
}

// Standard student/ID/go-to row used on the academic pages.
function idRowHtml() {
  return '<div class="idrow">' +
    '<div class="sname">' + STUDENT.name + '</div>' +
    '<div class="idlabel">ID Number <span class="idval">' + STUDENT.id + '</span></div>' +
    '<div class="goto">' +
      '<select aria-label="go to"><option>go to ...</option><option>Search</option>' +
      '<option>Plan</option><option>Enroll</option><option>My Academics</option></select>' +
      '<button class="go-btn" title="Go">&#187;</button>' +
    '</div>' +
  '</div>';
}

function tabsHtml(active) {
  return '<ul class="tabs">' +
    ['Search', 'Plan', 'Enroll', 'My Academics'].map(function (t) {
      return '<li class="' + (t === active ? 'active' : '') + '"><a href="#">' + t + '</a></li>';
    }).join('') +
  '</ul>';
}
