# Issues Log - Personal Project Tracker

A record of errors encountered and resolved during development.

## Fixed Issues

### 1. SQLite Recursive Cursor Error (March 24, 2025)
- **Error:**
   ```
   sqlite3.ProgrammingError: Recursive use of cursors not allowed INFO: 127.0.0.1:xxxxx - "GET /projects HTTP/1.1" 500 Internal Server Error
   ```

- **Cause:**
- Global cursor (`c = conn.cursor()`) reused across requests in `main.py`.
- FastAPI’s async threads + `check_same_thread=False` caused cursor conflicts.
- **Symptoms:**
- Backend crashed with 500 on `GET /projects`.
- Frontend showed CORS error (missing `Access-Control-Allow-Origin`) due to no response.
- **Fix:**
- Moved to per-request cursors: `c = conn.cursor()` inside each endpoint.
- Added `init_db()` for one-time table setup.
- Updated `main.py` (commit: "Frontend skeleton: List/add projects, add tasks").
- **Resolution Date:** March 24, 2025

## Open Issues
- None currently.

## Notes
- Log new issues as they arise, with error details, cause, and fix.
