"use client";
import { useState, useEffect } from 'react';

export default function NatureSettingsAdmin() {
  const [settings, setSettings] = useState([]);
  const [formData, setFormData] = useState({ label: '', unit: '', icon: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await fetch('/api/nature-settings');
    const data = await res.json();
    setSettings(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/nature-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ label: '', unit: '', icon: '' });
    fetchSettings();
  };

  const toggleActive = async (id, currentState) => {
    await fetch(`/api/nature-settings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !currentState })
    });
    fetchSettings();
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <h2>Gestion des Types de Dons en Nature</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="Label (ex: Riz)" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} required />
        <input type="text" placeholder="Unité (ex: kg)" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} required />
        <input type="text" placeholder="Icône (Emoji/Texte)" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} required />
        <button type="submit">Ajouter</button>
      </form>

      <ul>
        {settings.map(s => (
          <li key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
            <span>{s.icon} {s.label} ({s.unit})</span>
            <button onClick={() => toggleActive(s._id, s.is_active)}>
              {s.is_active ? 'Désactiver' : 'Activer'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
