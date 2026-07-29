/**
 * Add to Shopping Cart - Enrollment Preferences.
 *
 * The last screen before a course lands in the cart: it echoes the sections
 * chosen so far and, on Next, commits them.
 */
(function (ERP) {
  'use strict';

  var esc = ERP.esc;

  ERP.renderChrome({ active: 'academic-requirements', pageName: 'Registration' });

  var pending = ERP.readPending();
  if (!pending) {
    location.replace('academic-requirements.html');
    return;
  }

  var course = ERP.getCourse(pending.courseId);
  var parts = ERP.entrySections(pending);

  // Every required component must be resolved by now. If one is missing the
  // selection was truncated somewhere; send the user back to pick it again.
  if (parts.length !== course.components.length) {
    location.replace('course-detail.html?course=' + encodeURIComponent(pending.courseId) + '&sections=1');
    return;
  }

  ERP.mount(
    ERP.idRowHtml() +
    ERP.tabsHtml('My Academics') +
    ERP.requirementsSubnavHtml() +
    '<h1 class="page-title">Add to Shopping Cart - Enrollment Preferences</h1>' +
    '<p class="breadcrumb">' + esc(ERP.TERM + ' | ' + ERP.STUDENT.campus) + '<br>' +
      esc(course.code + ' - ' + course.name) + '</p>' +
    ERP.classPreferencesHtml(course, ERP.preferenceRowsHtml(course, parts)) +
    '<div class="cart-actions">' +
      '<button type="button" class="ps-btn" data-action="cancel">Cancel</button>' +
      '<button type="button" class="ps-btn" data-action="previous">Previous</button>' +
      '<button type="button" class="ps-btn primary" data-action="add-to-cart">Next</button>' +
    '</div>' +
    '<div class="spaced">' + ERP.sectionDetailTableHtml(parts) + '</div>' +
    ERP.goTopHtml()
  );

  function backToSections() {
    location.href = 'course-detail.html?course=' + encodeURIComponent(pending.courseId) + '&sections=1';
  }

  ERP.onAction({
    'add-to-cart': function () {
      var sections = {};
      parts.forEach(function (part) { sections[part.type] = part.section; });

      ERP.addToCart({ courseId: pending.courseId, sections: sections });
      ERP.clearPending();

      location.href = 'course-detail.html?course=' + encodeURIComponent(pending.courseId) +
        '&added=1&modal=1';
    },

    previous: function () {
      if (course.components.length > 1) {
        location.href = 'related-sections.html?' + ERP.pendingQuery(pending);
      } else {
        backToSections();
      }
    },

    cancel: function () {
      ERP.clearPending();
      backToSections();
    }
  });
})(window.ERP);
