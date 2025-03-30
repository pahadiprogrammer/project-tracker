// frontend/src/ProjectPage.jsx
import { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './App.css';

const TaskItem = memo(({ task, toggleTask }) => {
  return (
    <li key={task.id} className="task-item">
      <span className="checkbox-container">
        <input
          type="checkbox"
          checked={task.status === 1}
          onChange={() => toggleTask(task.id)}
        />
      </span>
      <span className={`task-name ${task.status === 1 ? 'completed' : ''}`}>
        {task.name}
      </span>
    </li>
  );
});

function Loader() {
  return <div className="loader"></div>;
}

function ProjectPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [taskNameError, setTaskNameError] = useState('');
  const [updatingTasks, setUpdatingTasks] = useState(false);
  const [addingTask, setAddingTask] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/tasks/${projectId}`)
      .then(res => {
        setTimeout(() => {
          setTasks(res.data.tasks);
          setTotalTasks(res.data.total_tasks);
          setCompletedTasks(res.data.completed_tasks);
          setLoading(false);
        }, 1000);
      })
      .catch(err => {
        setError('Failed to fetch tasks. Is the backend running?');
        setLoading(false);
      });

    axios.get(`http://localhost:8000/projects`)
      .then(res => {
        setTimeout(() => {
          const project = res.data.find(p => p.id === parseInt(projectId));
          setProjectName(project ? project.name : 'Unknown Project');
        }, 1000);
      })
      .catch(err => setError('Failed to fetch project name. Check backend connection.'));
  }, [projectId]);

  const addTask = () => {
    if (!newTask) {
      setTaskNameError('Task name cannot be empty.');
      return;
    }
    if (newTask.length > 100) {
      setTaskNameError('Task name is too long.');
      return;
    }
    setTaskNameError('');
    setAddingTask(true);
    axios.post('http://localhost:8000/tasks', { project_id: parseInt(projectId), name: newTask })
      .then(res => {
        setTimeout(() => {
          setTasks([...tasks, { ...res.data, status: 0 }]);
          setTotalTasks(totalTasks + 1);
          setNewTask('');
          setAddingTask(false);
        }, 1000);
      })
      .catch(err => {
        setError('Failed to add task. Check backend connection.');
        setAddingTask(false);
      });
  };

  const toggleTask = (taskId) => {
    setUpdatingTasks(true);
    axios.patch(`http://localhost:8000/tasks/${taskId}`)
      .then(res => {
        setTimeout(() => {
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === taskId ? { ...task, status: res.data.status } : task
            )
          );
          setCompletedTasks(prevCompletedTasks => {
            const updatedTasks = tasks.map(task =>
              task.id === taskId ? { ...task, status: res.data.status } : task
            );
            return updatedTasks.filter(task => task.status === 1).length;
          });
          setUpdatingTasks(false);
        }, 500); // Reduced latency to 500 milliseconds
      })
      .catch(err => {
        setError('Failed to toggle task. Check backend connection.');
        setUpdatingTasks(false);
      });
  };

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleCloseError = () => {
    setError('');
  };

  return (
    <div className="container">
      <h1>{projectName} Tasks</h1>
      {error && (
        <div className="error-modal">
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={handleCloseError}>Close</button>
        </div>
      )}
      {loading && (
        <div className="loading-container">
          <Loader />
          <p className="updating-message">Loading tasks...</p>
        </div>
      )}
      <div className="input-group">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
        />
        <button onClick={addTask} disabled={!newTask}>Add Task</button>
      </div>
      {taskNameError && <p style={{ color: 'red' }}>{taskNameError}</p>}
      <div className="divider"></div>
      <div className="progress-container">
        <span className="progress-text">Progress: {completedTasks}/{totalTasks}</span>
        <div className="progress-bar">
          {progress > 0 && (
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          )}
        </div>
      </div>
      <h2 className="task-list-header">Task List</h2>
      {updatingTasks && (
        <div className="loading-container">
          <Loader />
          <p className="updating-message">Tasks are updating...</p>
        </div>
      )}
      {addingTask && (
        <div className="loading-container">
          <Loader />
          <p className="updating-message">Adding task...</p>
        </div>
      )}
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
        ))}
      </ul>
    </div>
  );
}

export default ProjectPage;