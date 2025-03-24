// frontend/src/ProjectPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProjectPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Fetch tasks when the page loads
  useEffect(() => {
    axios.get(`http://localhost:8000/tasks/${projectId}`)
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, [projectId]);

  // Add a new task
  const addTask = () => {
    if (!newTask) return;
    axios.post('http://localhost:8000/tasks', { project_id: parseInt(projectId), name: newTask })
      .then(res => {
        setTasks([...tasks, { ...res.data, status: 0 }]);  // Add with default status 0
        setNewTask('');
      })
      .catch(err => console.error('Error adding task:', err));
  };

  // Toggle task status
  const toggleTask = (taskId) => {
    axios.patch(`http://localhost:8000/tasks/${taskId}`)
      .then(res => {
        setTasks(tasks.map(task =>
          task.id === taskId ? { ...task, status: res.data.status } : task
        ));
      })
      .catch(err => console.error('Error toggling task:', err));
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
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.status === 1}
              onChange={() => toggleTask(task.id)}
            />
            {task.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectPage;
