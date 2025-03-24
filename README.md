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

6. **Next Steps**
   - Day 5: Add progress bar for completed tasks.
   - Polish & Launch: Final tweaks, deploy locally by March 30, 2025.

7. **Project Structure:**

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


