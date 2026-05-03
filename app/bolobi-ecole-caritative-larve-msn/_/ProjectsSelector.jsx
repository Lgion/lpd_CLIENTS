import { useState, useEffect } from 'react';

export default function ProjectsSelector({ onProjectSelect }) {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch('/api/donation-projects')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setProjects(data.filter(p => p.is_active));
      });
  }, []);

  return (
    <div className="projects-selector">
      <h4>Choisissez un projet à financer :</h4>
      <div className="projects-grid">
        {projects.map(p => (
          <div 
            key={p._id} 
            className={`project-card ${selectedId === p._id ? 'selected' : ''}`}
            onClick={() => {
              setSelectedId(p._id);
              onProjectSelect(p);
            }}
          >
            {p.image && <img src={p.image} alt={p.title} />}
            <h5>{p.title}</h5>
            <p className="project-card__desc">{p.description}</p>
            <div className="project-card__progress">
              Objectif: {p.target_amount ? `${p.target_amount} FCFA` : 'Non défini'}
            </div>
          </div>
        ))}
      </div>
      {selectedId && <input type="hidden" name="project_id" value={selectedId} />}
    </div>
  );
}
