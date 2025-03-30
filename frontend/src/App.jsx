// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';

function Loader() {
  return <div className="loader"></div>;
}

function App() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectNameError, setProjectNameError] = useState('');
  const [addingProject, setAddingProject] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/projects')
      .then(res => {
        setTimeout(() => {
          setProjects(res.data);
          setLoading(false);
        }, 1000);
      })
      .catch(err => {
        setError('Failed to fetch projects. Is the backend running?');
        setLoading(false);
      });
  }, []);

  const addProject = () => {
    if (!newProject) {
      setProjectNameError('Project name cannot be empty.');
      return;
    }
    if (newProject.length > 100) {
      setProjectNameError('Project name is too long.');
      return;
    }
    setProjectNameError('');
    setAddingProject(true);
    axios.post('http://localhost:8000/projects', { name: newProject })
      .then(res => {
        setTimeout(() => {
          setProjects([...projects, res.data]);
          setNewProject('');
          setError('');
          setAddingProject(false);
        }, 1000);
      })
      .catch(err => {
        setError('Failed to add project. Check backend connection.');
        setAddingProject(false);
      });
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <div className="container">
      <h1>Project Tracker</h1>
      {error && (
        <div className="error-modal">
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={handleCloseError}>Close</button>
        </div>
      )}
      {loading && (
        <div className="loading-container">
          <Loader />
          <p className="updating-message">Loading projects...</p>
        </div>
      )}
      <div className="input-group">
        <input
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="New Project Name"
        />
        <button onClick={addProject} disabled={!newProject}>Add Project</button>
      </div>
      {projectNameError && <p style={{ color: 'red' }}>{projectNameError}</p>}
      {addingProject && (
        <div className="loading-container">
          <Loader />
          <p className="updating-message">Adding project...</p>
        </div>
      )}
      <div className="divider"></div>
      <h2>Projects</h2>
      <ul className="project-list">
        {projects.map((project, index) => (
          <li key={project.id} className="project-item">
            <span className="project-name">{`${index + 1}. ${project.name}`}</span>
            <Link to={`/project/${project.id}`} className="task-link">View Tasks</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;