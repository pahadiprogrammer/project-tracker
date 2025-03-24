import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './App.css';

function ProjectPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/tasks/${projectId}`)
      .then(res => {
        setTasks(res.data.tasks);
        setTotalTasks(res.data.total_tasks);
        setCompletedTasks(res.data.completed_tasks);
      })
      .catch(err => setError('Failed to fetch tasks—backend might be down!'));
  }, [projectId]);

  const addTask = () => {
    if (!newTask) return;
    axios.post('http://localhost:8000/tasks', { project_id: parseInt(projectId), name: newTask })
      .then(res => {
        setTasks([...tasks, { ...res.data, status: 0 }]);
        setTotalTasks(totalTasks + 1);
        setNewTask('');
        setError(''); 
      })
      .catch(err => setError('Failed to add task—check backend!'));
  };

  const toggleTask = (taskId) => {
    axios.patch(`http://localhost:8000/tasks/${taskId}`)
      .then(res => {
        const newTasks = tasks.map(task =>
          task.id === taskId ? { ...task, status: res.data.status } : task
        );
        setTasks(newTasks);
        setCompletedTasks(newTasks.filter(task => task.status === 1).length);
        setError(''); // New: Clear error
      })
      .catch(err => setError('Failed to toggle task—check backend!'));
  };

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="container">
      <h2>Project {projectId}</h2>
      {/* New: Error display */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        className="input-field"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New Task"
      />
      <button className="button" onClick={addTask}>Add Task</button>
      <div>
        Progress: {completedTasks}/{totalTasks}
        <div className="progress-container">
          {progress > 0 && (
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          )}
        </div>
      </div>
      <ul className="project-list">
        {tasks.map(task => (
          <li className="project-item" key={task.id}>
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
