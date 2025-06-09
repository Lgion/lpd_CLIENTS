
"use client"
import { useContext } from "react";
import { AiAdminContext } from '../../../../stores/ai_adminContext';
import EntityModal from '../components/EntityModal';

export default function EcoleAdminEleveLayout({ children }) {
    const ctx = useContext(AiAdminContext);
    const {selected, setSelected, showModal, setShowModal} = ctx
    
    return (<div>
        <h1>Liste des élèves</h1>
        <button onClick={() => { setSelected(null); setShowModal(true); }}>Ajouter un élève</button>
        {showModal && <EntityModal type="eleve" entity={selected} onClose={() => setShowModal(false)} classes={ctx.classes || []} />}
        {children}
    </div>)
}