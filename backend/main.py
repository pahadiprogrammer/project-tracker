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
