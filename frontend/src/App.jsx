import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  // New: Error state
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/projects')
      .then(res => setProjects(res.data))
      .catch(err => setError('Failed to fetch projects—backend might be down!'));
  }, []);

  const addProject = () => {
    if (!newProject) return;
    axios.post('http://localhost:8000/projects', { name: newProject })
      .then(res => {
        setProjects([...projects, res.data]);
        setNewProject('');
        setError(''); 
      })
      .catch(err => setError('Failed to add project—check backend!'));
  };

  return (
    <div className="container">
      <h1>Project Tracker</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        className="input-field"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
        placeholder="New Project Name"
      />
      <button className="button" onClick={addProject}>Add Project</button>
      <ul className="project-list">
        {projects.map(project => (
          <li className="project-item" key={project.id}>
            {project.name} <Link to={`/project/${project.id}`}>View Tasks</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
