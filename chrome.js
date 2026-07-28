// Shared app chrome: gradient rule, SISPRD strip, dark header, left sidebar nav.
// Pages call renderChrome({ active: '<key>', pageName: 'My Academics' })
// into <div id="chrome-root"></div>, then fill #main-content.

var SIDEBAR_ITEMS = [
  { key: 'view-my-classes',       label: 'View My Classes',          href: 'weekly-schedule.html' },
  { key: 'academic-requirements', label: 'My Academic Requirements', href: 'academic-requirements.html' },
  { key: 'add-classes',           label: 'Enrollment:  Add Classes', href: 'enroll-results.html' },
  { key: 'swap-classes',          label: 'Enrollment:  Swap Classes', href: '#' },
  { key: 'shopping-cart',         label: 'Enrollment Shopping Cart', href: 'shopping-cart.html' }
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
      '<div class="page-name">' + (opts.pageName || 'Registration') + '</div>' +
      '<div class="icons">' +
        '<a title="Home" href="student-homepage.html">&#8962;</a>' +
        '<a title="Search" href="#">&#9906;</a>' +
        '<a title="Notifications" href="#">&#128276;</a>' +
        '<a title="Actions" href="#">&#8942;</a>' +
        '<a title="Sign out" href="#">&#8856;</a>' +
      '</div>' +
    '</header>' +
    '<div class="shell">' +
      '<nav class="sidebar">' + items +
        '<a class="side-item reset" href="#" onclick="resetDemo(); return false;">' +
          '<span class="side-icon">&#8635;</span>Reset walkthrough</a>' +
      '</nav>' +
      '<main class="main" id="main-content"></main>' +
    '</div>';
}

// Clears the demo cart/enrollment so the walkthrough can be run again.
function resetDemo() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(ENROLLED_KEY);
  localStorage.removeItem(PENDING_KEY);
  location.href = 'academic-requirements.html';
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

// ---- Open / Closed / Wait List legend bar ----
function statusLegendHtml() {
  return '<div class="legend">' +
    '<span><span class="dot open"></span>Open</span>' +
    '<span><span class="dot closed"></span>Closed</span>' +
    '<span><span class="dot wait"></span>Wait List</span>' +
  '</div>';
}

function statusCellHtml(status) {
  var cls = status === 'open' ? 'open' : status === 'wait' ? 'wait' : 'closed';
  var label = status === 'open' ? 'Open' : status === 'wait' ? 'Wait List' : 'Closed';
  return '<span class="dot ' + cls + '" title="' + label + '"></span>';
}

// ---- Class Meeting Days grid: rows Mon-Sun, columns 8AM..6PM ----
// blocks come from scheduleBlocks(); `numbered` matches the Related Class
// Sections variant, which prefixes each row with its index.
var GRID_DAYS = [
  ['Mo', 'MONDAY'], ['Tu', 'TUESDAY'], ['We', 'WEDNESDAY'], ['Th', 'THURSDAY'],
  ['Fr', 'FRIDAY'], ['Sa', 'SATURDAY'], ['Su', 'SUNDAY']
];

function hourLabel(h) {
  var mer = h < 12 ? 'AM' : 'PM';
  var hh = h % 12 === 0 ? 12 : h % 12;
  return ('0' + hh).slice(-2) + '.00 ' + mer;
}

function weeklyGridHtml(blocks, numbered) {
  var head = '<th>Class Meeting Days</th>';
  for (var h = 8; h < 18; h++) head += '<th>' + hourLabel(h) + ' - ' + hourLabel(h + 1) + '</th>';

  var rows = GRID_DAYS.map(function (d, i) {
    var cells = '';
    for (var h = 8; h < 18; h++) {
      var hit = blocks.filter(function (b) { return b.day === d[0] && h >= b.start && h < b.end; });
      cells += '<td class="slot' + (hit.length ? ' busy' : '') + '">' +
        hit.map(function (b) { return b.label; }).join('<br>') + '</td>';
    }
    return '<tr><td class="daycell">' + (numbered ? (i + 1) + ' ' : '') + d[1] + '</td>' + cells + '</tr>';
  }).join('');

  return '<div class="grid-scroll"><table class="data weekly-grid">' +
    '<thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
}

// ---- "My Class Schedule" / "Registration Course Cart" side-by-side panels ----
function schedulePanelsHtml() {
  var enrolled = getEnrolled();
  var cart = getCart();

  function lines(entries, empty) {
    if (!entries.length) return '<p class="muted">' + empty + '</p>';
    return entries.map(function (e) {
      var c = COURSES[e.courseId];
      return Object.keys(e.sections).map(function (t) {
        var s = e.sections[t];
        if (typeof s === 'string') s = c.sections[t].find(function (x) { return x.id === s; });
        return '<div class="mini-row"><span class="mini-code">' + c.code + '</span>' +
          '<span>' + s.days + ' ' + s.time + '<br>Room ' + s.room + '</span></div>';
      }).join('');
    }).join('');
  }

  return '<div class="twoup">' +
    '<div class="panel"><div class="panel-title">My Class Schedule</div>' +
      '<div class="panel-body">' + lines(enrolled, 'You are not registered for classes in this term.') + '</div></div>' +
    '<div class="panel"><div class="panel-title">Registration Course Cart</div>' +
      '<div class="panel-body">' + lines(cart, 'Your shopping cart is empty.') + '</div></div>' +
  '</div>';
}
