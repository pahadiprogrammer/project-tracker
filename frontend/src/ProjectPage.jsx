// frontend/src/ProjectPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProjectPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:8000/tasks/${projectId}`)
      .then(res => {
        setTasks(res.data.tasks);
        setTotalTasks(res.data.total_tasks);
        setCompletedTasks(res.data.completed_tasks);
      })
      .catch(err => console.error('Error fetching tasks:', err));
  }, [projectId]);

  const addTask = () => {
    if (!newTask) return;
    axios.post('http://localhost:8000/tasks', { project_id: parseInt(projectId), name: newTask })
      .then(res => {
        setTasks([...tasks, { ...res.data, status: 0 }]);
        setTotalTasks(totalTasks + 1);
        setNewTask('');
      })
      .catch(err => console.error('Error adding task:', err));
  };

  const toggleTask = (taskId) => {
    axios.patch(`http://localhost:8000/tasks/${taskId}`)
      .then(res => {
        const newTasks = tasks.map(task =>
          task.id === taskId ? { ...task, status: res.data.status } : task
        );
        setTasks(newTasks);
        setCompletedTasks(newTasks.filter(task => task.status === 1).length);
      })
      .catch(err => console.error('Error toggling task:', err));
  };

  // Updated: Calculate progress, ensure 0% hides green bar
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div>
      <h2>Project {projectId}</h2>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={addTask}>Add Task</button>
      <div>
        Progress: {completedTasks}/{totalTasks}
        <div style={{
          width: '100%',              // Full width container
          backgroundColor: '#e0e0e0', // Gray background
          height: '20px',             // Fixed height
          marginTop: '10px',          // Spacing
          position: 'relative',       // Enable child positioning
          overflow: 'hidden'          // New: Clip any overflow
        }}>
          {/* Updated: Only show green bar if progress > 0 */}
          {progress > 0 && (
            <div style={{
              width: `${progress}%`,      // Progress width
              backgroundColor: '#4caf50', // Green fill
              height: '20px',             // Updated: Exact height match
              position: 'absolute',       // Overlay on gray
              top: 0,                     // Align to top
              left: 0                     // Start from left
            }} />
          )}
        </div>
      </div>
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
