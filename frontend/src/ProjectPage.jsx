// frontend/src/ProjectPage.jsx
import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';  // Get project ID from URL

function ProjectPage() {
  const { projectId } = useParams();  // Extract project ID from route
  const [tasks, setTasks] = useState([]);  // Store tasks for this project
  const [newTask, setNewTask] = useState('');  // Input for new task

  // Add a task to this project
  const addTask = () => {
    if (!newTask) return;  // Skip empty input
    axios.post('http://localhost:8000/tasks', { project_id: parseInt(projectId), name: newTask })
      .then(res => {
        setTasks([...tasks, res.data]);  // Add to list
        setNewTask('');  // Clear input
      })
      .catch(err => console.error('Error adding task:', err));
  };

  return (
    <div>
      <h2>Project {projectId}</h2>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectPage;
