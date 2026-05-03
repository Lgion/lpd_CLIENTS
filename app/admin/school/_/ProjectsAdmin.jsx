"use client";
import { useState, useEffect } from 'react';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', target_amount: '', image: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/donation-projects');
    const data = await res.json();
    setProjects(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/donation-projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ title: '', description: '', target_amount: '', image: '' });
    fetchProjects();
  };

  const toggleActive = async (id, currentState) => {
    await fetch(`/api/donation-projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !currentState })
    });
    fetchProjects();
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <h2>Gestion des Projets de Dons</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="Titre" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
        <input type="text" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        <input type="number" placeholder="Objectif (FCFA)" value={formData.target_amount} onChange={e => setFormData({...formData, target_amount: e.target.value})} />
        <input type="text" placeholder="URL Image" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
        <button type="submit">Ajouter</button>
      </form>

      <ul>
        {projects.map(p => (
          <li key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
            <span>{p.title} - {p.target_amount} FCFA</span>
            <button onClick={() => toggleActive(p._id, p.is_active)}>
              {p.is_active ? 'Désactiver' : 'Activer'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
