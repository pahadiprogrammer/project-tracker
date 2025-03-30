import { useState, useEffect } from 'react';
import axios from 'axios';
import api from './api';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({
    projects: false,
    addProject: false
  });

  // Enhanced fetch with retry logic
  const fetchProjects = async (retryCount = 0) => {
    setLoading(prev => ({ ...prev, projects: true }));
    setError(null);
    
    try {
      console.log('Attempting to fetch projects...'); // Debug
      const data = await api.get('/projects');
      setProjects(data);
      console.log('Projects fetched successfully:', data); // Debug
    } catch (err) {
      console.error('Fetch error:', err); // Debug
      if (retryCount < 2) {
        console.log(`Retrying... (${retryCount + 1}/2)`); // Debug
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchProjects(retryCount + 1);
      }
      setError({
        message: err.message,
        details: 'Check: 1) Backend running 2) Correct API key 3) CORS setup'
      });
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async () => {
    if (!newProject.trim()) {
      setError({ message: 'Project name cannot be empty' });
      return;
    }

    setLoading(prev => ({ ...prev, addProject: true }));
    try {
      const createdProject = await api.post('/projects', { name: newProject });
      setProjects(prev => [...prev, createdProject]);
      setNewProject('');
      setError(null);
    } catch (err) {
      setError({ 
        message: err.message,
        details: 'Failed to communicate with backend'
      });
    } finally {
      setLoading(prev => ({ ...prev, addProject: false }));
    }
  };

  return (
    <div className="container">
      
      <h1>Project Tracker</h1>
      
      {/* Enhanced error display */}
      {error && (
        <div className="error">
          <strong>Error:</strong> {error.message}
          {error.details && <p>{error.details}</p>}
          <button onClick={() => fetchProjects()}>Retry</button>
        </div>
      )}

      <div className="input-group">
        <input
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="New Project Name"
          disabled={loading.addProject}
        />
        <button 
          onClick={addProject}
          disabled={loading.addProject || !newProject.trim()}
        >
          {loading.addProject ? 'Adding...' : 'Add Project'}
        </button>
      </div>

      <div className="divider"></div>

      <h2>Projects</h2>
      {loading.projects ? (
        <p>Loading projects...</p>
      ) : (
        <ul className="project-list">
          {projects.length === 0 ? (
            <li className="no-projects">No projects found</li>
          ) : (
            projects.map((project) => (
              <li key={project.id} className="project-item">
                <span className="project-name">{project.name}</span>
                <a 
                  href={`/project/${project.id}`} 
                  className="task-link"
                >
                  View Tasks
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default App;