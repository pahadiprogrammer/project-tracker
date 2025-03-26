# Issues Log - Personal Project Tracker

A record of errors encountered and resolved during development.

## Fixed Issues

### 1. SQLite Recursive Cursor Error (March 24, 2025)
- **Error:** `sqlite3.ProgrammingError: Recursive use of cursors not allowed`
- **Cause:** Global cursor reused across requests in `main.py`.
- **Symptoms:** Backend crashed with 500, frontend showed CORS error.
- **Fix:** Per-request cursors in `main.py`.
- **Resolution Date:** March 24, 2025

### 2. Progress Bar Misalignment (March 26, 2025)
- **Error:** Green bar showed at 0%, oversized when partially complete.
- **Cause:** Green `<div>` rendered at 0%, height mismatch in `ProjectPage.jsx`.
- **Symptoms:** Two bars not overlapping—sliver at 0%, green too big at 50%.
- **Fix:** Added `progress > 0` check, fixed height, added `overflow: 'hidden'`.
- **Resolution Date:** March 26, 2025

### 3. Checkbox Misalignment (March 27, 2025)
- **Error:** Checkboxes shifted left based on task name length.
- **Cause:** Flex layout in `.task-item` didn’t fix checkbox position.
- **Symptoms:** Uneven checkbox column in task list.
- **Fix:** Added `.checkbox-container` with fixed width in `App.css`, wrapped checkbox in `ProjectPage.jsx`.
- **Resolution Date:** March 27, 2025

### 4. Checkbox Offset from Progress Bar (March 27, 2025)
- **Error:** Checkboxes aligned left of progress bar’s start.
- **Cause:** Default `<ul>` margin and inconsistent container offsets in `App.css`.
- **Symptoms:** Checkboxes not vertically aligned with progress bar edge.
- **Fix:** Added `margin: 0` to `.task-list`, `margin-left: 0` to `.progress-container`, `.checkbox-container`, and `.progress-bar` in `App.css`.
- **Resolution Date:** March 27, 2025

### 5. Uneven Row Heights in Project List (March 27, 2025)
- **Error:** Even rows (white) appeared taller than odd rows (gray).
- **Cause:** `margin: 10px 0` on `.project-item` added white space, blending with even rows.
- **Symptoms:** Inconsistent row heights in project list.
- **Fix:** Removed `margin: 10px 0` from `.project-item, .task-item` in `App.css`.
- **Resolution Date:** March 27, 2025

### 6. Inconsistent Divider Spacing (March 27, 2025)
- **Error:** Spacing around horizontal divider differed between projects and tasks pages.
- **Cause:** Multiple containers on projects page (`20px padding` each) vs. single container on tasks page.
- **Symptoms:** Larger gaps on projects page, uneven visual flow.
- **Fix:** Unified projects page to single `.container` in `App.jsx`, standardized `.divider` margins to `25px 0` in `App.css`.
- **Resolution Date:** March 27, 2025

## Open Issues
- None currently.

## Notes
- Log new issues as they arise, with error details, cause, and fix.