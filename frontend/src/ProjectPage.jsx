// frontend/src/ProjectPage.jsx
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
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/tasks/${projectId}`)
      .then(res => {
        setTasks(res.data.tasks);
        setTotalTasks(res.data.total_tasks);
        setCompletedTasks(res.data.completed_tasks);
        setError('');
      })
      .catch(err => setError('Failed to fetch tasks. Is the backend running?'));

    axios.get(`http://localhost:8000/projects`)
      .then(res => {
        const project = res.data.find(p => p.id === parseInt(projectId));
        setProjectName(project ? project.name : 'Unknown Project');
        setError('');
      })
      .catch(err => setError('Failed to fetch project name. Check backend connection.'));
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
      .catch(err => setError('Failed to add task. Check backend connection.'));
  };

  const toggleTask = (taskId) => {
    axios.patch(`http://localhost:8000/tasks/${taskId}`)
      .then(res => {
        const newTasks = tasks.map(task =>
          task.id === taskId ? { ...task, status: res.data.status } : task
        );
        setTasks(newTasks);
        setCompletedTasks(newTasks.filter(task => task.status === 1).length);
        setError('');
      })
      .catch(err => setError('Failed to toggle task. Check backend connection.'));
  };

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="container">
      <h1>{projectName} Tasks</h1> {/* Updated: h2 to h1 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="input-group">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="divider"></div>
      <div className="progress-container">
        <span className="progress-text">Progress: {completedTasks}/{totalTasks}</span>
        <div className="progress-bar">
          {progress > 0 && (
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          )}
        </div>
      </div>
      <h2 className="task-list-header">Task List</h2> {/* Updated: h3 to h2 */}
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={task.id} className="task-item">
            <span className="checkbox-container">
              <input
                type="checkbox"
                checked={task.status === 1}
                onChange={() => toggleTask(task.id)}
              />
            </span>
            <span className={`task-name ${task.status === 1 ? 'completed' : ''}`}>
              {`${index + 1}. ${task.name}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectPage;