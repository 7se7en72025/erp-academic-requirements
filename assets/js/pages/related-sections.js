/**
 * Add to Shopping Cart - Related Class Sections.
 *
 * Reached only for courses with a second required component. The meeting-days
 * grid above the picker already includes the section chosen on the previous
 * screen, so a clash is visible before the second pick is committed.
 */
(function (ERP) {
  'use strict';

  var esc = ERP.esc;
  var COMP_NAME = ERP.COMP_NAME;

  ERP.renderChrome({ active: 'academic-requirements', pageName: 'Registration' });

  var pending = ERP.readPending();
  if (!pending) {
    location.replace('academic-requirements.html');
    return;
  }

  var course = ERP.getCourse(pending.courseId);
  var primaryType = course.components[0].type;
  var relatedType = course.components[1].type;
  var primarySection = ERP.resolveSection(course, primaryType, pending.sections[primaryType]);

  // The primary pick is what got us here; without it there is nothing to relate to.
  if (!primarySection) {
    location.replace('course-detail.html?course=' + encodeURIComponent(pending.courseId) + '&sections=1');
    return;
  }

  var picked = pending.sections[relatedType] || null;

  function rowsHtml() {
    return course.sections[relatedType].map(function (section) {
      var closed = section.status === 'closed';
      var isPicked = picked === section.id;
      return '<tr class="' + (isPicked ? 'picked' : '') + '">' +
        '<td class="pick">' +
          '<input type="radio" name="rel" value="' + esc(section.id) + '" ' +
            'data-action="pick-related" aria-label="Section ' + esc(section.id) + '"' +
            (isPicked ? ' checked' : '') + (closed ? ' disabled' : '') + '>' +
        '</td>' +
        '<td>' + esc(section.nbr) + '</td>' +
        '<td>' + esc(section.id) + '</td>' +
        '<td>' + esc(section.days + ' ' + section.time) + '</td>' +
        '<td>' + esc(section.room) + '</td>' +
        '<td>' + esc(section.instructor) + '</td>' +
        '<td class="center">' + ERP.statusCellHtml(section.status) + '</td>' +
      '</tr>';
    }).join('');
  }

  /** Everything already committed, plus the pair being assembled right now. */
  function gridBlocks() {
    var provisional = { courseId: pending.courseId, sections: {} };
    provisional.sections[primaryType] = primarySection;
    if (picked) provisional.sections[relatedType] = picked;
    return ERP.blocksFor(ERP.getCommitted().concat([provisional]));
  }

  function render() {
    var count = course.sections[relatedType].length;

    ERP.mount(
      ERP.idRowHtml() +
      ERP.tabsHtml('My Academics') +
      ERP.requirementsSubnavHtml() +
      '<h1 class="page-title">Add to Shopping Cart - Related Class Sections</h1>' +
      ERP.meetingDaysGridHtml(gridBlocks(), true) +
      '<p class="breadcrumb">' + esc(ERP.TERM + ' | ' + ERP.STUDENT.campus) + '<br>' +
        esc(course.code + ' - ' + course.name) + '</p>' +
      '<p class="chosen"><strong>' + esc(COMP_NAME[primaryType]) + ' selected</strong> &nbsp; Section ' +
        esc(primarySection.id) + '<br><span class="chosen-detail">' +
        esc(primarySection.days + ' ' + primarySection.time) +
        ' &nbsp; Room ' + esc(primarySection.room) + '</span></p>' +
      ERP.statusLegendHtml() +
      '<div class="grid">' +
        '<div class="grid-title">Select ' + esc(COMP_NAME[relatedType]) + ' section (Required):</div>' +
        '<div class="grid-nav"><span class="pager">1-' + count + ' of ' + count + '</span></div>' +
        '<div class="grid-scroll"><table class="data">' +
          '<thead><tr><th scope="col"><span class="sr-only">Select</span></th>' +
          '<th scope="col">Class Nbr</th><th scope="col">Section</th><th scope="col">Schedule</th>' +
          '<th scope="col">Room</th><th scope="col">Instructor</th><th scope="col">Status</th></tr></thead>' +
          '<tbody>' + rowsHtml() + '</tbody>' +
        '</table></div>' +
      '</div>' +
      '<div class="cart-actions">' +
        '<button type="button" class="ps-btn" data-action="cancel">Cancel</button>' +
        '<button type="button" class="ps-btn" id="nextBtn" data-action="next"' +
          (picked ? '' : ' disabled') + '>Next</button>' +
      '</div>' +
      ERP.goTopHtml()
    );
  }

  ERP.onChangeAction({
    'pick-related': function (input) {
      var section = ERP.resolveSection(course, relatedType, input.value);
      if (!section) return;
      picked = section.id;
      render();
    }
  });

  ERP.onAction({
    next: function () {
      if (!picked) return;
      pending.sections[relatedType] = picked;
      ERP.savePending(pending);
      location.href = 'enrollment-preferences.html?' + ERP.pendingQuery(pending);
    },

    cancel: function () {
      ERP.clearPending();
      location.href = 'course-detail.html?course=' + encodeURIComponent(pending.courseId) + '&sections=1';
    }
  });

  render();
})(window.ERP);
