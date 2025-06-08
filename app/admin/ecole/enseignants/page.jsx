"use client"

// Liste des enseignants et gestion modale
import { useContext, useState, useEffect } from 'react';
import { AiAdminContext } from '../../../../stores/ai_adminContext';
import EntityModal from '../components/EntityModal';

export default function EnseignantsPage() {
  const ctx = useContext(AiAdminContext);
  if (!ctx) return <div style={{color:'red'}}>Erreur : AiAdminContext non trouvé. Vérifiez que l'application est bien entourée par le provider.</div>;
  const { enseignants = [], fetchEnseignants } = ctx;
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchEnseignants && fetchEnseignants(); }, []);

  return (
    <div>
      <h1>Liste des enseignants</h1>
      <button onClick={() => { setSelected(null); setShowModal(true); }}>Ajouter un enseignant</button>
      <table>
        <thead><tr><th>Nom</th><th>Prénoms</th><th>Actions</th></tr></thead>
        <tbody>
          {enseignants.map(ens => (
            <tr key={ens._id}>
              <td>{ens.nom}</td>
              <td>{Array.isArray(ens.prenoms) ? ens.prenoms.join(', ') : ens.prenoms}</td>
              <td>
                <button onClick={() => { setSelected(ens); setShowModal(true); }}>Voir / Éditer</button>
                {/* Suppression à ajouter */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && <EntityModal type="enseignant" entity={selected} onClose={() => setShowModal(false)} />}
    </div>
  );
}

