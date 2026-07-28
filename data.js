// Static demo data for the ERP walkthrough replica.
// All names/instructors are placeholders — not real people or real grades.

var STUDENT = {
  name: 'STUDENT NAME',
  id: '20XXA0PS0000P',
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
