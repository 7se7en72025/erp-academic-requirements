/**
 * Turning section timings into something the timetable grids and the clash
 * checker can reason about.
 *
 * Sections describe themselves the way the printed timetable does -- "MoWeFr",
 * "9:00AM - 9:50AM" -- so everything here is about getting from those strings to
 * whole-hour grid columns.
 */
window.ERP = window.ERP || {};
(function (ERP) {
  'use strict';

  var getCourse = ERP.getCourse;
  var entrySections = ERP.entrySections;
  var COMP_ABBR = ERP.COMP_ABBR;

  // The grid runs 8AM to 6PM, which is every slot the timetable actually uses.
  var DAY_START_HOUR = 8;
  var DAY_END_HOUR = 18;

  var TIME_RANGE = /(\d+):(\d+)(AM|PM)\s*-\s*(\d+):(\d+)(AM|PM)/;

  /** "MoWeFr" -> ["Mo", "We", "Fr"] */
  function splitDays(days) {
    return String(days || '').match(/[A-Z][a-z]/g) || [];
  }

  function to24Hour(hour, meridiem) {
    var h = Number(hour) % 12;
    return meridiem === 'PM' ? h + 12 : h;
  }

  /**
   * "9:00AM - 9:50AM" -> { start: 9, end: 10 }, as whole grid columns.
   *
   * A class ending at :50 still occupies its hour, so any non-zero end minute
   * rounds the end up to the next column.
   */
  function slotRange(time) {
    var m = TIME_RANGE.exec(String(time || ''));
    if (!m) return null;
    var start = to24Hour(m[1], m[3]);
    var end = to24Hour(m[4], m[6]) + (Number(m[5]) > 0 ? 1 : 0);
    return { start: start, end: Math.max(end, start + 1) };
  }

  /**
   * Flatten cart/enrolled entries into one block per day per section:
   * { day, start, end, courseId, code, comp, section, label }.
   */
  function blocksFor(entries) {
    var blocks = [];
    entries.forEach(function (entry) {
      var course = getCourse(entry.courseId);
      if (!course) return;

      entrySections(entry).forEach(function (part) {
        var range = slotRange(part.section.time);
        if (!range) return;

        splitDays(part.section.days).forEach(function (day) {
          blocks.push({
            day: day,
            start: range.start,
            end: range.end,
            courseId: entry.courseId,
            code: course.code,
            comp: part.type,
            section: part.section,
            label: course.code.replace(/\s+/g, '-') + '(' + COMP_ABBR[part.type] + ')'
          });
        });
      });
    });
    return blocks;
  }

  function overlaps(a, b) {
    return a.day === b.day && a.start < b.end && b.start < a.end;
  }

  /**
   * Find every course whose meeting times collide with another course's.
   *
   * Returns a lookup of courseId -> { classNbr, otherClassNbr } holding the
   * first collision found for that course, which is all the status report
   * shows. Blocks are built once per entry rather than once per comparison.
   */
  function findConflicts(entries) {
    var expanded = entries.map(function (entry) {
      return { courseId: entry.courseId, blocks: blocksFor([entry]) };
    });

    var conflicts = Object.create(null);

    for (var i = 0; i < expanded.length; i++) {
      for (var j = i + 1; j < expanded.length; j++) {
        if (expanded[i].courseId === expanded[j].courseId) continue;

        var hit = firstOverlap(expanded[i].blocks, expanded[j].blocks);
        if (!hit) continue;

        if (!conflicts[expanded[i].courseId]) {
          conflicts[expanded[i].courseId] = { classNbr: hit.a.section.nbr, otherClassNbr: hit.b.section.nbr };
        }
        if (!conflicts[expanded[j].courseId]) {
          conflicts[expanded[j].courseId] = { classNbr: hit.b.section.nbr, otherClassNbr: hit.a.section.nbr };
        }
      }
    }

    return conflicts;
  }

  function firstOverlap(mine, theirs) {
    for (var a = 0; a < mine.length; a++) {
      for (var b = 0; b < theirs.length; b++) {
        if (overlaps(mine[a], theirs[b])) return { a: mine[a], b: theirs[b] };
      }
    }
    return null;
  }

  ERP.DAY_START_HOUR = DAY_START_HOUR;
  ERP.DAY_END_HOUR = DAY_END_HOUR;
  ERP.splitDays = splitDays;
  ERP.slotRange = slotRange;
  ERP.blocksFor = blocksFor;
  ERP.findConflicts = findConflicts;
})(window.ERP);
