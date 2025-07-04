import { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './App.css';

const TaskItem = memo(({ task, toggleTask }) => (
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
));

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

  // LLM state
  const [llmInput, setLlmInput] = useState('');
  const [llmResponse, setLlmResponse] = useState('');
  const [llmLoading, setLlmLoading] = useState(false);

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
      .catch(() => {
        setError('Failed to fetch tasks. Is the backend running?');
        setLoading(false);
      });

    axios.get(`http://localhost:8000/projects`)
      .then(res => {
        const project = res.data.find(p => p.id === parseInt(projectId));
        setProjectName(project ? project.name : 'Unknown Project');
      })
      .catch(() => setError('Failed to fetch project name. Check backend connection.'));
  }, [projectId]);

  const addTask = () => {
    if (!newTask.trim()) {
      setTaskNameError('Task name cannot be empty.');
      return;
    }
    if (newTask.length > 100) {
      setTaskNameError('Task name is too long.');
      return;
    }
    setTaskNameError('');
    setAddingTask(true);
    axios.post('http://localhost:8000/tasks', {
      project_id: parseInt(projectId),
      name: newTask
    })
      .then(res => {
        setTasks([...tasks, { ...res.data, status: 0 }]);
        setTotalTasks(totalTasks + 1);
        setNewTask('');
        setAddingTask(false);
      })
      .catch(() => {
        setError('Failed to add task. Check backend connection.');
        setAddingTask(false);
      });
  };

  const toggleTask = (taskId) => {
    setUpdatingTasks(true);
    axios.patch(`http://localhost:8000/tasks/${taskId}`)
      .then(res => {
        const updatedTasks = tasks.map(task =>
          task.id === taskId ? { ...task, status: res.data.status } : task
        );
        setTasks(updatedTasks);
        setCompletedTasks(updatedTasks.filter(task => task.status === 1).length);
        setUpdatingTasks(false);
      })
      .catch(() => {
        setError('Failed to toggle task. Check backend connection.');
        setUpdatingTasks(false);
      });
  };

  const handleCloseError = () => {
    setError('');
  };

  const handleAskLLM = async () => {
    if (!llmInput.trim()) return;
    setLlmLoading(true);
    setLlmResponse('');
    try {
      const res = await axios.post('http://localhost:8000/ask-llm', {
        message: llmInput
      });
      setLlmResponse(res.data.reply);
    } catch (err) {
      setLlmResponse('Failed to get response from Gemini LLM.');
    } finally {
      setLlmLoading(false);
    }
  };

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

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
        <button onClick={addTask} disabled={!newTask || addingTask}>
          {addingTask ? 'Adding...' : 'Add Task'}
        </button>
      </div>
      {taskNameError && <p style={{ color: 'red' }}>{taskNameError}</p>}

      <div className="divider"></div>

      <div className="progress-container">
        <span className="progress-text">Progress: {completedTasks}/{totalTasks}</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h2 className="task-list-header">Task List</h2>

      {(updatingTasks || addingTask) && (
        <div className="loading-container">
          <Loader />
          <p className="updating-message">{updatingTasks ? 'Updating task...' : 'Adding task...'}</p>
        </div>
      )}

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} toggleTask={toggleTask} />
        ))}
      </ul>

      <div className="divider"></div>

      <h2>Ask Gemini LLM</h2>
      <div className="input-group">
        <input
          value={llmInput}
          onChange={(e) => setLlmInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button onClick={handleAskLLM} disabled={llmLoading}>
          {llmLoading ? 'Thinking...' : 'Ask'}
        </button>
      </div>
      {llmResponse && (
        <div className="llm-response">
          <strong>Response:</strong>
          <p>{llmResponse}</p>
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
