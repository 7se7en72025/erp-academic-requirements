# ERP Registration Walkthrough (static replica)

A static, multi-page recreation of the BITS ERP (PeopleSoft) student portal registration
flow, styled after the real portal's sidebar/header chrome. Built for the freshers'
registration walkthrough guide — all names, grades, and instructors are placeholders,
not real data.

## Pages

- `student-homepage.html` — landing page with tiles
- `academic-requirements.html` — My Academic Requirements (course requirement tree)
- `course-detail.html?course=<ID>` — course detail, section picker, add-to-cart flow
  (IDs: CHEMF110, CHEMF111, EEEF111, MATHF111, MEF112, PHYF110, PHYF111)
- `shopping-cart.html` — Enrollment Shopping Cart
- `enroll-results.html` — 3-step wizard, step 3 (View Results)
- `weekly-schedule.html` — My Weekly Schedule (built from enrolled courses)

Shared chrome (status bar, header, sidebar) lives in `chrome.css` / `chrome.js`.
Course catalog and cart/enrollment state (via `localStorage`) live in `data.js`.

## Flow

Student Homepage → Registration tile → My Academic Requirements → click a course →
Course Detail → Show Sections → Select a section (repeat if a second component like
a Tutorial/Lab is required) → Next → added to cart (confirmation modal) → Return to
My Academic Requirements → repeat for remaining courses → Enrollment Shopping Cart →
Validate → View Results → My Weekly Schedule.

## Run

```
python3 -m http.server 8000
```

then visit http://localhost:8000/student-homepage.html
