/**
 * Autoplay walkthrough: drives the whole registration flow with a synthetic
 * cursor, so the result can be screen-recorded without anyone clicking along.
 *
 * Start it at `student-homepage.html?demo=1`. Progress lives in sessionStorage
 * so the run survives the page navigations the flow makes.
 *
 *   ?speed=0.5   half pace          ?speed=2   double pace
 *   ?caption=0   hide the captions  Escape     stop a run in progress
 */
(function (ERP) {
  'use strict';

  var RUNNING_KEY = 'erp_demo_on';
  var STEP_KEY = 'erp_demo_idx';

  var query = new URLSearchParams(location.search);
  var speed = parseFloat(query.get('speed')) || 1;

  // Pacing in milliseconds, before the speed multiplier. Tuned to read as
  // deliberate rather than snappy -- this is meant to be watched, not used.
  var TIMING = {
    settle: 900,   // after a page load, before the first move
    move: 950,     // cursor travel
    aim: 400,      // resting on the target before the click
    press: 420,    // click ripple
    after: 950,    // pause after a click, before the next step
    scroll: 650    // wait for smooth scrolling to finish
  };

  function ms(value) { return value / speed; }
  function sleep(value) { return new Promise(function (resolve) { setTimeout(resolve, ms(value)); }); }

  // Which courses to register and which sections to pick. All open sections,
  // and no meeting-time clashes between them, so Validate reports every row as
  // OK to Add.
  var PLAN = [
    { id: 'CHEMF110', name: 'CHEM F110', picks: ['P1'] },
    { id: 'CHEMF111', name: 'CHEM F111', picks: ['L1', 'T1'] },
    { id: 'EEEF111', name: 'EEE F111', picks: ['L1', 'T1'] },
    { id: 'MATHF111', name: 'MATH F111', picks: ['L1', 'T1'] },
    { id: 'MEF112', name: 'ME F112', picks: ['L1', 'P1'] },
    { id: 'PHYF110', name: 'PHY F110', picks: ['P1'] },
    { id: 'PHYF111', name: 'PHY F111', picks: ['L1', 'T1'] }
  ];

  function currentPage() {
    var file = location.pathname.split('/').pop() || 'index.html';
    return file.replace('.html', '');
  }

  function byAction(action, attributes) {
    return document.querySelector('[data-action="' + action + '"]' + (attributes || ''));
  }

  function byText(selector, text) {
    return ERP.qsa(selector).filter(function (el) {
      return (el.textContent || '').trim() === text;
    })[0];
  }

  // ---- the step list ------------------------------------------------------

  var steps = [];
  function step(page, caption, find) { steps.push({ page: page, caption: caption, find: find }); }

  step('student-homepage', 'Open Registration from the Student Homepage', function () {
    // Scoped to the tile: the sidebar links to the same page and comes first
    // in the DOM, so an unscoped selector picks the wrong target.
    return document.querySelector('a.tile[href*="academic-requirements"]');
  });

  PLAN.forEach(function (course) {
    step('academic-requirements', 'Open ' + course.name, function () {
      return document.querySelector('a[href*="course=' + course.id + '"]');
    });
    step('course-detail', 'Show the sections offered for ' + course.name, function () {
      // Two buttons reveal the sections; the demo uses the lower one so the
      // cursor travels past the course facts on its way there.
      return byText('button.ps-btn', 'Show Sections');
    });
    step('course-detail', 'Select section ' + course.picks[0], function () {
      return byAction('select-section', '[data-section="' + course.picks[0] + '"]');
    });

    if (course.picks.length > 1) {
      step('related-sections', 'Pick the required ' + course.picks[1] + ' section', function () {
        return document.querySelector('input[name="rel"][value="' + course.picks[1] + '"]');
      });
      step('related-sections', 'Confirm the section pair', function () {
        return byAction('next');
      });
    }

    step('enrollment-preferences', 'Add ' + course.name + ' to the cart', function () {
      return byAction('add-to-cart');
    });
    step('course-detail', 'Acknowledge the confirmation', function () {
      return byAction('close-modal');
    });
    step('course-detail', 'Back to My Academic Requirements', function () {
      return byText('a', 'Return to My Academic Requirements');
    });
  });

  step('academic-requirements', 'All seven courses are in the cart — open it', function () {
    return document.querySelector('.sidebar a[href*="shopping-cart"]');
  });
  step('shopping-cart', 'Select every class in the cart', function () {
    return byAction('select-all');
  });
  step('shopping-cart', 'Validate the cart for clashes', function () {
    return byAction('validate');
  });
  step('validate-results', 'No conflicts — proceed to enroll', function () {
    return byAction('proceed');
  });

  // Step 1 of the wizard walks the cart one course at a time; the last Next
  // moves the wizard on to Confirm classes.
  PLAN.forEach(function (course, i) {
    step('enroll-results', 'Review ' + course.name + ' (' + (i + 1) + ' of ' + PLAN.length + ')', function () {
      return byAction('next-course');
    });
  });
  step('enroll-results', 'Finish registration', function () {
    return byAction('finish');
  });
  step('enroll-results', 'All classes added — open the timetable', function () {
    return byAction('view-schedule');
  });
  step('weekly-schedule', null, null);   // terminal: nothing left to click

  // ---- cursor and caption chrome -----------------------------------------

  var cursor, ripple, caption;
  var position = { x: 90, y: 90 };
  var stopped = false;

  function buildOverlay() {
    cursor = document.createElement('div');
    cursor.className = 'demo-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.style.transform = 'translate(' + position.x + 'px,' + position.y + 'px)';
    cursor.innerHTML =
      '<svg viewBox="0 0 24 24" width="26" height="26">' +
        '<path d="M4 2 L4 20 L9 15.5 L12.2 22 L15.4 20.4 L12.2 14.2 L19 14 Z" ' +
          'fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/>' +
      '</svg>';

    ripple = document.createElement('div');
    ripple.className = 'demo-ripple';
    ripple.setAttribute('aria-hidden', 'true');

    caption = document.createElement('div');
    caption.className = 'demo-caption';
    caption.setAttribute('role', 'status');
    if (query.get('caption') === '0') caption.hidden = true;

    document.body.appendChild(ripple);
    document.body.appendChild(cursor);
    document.body.appendChild(caption);
  }

  function say(text) {
    if (!text) return;
    caption.textContent = text;
    caption.classList.add('visible');
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function moveTo(x, y) {
    return new Promise(function (done) {
      var from = { x: position.x, y: position.y };
      var distance = Math.hypot(x - from.x, y - from.y);
      if (distance < 1) return done();

      // Short hops should not take as long as a cross-screen sweep.
      var duration = ms(TIMING.move) * Math.min(1, 0.35 + distance / 900);
      var startedAt = performance.now();

      (function frame(now) {
        if (stopped) return done();
        var progress = Math.min(1, (now - startedAt) / duration);
        var eased = easeInOutCubic(progress);
        position.x = from.x + (x - from.x) * eased;
        position.y = from.y + (y - from.y) * eased;
        cursor.style.transform = 'translate(' + position.x + 'px,' + position.y + 'px)';
        if (progress < 1) requestAnimationFrame(frame); else done();
      })(performance.now());
    });
  }

  function clickFlash() {
    cursor.classList.add('pressed');

    ripple.style.transition = 'none';
    ripple.style.transform = 'translate(' + position.x + 'px,' + position.y + 'px) scale(.3)';
    ripple.style.opacity = '1';

    // Next frame, so the reset above paints before the grow starts.
    requestAnimationFrame(function () {
      ripple.style.transition = 'transform ' + ms(TIMING.press) + 'ms ease-out, ' +
        'opacity ' + ms(TIMING.press) + 'ms ease-out';
      ripple.style.transform = 'translate(' + position.x + 'px,' + position.y + 'px) scale(1.9)';
      ripple.style.opacity = '0';
    });

    setTimeout(function () { cursor.classList.remove('pressed'); }, ms(160));
    return sleep(TIMING.press);
  }

  /** Targets are often below the fold on these long pages. */
  function reveal(element) {
    var box = element.getBoundingClientRect();
    if (box.top > 90 && box.bottom < window.innerHeight - 110) return Promise.resolve();
    element.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return sleep(TIMING.scroll);
  }

  /** The page may still be rendering when we arrive, so retry briefly. */
  function waitFor(find) {
    return new Promise(function (done) {
      var tries = 0;
      (function poll() {
        if (stopped) return done(null);

        var element;
        try { element = find(); } catch (e) { element = null; }
        if (element) return done(element);

        if (++tries > 25) return done(null);
        setTimeout(poll, 200);
      })();
    });
  }

  function stepIndex() { return parseInt(sessionStorage.getItem(STEP_KEY) || '0', 10); }
  function setStepIndex(n) { sessionStorage.setItem(STEP_KEY, String(n)); }

  function finish(message) {
    sessionStorage.removeItem(RUNNING_KEY);
    say(message);
    cursor.classList.add('done');
  }

  async function run() {
    buildOverlay();
    await sleep(TIMING.settle);

    while (!stopped) {
      var index = stepIndex();
      var current = steps[index];

      if (!current) return finish('Walkthrough complete.');

      if (current.page !== currentPage()) {
        // Landed somewhere the script did not expect. Stop rather than click
        // blindly on whatever happens to be under the cursor.
        return finish('Walkthrough paused (unexpected page: ' + currentPage() + ').');
      }

      if (!current.find) {   // terminal step
        window.scrollTo({ top: document.body.scrollHeight * 0.35, behavior: 'smooth' });
        return finish('Registration complete — this is the weekly timetable.');
      }

      say(current.caption);

      var target = await waitFor(current.find);
      if (!target) return finish('Walkthrough stopped: could not find "' + current.caption + '".');

      await reveal(target);
      var box = target.getBoundingClientRect();
      await moveTo(box.left + box.width / 2, box.top + box.height / 2);
      await sleep(TIMING.aim);
      await clickFlash();

      // Advance before clicking: the click usually navigates, and the next page
      // load has to pick up at the following step.
      setStepIndex(index + 1);
      target.click();

      await sleep(TIMING.after);
    }
  }

  function start() {
    ERP.clearAll();
    sessionStorage.setItem(RUNNING_KEY, '1');
    setStepIndex(0);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !sessionStorage.getItem(RUNNING_KEY)) return;
    stopped = true;
    sessionStorage.removeItem(RUNNING_KEY);
    if (caption) say('Walkthrough stopped.');
  });

  window.addEventListener('load', function () {
    if (query.get('demo') === '1') start();
    else if (sessionStorage.getItem(RUNNING_KEY) !== '1') return;
    run();
  });
})(window.ERP);
