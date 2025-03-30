import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api, { generateTasksWithAI } from './api';
import './App.css';

function ProjectPage() {
  const { projectId } = useParams();
  
  // State management
  const [state, setState] = useState({
    tasks: [],
    newTask: '',
    projectName: 'Loading...',
    error: '',
    projectDetails: '',
    llmTasks: [],
    loading: {
      tasks: true,
      project: true,
      llm: false
    }
  });

  // Derived state
  const completedTasks = state.tasks.filter(t => t.status === 1).length;
  const totalTasks = state.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Helper to update state
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, projectsResponse] = await Promise.all([
          api.get(`/tasks/${projectId}`),
          api.get('/projects')
        ]);
        
        updateState({
          tasks: tasksResponse.tasks || [],
          projectName: projectsResponse.find(p => p.id === parseInt(projectId))?.name || 'Unknown Project',
          loading: { tasks: false, project: false, llm: false }
        });
        
      } catch (err) {
        updateState({ 
          error: err.message,
          loading: { tasks: false, project: false, llm: false }
        });
      }
    };

    fetchData();
  }, [projectId]);

  // Task operations
  const addTask = async () => {
    if (!state.newTask.trim()) {
      updateState({ error: 'Task name cannot be empty' });
      return;
    }

    try {
      const createdTask = await api.post('/tasks', {
        project_id: parseInt(projectId),
        name: state.newTask
      });
      
      updateState({ 
        tasks: [...state.tasks, { ...createdTask, status: 0 }],
        newTask: '',
        error: ''
      });
    } catch (err) {
      updateState({ error: err.message });
    }
  };

  const toggleTaskStatus = async (taskId) => {
    try {
      const updatedTask = await api.patch(`/tasks/${taskId}`);
      updateState({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, status: updatedTask.status } : task
        )
      });
    } catch (err) {
      updateState({ error: `Failed to update task: ${err.message}` });
    }
  };

  // AI Task Generation
  const handleGenerateTasks = async () => {
    if (!state.projectDetails.trim()) {
      updateState({ error: 'Please describe your project for suggestions' });
      return;
    }

    updateState({ 
      loading: { ...state.loading, llm: true },
      error: ''
    });

    try {
      const suggestions = await generateTasksWithAI(state.projectDetails);
      updateState({ llmTasks: suggestions });
    } catch (err) {
      updateState({ error: err.message });
    } finally {
      updateState({ 
        loading: { ...state.loading, llm: false }
      });
    }
  };

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateState({ [name]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  return (
    <div className="container">
      
      <h1>{state.projectName} Tasks</h1>
      
      {/* Error Display */}
      {state.error && <p className="error-message">{state.error}</p>}
      
      {/* Add Task Form */}
      <div className="input-group">
        <input
          type="text"
          name="newTask"
          value={state.newTask}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter new task"
          disabled={state.loading.tasks}
        />
        <button 
          onClick={addTask}
          disabled={state.loading.tasks || !state.newTask.trim()}
        >
          {state.loading.tasks ? 'Adding...' : 'Add Task'}
        </button>
      </div>
      
      {/* AI Task Generation */}
      <div className="llm-container">
        <h3>AI Task Suggestions</h3>
        <textarea
          name="projectDetails"
          value={state.projectDetails}
          onChange={handleInputChange}
          placeholder="Describe your project (e.g., 'Build a login system with authentication')"
          disabled={state.loading.llm}
        />
        <button 
          onClick={handleGenerateTasks}
          disabled={state.loading.llm || !state.projectDetails.trim()}
        >
          {state.loading.llm ? 'Generating...' : 'Suggest Tasks'}
        </button>
        
        {state.llmTasks.length > 0 && (
          <div className="llm-suggestions">
            <h4>Suggested Tasks:</h4>
            <ul>
              {state.llmTasks.map((task, index) => (
                <li key={index}>
                  {task}
                  <button 
                    className="add-suggestion-btn"
                    onClick={() => updateState({ newTask: task })}
                  >
                    Use
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="divider"></div>
      
      {/* Progress Tracking */}
      <div className="progress-container">
        <span className="progress-text">
          Progress: {completedTasks}/{totalTasks} ({progress}%)
        </span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Task List */}
      <h2>Task List</h2>
      {state.loading.tasks ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="task-list">
          {state.tasks.length === 0 ? (
            <li className="no-tasks">No tasks yet. Add one above!</li>
          ) : (
            state.tasks.map((task) => (
              <li key={task.id} className="task-item">
                <label className="task-checkbox">
                  <input
                    type="checkbox"
                    checked={task.status === 1}
                    onChange={() => toggleTaskStatus(task.id)}
                  />
                  <span className="checkmark" />
                </label>
                <span className={`task-name ${task.status === 1 ? 'completed' : ''}`}>
                  {task.name}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default ProjectPage;