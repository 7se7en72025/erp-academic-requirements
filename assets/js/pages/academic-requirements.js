/**
 * My Academic Requirements -- the collapsible requirement tree, and the screen
 * the walkthrough keeps returning to between courses.
 *
 * Sem 1 courses link into the registration flow; the later semesters are shown
 * for context and are not clickable.
 */
(function (ERP) {
  'use strict';

  var esc = ERP.esc;
  var COURSES = ERP.COURSES;
  var PROGRAM = ERP.PROGRAM;
  var TERM = ERP.TERM;
  var STUDENT = ERP.STUDENT;

  ERP.renderChrome({ active: 'academic-requirements', pageName: 'Registration' });

  var enrolled = ERP.getEnrolled();
  var enrolledIds = enrolled.map(function (e) { return e.courseId; });
  var cartIds = ERP.getCart().map(function (c) { return c.courseId; });

  function isEnrolled(courseId) { return enrolledIds.indexOf(courseId) > -1; }
  function isInCart(courseId) { return cartIds.indexOf(courseId) > -1; }

  function whenCell(courseId) {
    return isEnrolled(courseId) || isInCart(courseId) ? esc(TERM) : '';
  }

  function statusCell(courseId) {
    if (isEnrolled(courseId)) return '<span class="chk">&#10003;</span><span class="sr-only">Taken</span>';
    if (isInCart(courseId)) return '<span class="diamond"></span><span class="sr-only">In Progress</span>';
    return '';
  }

  function gridHtml(rowsHtml, count) {
    return '<div class="grid">' +
      '<div class="grid-title">The following courses may be used to satisfy this requirement:</div>' +
      '<div class="grid-nav">' +
        '<a href="#">Personalize</a> | <a href="#">View All</a> | <a href="#">&#8663;</a>' +
        '<span class="pager">First <span class="pg">&#9664;</span> ' +
          '<strong>1-' + count + ' of ' + count + '</strong> <span class="pg">&#9654;</span> Last</span>' +
      '</div>' +
      '<div class="grid-scroll"><table class="data">' +
        '<thead><tr><th scope="col">Course</th><th scope="col">Description</th>' +
        '<th scope="col" class="num">Units</th><th scope="col">When</th>' +
        '<th scope="col">Grade</th><th scope="col">Status</th></tr></thead>' +
        '<tbody>' + rowsHtml + '</tbody>' +
      '</table></div>' +
    '</div>';
  }

  /** Sem 1: every row links through to the course detail screen. */
  function registrableRowsHtml(courseIds) {
    return courseIds.map(function (id) {
      var course = COURSES[id];
      return '<tr>' +
        '<td>' + esc(course.code) + '</td>' +
        '<td><a href="course-detail.html?course=' + encodeURIComponent(id) + '">' +
          esc(course.name) + '</a></td>' +
        '<td class="num">' + course.units.toFixed(2) + '</td>' +
        '<td>' + whenCell(id) + '</td>' +
        '<td></td>' +
        '<td class="center">' + statusCell(id) + '</td>' +
      '</tr>';
    }).join('');
  }

  /** Later semesters: listed for context only. */
  function upcomingRowsHtml(courses) {
    return courses.map(function (course) {
      return '<tr>' +
        '<td>' + esc(course.code) + '</td>' +
        '<td><a href="#">' + esc(course.name) + '</a></td>' +
        '<td class="num">' + course.units.toFixed(2) + '</td>' +
        '<td></td><td></td><td></td>' +
      '</tr>';
    }).join('');
  }

  function semesterHtml(semester, index) {
    var isSemOne = Boolean(semester.courseIds);
    var count = isSemOne ? semester.courseIds.length : semester.courses.length;
    var taken = isSemOne ? semester.courseIds.filter(isEnrolled).length : 0;
    var rows = isSemOne
      ? registrableRowsHtml(semester.courseIds)
      : upcomingRowsHtml(semester.courses);

    var bodyId = 'sem-' + index;
    return '<div class="req-sub click" data-action="toggle-section" data-target="' + bodyId + '">' +
        '<span class="arrow">' + (semester.open ? '&#9660;' : '&#9654;') + '</span> ' + esc(semester.name) +
      '</div>' +
      '<div class="req-body' + (semester.open ? '' : ' hidden') + '" id="' + bodyId + '">' +
        '<p class="status-line"><strong>Not Satisfied:</strong> All courses are compulsory.</p>' +
        '<ul class="reqs"><li>Courses: ' + semester.required + ' required, ' + taken +
          ' taken, ' + (semester.required - taken) + ' needed</li></ul>' +
        gridHtml(rows, count) +
      '</div>';
  }

  function generatedOn() {
    return new Date().toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    }).replace(',', ' ');
  }

  var unitsTaken = enrolled.reduce(function (sum, e) { return sum + COURSES[e.courseId].units; }, 0);
  var coursesTaken = enrolled.length;

  ERP.mount(
    ERP.idRowHtml() +
    ERP.tabsHtml('My Academics') +
    '<h1 class="page-title">My Academic Requirements</h1>' +
    '<p class="breadcrumb">' + esc(STUDENT.campus) + '</p>' +
    '<p class="generated"><strong>This report last generated on</strong>' +
      '<span class="when">' + esc(generatedOn()) + '</span></p>' +
    '<div class="btn-row">' +
      '<button type="button" class="ps-btn" data-action="collapse-all">Collapse All</button>' +
      '<button type="button" class="ps-btn" data-action="expand-all">Expand All</button>' +
      '<button type="button" class="ps-btn" data-action="print-report">View Report as PDF</button>' +
    '</div>' +
    ERP.legendHtml([
      { glyph: 'chk', symbol: '&#10003;', label: 'Taken' },
      { glyph: 'diamond', symbol: '', label: 'In Progress' },
      { glyph: 'star', symbol: '&#9733;', label: 'Planned' }
    ]) +
    '<div class="reqgroup">' +
      '<div class="req-head" data-action="toggle-section" data-target="grp-plan">' +
        '<span class="arrow">&#9660;</span> ' + esc(PROGRAM.plan) +
      '</div>' +
      '<div class="req-body" id="grp-plan">' +
        '<p class="status-line"><strong>Not Satisfied:</strong> ' + esc(PROGRAM.plan) + '</p>' +
        '<div class="req-sub">' + esc(PROGRAM.subplan) + '</div>' +
        '<div class="req-body">' +
          '<p class="status-line"><strong>Not Satisfied:</strong> ' + esc(PROGRAM.subplan) + '</p>' +
          '<ul class="reqs">' +
            '<li>Units: ' + PROGRAM.unitsRequired.toFixed(2) + ' required, ' + unitsTaken.toFixed(2) +
              ' taken, ' + (PROGRAM.unitsRequired - unitsTaken).toFixed(2) + ' needed</li>' +
            '<li>Courses: ' + PROGRAM.coursesRequired + ' required, ' + coursesTaken +
              ' taken, ' + (PROGRAM.coursesRequired - coursesTaken) + ' needed</li>' +
            '<li>GPA: ' + esc(PROGRAM.gpaRequired) + ' required, 0.000 actual</li>' +
          '</ul>' +
          PROGRAM.semesters.map(semesterHtml).join('') +
        '</div>' +
      '</div>' +
    '</div>' +
    ERP.goTopHtml()
  );

  function setOpen(head, open) {
    var body = document.getElementById(head.dataset.target);
    if (!body) return;
    body.classList.toggle('hidden', !open);
    var arrow = head.querySelector('.arrow');
    if (arrow) arrow.innerHTML = open ? '&#9660;' : '&#9654;';
  }

  function setAll(open) {
    ERP.qsa('[data-action="toggle-section"]').forEach(function (head) { setOpen(head, open); });
  }

  ERP.onAction({
    'toggle-section': function (head) {
      var body = document.getElementById(head.dataset.target);
      if (body) setOpen(head, body.classList.contains('hidden'));
    },
    'collapse-all': function () { setAll(false); },
    'expand-all': function () { setAll(true); },
    'print-report': function () { window.print(); }
  });
})(window.ERP);
