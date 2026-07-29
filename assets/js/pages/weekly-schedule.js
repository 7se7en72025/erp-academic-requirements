/**
 * My Class Schedule -- the finished timetable, as a weekly calendar or a list.
 *
 * Week 1 is the first teaching week of the term; the arrows step through the
 * following weeks, which all look the same but re-date the column headers.
 */
(function (ERP) {
  'use strict';

  var esc = ERP.esc;
  var COMP_NAME = ERP.COMP_NAME;

  ERP.renderChrome({ active: 'view-my-classes', pageName: 'Registration' });

  var DAY_NAMES = {
    Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday',
    Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday'
  };
  var DAY_ORDER = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Monday 03/08/2026, the first teaching Monday of the term.
  var FIRST_TEACHING_MONDAY = [2026, 7, 3];

  var enrolled = ERP.getEnrolled();
  var blocks = ERP.blocksFor(enrolled);

  var weekOffset = 0;
  var view = 'week';   // 'week' | 'list'

  function formatDate(date) {
    return ('0' + date.getDate()).slice(-2) + '/' +
      ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  }

  function weekStart() {
    var date = new Date(FIRST_TEACHING_MONDAY[0], FIRST_TEACHING_MONDAY[1], FIRST_TEACHING_MONDAY[2]);
    date.setDate(date.getDate() + weekOffset * 7);
    return date;
  }

  function hourLabel(hour) {
    return (hour % 12 === 0 ? 12 : hour % 12) + ':00' + (hour < 12 ? 'AM' : 'PM');
  }

  function calendarHtml() {
    var start = weekStart();

    var header = '<tr><th scope="col">Time</th>' + DAY_ORDER.map(function (code, i) {
      var day = new Date(start);
      day.setDate(day.getDate() + i);
      return '<th scope="col">' + esc(DAY_NAMES[code]) + '<br>' +
        day.getDate() + ' ' + MONTHS[day.getMonth()] + '</th>';
    }).join('') + '</tr>';

    var rows = '';
    for (var hour = ERP.DAY_START_HOUR; hour < ERP.DAY_END_HOUR; hour++) {
      rows += '<tr><th scope="row" class="timecell">' + hourLabel(hour) + '</th>' +
        DAY_ORDER.map(function (code) {
          return cellHtml(code, hour);
        }).join('') + '</tr>';
    }

    return '<div class="grid-scroll"><table class="cal">' +
      '<thead>' + header + '</thead><tbody>' + rows + '</tbody></table></div>';
  }

  function cellHtml(dayCode, hour) {
    var busy = blocks.filter(function (b) {
      return b.day === dayCode && hour >= b.start && hour < b.end;
    });
    if (!busy.length) return '<td class="empty"></td>';

    return '<td class="ev">' + busy.map(function (b) {
      return esc(b.code + ' - ' + b.section.id) + '<br>' +
        esc(COMP_NAME[b.comp]) + '<br>' +
        esc(b.section.time) + '<br>Location: ' + esc(b.section.room);
    }).join('<hr>') + '</td>';
  }

  function listHtml() {
    var rows = enrolled.map(function (entry) {
      var course = ERP.getCourse(entry.courseId);
      return ERP.entrySections(entry).map(function (part) {
        var section = part.section;
        return '<tr>' +
          '<td>' + esc(course.code + '-' + section.id) + '<br>(' + esc(section.nbr) + ')</td>' +
          '<td>' + esc(course.name) + '</td>' +
          '<td>' + esc(COMP_NAME[part.type]) + '</td>' +
          '<td>' + esc(section.days + ' ' + section.time) + '</td>' +
          '<td>' + esc(section.room) + '</td>' +
          '<td>' + esc(section.instructor) + '</td>' +
        '</tr>';
      }).join('');
    }).join('');

    return '<div class="grid-scroll"><table class="data">' +
      '<thead><tr><th scope="col">Class</th><th scope="col">Description</th>' +
      '<th scope="col">Component</th><th scope="col">Days/Times</th>' +
      '<th scope="col">Room</th><th scope="col">Instructor</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
    '</table></div>';
  }

  function bodyHtml() {
    if (!enrolled.length) {
      return '<p class="indented">You are not registered for classes in this term. ' +
        '<a href="academic-requirements.html">Go register</a>.</p>';
    }

    if (view === 'list') {
      return '<div class="req-sub">Schedule</div>' + listHtml();
    }

    var start = weekStart();
    var end = new Date(start);
    end.setDate(end.getDate() + 6);

    return '<div class="weeknav">' +
        '<button type="button" class="ps-btn" data-action="previous-week">&lt;&lt; Previous Week</button>' +
        '<span class="weeklabel">Week of ' + formatDate(start) + ' - ' + formatDate(end) + '</span>' +
        '<button type="button" class="ps-btn" data-action="next-week">Next Week &gt;&gt;</button>' +
      '</div>' +
      '<div class="panel"><div class="panel-body">' +
        '<label><strong>Show Week of</strong> ' +
          '<input type="text" size="10" value="' + formatDate(start) + '" readonly></label> ' +
        '&nbsp;<label><strong>Start Time</strong> ' +
          '<input type="text" size="7" value="' + hourLabel(ERP.DAY_START_HOUR) + '" readonly></label> ' +
        '&nbsp;<label><strong>End Time</strong> ' +
          '<input type="text" size="7" value="' + hourLabel(ERP.DAY_END_HOUR) + '" readonly></label> ' +
        '&nbsp;<button type="button" class="ps-btn slim" data-action="refresh">Refresh Calendar</button>' +
      '</div></div>' +
      '<div class="req-sub">Schedule</div>' + calendarHtml();
  }

  function render() {
    ERP.mount(
      ERP.idRowHtml() +
      ERP.tabsHtml('Enroll') +
      '<div class="subnav">' +
        '<span class="current">My Class Schedule</span>' +
        '<span class="sep">|</span><a href="academic-requirements.html">Add</a>' +
        '<span class="sep">|</span><a href="#">Swap</a>' +
        '<span class="sep">|</span><a href="#">Term Information</a>' +
      '</div>' +
      '<h1 class="page-title">My Class Schedule</h1>' +
      '<div class="optrow"><strong>Select Display Option</strong>' +
        '<label><input type="radio" name="disp" data-action="set-view" value="list"' +
          (view === 'list' ? ' checked' : '') + '> List View</label>' +
        '<label><input type="radio" name="disp" data-action="set-view" value="week"' +
          (view === 'week' ? ' checked' : '') + '> Weekly Calendar View</label>' +
      '</div>' +
      bodyHtml() +
      ERP.goTopHtml()
    );
  }

  ERP.onChangeAction({
    'set-view': function (input) {
      view = input.value === 'list' ? 'list' : 'week';
      render();
    }
  });

  ERP.onAction({
    'previous-week': function () { weekOffset--; render(); },
    'next-week': function () { weekOffset++; render(); },
    refresh: render
  });

  render();
})(window.ERP);
