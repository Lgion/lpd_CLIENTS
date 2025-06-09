"use client"

// Liste des élèves et gestion modale
import { useContext, useState, useEffect } from 'react';
import { AiAdminContext } from '../../../../stores/ai_adminContext';
import EleveCard from './EleveCard';
import './EleveCard.scss';

export default function ElevesPage() {
  const ctx = useContext(AiAdminContext);
  if (!ctx) return <div style={{color:'red'}}>Erreur : AiAdminContext non trouvé. Vérifiez que l'application est bien entourée par le provider.</div>;
  const {selected, setSelected, showModal, setShowModal} = ctx
  const { eleves = [], fetchEleves } = ctx;

  useEffect(() => { fetchEleves && fetchEleves(); }, []);

  return (<>
    <div className="eleves-list">
      {eleves.map(eleve => (
        <EleveCard
          key={eleve._id}
          classe={(ctx.classes || []).find(c => c._id === eleve.current_classe) || {}}
          eleve={eleve}
          onClick={() => { setSelected(eleve); setShowModal(true); }}
          onEdit={e => { setSelected(e); setShowModal(true); }}
        />
      ))}
    </div>
  </>);
}

