/**
 * The fragments that show up on more than one screen: the student ID row, the
 * tab strip, status glyphs and legends, the meeting-days grid, and the panels
 * the enrollment screens share.
 *
 * Everything here returns an HTML string. Pages concatenate them and hand the
 * result to `ERP.mount()`.
 */
window.ERP = window.ERP || {};
(function (ERP) {
  'use strict';

  var esc = ERP.esc;
  var STUDENT = ERP.STUDENT;
  var TERM_DATES = ERP.TERM_DATES;
  var COMP_NAME = ERP.COMP_NAME;
  var STATUS = ERP.STATUS;
  var getCourse = ERP.getCourse;
  var entrySections = ERP.entrySections;

  var TABS = ['Search', 'Plan', 'Enroll', 'My Academics'];
  var GO_TO_OPTIONS = ['go to ...', 'Search', 'Plan', 'Enroll', 'My Academics'];

  var GRID_DAYS = [
    ['Mo', 'MONDAY'], ['Tu', 'TUESDAY'], ['We', 'WEDNESDAY'], ['Th', 'THURSDAY'],
    ['Fr', 'FRIDAY'], ['Sa', 'SATURDAY'], ['Su', 'SUNDAY']
  ];

  // ---- student header row -------------------------------------------------

  function idRowHtml() {
    return '<div class="idrow">' +
      '<div class="sname">' + esc(STUDENT.name) + '</div>' +
      '<div class="idlabel">ID Number <span class="idval">' + esc(STUDENT.id) + '</span></div>' +
      '<div class="goto">' +
        '<select aria-label="Go to">' +
          GO_TO_OPTIONS.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') +
        '</select>' +
        '<button type="button" class="go-btn" title="Go" aria-label="Go">' +
          '<img src="assets/img/nav-go.gif" alt=""></button>' +
      '</div>' +
    '</div>';
  }

  function tabsHtml(active) {
    return '<ul class="tabs">' +
      TABS.map(function (tab) {
        var isActive = tab === active;
        return '<li class="' + (isActive ? 'active' : '') + '">' +
          '<a href="#"' + (isActive ? ' aria-current="page"' : '') + '>' + esc(tab) + '</a></li>';
      }).join('') +
    '</ul>';
  }

  /** The "Shopping Cart | Course History" strip above the enrollment screens. */
  function shoppingCartSubnavHtml() {
    return '<div class="subnav">' +
      '<span class="current">Shopping Cart</span>' +
      '<span class="sep">|</span><a href="#">Course History</a>' +
    '</div>';
  }

  function requirementsSubnavHtml() {
    return '<div class="subnav">' +
      '<a href="academic-requirements.html">My Academic Requirements</a>' +
    '</div>';
  }

  function goTopHtml() {
    return '<p class="go-top"><a href="#">' +
      '<img src="assets/img/go-top.gif" alt="">Go to top</a></p>';
  }

  // ---- status glyphs ------------------------------------------------------

  function statusOf(status) { return STATUS[status] || STATUS.closed; }

  /** The bare glyph, for a table's Status column. */
  function statusCellHtml(status) {
    var s = statusOf(status);
    return '<span class="dot ' + s.className + '" title="' + esc(s.label) + '"></span>' +
      '<span class="sr-only">' + esc(s.label) + '</span>';
  }

  /** Glyph plus its label, for prose lines. */
  function statusTextHtml(status) {
    var s = statusOf(status);
    return '<span class="dot ' + s.className + '"></span>' + esc(s.label);
  }

  function statusLegendHtml() {
    return '<div class="legend">' +
      Object.keys(STATUS).map(function (key) {
        return '<span><span class="dot ' + STATUS[key].className + '"></span>' + esc(STATUS[key].label) + '</span>';
      }).join('') +
    '</div>';
  }

  function legendHtml(items) {
    return '<div class="legend">' +
      items.map(function (item) {
        return '<span><span class="' + item.glyph + '">' + item.symbol + '</span> ' + esc(item.label) + '</span>';
      }).join('') +
    '</div>';
  }

  // ---- class meeting days grid --------------------------------------------

  function hourLabel(hour) {
    var meridiem = hour < 12 ? 'AM' : 'PM';
    var display = hour % 12 === 0 ? 12 : hour % 12;
    return ('0' + display).slice(-2) + '.00 ' + meridiem;
  }

  /**
   * Rows Monday-Sunday, columns 8AM-6PM, with each block's label in its slots.
   * `numbered` prefixes the day names with an index, the way the Related Class
   * Sections screen does.
   */
  function meetingDaysGridHtml(blocks, numbered) {
    var header = '<th scope="col">Class Meeting Days</th>';
    for (var h = ERP.DAY_START_HOUR; h < ERP.DAY_END_HOUR; h++) {
      header += '<th scope="col">' + hourLabel(h) + ' - ' + hourLabel(h + 1) + '</th>';
    }

    var rows = GRID_DAYS.map(function (day, index) {
      var cells = '';
      for (var hour = ERP.DAY_START_HOUR; hour < ERP.DAY_END_HOUR; hour++) {
        var busy = blocksAt(blocks, day[0], hour);
        cells += '<td class="slot' + (busy.length ? ' busy' : '') + '">' +
          busy.map(function (b) { return esc(b.label); }).join('<br>') + '</td>';
      }
      var label = (numbered ? (index + 1) + ' ' : '') + day[1];
      return '<tr><th scope="row" class="daycell">' + esc(label) + '</th>' + cells + '</tr>';
    }).join('');

    return '<div class="grid-scroll"><table class="data weekly-grid">' +
      '<thead><tr>' + header + '</tr></thead><tbody>' + rows + '</tbody>' +
    '</table></div>';
  }

  function blocksAt(blocks, day, hour) {
    return blocks.filter(function (b) { return b.day === day && hour >= b.start && hour < b.end; });
  }

  // ---- side-by-side schedule / cart panels --------------------------------

  function miniLinesHtml(entries, emptyMessage) {
    if (!entries.length) return '<p class="muted">' + esc(emptyMessage) + '</p>';

    return entries.map(function (entry) {
      var course = getCourse(entry.courseId);
      return entrySections(entry).map(function (part) {
        return '<div class="mini-row">' +
          '<span class="mini-code">' + esc(course.code) + '</span>' +
          '<span>' + esc(part.section.days + ' ' + part.section.time) +
            '<br>Room ' + esc(part.section.room) + '</span>' +
        '</div>';
      }).join('');
    }).join('');
  }

  function schedulePanelsHtml() {
    var cart = ERP.getCart();
    var showAll = cart.length
      ? ' <button type="button" class="ps-btn slim tiny" data-action="open-cart">Show All</button>'
      : '';

    return '<div class="twoup">' +
      '<div class="panel">' +
        '<div class="panel-title">My Class Schedule</div>' +
        '<div class="panel-body">' +
          miniLinesHtml(ERP.getEnrolled(), 'You are not registered for classes in this term.') +
        '</div>' +
      '</div>' +
      '<div class="panel">' +
        '<div class="panel-title">Registration Course Cart' + showAll + '</div>' +
        '<div class="panel-body">' +
          miniLinesHtml(cart, 'Your shopping cart is empty.') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ---- enrollment preference panels ---------------------------------------

  /** Selection summary as a small table (Add to Shopping Cart screen). */
  function preferenceRowsHtml(course, parts) {
    var code = course.code.split(' ');
    return '<table class="data borderless"><tbody>' +
      parts.map(function (part) {
        return '<tr>' +
          '<td>' + esc(code[0]) + '</td>' +
          '<td>' + esc(code[1] + '-' + part.section.id) + '</td>' +
          '<td>' + esc(COMP_NAME[part.type]) + '</td>' +
          '<td>' + statusTextHtml(part.section.status) + '</td>' +
        '</tr>';
      }).join('') +
    '</tbody></table>';
  }

  /** The same summary as prose lines (Add Classes wizard, step 1). */
  function preferenceLinesHtml(course, parts) {
    var code = course.code.split(' ');
    return parts.map(function (part) {
      return '<p>' + esc(code[0]) + ' &nbsp; ' + esc(code[1] + '-' + part.section.id) +
        ' &nbsp; ' + esc(COMP_NAME[part.type]) + ' &nbsp; ' + statusTextHtml(part.section.status) + '</p>';
    }).join('');
  }

  /**
   * The Class Preferences panel, shared by the Add to Shopping Cart screen and
   * step 1 of the Add Classes wizard. They differ only in how the left column
   * lists the chosen sections, so that part comes in as `selectionHtml`.
   */
  function classPreferencesHtml(course, selectionHtml) {
    return '<div class="panel">' +
      '<div class="panel-title">Class Preferences</div>' +
      '<div class="panel-body">' +
        '<div class="twoup flush">' +
          '<div>' +
            selectionHtml +
            '<p class="spaced"><strong>Session</strong> &nbsp; Regular Session<br>' +
              '<strong>Career</strong> &nbsp; First Degree</p>' +
          '</div>' +
          '<div>' +
            '<p><label><strong>Permission Nbr</strong> ' +
              '<input type="text" size="8" autocomplete="off"></label></p>' +
            '<p><strong>Grading</strong> &nbsp; Course Grading</p>' +
            '<p><strong>Units</strong> &nbsp; ' + course.units.toFixed(2) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /** Section | Component | Days & Times | Room | Instructor | Start/End Date */
  function sectionDetailTableHtml(parts) {
    return '<div class="grid-scroll"><table class="data">' +
      '<thead><tr><th scope="col">Section</th><th scope="col">Component</th>' +
      '<th scope="col">Days &amp; Times</th><th scope="col">Room</th>' +
      '<th scope="col">Instructor</th><th scope="col">Start/End Date</th></tr></thead>' +
      '<tbody>' +
        parts.map(function (part) {
          var s = part.section;
          return '<tr>' +
            '<td>' + esc(s.id) + '</td>' +
            '<td>' + esc(COMP_NAME[part.type]) + '</td>' +
            '<td>' + esc(s.days + ' ' + s.time) + '</td>' +
            '<td>' + esc(s.room) + '</td>' +
            '<td>' + esc(s.instructor) + '</td>' +
            '<td>' + esc(TERM_DATES) + '</td>' +
          '</tr>';
        }).join('') +
      '</tbody>' +
    '</table></div>';
  }

  ERP.idRowHtml = idRowHtml;
  ERP.tabsHtml = tabsHtml;
  ERP.shoppingCartSubnavHtml = shoppingCartSubnavHtml;
  ERP.requirementsSubnavHtml = requirementsSubnavHtml;
  ERP.goTopHtml = goTopHtml;
  ERP.statusCellHtml = statusCellHtml;
  ERP.statusTextHtml = statusTextHtml;
  ERP.statusLegendHtml = statusLegendHtml;
  ERP.legendHtml = legendHtml;
  ERP.meetingDaysGridHtml = meetingDaysGridHtml;
  ERP.schedulePanelsHtml = schedulePanelsHtml;
  ERP.preferenceRowsHtml = preferenceRowsHtml;
  ERP.preferenceLinesHtml = preferenceLinesHtml;
  ERP.classPreferencesHtml = classPreferencesHtml;
  ERP.sectionDetailTableHtml = sectionDetailTableHtml;
})(window.ERP);
