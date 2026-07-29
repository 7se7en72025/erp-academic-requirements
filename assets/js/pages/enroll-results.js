/**
 * Enrollment: Add Classes -- the three-step wizard.
 *
 *   1. Select classes to add, one cart course at a time
 *   2. Confirm classes
 *   3. View results
 *
 * Nothing is actually enrolled until Finish Registration on step 2.
 */
(function (ERP) {
  'use strict';

  var esc = ERP.esc;
  var COMP_NAME = ERP.COMP_NAME;
  var TERM = ERP.TERM;
  var STUDENT = ERP.STUDENT;

  ERP.renderChrome({ active: 'add-classes', pageName: 'Registration' });

  var cart = ERP.getCart();
  var step = 1;
  var index = 0;          // which cart course step 1 is showing
  var enrolledNow = [];   // snapshot taken at Finish Registration, for step 3

  function stepChipsHtml(active) {
    return '<div class="stepchips">' +
      [1, 2, 3].map(function (n) {
        return '<span class="chip' + (n === active ? ' active' : '') + '">' + n + '</span>';
      }).join('<span class="dash"></span>') +
    '</div>';
  }

  function shell(inner) {
    ERP.mount(
      ERP.idRowHtml() +
      ERP.tabsHtml('Plan') +
      ERP.shoppingCartSubnavHtml() +
      '<h1 class="page-title">Shopping Cart</h1>' +
      stepChipsHtml(step) +
      inner +
      ERP.goTopHtml()
    );
  }

  // ---- step 1: Select classes to add - Enrollment Preferences -------------

  function renderStep1() {
    if (!cart.length) {
      shell('<p class="indented">Your shopping cart is empty. ' +
        '<a href="academic-requirements.html">Add a class first</a>.</p>');
      return;
    }

    var entry = cart[index];
    var course = ERP.getCourse(entry.courseId);
    var parts = ERP.entrySections(entry);

    shell(
      '<h2 class="page-title plain">1. Select classes to add - Enrollment Preferences</h2>' +
      '<p class="breadcrumb">' + esc(TERM + ' | ' + STUDENT.campus) + '<br>' +
        esc(course.code + ' - ' + course.name) + '</p>' +
      ERP.classPreferencesHtml(course, ERP.preferenceLinesHtml(course, parts)) +
      '<div class="cart-actions">' +
        '<button type="button" class="ps-btn" data-action="cancel">Cancel</button>' +
        '<button type="button" class="ps-btn" data-action="previous-course"' +
          (index === 0 ? ' disabled' : '') + '>Previous</button>' +
        '<button type="button" class="ps-btn primary" data-action="next-course">Next</button>' +
      '</div>' +
      '<p class="centred muted">Class ' + (index + 1) + ' of ' + cart.length + '</p>' +
      '<div class="spaced">' + ERP.sectionDetailTableHtml(parts) + '</div>'
    );
  }

  // ---- step 2: Confirm classes -------------------------------------------

  function renderStep2() {
    var rows = cart.map(function (entry) {
      var course = ERP.getCourse(entry.courseId);
      return ERP.entrySections(entry).map(function (part, i) {
        var section = part.section;
        return '<tr>' +
          '<td>' + esc(course.code + '-' + section.id) + '<br>(' + esc(section.nbr) + ')</td>' +
          '<td>' + esc(course.name) + '<br>(' + esc(COMP_NAME[part.type]) + ')</td>' +
          '<td>' + esc(section.days + ' ' + section.time) + '</td>' +
          '<td>' + esc(section.room) + '</td>' +
          '<td>' + esc(section.instructor) + '</td>' +
          '<td class="num">' + (i === 0 ? course.units.toFixed(2) : '') + '</td>' +
          '<td class="center">' + ERP.statusCellHtml(section.status) + '</td>' +
        '</tr>';
      }).join('');
    }).join('');

    shell(
      '<h2 class="page-title plain">2. Confirm classes</h2>' +
      '<p class="breadcrumb">Click Finish Registration to process your request for the ' +
        'classes listed below.</p>' +
      '<p class="breadcrumb">' + esc(TERM + ' | ' + STUDENT.campus) + '</p>' +
      ERP.statusLegendHtml() +
      '<div class="grid-scroll indented"><table class="data">' +
        '<thead><tr><th scope="col">Class</th><th scope="col">Description</th>' +
        '<th scope="col">Days/Times</th><th scope="col">Room</th><th scope="col">Instructor</th>' +
        '<th scope="col">Units</th><th scope="col">Status</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table></div>' +
      '<div class="cart-actions">' +
        '<button type="button" class="ps-btn" data-action="cancel">Cancel</button>' +
        '<button type="button" class="ps-btn" data-action="back-to-step-1">Previous</button>' +
        '<button type="button" class="ps-btn primary" data-action="finish">Finish Registration</button>' +
      '</div>'
    );
  }

  // ---- step 3: View results ----------------------------------------------

  function renderStep3() {
    var rows = enrolledNow.length
      ? enrolledNow.map(function (entry) {
        var code = ERP.getCourse(entry.courseId).code.split(' ');
        return '<tr>' +
          '<td>' + esc(code[0]) + '</td>' +
          '<td>' + esc(code[1]) + '</td>' +
          '<td><strong>Success:</strong> This class has been added to your schedule</td>' +
          '<td class="center"><span class="chk">&#10003;</span>' +
            '<span class="sr-only">Success</span></td>' +
        '</tr>';
      }).join('')
      : '<tr><td colspan="4" class="empty-row">No classes were in the cart.</td></tr>';

    shell(
      '<h2 class="page-title plain">3. View results</h2>' +
      '<p class="breadcrumb">View the following status report for enrollment ' +
        'confirmations and errors</p>' +
      '<p class="breadcrumb">' + esc(TERM + ' | ' + STUDENT.campus) + '</p>' +
      ERP.legendHtml([
        { glyph: 'chk', symbol: '&#10003;', label: 'Success: enrolled' },
        { glyph: 'xmark', symbol: '&#10008;', label: 'Error: unable to add class' }
      ]) +
      '<div class="grid-scroll indented"><table class="data">' +
        '<thead><tr><th scope="col" colspan="2">Class</th>' +
        '<th scope="col">Message</th><th scope="col">Status</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table></div>' +
      '<div class="cart-actions">' +
        '<button type="button" class="ps-btn" data-action="view-schedule">My Class Schedule</button>' +
        '<button type="button" class="ps-btn" data-action="add-another">Add Another Class</button>' +
      '</div>'
    );
  }

  function finishRegistration() {
    var enrolled = ERP.getEnrolled();

    cart.forEach(function (entry) {
      var alreadyEnrolled = enrolled.some(function (e) { return e.courseId === entry.courseId; });
      if (alreadyEnrolled) return;

      // Store resolved section objects so later screens need no lookup.
      var sections = {};
      ERP.entrySections(entry).forEach(function (part) { sections[part.type] = part.section; });
      enrolled.push({ courseId: entry.courseId, sections: sections });
    });

    ERP.saveEnrolled(enrolled);
    enrolledNow = cart.slice();
    ERP.saveCart([]);

    step = 3;
    renderStep3();
  }

  ERP.onAction({
    cancel: function () { location.href = 'shopping-cart.html'; },

    'previous-course': function () {
      if (index > 0) {
        index--;
        renderStep1();
      }
    },

    'next-course': function () {
      if (index < cart.length - 1) {
        index++;
        renderStep1();
      } else {
        step = 2;
        renderStep2();
      }
    },

    'back-to-step-1': function () {
      step = 1;
      index = cart.length - 1;
      renderStep1();
    },

    finish: finishRegistration,

    'view-schedule': function () { location.href = 'weekly-schedule.html'; },
    'add-another': function () { location.href = 'academic-requirements.html'; }
  });

  renderStep1();
})(window.ERP);
