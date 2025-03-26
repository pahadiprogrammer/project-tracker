// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/projects')
      .then(res => setProjects(res.data))
      .catch(err => setError('Failed to fetch projects. Is the backend running?'));
  }, []);

  const addProject = () => {
    if (!newProject) return;
    axios.post('http://localhost:8000/projects', { name: newProject })
      .then(res => {
        setProjects([...projects, res.data]);
        setNewProject('');
        setError('');
      })
      .catch(err => setError('Failed to add project. Check backend connection.'));
  };

  return (
    <div className="container">
      <h1>Project Tracker</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="input-group">
        <input
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="New Project Name"
        />
        <button onClick={addProject}>Add Project</button>
      </div>
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