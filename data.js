// Static demo data for the ERP walkthrough replica.
// Instructor names and grades are placeholders — not real people or real marks.

var STUDENT = {
  name: 'NSA RAIYYAN',
  id: '2024A2PS1312P',
  campus: 'Birla Institute of Tech & Sci | First Degree'
};

var TERM = 'FIRST SEMESTER 2026-2027';

// courseId -> details. Components: L = Lecture, T = Tutorial, P = Lab/Practical.
var COURSES = {
  'CHEMF110': {
    code: 'CHEM F110', name: 'CHEMISTRY LABORATORY', units: 1,
    dept: 'Dept of Chemistry', components: [{ type: 'P', required: true }],
    sections: {
      P: [
        { id: 'P1', days: 'Tu', time: '2:00PM - 4:50PM', room: 'Chem Lab 1', instructor: 'Instructor A', status: 'open' },
        { id: 'P2', days: 'We', time: '2:00PM - 4:50PM', room: 'Chem Lab 2', instructor: 'Instructor B', status: 'open' }
      ]
    }
  },
  'CHEMF111': {
    code: 'CHEM F111', name: 'GENERAL CHEMISTRY', units: 3,
    dept: 'Dept of Chemistry', components: [{ type: 'L', required: true }, { type: 'T', required: true }],
    sections: {
      L: [{ id: 'L1', days: 'MoWeFr', time: '9:00AM - 9:50AM', room: 'LT-1', instructor: 'Instructor C', status: 'open' }],
      T: [
        { id: 'T1', days: 'Th', time: '10:00AM - 10:50AM', room: 'Room 201', instructor: 'Instructor C', status: 'open' },
        { id: 'T2', days: 'Th', time: '11:00AM - 11:50AM', room: 'Room 202', instructor: 'Instructor D', status: 'open' }
      ]
    }
  },
  'EEEF111': {
    code: 'EEE F111', name: 'ELECTRICAL SCIENCES', units: 3,
    dept: 'Dept of EEE', components: [{ type: 'L', required: true }, { type: 'T', required: true }],
    sections: {
      L: [{ id: 'L1', days: 'MoWeFr', time: '11:00AM - 11:50AM', room: 'LT-2', instructor: 'Instructor E', status: 'open' }],
      T: [
        { id: 'T1', days: 'Mo', time: '4:00PM - 4:50PM', room: 'Room 105', instructor: 'Instructor E', status: 'open' },
        { id: 'T2', days: 'Tu', time: '4:00PM - 4:50PM', room: 'Room 106', instructor: 'Instructor F', status: 'closed' }
      ]
    }
  },
  'MATHF111': {
    code: 'MATH F111', name: 'MATHEMATICS I', units: 3,
    dept: 'Dept of Mathematics', components: [{ type: 'L', required: true }, { type: 'T', required: true }],
    sections: {
      L: [{ id: 'L1', days: 'MoWeFr', time: '8:00AM - 8:50AM', room: 'LT-3', instructor: 'Instructor G', status: 'open' }],
      T: [
        { id: 'T1', days: 'We', time: '3:00PM - 3:50PM', room: 'Room 301', instructor: 'Instructor G', status: 'open' },
        { id: 'T2', days: 'We', time: '4:00PM - 4:50PM', room: 'Room 302', instructor: 'Instructor H', status: 'wait' }
      ]
    }
  },
  'MEF112': {
    code: 'ME F112', name: 'WORKSHOP PRACTICE', units: 2,
    dept: 'Dept of Mech Engg', components: [{ type: 'L', required: true }, { type: 'P', required: true }],
    sections: {
      L: [{ id: 'L1', days: 'Tu', time: '8:00AM - 8:50AM', room: 'LT-4', instructor: 'Instructor I', status: 'open' }],
      P: [
        { id: 'P1', days: 'Fr', time: '2:00PM - 4:50PM', room: 'Workshop 1', instructor: 'Instructor I', status: 'open' },
        { id: 'P2', days: 'Sa', time: '9:00AM - 11:50AM', room: 'Workshop 2', instructor: 'Instructor J', status: 'open' }
      ]
    }
  },
  'PHYF110': {
    code: 'PHY F110', name: 'PHYSICS LABORATORY', units: 1,
    dept: 'Dept of Physics', components: [{ type: 'P', required: true }],
    sections: {
      P: [
        { id: 'P1', days: 'Mo', time: '2:00PM - 4:50PM', room: 'Physics Lab 1', instructor: 'Instructor K', status: 'open' },
        { id: 'P2', days: 'Th', time: '2:00PM - 4:50PM', room: 'Physics Lab 2', instructor: 'Instructor L', status: 'open' }
      ]
    }
  },
  'PHYF111': {
    code: 'PHY F111', name: 'MECH OSCILLATIONS & WAVE', units: 3,
    dept: 'Dept of Physics', components: [{ type: 'L', required: true }, { type: 'T', required: true }],
    sections: {
      L: [{ id: 'L1', days: 'MoWeFr', time: '10:00AM - 10:50AM', room: 'LT-5', instructor: 'Instructor M', status: 'open' }],
      T: [
        { id: 'T1', days: 'Sa', time: '10:00AM - 10:50AM', room: 'Room 401', instructor: 'Instructor M', status: 'open' },
        { id: 'T2', days: 'Sa', time: '11:00AM - 11:50AM', room: 'Room 402', instructor: 'Instructor N', status: 'open' }
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
