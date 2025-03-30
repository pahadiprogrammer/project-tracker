from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
import sqlite3
import os
from dotenv import load_dotenv
from contextlib import contextmanager

# Load environment variables
load_dotenv()

app = FastAPI()

# Security Configuration
API_KEY_NAME = "X-API-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME)

async def validate_api_key(api_key: str = Depends(api_key_header)):
    print(api_key)
    print(os.getenv("BACKEND_API_KEY"))
    print("hello123")
    """Validate API key from header"""
    if api_key != os.getenv("BACKEND_API_KEY"):
        raise HTTPException(status_code=403, detail="Invalid API Key")

# Database Setup
@contextmanager
def get_db():
    conn = sqlite3.connect("tracker.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY,
                project_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                status INTEGER DEFAULT 0,
                FOREIGN KEY(project_id) REFERENCES projects(id)
            )
        """)

init_db()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Project(BaseModel):
    name: str

class Task(BaseModel):
    project_id: int
    name: str

# Routes
@app.post("/projects", dependencies=[Depends(validate_api_key)])
def create_project(project: Project):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("INSERT INTO projects (name) VALUES (?)", (project.name,))
        conn.commit()
        return {"id": cur.lastrowid, "name": project.name}

@app.get("/projects", dependencies=[Depends(validate_api_key)])
def get_projects():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM projects")
        return [dict(row) for row in cur.fetchall()]

@app.get("/tasks/{project_id}", dependencies=[Depends(validate_api_key)])
def get_tasks(project_id: int):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM tasks WHERE project_id = ?", (project_id,))
        tasks = [dict(row) for row in cur.fetchall()]
        return {
            "tasks": tasks,
            "total_tasks": len(tasks),
            "completed_tasks": sum(1 for t in tasks if t["status"] == 1)
        }

@app.post("/tasks", dependencies=[Depends(validate_api_key)])
def create_task(task: Task):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO tasks (project_id, name) VALUES (?, ?)",
            (task.project_id, task.name)
        )
        conn.commit()
        return {"id": cur.lastrowid, **task.dict()}

@app.patch("/tasks/{task_id}", dependencies=[Depends(validate_api_key)])
def toggle_task(task_id: int):
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("UPDATE tasks SET status = NOT status WHERE id = ?", (task_id,))
        conn.commit()
        cur.execute("SELECT status FROM tasks WHERE id = ?", (task_id,))
        return {"status": cur.fetchone()["status"]}