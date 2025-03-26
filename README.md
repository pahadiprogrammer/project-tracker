# Personal Project Tracker

A simple web app to track personal projects and their tasks, built with React (frontend) and FastAPI (backend) using SQLite for storage. Created to manage tasks efficiently with a clean UI.

## Project Overview
- **Goal:** Track projects and tasks, with features to add projects, add tasks, toggle task status, and (eventually) show progress.
- **Tech Stack:**
  - **Frontend:** React (`localhost:5173`)
  - **Backend:** FastAPI + SQLite (`localhost:8000`)
  - **Tools:** Axios (API calls), React Router (navigation)

## Setup
1. **Clone the Repo:**
   ```bash
   git clone https://github.com/yourusername/project-tracker.git
   cd project-tracker
   ```

2. **Backend Setup:**
   ```
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install fastapi uvicorn sqlite3
   ```

3. **Frontend Setup:**
   ```
   cd ../frontend
   npm install
   npm install axios react-router-dom  # Additional deps
   ```

4. **Running the App:**
   4.1 **Start Backend Server:**
       ```
       cd backend
       source venv/bin/activate
       uvicorn main:app --reload
       # Runs on http://localhost:8000
       ```

   4.2 **Start Frontend Server:**
       ```
       cd frontend
       npm run dev
       # Runs on http://localhost:5173
       ```

   4.3 Open http://localhost:5173 in your browser to use the app.

5. **Current Status (March 25, 2025):**
   5.1 **Initial Commit (March 18):**
       - Setup: React frontend, FastAPI backend, SQLite DB, Git remote.
       - UI sketch in ui_sketch.txt.
   5.2 **Day 2-3 (March 23-24):**
       - Backend: GET /projects, POST /projects, POST /tasks—store/list projects and tasks.
       - Frontend: List/add projects, add tasks per project (no fetch/toggle yet).
       - Fixed: CORS and SQLite cursor issues (see issues.md).
   5.3 **Day 4 (March 25):**
       - Backend: Added GET /tasks/{project_id} to fetch tasks, PATCH /tasks/{task_id} to toggle status (0 = to-do, 1 = done).
       - Frontend: Updated ProjectPage.jsx to fetch tasks on load, toggle status with checkboxes.
       - UI: Add tasks, check/uncheck them—status updates persist.
   5.4 **Day 4 (March 25):**
       - Backend: Updated GET /tasks/{project_id} to return task counts (total and completed).
       - Frontend: Added progress bar in ProjectPage.jsx showing completed/total tasks.
       - UI: Toggle tasks, see progress update (e.g., "2/3" with a green bar).
   5.5 **Day 4 (March 25) to Day 6(March 27):**
       - Frontend: Moved styles to App.css, added error handling for API failures.
       - UI: Cleaner layout, red error messages on fetch/add/toggle failures.
       - Projects Page: Single container, numbered projects with alternating shades, “View Tasks” buttons.
       - Tasks Page: Project name in header (“[Name] Tasks”), numbered tasks with shades, strike-through for completed, styled progress text, divider between input and content, “Task List” header.
       - Fixed: Multiple spacing issues—unified container structure, consistent divider gaps (see issues.md).
   

6. **Project Structure:**

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


