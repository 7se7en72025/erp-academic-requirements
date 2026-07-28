// Static demo data for the ERP walkthrough replica.
// Instructor names and grades are placeholders — not real people or real marks.

var STUDENT = {
  name: 'NSA RAIYYAN',
  id: '2024A2PS1312P',
  campus: 'Birla Institute of Tech & Sci | First Degree'
};

var TERM = 'FIRST SEMESTER 2026-2027';

// courseId -> details. Components: L = Lecture, T = Tutorial, P = Lab/Practical.
// Instructor names are footballers — this is demo data, not a real timetable.
var COURSES = {
  'CHEMF110': {
    code: 'CHEM F110', name: 'CHEMISTRY LABORATORY', units: 1,
    dept: 'Dept of Chemistry', acadGroup: 'Science', components: [{ type: 'P', required: true }],
    sections: {
      P: [
        { id: 'P1', nbr: 1844, days: 'Tu', time: '2:00PM - 4:50PM', room: 'Chem Lab 1', instructor: 'LIONEL MESSI', exam: '', fnan: 'AN', status: 'open' },
        { id: 'P2', nbr: 1845, days: 'We', time: '2:00PM - 4:50PM', room: 'Chem Lab 2', instructor: 'CRISTIANO RONALDO', exam: '', fnan: 'AN', status: 'open' }
      ]
    }
  },
  'CHEMF111': {
    code: 'CHEM F111', name: 'GENERAL CHEMISTRY', units: 3,
    dept: 'Dept of Chemistry', acadGroup: 'Science', components: [{ type: 'L', required: true }, { type: 'T', required: true }],
    sections: {
      L: [
        { id: 'L1', nbr: 1855, days: 'MoWeFr', time: '9:00AM - 9:50AM', room: 'LT-1', instructor: 'ANDRES INIESTA', exam: '21/12/2026', fnan: 'FN', status: 'open' },
        { id: 'L2', nbr: 1856, days: 'MoWeFr', time: '12:00PM - 12:50PM', room: 'LT-2', instructor: 'XAVI HERNANDEZ', exam: '21/12/2026', fnan: 'FN', status: 'closed' }
      ],
      T: [
        { id: 'T1', nbr: 1860, days: 'Th', time: '10:00AM - 10:50AM', room: 'Room 201', instructor: 'SERGIO BUSQUETS', exam: '', fnan: '', status: 'open' },
        { id: 'T2', nbr: 1861, days: 'Sa', time: '8:00AM - 8:50AM', room: 'Room 202', instructor: 'CARLES PUYOL', exam: '', fnan: '', status: 'open' }
      ]
    }
  },
  'EEEF111': {
    code: 'EEE F111', name: 'ELECTRICAL SCIENCES', units: 3,
    dept: 'Dept of Electrical & Elec Engg', acadGroup: 'Engineering', components: [{ type: 'L', required: true }, { type: 'T', required: true }],
    sections: {
      L: [
        { id: 'L1', nbr: 1877, days: 'TuThSa', time: '9:00AM - 9:50AM', room: 'LT-3', instructor: 'KEVIN DE BRUYNE', exam: '14/12/2026', fnan: 'AN', status: 'open' },
        { id: 'L2', nbr: 1878, days: 'TuThSa', time: '11:00AM - 11:50AM', room: 'LT-4', instructor: 'ERLING HAALAND', exam: '14/12/2026', fnan: 'AN', status: 'closed' }
      ],
      T: [
        { id: 'T1', nbr: 1885, days: 'Mo', time: '1:00PM - 1:50PM', room: 'Room 105', instructor: 'PHIL FODEN', exam: '', fnan: '', status: 'open' },
        { id: 'T2', nbr: 1886, days: 'Tu', time: '4:00PM - 4:50PM', room: 'Room 106', instructor: 'RODRI HERNANDEZ', exam: '', fnan: '', status: 'closed' }
      ]
    }
  },
  'MATHF111': {
    code: 'MATH F111', name: 'MATHEMATICS I', units: 3,
    dept: 'Dept of Mathematics', acadGroup: 'Science', components: [{ type: 'L', required: true }, { type: 'T', required: true }],
    sections: {
      L: [
        { id: 'L1', nbr: 1901, days: 'MoWeFr', time: '8:00AM - 8:50AM', room: 'LT-5', instructor: 'LUKA MODRIC', exam: '07/12/2026', fnan: 'FN', status: 'open' }
      ],
      T: [
        { id: 'T1', nbr: 1910, days: 'We', time: '3:00PM - 3:50PM', room: 'Room 301', instructor: 'TONI KROOS', exam: '', fnan: '', status: 'open' },
        { id: 'T2', nbr: 1911, days: 'We', time: '4:00PM - 4:50PM', room: 'Room 302', instructor: 'KARIM BENZEMA', exam: '', fnan: '', status: 'wait' }
      ]
    }
  },
  'MEF112': {
    code: 'ME F112', name: 'WORKSHOP PRACTICE', units: 2,
    dept: 'Dept of Mechanical Engg', acadGroup: 'Engineering', components: [{ type: 'L', required: true }, { type: 'P', required: true }],
    sections: {
      L: [
        { id: 'L1', nbr: 2730, days: 'Th', time: '8:00AM - 8:50AM', room: 'LT-6', instructor: 'VIRGIL VAN DIJK', exam: '', fnan: '', status: 'open' }
      ],
      P: [
        { id: 'P1', nbr: 2736, days: 'Fr', time: '2:00PM - 4:50PM', room: 'Workshop 1', instructor: 'MOHAMED SALAH', exam: '', fnan: '', status: 'open' },
        { id: 'P2', nbr: 2737, days: 'Tu', time: '12:00PM - 2:50PM', room: 'Workshop 2', instructor: 'TRENT ALEXANDER-ARNOLD', exam: '', fnan: '', status: 'closed' },
        { id: 'P3', nbr: 2738, days: 'Mo', time: '9:00AM - 11:50AM', room: 'Workshop 1', instructor: 'ALISSON BECKER', exam: '', fnan: '', status: 'closed' }
      ]
    }
  },
  'PHYF110': {
    code: 'PHY F110', name: 'PHYSICS LABORATORY', units: 1,
    dept: 'Dept of Physics', acadGroup: 'Science', components: [{ type: 'P', required: true }],
    sections: {
      P: [
        { id: 'P1', nbr: 1920, days: 'Mo', time: '2:00PM - 4:50PM', room: 'Physics Lab 1', instructor: 'NEYMAR JR', exam: '', fnan: 'AN', status: 'open' },
        { id: 'P2', nbr: 1921, days: 'Th', time: '2:00PM - 4:50PM', room: 'Physics Lab 2', instructor: 'KYLIAN MBAPPE', exam: '', fnan: 'AN', status: 'open' }
      ]
    }
  },
  'PHYF111': {
    code: 'PHY F111', name: 'MECH OSCILLATIONS & WAVE', units: 3,
    dept: 'Dept of Physics', acadGroup: 'Science', components: [{ type: 'L', required: true }, { type: 'T', required: true }],
    sections: {
      L: [
        { id: 'L1', nbr: 1930, days: 'MoWeFr', time: '10:00AM - 10:50AM', room: 'LT-7', instructor: 'ZINEDINE ZIDANE', exam: '10/12/2026', fnan: 'FN', status: 'open' }
      ],
      T: [
        { id: 'T1', nbr: 1940, days: 'Sa', time: '10:00AM - 10:50AM', room: 'Room 401', instructor: 'RONALDINHO GAUCHO', exam: '', fnan: '', status: 'open' },
        { id: 'T2', nbr: 1941, days: 'Sa', time: '11:00AM - 11:50AM', room: 'Room 402', instructor: 'THIERRY HENRY', exam: '', fnan: '', status: 'open' }
      ]
    }
  }
};

var COURSE_ORDER = ['CHEMF110', 'CHEMF111', 'EEEF111', 'MATHF111', 'MEF112', 'PHYF110', 'PHYF111'];

// Requirement tree. Sem 1 courses are wired to course-detail.html; later
// semesters are listed for context only (registration is Sem-1 focused).
var PROGRAM = {
  plan: 'Computer Science',
  subplan: 'Computer Sc. FS PS HYDON',
  unitsRequired: 144,
  coursesRequired: 42,
  gpaRequired: '4.500',
  semesters: [
    { name: 'Year 1 Sem 1', open: true, required: 7, courseIds: COURSE_ORDER },
    { name: 'Year 1 Sem 2', open: false, required: 8, courses: [
      { code: 'BITS F110', name: 'ENGINEERING GRAPHICS', units: 2 },
      { code: 'BITS F111', name: 'THERMODYNAMICS', units: 3 },
      { code: 'BIO F110',  name: 'BIOLOGY LABORATORY', units: 1 },
      { code: 'BIO F111',  name: 'GENERAL BIOLOGY', units: 3 },
      { code: 'CS F111',   name: 'COMPUTER PROGRAMMING', units: 4 },
      { code: 'MATH F112', name: 'MATHEMATICS II', units: 3 },
      { code: 'PHY F112',  name: 'ELECTRO MAGNETIC THEORY I', units: 3 },
      { code: 'BITS F112', name: 'TECHNICAL REPORT WRITING', units: 2 }
    ]},
    { name: 'Year 2 Sem 1', open: false, required: 6, courses: [
      { code: 'MATH F211', name: 'MATHEMATICS III', units: 3 },
      { code: 'CS F211',   name: 'DATA STRUCTURES & ALGORITHMS', units: 4 },
      { code: 'CS F215',   name: 'DIGITAL DESIGN', units: 4 },
      { code: 'ECON F211', name: 'PRINCIPLES OF ECONOMICS', units: 3 },
      { code: 'BITS F225', name: 'ENVIRONMENTAL STUDIES', units: 3 },
      { code: 'CS F213',   name: 'OBJECT ORIENTED PROGRAMMING', units: 4 }
    ]},
    { name: 'Year 2 Sem 2', open: false, required: 6, courses: [
      { code: 'CS F212',   name: 'DATABASE SYSTEMS', units: 4 },
      { code: 'CS F214',   name: 'LOGIC IN COMPUTER SCIENCE', units: 3 },
      { code: 'CS F222',   name: 'DISCRETE STRUCTURES FOR CS', units: 3 },
      { code: 'MATH F212', name: 'OPTIMIZATION', units: 3 },
      { code: 'BITS F215', name: 'PRINCIPLES OF MANAGEMENT', units: 3 },
      { code: 'CS F241',   name: 'MICROPROCESSOR PROGRAMMING', units: 3 }
    ]}
  ]
};

// ---- cart / enrollment persisted in localStorage so the flow feels real across pages ----
var CART_KEY = 'erp_demo_cart';
var ENROLLED_KEY = 'erp_demo_enrolled';

function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function addToCart(entry) {
  var cart = getCart().filter(function (c) { return c.courseId !== entry.courseId; });
  cart.push(entry);
  saveCart(cart);
}
function removeFromCart(courseId) {
  saveCart(getCart().filter(function (c) { return c.courseId !== courseId; }));
}

function getEnrolled() { return JSON.parse(localStorage.getItem(ENROLLED_KEY) || '[]'); }
function saveEnrolled(list) { localStorage.setItem(ENROLLED_KEY, JSON.stringify(list)); }

// In-progress "add to cart" selection, carried across the Related Class Sections
// and Enrollment Preferences screens. Shape: { courseId, sections: { L: id, T: id } }
var PENDING_KEY = 'erp_demo_pending';
function getPending() { return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null'); }
function savePending(p) { localStorage.setItem(PENDING_KEY, JSON.stringify(p)); }
function clearPending() { localStorage.removeItem(PENDING_KEY); }

// ---- component vocabulary ----
var COMP_NAME = { L: 'Lecture', T: 'Tutorial', P: 'Laboratory' };
var COMP_ABBR = { L: 'LEC', T: 'TUT', P: 'LAB' };

// "MoWeFr" -> ['Mo','We','Fr']
function splitDays(days) { return (days || '').match(/[A-Z][a-z]/g) || []; }

// "9:00AM - 9:50AM" -> { start: 9, end: 10 } as whole grid columns (8..17)
function slotRange(time) {
  var m = (time || '').match(/(\d+):(\d+)(AM|PM)\s*-\s*(\d+):(\d+)(AM|PM)/);
  if (!m) return null;
  function h24(h, mer) { h = +h % 12; return mer === 'PM' ? h + 12 : h; }
  var s = h24(m[1], m[3]);
  var e = h24(m[4], m[6]) + (+m[5] > 0 ? 1 : 0);
  return { start: s, end: Math.max(e, s + 1) };
}

// Flatten cart/enrolled entries into { day, start, end, label, course, comp } blocks.
function scheduleBlocks(entries) {
  var out = [];
  entries.forEach(function (e) {
    var c = COURSES[e.courseId];
    Object.keys(e.sections).forEach(function (type) {
      var s = e.sections[type];
      if (typeof s === 'string') s = (c.sections[type] || []).find(function (x) { return x.id === s; });
      if (!s) return;
      var r = slotRange(s.time);
      if (!r) return;
      splitDays(s.days).forEach(function (d) {
        out.push({
          day: d, start: r.start, end: r.end, courseId: e.courseId,
          code: c.code, comp: type, sec: s,
          label: c.code.replace(/\s+/g, '-') + '(' + COMP_ABBR[type] + ')'
        });
      });
    });
  });
  return out;
}
