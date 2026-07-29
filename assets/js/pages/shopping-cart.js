/**
 * Enrollment Shopping Cart -- everything picked so far, with the Validate and
 * Enroll buttons that lead out of it.
 *
 * The cart lists one row per component, the way the real one does, with the
 * checkbox and unit count only on a course's first row.
 */
(function (ERP) {
  'use strict';

  var esc = ERP.esc;
  var COMP_NAME = ERP.COMP_NAME;
  var TERM = ERP.TERM;

  ERP.renderChrome({ active: 'shopping-cart', pageName: 'Registration' });

  function cartRowsHtml() {
    var cart = ERP.getCart();
    if (!cart.length) {
      return '<tr><td colspan="8" class="empty-row">Your shopping cart is empty.</td></tr>';
    }

    // Walk the catalogue order rather than insertion order, so the cart reads
    // the same however the courses were added.
    return ERP.COURSE_ORDER.map(function (courseId) {
      var entry = cart.filter(function (c) { return c.courseId === courseId; })[0];
      if (!entry) return '';

      var course = ERP.getCourse(courseId);
      return ERP.entrySections(entry).map(function (part, index) {
        var isFirstRow = index === 0;
        var section = part.section;
        return '<tr>' +
          '<td class="pick">' + (isFirstRow
            ? '<input type="checkbox" class="cartchk" value="' + esc(courseId) + '" ' +
              'aria-label="Select ' + esc(course.code) + '">'
            : '') + '</td>' +
          '<td>' + esc(course.code + '-' + section.id) + '<br>(' + esc(section.nbr) + ')</td>' +
          '<td>' + esc(course.name) + '<br>(' + esc(COMP_NAME[part.type]) + ')</td>' +
          '<td>' + esc(section.days + ' ' + section.time) + '</td>' +
          '<td>' + esc(section.room) + '</td>' +
          '<td>' + esc(section.instructor) + '</td>' +
          '<td class="num">' + (isFirstRow ? course.units.toFixed(2) : '') + '</td>' +
          '<td class="center">' + ERP.statusCellHtml(section.status) + '</td>' +
        '</tr>';
      }).join('');
    }).join('');
  }

  function enrolledScheduleHtml() {
    var enrolled = ERP.getEnrolled();
    if (!enrolled.length) {
      return '<p class="centred">You are not registered for classes in this term.</p>';
    }

    var rows = enrolled.map(function (entry) {
      var course = ERP.getCourse(entry.courseId);
      return ERP.entrySections(entry).map(function (part) {
        var section = part.section;
        return '<tr>' +
          '<td>' + esc(course.code + '-' + section.id) + '</td>' +
          '<td>' + esc(course.name) + '</td>' +
          '<td>' + esc(section.days + ' ' + section.time) + '</td>' +
          '<td>' + esc(section.room) + '</td>' +
          '<td>' + esc(section.instructor) + '</td>' +
        '</tr>';
      }).join('');
    }).join('');

    return '<div class="grid-scroll"><table class="data">' +
      '<thead><tr><th scope="col">Class</th><th scope="col">Description</th>' +
      '<th scope="col">Days/Times</th><th scope="col">Room</th>' +
      '<th scope="col">Instructor</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
    '</table></div>';
  }

  function render() {
    ERP.mount(
      ERP.idRowHtml() +
      ERP.tabsHtml('Plan') +
      ERP.shoppingCartSubnavHtml() +
      '<h1 class="page-title">Shopping Cart</h1>' +
      '<div class="panel">' +
        '<div class="panel-title">Registration Slot Details</div>' +
        '<div class="grid-scroll"><table class="data">' +
          '<thead><tr><th scope="col">Priority Number</th><th scope="col">Registration Date</th>' +
          '<th scope="col">Start Time</th><th scope="col">End Time</th></tr></thead>' +
          '<tbody><tr><td>1</td><td>28/07/2026</td><td>9:00AM</td><td>11:59PM</td></tr></tbody>' +
        '</table></div>' +
      '</div>' +
      ERP.statusLegendHtml() +
      '<div class="cart-layout">' +
        '<div class="cart-rail">' +
          '<div class="rail-head"><strong>Add to Cart</strong></div>' +
          '<div><a href="academic-requirements.html">Enter Class Nbr</a></div>' +
          '<div class="rail-head"><strong>Find Classes</strong></div>' +
          '<div><label><input type="radio" name="find" checked> Class Search</label></div>' +
        '</div>' +
        '<div class="cart-main">' +
          '<div class="grid flush">' +
            '<div class="grid-title">' + esc(TERM) + ' Shopping Cart</div>' +
            '<div class="grid-scroll"><table class="data">' +
              '<thead><tr><th scope="col">Select</th><th scope="col">Class</th>' +
              '<th scope="col">Description</th><th scope="col">Days/Times</th><th scope="col">Room</th>' +
              '<th scope="col">Instructor</th><th scope="col">Units</th>' +
              '<th scope="col">Status</th></tr></thead>' +
              '<tbody>' + cartRowsHtml() + '</tbody>' +
            '</table></div>' +
          '</div>' +
          '<div class="cart-actions">' +
            '<button type="button" class="ps-btn" data-action="select-all">Select All</button>' +
            '<span>for selected</span>' +
            '<button type="button" class="ps-btn" data-action="delete-selected">Delete</button>' +
            '<button type="button" class="ps-btn" data-action="validate">Validate</button>' +
            '<button type="button" class="ps-btn primary" data-action="enroll">Enroll</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="req-sub spaced">My ' + esc(TERM) + ' Class Schedule</div>' +
      enrolledScheduleHtml() +
      ERP.goTopHtml()
    );
  }

  function requireCart() {
    if (ERP.getCart().length) return true;
    alert('Your shopping cart is empty.');
    return false;
  }

  ERP.onAction({
    'select-all': function () {
      ERP.qsa('.cartchk').forEach(function (box) { box.checked = true; });
    },

    'delete-selected': function () {
      var ids = ERP.qsa('.cartchk:checked').map(function (box) { return box.value; });
      if (!ids.length) {
        alert('Select at least one class first.');
        return;
      }
      ids.forEach(ERP.removeFromCart);
      // Re-render rather than reload. A reload deliberately restarts the
      // walkthrough, which would empty the whole cart instead of the one row.
      render();
    },

    validate: function () {
      if (requireCart()) location.href = 'validate-results.html';
    },

    enroll: function () {
      if (requireCart()) location.href = 'enroll-results.html';
    }
  });

  render();
})(window.ERP);
