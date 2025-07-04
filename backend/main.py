from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
import requests
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
print("🔍 DEBUG: .env path:", dotenv_path)
load_dotenv(dotenv_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("🔍 DEBUG: GEMINI_API_KEY =", GEMINI_API_KEY)  # For verification

GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"




# Initialize FastAPI app
app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite DB connection
conn = sqlite3.connect("tracker.db", check_same_thread=False)

# Create required tables if not present
def init_db():
    c = conn.cursor()
    c.execute("CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, name TEXT)")
    c.execute("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, project_id INTEGER, name TEXT, status INTEGER DEFAULT 0)")
    conn.commit()

init_db()

# Request models
class Project(BaseModel):
    name: str

class Task(BaseModel):
    project_id: int
    name: str

class LLMRequest(BaseModel):
    message: str

# Health check route
@app.get("/")
def read_root():
    return {"message": "Project Tracker Backend is Running!"}

# Project APIs
@app.post("/projects")
def add_project(project: Project):
    c = conn.cursor()
    c.execute("INSERT INTO projects (name) VALUES (?)", (project.name,))
    conn.commit()
    return {"id": c.lastrowid, "name": project.name}

@app.get("/projects")
def get_projects():
    c = conn.cursor()
    c.execute("SELECT * FROM projects")
    return [{"id": row[0], "name": row[1]} for row in c.fetchall()]

# Task APIs
@app.post("/tasks")
def add_task(task: Task):
    c = conn.cursor()
    c.execute("INSERT INTO tasks (project_id, name) VALUES (?, ?)", (task.project_id, task.name))
    conn.commit()
    return {"id": c.lastrowid, "project_id": task.project_id, "name": task.name}

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
    result = c.fetchone()
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    current_status = result[0]
    new_status = 1 if current_status == 0 else 0
    c.execute("UPDATE tasks SET status = ? WHERE id = ?", (new_status, task_id))
    conn.commit()
    return {"id": task_id, "status": new_status}

@app.post("/ask-llm")
def ask_llm(req: LLMRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set")

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": req.message}
                ]
            }
        ]
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(
        f"{GEMINI_ENDPOINT}?key={GEMINI_API_KEY}",
        headers=headers,
        json=payload
    )

    if response.ok:
        try:
            reply = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            return {"reply": reply}
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Parsing error: {str(e)}")
    else:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {response.text}")


   
