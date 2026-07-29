/**
 * Course Detail -- course facts, the section list, and the point where a
 * section actually gets picked.
 *
 * Picking the first component here hands off to Related Class Sections when the
 * course needs a second one (a tutorial or a lab), and straight to Enrollment
 * Preferences when it does not.
 */
(function (ERP) {
  'use strict';

  var esc = ERP.esc;
  var TERM = ERP.TERM;
  var TERM_DATES = ERP.TERM_DATES;
  var COMP_NAME = ERP.COMP_NAME;
  var COMP_ABBR = ERP.COMP_ABBR;

  ERP.renderChrome({ active: 'academic-requirements', pageName: 'Registration' });

  var params = new URLSearchParams(location.search);
  var courseId = params.get('course') || ERP.COURSE_ORDER[0];
  var course = ERP.getCourse(courseId);

  // An unknown course id means a hand-edited or stale link. Go back to the list
  // rather than render a broken page.
  if (!course) {
    location.replace('academic-requirements.html');
    return;
  }

  // The first component is chosen from the section list on this page; anything
  // further is chosen on the Related Class Sections screen.
  var primary = course.components[0].type;

  var showBanner = params.get('added') === '1';
  var showModal = params.get('modal') === '1';
  var sectionsRequested = params.get('sections') === '1';

  // Both confirmations are one-shot. Strip the flags from the URL so a refresh
  // or a shared link does not replay them.
  if (showBanner || showModal) {
    params.delete('added');
    params.delete('modal');
    var query = params.toString();
    history.replaceState(null, '', location.pathname + (query ? '?' + query : ''));
  }

  function sectionBlockHtml(section) {
    var closed = section.status === 'closed';
    return '<div class="sec-block">' +
      '<div class="grid-title">Section</div>' +
      '<table class="data">' +
        '<thead><tr><th scope="col">Section</th><th scope="col">Session</th>' +
        '<th scope="col">FN/AN</th><th scope="col">Exam Date</th>' +
        '<th scope="col">Status</th><th scope="col"><span class="sr-only">Select</span></th></tr></thead>' +
        '<tbody><tr>' +
          '<td>' + esc(section.id + '-' + COMP_ABBR[primary] + ' (' + section.nbr + ')') + '</td>' +
          '<td>H</td>' +
          '<td>' + esc(section.fnan) + '</td>' +
          '<td>' + esc(section.exam) + '</td>' +
          '<td class="center">' + ERP.statusCellHtml(section.status) + '</td>' +
          '<td class="center">' +
            '<button type="button" class="ps-btn slim" data-action="select-section" ' +
              'data-section="' + esc(section.id) + '"' + (closed ? ' disabled' : '') + '>Select</button>' +
          '</td>' +
        '</tr></tbody>' +
      '</table>' +
      '<div class="sec-details">' +
        '<div class="grid-title">Section Details</div>' +
        '<table class="data">' +
          '<thead><tr><th scope="col">Days</th><th scope="col">Start</th><th scope="col">End</th>' +
          '<th scope="col">Room</th><th scope="col">Instructor</th><th scope="col">Dates</th></tr></thead>' +
          '<tbody><tr>' +
            '<td>' + esc(section.days) + '</td>' +
            '<td>' + esc(section.time.split(' - ')[0]) + '</td>' +
            '<td>' + esc(section.time.split(' - ')[1]) + '</td>' +
            '<td>' + esc(section.room) + '</td>' +
            '<td>' + esc(section.instructor) + '</td>' +
            '<td>' + esc(TERM_DATES) + '</td>' +
          '</tr></tbody>' +
        '</table>' +
      '</div>' +
    '</div>';
  }

  function sectionsHtml() {
    var sections = course.sections[primary] || [];
    return ERP.schedulePanelsHtml() +
      ERP.meetingDaysGridHtml(ERP.blocksFor(ERP.getCommitted())) +
      ERP.statusLegendHtml() +
      '<div class="req-sub">' + esc(course.code) + ' Sections for ' + esc(TERM) + '</div>' +
      '<p class="grid-nav right">1-' + sections.length + ' of ' + sections.length + '</p>' +
      sections.map(sectionBlockHtml).join('');
  }

  function bannerHtml() {
    if (!showBanner) return '';
    return '<div class="confirm-banner"><span class="chk">&#10003;</span><div>' +
      '<strong>' + esc(course.code) + '</strong> has been added to your Shopping Cart.<br>' +
      'To enroll in classes from your ' + esc(TERM) + ' Shopping Cart, ' +
      '<a href="shopping-cart.html">select here</a>.' +
    '</div></div>';
  }

  function modalHtml() {
    if (!showModal) return '';
    var code = course.code.split(' ');
    return '<div class="modal-overlay" id="addedModal" role="dialog" aria-modal="true">' +
      '<div class="modal-box">' +
        '<p>' + esc(code[0]) + '&nbsp;&nbsp;&nbsp;' + esc(code[1]) +
          ' has been added to your Shopping Cart. To Register in this course you need to go to ' +
          'Registration Course Cart and click on register button. (0,0)</p>' +
        '<div class="modal-actions">' +
          '<button type="button" class="ps-btn" data-action="close-modal">OK</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function render() {
    // A course already in the cart opens with its sections showing, so the
    // choice can be reviewed or changed without hunting for the button.
    var inCart = ERP.getCart().some(function (entry) { return entry.courseId === courseId; });
    var sectionsVisible = sectionsRequested || inCart;

    ERP.mount(
      ERP.idRowHtml() +
      ERP.tabsHtml('My Academics') +
      ERP.requirementsSubnavHtml() +
      '<h1 class="page-title">Course Detail</h1>' +
      bannerHtml() +
      '<p><a href="academic-requirements.html">Return to My Academic Requirements</a></p>' +
      '<p class="breadcrumb">' + esc(course.code + ' - ' + course.name) + '</p>' +
      // The portal puts the title band and the button side by side across the
      // top of the group box, the band taking about two thirds of the width.
      '<div class="panel">' +
        '<div class="panel-head">' +
          '<div class="panel-title">Course Detail</div>' +
          '<button type="button" class="ps-btn" data-action="show-sections">' +
            (inCart ? 'View/Edit Sections' : 'View Class Sections') + '</button>' +
        '</div>' +
        '<div class="panel-body">' +
          '<div>' +
            '<p><strong>Career</strong> &nbsp; First Degree</p>' +
            '<p><strong>Units</strong> &nbsp; ' + course.units.toFixed(2) + '</p>' +
            '<p><strong>Grading Basis</strong> &nbsp; Course Grading</p>' +
            '<p><strong>Course Components</strong><br>' +
              course.components.map(function (comp) {
                return '&nbsp;&nbsp;' + esc(COMP_NAME[comp.type]) + ' &nbsp; ' +
                  (comp.required ? 'Required' : 'Optional');
              }).join('<br>') +
            '</p>' +
            '<p><strong>Campus</strong> &nbsp; Pilani Campus</p>' +
            '<p><strong>Academic Group</strong> &nbsp; ' + esc(course.acadGroup) + '</p>' +
            '<p><strong>Academic Organization</strong> &nbsp; ' + esc(course.dept) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<h2 class="page-title">Course Schedule</h2>' +
      '<div class="btn-row">' +
        '<label><strong>*Terms Offered</strong> ' +
          '<select><option>' + esc(TERM) + '</option></select></label>' +
        '<button type="button" class="ps-btn" data-action="show-sections">Show Sections</button>' +
      '</div>' +
      '<div id="sectionsArea">' + (sectionsVisible ? sectionsHtml() : '') + '</div>' +
      modalHtml() +
      '<p><a href="academic-requirements.html">Return to My Academic Requirements</a></p>' +
      ERP.goTopHtml()
    );
  }

  ERP.onAction({
    'show-sections': function () {
      ERP.qs('#sectionsArea').innerHTML = sectionsHtml();
    },

    'select-section': function (button) {
      var section = ERP.resolveSection(course, primary, button.dataset.section);
      if (!section) return;

      var pending = { courseId: courseId, sections: {} };
      pending.sections[primary] = section.id;
      ERP.savePending(pending);

      var next = course.components.length > 1 ? 'related-sections.html' : 'enrollment-preferences.html';
      location.href = next + '?' + ERP.pendingQuery(pending);
    },

    'close-modal': function () {
      var modal = document.getElementById('addedModal');
      if (modal) modal.remove();
    },

    'open-cart': function () { location.href = 'shopping-cart.html'; }
  });

  render();
})(window.ERP);
