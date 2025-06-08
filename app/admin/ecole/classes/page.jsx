"use client"

// Liste des classes et gestion modale
import { useContext, useState, useEffect } from 'react';
import { AiAdminContext } from '../../../../stores/ai_adminContext';
import EntityModal from '../components/EntityModal';

export default function ClassesPage() {
  const ctx = useContext(AiAdminContext);
  if (!ctx) return <div style={{color:'red'}}>Erreur : AiAdminContext non trouvé. Vérifiez que l'application est bien entourée par le provider.</div>;
  const { classes = [], fetchClasses } = ctx;
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchClasses && fetchClasses(); }, []);

  return (
    <div>
      <h1>Liste des classes</h1>
      <button onClick={() => { setSelected(null); setShowModal(true); }}>Ajouter une classe</button>
      <table>
        <thead><tr><th>Nom</th><th>Année</th><th>Actions</th></tr></thead>
        <tbody>
          {classes.map(classe => (
            <tr key={classe._id}>
              <td>{classe.nom}</td>
              <td>{classe.annee}</td>
              <td>
                <button onClick={() => { setSelected(classe); setShowModal(true); }}>Voir / Éditer</button>
                {/* Suppression à ajouter */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && <EntityModal type="classe" entity={selected} onClose={() => setShowModal(false)} />}
    </div>
  );
}

