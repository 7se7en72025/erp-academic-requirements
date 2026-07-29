/**
 * Add Classes to Shopping Cart -- the Validate status report.
 *
 * Validate is a dry run: it checks the cart (plus anything already enrolled)
 * for meeting-time clashes and reports, without enrolling anything.
 */
(function (ERP) {
  'use strict';

  var esc = ERP.esc;

  ERP.renderChrome({ active: 'shopping-cart', pageName: 'Registration' });

  var cart = ERP.getCart();
  var conflicts = ERP.findConflicts(ERP.getCommitted());

  function conflictMessage(conflict) {
    return 'There is a time conflict for class number ' + esc(conflict.classNbr) +
      ' and class number ' + esc(conflict.otherClassNbr) + '. There is currently a meeting time ' +
      'conflict for two of your shopping cart classes or a shopping cart class and one of your ' +
      'enrolled classes for this term. Use the class numbers to check the meeting times.';
  }

  function rowsHtml() {
    if (!cart.length) {
      return '<tr><td colspan="4" class="empty-row">Your shopping cart is empty.</td></tr>';
    }

    return cart.map(function (entry) {
      var code = ERP.getCourse(entry.courseId).code.split(' ');
      var conflict = conflicts[entry.courseId];

      var message = conflict ? conflictMessage(conflict) : 'OK to Add';
      var status = conflict
        ? '<span class="xmark">&#10008;</span><span class="sr-only">Potential Problem</span>'
        : '<span class="chk">&#10003;</span><span class="sr-only">OK to Add</span>';

      return '<tr>' +
        '<td>' + esc(code[0]) + '</td>' +
        '<td>' + esc(code[1]) + '</td>' +
        '<td>' + message + '</td>' +
        '<td class="center">' + status + '</td>' +
      '</tr>';
    }).join('');
  }

  ERP.mount(
    ERP.idRowHtml() +
    ERP.tabsHtml('Plan') +
    ERP.shoppingCartSubnavHtml() +
    '<h1 class="page-title">Shopping Cart</h1>' +
    '<h2 class="page-title plain">Add Classes to Shopping Cart</h2>' +
    '<p class="breadcrumb">View the following status report for enrollment confirmations and errors</p>' +
    ERP.legendHtml([
      { glyph: 'chk', symbol: '&#10003;', label: 'OK to Add' },
      { glyph: 'xmark', symbol: '&#10008;', label: 'Potential Problem' }
    ]) +
    '<div class="grid-scroll indented"><table class="data">' +
      '<thead><tr><th scope="col" colspan="2">Description</th>' +
      '<th scope="col">Message</th><th scope="col">Status</th></tr></thead>' +
      '<tbody>' + rowsHtml() + '</tbody>' +
    '</table></div>' +
    '<div class="cart-actions">' +
      '<button type="button" class="ps-btn" data-action="back-to-cart">Registration Cart</button>' +
      '<button type="button" class="ps-btn primary" data-action="proceed">Proceed to Enroll</button>' +
    '</div>' +
    ERP.goTopHtml()
  );

  ERP.onAction({
    'back-to-cart': function () { location.href = 'shopping-cart.html'; },
    proceed: function () { location.href = 'enroll-results.html'; }
  });
})(window.ERP);
