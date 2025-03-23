// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // For navigation
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);  // Store project list
  const [newProject, setNewProject] = useState('');  // Input for new project

  // Fetch projects on load
  useEffect(() => {
    axios.get('http://localhost:8000/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error('Error fetching projects:', err));
  }, []);

  // Add a new project
  const addProject = () => {
    if (!newProject) return;  // Skip empty input
    axios.post('http://localhost:8000/projects', { name: newProject })
      .then(res => {
        setProjects([...projects, res.data]);  // Add to list
        setNewProject('');  // Clear input
      })
      .catch(err => console.error('Error adding project:', err));
  };

  return (
    <div>
      <h1>Project Tracker</h1>
      <input
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
        placeholder="New Project Name"
      />
      <button onClick={addProject}>Add Project</button>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            {project.name} <Link to={`/project/${project.id}`}>View Tasks</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;  
