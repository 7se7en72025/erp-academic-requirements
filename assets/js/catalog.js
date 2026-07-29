/**
 * The made-up course catalogue the walkthrough runs on.
 *
 * Nothing in here is real. The student, the instructor names, and the class
 * numbers, rooms, timings and exam dates were all invented to make the screens
 * look plausible. Any resemblance to actual faculty is accidental -- check the
 * actual ERP and the official timetable PDF for anything you intend to act on.
 */
window.ERP = window.ERP || {};
(function (ERP) {
  'use strict';

  // The name and ID shown in the header of every page.
  var STUDENT = Object.freeze({
    name: 'NSA RaIYYAN',
    id: '2024A2PS1312P',
    instance: '777  -  SISDEMO',
    campus: 'Birla Institute of Tech & Sci | First Degree'
  });

  var TERM = 'FIRST SEMESTER 2026-2027';

  // Every section runs for the whole teaching term; the real portal prints the
  // range on each row, so the pages that show it all read it from here.
  var TERM_DATES = '03/08/2026 - 12/12/2026';

  // Course components. L = Lecture, T = Tutorial, P = Laboratory/Practical.
  var COMP_NAME = Object.freeze({ L: 'Lecture', T: 'Tutorial', P: 'Laboratory' });
  var COMP_ABBR = Object.freeze({ L: 'LEC', T: 'TUT', P: 'LAB' });

  // Section status vocabulary, shared by the legend and every status cell.
  var STATUS = Object.freeze({
    open: { label: 'Open', className: 'open' },
    closed: { label: 'Closed', className: 'closed' },
    wait: { label: 'Wait List', className: 'wait' }
  });

  var COURSES = {
    CHEMF110: {
      code: 'CHEM F110', name: 'CHEMISTRY LABORATORY', units: 1,
      dept: 'Dept of Chemistry', acadGroup: 'Science',
      components: [{ type: 'P', required: true }],
      sections: {
        P: [
          { id: 'P1', nbr: 1844, days: 'Tu', time: '2:00PM - 4:50PM', room: 'Chem Lab 1', instructor: 'PROF. S. KUMAR', exam: '', fnan: 'AN', status: 'open' },
          { id: 'P2', nbr: 1845, days: 'We', time: '2:00PM - 4:50PM', room: 'Chem Lab 2', instructor: 'PROF. M. IYER', exam: '', fnan: 'AN', status: 'open' }
        ]
      }
    },
    CHEMF111: {
      code: 'CHEM F111', name: 'GENERAL CHEMISTRY', units: 3,
      dept: 'Dept of Chemistry', acadGroup: 'Science',
      components: [{ type: 'L', required: true }, { type: 'T', required: true }],
      sections: {
        L: [
          { id: 'L1', nbr: 1855, days: 'MoWeFr', time: '9:00AM - 9:50AM', room: 'LT-1', instructor: 'PROF. R. NAIR', exam: '21/12/2026', fnan: 'FN', status: 'open' },
          { id: 'L2', nbr: 1856, days: 'MoWeFr', time: '12:00PM - 12:50PM', room: 'LT-2', instructor: 'PROF. A. DESAI', exam: '21/12/2026', fnan: 'FN', status: 'closed' }
        ],
        T: [
          { id: 'T1', nbr: 1860, days: 'Th', time: '10:00AM - 10:50AM', room: 'Room 201', instructor: 'PROF. V. RAO', exam: '', fnan: '', status: 'open' },
          { id: 'T2', nbr: 1861, days: 'Sa', time: '8:00AM - 8:50AM', room: 'Room 202', instructor: 'PROF. N. JOSHI', exam: '', fnan: '', status: 'open' }
        ]
      }
    },
    EEEF111: {
      code: 'EEE F111', name: 'ELECTRICAL SCIENCES', units: 3,
      dept: 'Dept of Electrical & Elec Engg', acadGroup: 'Engineering',
      components: [{ type: 'L', required: true }, { type: 'T', required: true }],
      sections: {
        L: [
          { id: 'L1', nbr: 1877, days: 'TuThSa', time: '9:00AM - 9:50AM', room: 'LT-3', instructor: 'PROF. P. MENON', exam: '14/12/2026', fnan: 'AN', status: 'open' },
          { id: 'L2', nbr: 1878, days: 'TuThSa', time: '11:00AM - 11:50AM', room: 'LT-4', instructor: 'PROF. K. BANERJEE', exam: '14/12/2026', fnan: 'AN', status: 'closed' }
        ],
        T: [
          { id: 'T1', nbr: 1885, days: 'Mo', time: '1:00PM - 1:50PM', room: 'Room 105', instructor: 'PROF. T. GHOSH', exam: '', fnan: '', status: 'open' },
          { id: 'T2', nbr: 1886, days: 'Tu', time: '4:00PM - 4:50PM', room: 'Room 106', instructor: 'PROF. D. PILLAI', exam: '', fnan: '', status: 'closed' }
        ]
      }
    },
    MATHF111: {
      code: 'MATH F111', name: 'MATHEMATICS I', units: 3,
      dept: 'Dept of Mathematics', acadGroup: 'Science',
      components: [{ type: 'L', required: true }, { type: 'T', required: true }],
      sections: {
        L: [
          { id: 'L1', nbr: 1901, days: 'MoWeFr', time: '8:00AM - 8:50AM', room: 'LT-5', instructor: 'PROF. H. SHETTY', exam: '07/12/2026', fnan: 'FN', status: 'open' }
        ],
        T: [
          { id: 'T1', nbr: 1910, days: 'We', time: '3:00PM - 3:50PM', room: 'Room 301', instructor: 'PROF. G. VERMA', exam: '', fnan: '', status: 'open' },
          { id: 'T2', nbr: 1911, days: 'We', time: '4:00PM - 4:50PM', room: 'Room 302', instructor: 'PROF. L. MISHRA', exam: '', fnan: '', status: 'wait' }
        ]
      }
    },
    MEF112: {
      code: 'ME F112', name: 'WORKSHOP PRACTICE', units: 2,
      dept: 'Dept of Mechanical Engg', acadGroup: 'Engineering',
      components: [{ type: 'L', required: true }, { type: 'P', required: true }],
      sections: {
        L: [
          { id: 'L1', nbr: 2730, days: 'Th', time: '8:00AM - 8:50AM', room: 'LT-6', instructor: 'PROF. J. CHATTERJEE', exam: '', fnan: '', status: 'open' }
        ],
        P: [
          { id: 'P1', nbr: 2736, days: 'Fr', time: '2:00PM - 4:50PM', room: 'Workshop 1', instructor: 'PROF. B. SETHI', exam: '', fnan: '', status: 'open' },
          { id: 'P2', nbr: 2737, days: 'Tu', time: '12:00PM - 2:50PM', room: 'Workshop 2', instructor: 'PROF. C. DUTTA', exam: '', fnan: '', status: 'closed' },
          { id: 'P3', nbr: 2738, days: 'Mo', time: '9:00AM - 11:50AM', room: 'Workshop 1', instructor: 'PROF. Y. BHAT', exam: '', fnan: '', status: 'closed' }
        ]
      }
    },
    PHYF110: {
      code: 'PHY F110', name: 'PHYSICS LABORATORY', units: 1,
      dept: 'Dept of Physics', acadGroup: 'Science',
      components: [{ type: 'P', required: true }],
      sections: {
        P: [
          { id: 'P1', nbr: 1920, days: 'Mo', time: '2:00PM - 4:50PM', room: 'Physics Lab 1', instructor: 'PROF. U. KULKARNI', exam: '', fnan: 'AN', status: 'open' },
          { id: 'P2', nbr: 1921, days: 'Th', time: '2:00PM - 4:50PM', room: 'Physics Lab 2', instructor: 'PROF. E. RANGAN', exam: '', fnan: 'AN', status: 'open' }
        ]
      }
    },
    PHYF111: {
      code: 'PHY F111', name: 'MECH OSCILLATIONS & WAVE', units: 3,
      dept: 'Dept of Physics', acadGroup: 'Science',
      components: [{ type: 'L', required: true }, { type: 'T', required: true }],
      sections: {
        L: [
          { id: 'L1', nbr: 1930, days: 'MoWeFr', time: '10:00AM - 10:50AM', room: 'LT-7', instructor: 'PROF. O. SAXENA', exam: '10/12/2026', fnan: 'FN', status: 'open' }
        ],
        T: [
          { id: 'T1', nbr: 1940, days: 'Sa', time: '10:00AM - 10:50AM', room: 'Room 401', instructor: 'PROF. F. NADKARNI', exam: '', fnan: '', status: 'open' },
          { id: 'T2', nbr: 1941, days: 'Sa', time: '11:00AM - 11:50AM', room: 'Room 402', instructor: 'PROF. W. PRASAD', exam: '', fnan: '', status: 'open' }
        ]
      }
    }
  };

  var COURSE_ORDER = ['CHEMF110', 'CHEMF111', 'EEEF111', 'MATHF111', 'MEF112', 'PHYF110', 'PHYF111'];

  // Requirement tree. Only Sem 1 is wired up to the registration flow; the later
  // semesters are listed so the page has the shape of the real report.
  var PROGRAM = {
    plan: 'Computer Science',
    subplan: 'Computer Sc. FS PS PILON',
    unitsRequired: 144,
    coursesRequired: 42,
    gpaRequired: '4.500',
    semesters: [
      { name: 'Year 1 Sem 1', open: true, required: 7, courseIds: COURSE_ORDER },
      { name: 'Year 1 Sem 2', open: false, required: 8, courses: [
        { code: 'BITS F110', name: 'ENGINEERING GRAPHICS', units: 2 },
        { code: 'BITS F111', name: 'THERMODYNAMICS', units: 3 },
        { code: 'BIO F110', name: 'BIOLOGY LABORATORY', units: 1 },
        { code: 'BIO F111', name: 'GENERAL BIOLOGY', units: 3 },
        { code: 'CS F111', name: 'COMPUTER PROGRAMMING', units: 4 },
        { code: 'MATH F112', name: 'MATHEMATICS II', units: 3 },
        { code: 'PHY F112', name: 'ELECTRO MAGNETIC THEORY I', units: 3 },
        { code: 'BITS F112', name: 'TECHNICAL REPORT WRITING', units: 2 }
      ] },
      { name: 'Year 2 Sem 1', open: false, required: 6, courses: [
        { code: 'MATH F211', name: 'MATHEMATICS III', units: 3 },
        { code: 'CS F211', name: 'DATA STRUCTURES & ALGORITHMS', units: 4 },
        { code: 'CS F215', name: 'DIGITAL DESIGN', units: 4 },
        { code: 'ECON F211', name: 'PRINCIPLES OF ECONOMICS', units: 3 },
        { code: 'BITS F225', name: 'ENVIRONMENTAL STUDIES', units: 3 },
        { code: 'CS F213', name: 'OBJECT ORIENTED PROGRAMMING', units: 4 }
      ] },
      { name: 'Year 2 Sem 2', open: false, required: 6, courses: [
        { code: 'CS F212', name: 'DATABASE SYSTEMS', units: 4 },
        { code: 'CS F214', name: 'LOGIC IN COMPUTER SCIENCE', units: 3 },
        { code: 'CS F222', name: 'DISCRETE STRUCTURES FOR CS', units: 3 },
        { code: 'MATH F212', name: 'OPTIMIZATION', units: 3 },
        { code: 'BITS F215', name: 'PRINCIPLES OF MANAGEMENT', units: 3 },
        { code: 'CS F241', name: 'MICROPROCESSOR PROGRAMMING', units: 3 }
      ] }
    ]
  };

  /**
   * Look a course up by id. Returns null rather than undefined for anything
   * that isn't a genuine catalogue entry -- course ids arrive from the query
   * string, so a plain `COURSES[id]` would happily hand back `Object.prototype`
   * members for ids like "constructor" and blow up further down the page.
   */
  function getCourse(courseId) {
    if (typeof courseId !== 'string') return null;
    return Object.prototype.hasOwnProperty.call(COURSES, courseId) ? COURSES[courseId] : null;
  }

  /**
   * Resolve a section reference to the section object it names.
   *
   * References come in two shapes: the cart stores section ids ("L1") while
   * enrolled classes store the resolved objects. Everything that reads either
   * store goes through here so the difference stops leaking into page code.
   */
  function resolveSection(course, type, ref) {
    if (!course || !ref) return null;
    if (typeof ref !== 'string') return ref;
    var list = course.sections[type] || [];
    return list.filter(function (s) { return s.id === ref; })[0] || null;
  }

  /**
   * Expand a cart/enrolled entry into its component sections, in the order the
   * course declares them: [{ type: 'L', section: {...} }, ...].
   * Unknown courses and dangling section references drop out silently.
   */
  function entrySections(entry) {
    var course = entry && getCourse(entry.courseId);
    if (!course) return [];
    return course.components
      .map(function (comp) {
        return { type: comp.type, section: resolveSection(course, comp.type, entry.sections[comp.type]) };
      })
      .filter(function (part) { return part.section; });
  }

  ERP.STUDENT = STUDENT;
  ERP.TERM = TERM;
  ERP.TERM_DATES = TERM_DATES;
  ERP.COMP_NAME = COMP_NAME;
  ERP.COMP_ABBR = COMP_ABBR;
  ERP.STATUS = STATUS;
  ERP.COURSES = COURSES;
  ERP.COURSE_ORDER = COURSE_ORDER;
  ERP.PROGRAM = PROGRAM;
  ERP.getCourse = getCourse;
  ERP.resolveSection = resolveSection;
  ERP.entrySections = entrySections;
})(window.ERP);
