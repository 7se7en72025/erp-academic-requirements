/**
 * Walkthrough state: the shopping cart, the enrolled classes, and the
 * half-finished selection that travels between the section-picker screens.
 *
 * Two deliberate quirks live here.
 *
 * 1. Everything is written to *both* localStorage and sessionStorage, and read
 *    from localStorage first. Either store can be unavailable -- private modes,
 *    blocked site data, pages opened straight off the filesystem -- and losing
 *    the cart mid-demo is worse than writing twice.
 *
 * 2. Reloading a page wipes the state on purpose, so the walkthrough always
 *    starts from an empty cart. Navigating between pages preserves it.
 */
window.ERP = window.ERP || {};
(function (ERP) {
  'use strict';

  var getCourse = ERP.getCourse;
  var resolveSection = ERP.resolveSection;

  var KEYS = ['erp_demo_cart', 'erp_demo_enrolled', 'erp_demo_pending'];
  var CART = KEYS[0];
  var ENROLLED = KEYS[1];
  var PENDING = KEYS[2];

  function read(key, fallback) {
    var raw = null;
    try { raw = localStorage.getItem(key); } catch (e) { /* storage blocked */ }
    if (raw === null || raw === undefined) {
      try { raw = sessionStorage.getItem(key); } catch (e) { /* storage blocked */ }
    }
    if (raw === null || raw === undefined) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

  function write(key, value) {
    var json = JSON.stringify(value);
    try { localStorage.setItem(key, json); } catch (e) { /* storage blocked */ }
    try { sessionStorage.setItem(key, json); } catch (e) { /* storage blocked */ }
  }

  function drop(key) {
    try { localStorage.removeItem(key); } catch (e) { /* storage blocked */ }
    try { sessionStorage.removeItem(key); } catch (e) { /* storage blocked */ }
  }

  /**
   * Keep only entries that still name a course in the catalogue.
   *
   * Stored state outlives the code that wrote it: a browser holding a cart from
   * an older build would otherwise hand a page a course id it cannot resolve,
   * and every `COURSES[id].code` downstream would throw.
   */
  function usableEntries(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(function (entry) {
      return entry && getCourse(entry.courseId) && entry.sections && typeof entry.sections === 'object';
    });
  }

  function getCart() { return usableEntries(read(CART, [])); }
  function saveCart(cart) { write(CART, cart); }

  function addToCart(entry) {
    var rest = getCart().filter(function (c) { return c.courseId !== entry.courseId; });
    saveCart(rest.concat([entry]));
  }

  function removeFromCart(courseId) {
    saveCart(getCart().filter(function (c) { return c.courseId !== courseId; }));
  }

  function getEnrolled() { return usableEntries(read(ENROLLED, [])); }
  function saveEnrolled(list) { write(ENROLLED, list); }

  /** Everything the timetable and the clash checker have to consider. */
  function getCommitted() { return getEnrolled().concat(getCart()); }

  function getPending() { return sanitisePending(read(PENDING, null)); }
  function savePending(pending) { write(PENDING, pending); }
  function clearPending() { drop(PENDING); }

  function clearAll() { KEYS.forEach(drop); }

  /**
   * Reduce a candidate selection to the parts that name real sections.
   *
   * This is the trust boundary: `readPending` feeds it whatever is in the query
   * string. Anything that does not match a section the catalogue actually
   * offers is dropped here, so no attacker-chosen string ever reaches the DOM.
   */
  function sanitisePending(candidate) {
    var course = candidate && getCourse(candidate.courseId);
    if (!course || !candidate.sections) return null;

    var sections = {};
    course.components.forEach(function (comp) {
      var section = resolveSection(course, comp.type, candidate.sections[comp.type]);
      if (section) sections[comp.type] = section.id;
    });

    return Object.keys(sections).length ? { courseId: candidate.courseId, sections: sections } : null;
  }

  /**
   * Serialise the in-progress selection for the next screen's URL, as
   * `course=CHEMF111&sec=L1,T1`.
   *
   * The URL is the source of truth for this one piece of state, not storage.
   * Storage is not always shared across a navigation -- opened over file://,
   * site data blocked, strict privacy modes -- and when it wasn't, the
   * selection vanished and the user got bounced back to the requirements page
   * with no explanation. Query parameters always survive a navigation.
   */
  function pendingQuery(pending) {
    var course = getCourse(pending.courseId);
    var ids = course.components.map(function (comp) {
      var ref = pending.sections[comp.type];
      if (!ref) return '';
      return typeof ref === 'string' ? ref : ref.id;
    });
    return 'course=' + encodeURIComponent(pending.courseId) + '&sec=' + encodeURIComponent(ids.join(','));
  }

  /** Read the in-progress selection from the URL, falling back to storage. */
  function readPending() {
    var params = new URLSearchParams(location.search);
    var course = getCourse(params.get('course'));

    if (course) {
      var ids = (params.get('sec') || '').split(',');
      var sections = {};
      course.components.forEach(function (comp, i) { sections[comp.type] = ids[i]; });

      var fromUrl = sanitisePending({ courseId: params.get('course'), sections: sections });
      if (fromUrl) {
        savePending(fromUrl);
        return fromUrl;
      }
    }

    return getPending();
  }

  /**
   * Wipe the walkthrough state when the page was reloaded rather than navigated
   * to, so a refresh always restarts the demo from an empty cart. The
   * Navigation Timing API is what tells the two apart.
   */
  function clearOnReload() {
    var reloaded = false;
    try {
      var entries = performance.getEntriesByType && performance.getEntriesByType('navigation');
      if (entries && entries.length) {
        reloaded = entries[0].type === 'reload';
      } else if (performance.navigation) {
        reloaded = performance.navigation.type === 1; // deprecated fallback
      }
    } catch (e) { /* timing API unavailable; leave the state alone */ }

    if (reloaded) clearAll();
  }

  // Must happen before any page reads the cart, and this file loads first.
  clearOnReload();

  ERP.getCart = getCart;
  ERP.saveCart = saveCart;
  ERP.addToCart = addToCart;
  ERP.removeFromCart = removeFromCart;
  ERP.getEnrolled = getEnrolled;
  ERP.saveEnrolled = saveEnrolled;
  ERP.getCommitted = getCommitted;
  ERP.getPending = getPending;
  ERP.savePending = savePending;
  ERP.clearPending = clearPending;
  ERP.clearAll = clearAll;
  ERP.pendingQuery = pendingQuery;
  ERP.readPending = readPending;
})(window.ERP);
