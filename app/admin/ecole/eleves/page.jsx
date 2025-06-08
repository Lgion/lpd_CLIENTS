"use client"

// Liste des élèves et gestion modale
import { useContext, useState, useEffect } from 'react';
import { AiAdminContext } from '../../../../stores/ai_adminContext';
import EntityModal from '../components/EntityModal';

export default function ElevesPage() {
  const ctx = useContext(AiAdminContext);
  if (!ctx) return <div style={{color:'red'}}>Erreur : AiAdminContext non trouvé. Vérifiez que l'application est bien entourée par le provider.</div>;
  const { eleves = [], fetchEleves } = ctx;
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchEleves && fetchEleves(); }, []);

  return (
    <div>
      <h1>Liste des élèves</h1>
      <button onClick={() => { setSelected(null); setShowModal(true); }}>Ajouter un élève</button>
      <table>
        <thead><tr><th>Nom</th><th>Prénoms</th><th>Classe</th><th>Actions</th></tr></thead>
        <tbody>
          {eleves.map(eleve => (
            <tr key={eleve._id}>
              <td>{eleve.nom}</td>
              <td>{Array.isArray(eleve.prenoms) ? eleve.prenoms.join(', ') : eleve.prenoms}</td>
              <td>{eleve.current_classe || ''}</td>
              <td>
                <button onClick={() => { setSelected(eleve); setShowModal(true); }}>Voir / Éditer</button>
                {/* Suppression à ajouter */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && <EntityModal type="eleve" entity={selected} onClose={() => setShowModal(false)} classes={ctx.classes || []} />}
    </div>
  );
}

