# Personal Project Tracker

A simple web app to track personal projects and their tasks, built with React (frontend) and FastAPI (backend) using SQLite for storage. Created to manage tasks efficiently with a clean UI.

## Project Overview

-   **Goal:** Track projects and tasks, with features to add projects, add tasks, toggle task status, and show progress.
-   **Tech Stack:**
    -   **Frontend:** React (`localhost:5173`)
    -   **Backend:** FastAPI + SQLite (`localhost:8000`)
    -   **Tools:** Axios (API calls), React Router (navigation)

## Setup

1.  **Clone the Repo:**

    ```bash
    git clone [https://github.com/yourusername/project-tracker.git](https://github.com/yourusername/project-tracker.git)
    cd project-tracker
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    pip install fastapi uvicorn sqlite3
    ```

3.  **Frontend Setup:**

    ```bash
    cd ../frontend
    npm install
    npm install axios react-router-dom  # Additional deps
    ```

4.  **Running the App:**

    4.1 **Start Backend Server:**

        ```bash
        cd backend
        source venv/bin/activate
        uvicorn main:app --reload
        # Runs on http://localhost:8000
        ```

    4.2 **Start Frontend Server:**

        ```bash
        cd frontend
        npm run dev
        # Runs on http://localhost:5173
        ```

    4.3 Open http://localhost:5173 in your browser to use the app.

## Current Status (March 30, 2025)

-   **March 18, 2025 (Initial Commit):**
    -   Setup: React frontend, FastAPI backend, SQLite DB, Git remote.
    -   UI sketch in `ui_sketch.txt`.
-   **March 23-24, 2025 (Day 2-3):**
    -   Backend: `GET /projects`, `POST /projects`, `POST /tasks` - store/list projects and tasks.
    -   Frontend: List/add projects, add tasks per project (no fetch/toggle yet).
    -   Fixed: CORS and SQLite cursor issues (see `issues.md`).
-   **March 25, 2025 (Day 4):**
    -   Backend: Added `GET /tasks/{project_id}` to fetch tasks, `PATCH /tasks/{task_id}` to toggle status (0 = to-do, 1 = done).
    -   Frontend: Updated `ProjectPage.jsx` to fetch tasks on load, toggle status with checkboxes.
    -   UI: Add tasks, check/uncheck them—status updates persist.
    -   Backend: Updated `GET /tasks/{project_id}` to return task counts (total and completed).
    -   Frontend: Added progress bar in `ProjectPage.jsx` showing completed/total tasks.
    -   UI: Toggle tasks, see progress update (e.g., "2/3" with a green bar).
-   **March 25-27, 2025 (Day 4 - Day 6):**
    -   Frontend: Moved styles to `App.css`, added error handling for API failures.
    -   UI: Cleaner layout, red error messages on fetch/add/toggle failures.
    -   Projects Page: Single container, numbered projects with alternating shades, “View Tasks” buttons.
    -   Tasks Page: Project name in header (“\[Name] Tasks”), numbered tasks with shades, strike-through for completed, styled progress text, divider between input and content, “Task List” header.
    -   Fixed: Multiple spacing issues—unified container structure, consistent divider gaps (see `issues.md`).
    -   Frontend: Unified font styles/sizes—h1 (2em) for top headings, h2 (1.5em) for sub-headings, `.progress-text` (1.5em) aligned with h2.
    -   Tasks Page: Adjusted spacing—15px gap between “Progress” and bar, matching “Task List” to tasks.
-   **March 28-30, 2025 (Day 7-9):**
    -   Frontend: Implemented loading indicators and messages during API calls.
    -   Added simulated latency to improve user experience.
    -   Optimized task list rendering with `React.memo`.
    -   UI: Added loader and messages during project/task addition and task updates.
    -   Project details and project list pages now have loaders and loading messages.
    -   Fixed bug where loader was not shown when task page was initially loaded.
    -   Reduced latency for task updates to 500ms.

## Project Structure
project-tracker/
├── backend/        # FastAPI app
│   ├── venv/       # Virtual environment
│   ├── main.py     # API endpoints
│   └── tracker.db  # SQLite database
├── frontend/       # React app
│   ├── src/        # React source files
│   └── node_modules/
├── ui_sketch.txt   # Initial UI plan
├── README.md       # This file
└── issues.md       # Known/fixed issues

## Next Steps

-   Integrate OpenRouter API for enhanced task management.
-   Implement user authentication.
-   Add more advanced project and task management features.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
