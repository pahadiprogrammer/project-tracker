# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global connection (still fine with check_same_thread=False)
conn = sqlite3.connect("tracker.db", check_same_thread=False)

# Initialize tables (only once at startup)
def init_db():
    c = conn.cursor()  # Temporary cursor for setup
    c.execute("CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, name TEXT)")
    c.execute("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, project_id INTEGER, name TEXT, status INTEGER DEFAULT 0)")
    conn.commit()

init_db()  # Run once when app starts

class Project(BaseModel):
    name: str

class Task(BaseModel):
    project_id: int
    name: str

@app.post("/projects")
def add_project(project: Project):
    c = conn.cursor()  # New cursor per request
    c.execute("INSERT INTO projects (name) VALUES (?)", (project.name,))
    conn.commit()
    return {"id": c.lastrowid, "name": project.name}

@app.post("/tasks")
def add_task(task: Task):
    c = conn.cursor()  # New cursor per request
    c.execute("INSERT INTO tasks (project_id, name) VALUES (?, ?)", (task.project_id, task.name))
    conn.commit()
    return {"id": c.lastrowid, "project_id": task.project_id, "name": task.name}

@app.get("/projects")
def get_projects():
    c = conn.cursor()  # New cursor per request
    c.execute("SELECT * FROM projects")
    return [{"id": row[0], "name": row[1]} for row in c.fetchall()]

@app.get("/tasks/{project_id}")
def get_tasks(project_id: int):
    c = conn.cursor()
    c.execute("SELECT * FROM tasks WHERE project_id = ?", (project_id,))
    tasks = [{"id": row[0], "project_id": row[1], "name": row[2], "status": row[3]} for row in c.fetchall()]
    total_tasks = len(tasks)
    completed_tasks = sum(1 for task in tasks if task["status"] == 1)

    return {
        "tasks": tasks,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks
    }

@app.patch("/tasks/{task_id}")
def toggle_task(task_id: int):
    c = conn.cursor()
    c.execute("SELECT status FROM tasks WHERE id = ?", (task_id,))
    current_status = c.fetchone()[0]  # Get current status (0 or 1)
    new_status = 1 if current_status == 0 else 0  # Flip it
    c.execute("UPDATE tasks SET status = ? WHERE id = ?", (new_status, task_id))
    conn.commit()
    return {"id": task_id, "status": new_status}
