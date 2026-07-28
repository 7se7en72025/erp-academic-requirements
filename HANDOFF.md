# Handoff prompt — continue the ERP walkthrough replica

Copy everything below into a fresh session.

---

I have a static HTML/CSS/JS replica of the BITS Pilani ERP (PeopleSoft) student
registration portal at:

    /home/raiyyan/KG Freshers Help 2026/erp-academic-requirements/

It is a git repo, clean tree, latest commit `47328b3`. It is a walkthrough guide for
2026 freshers — legitimate educational use, replicating their own university's portal.

## Your task

Extract frames **one per second starting at 1:10** from this screen recording:

    /home/raiyyan/Downloads/BITS Pilani Registration Instructions - For all campuses including login page - BITS ERP (1080p, h264)(1).mp4

(423s long, 1080p. Use `ffmpeg -ss 70 -i "<video>" -vf fps=1 out/f_%04d.jpg`.
Write frames to a scratchpad dir, NOT into the repo.)

Read the frames in order and rebuild any ERP screens that the repo does not yet
cover, and correct any existing page that differs from what the frames show.
A previous pass sampled only 1 frame per 4s, so fast interactions were missed —
that is why you are resampling at 1fps.

## What already exists

| File | Screen |
|---|---|
| `student-homepage.html` | tile launcher |
| `academic-requirements.html` | My Academic Requirements (requirement tree) |
| `course-detail.html?course=<ID>` | course detail + section picker + add-to-cart modal |
| `shopping-cart.html` | Enrollment Shopping Cart |
| `enroll-results.html` | 3-step wizard, step 3 View Results |
| `weekly-schedule.html` | My Weekly Schedule |

Shared: `chrome.css` (all styling), `chrome.js` (`renderChrome()`, `idRowHtml()`,
`tabsHtml()`, `resetDemo()`), `data.js` (`STUDENT`, `TERM`, `COURSES`,
`COURSE_ORDER`, `PROGRAM`, cart/enrolled helpers on `localStorage`).

Known gaps worth checking against the 1fps frames:
- **"Add to Shopping Cart — Related Class Sections"** is a real standalone screen
  (radio-button picker, Class Nbr column, weekly grid on top showing already-chosen
  slots, Cancel/Next). The repo currently inlines the 2nd component into
  `course-detail.html` instead. Consider building it properly.
- The **weekly grid** shown above section lists on the Course Schedule screen
  (rows Mon–Sun, columns 8AM–6PM, occupied cells labelled e.g. `CHEM-F110(LAB)`).
- **"My Class Schedule" / "Registration Course Cart"** side-by-side panels that sit
  above the section list and populate as courses are added.
- Steps 1 and 2 of the enrollment wizard (only step 3 is built).

## Conventions — follow these

- **No build step, no frameworks, no CDNs.** Plain HTML + one shared CSS + vanilla JS.
- Every page: `<div id="chrome-root"></div>`, then `<script src="data.js">`,
  `<script src="chrome.js">`, then a script calling
  `renderChrome({ active: '<sidebar-key>', pageName: '<header title>' })` and filling
  `document.getElementById('main-content').innerHTML`.
- Styling is already calibrated to the real portal — **reuse existing classes**, do not
  invent a new palette: `.ps-btn` (tan/peach buttons), `.req-head` / `.req-sub`
  (orange-brown headers on grey bars), `table.data` (orange th), `.chk` `.diamond`
  `.star` (Taken / In Progress / Planned), `.dot.open|.closed|.wait`, `.panel`,
  `.grid`, `.steps`, `.modal-overlay`, `.weekly-grid`.
- Chrome = thin blue→green `.topline`, `11120241312 - SISPRD` strip, dark header bar
  with `‹ Student Homepage` pill + centered title + right icons, 288px sidebar with
  light-green active row.

## Data rules — important

- Student is `NSA RAIYYAN` / `2024A2PS1312P` in `data.js` (the repo owner, intentional).
- **Instructors are footballers on purpose** (Messi, Ronaldo, De Bruyne, Zidane…).
  Do NOT replace them with the real faculty names visible in the video — those are
  2021-22 Hyderabad staff, stale and wrong-campus for a 2026 Pilani guide, and
  attaching real people to invented sections is worse than obviously-fake names.
- Likewise ignore the real student ID `41120210001` visible in the frames.
- Class numbers, timings, rooms and exam dates are illustrative; keep them plausible
  and self-consistent (no two enrolled sections colliding in the weekly grid).

## Verify before committing

Serve it and click the whole path — do not just eyeball the HTML:

    cd "/home/raiyyan/KG Freshers Help 2026/erp-academic-requirements"
    python3 -m http.server 8000

Path: student-homepage → Registration → a course → Show Sections → select each
required component → Next → confirm modal → shopping-cart → Validate →
enroll-results → weekly-schedule. Then "Reset walkthrough" in the sidebar and
confirm state clears. Commit with a descriptive message when it passes.
