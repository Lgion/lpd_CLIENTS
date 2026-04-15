 "use client";
 import Link from 'next/link';
import { useContext,useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AiAdminContext } from '../../../../../stores/ai_adminContext';
import { Parent, DocumentsBlock, IsInterneBlock, AddNoteForm, CompositionsBlock, SchoolHistoryBlock, ScolarityFeesBlock, CommentairesBlock, AbsencesBlock, BonusBlock, ManusBlock } from '../../components/EntityModal.jsx';
import Gmap from '../../../../_/Gmap_plus';

export default function ElevePage() {
  const { id } = useParams();
  const router = useRouter();
  const ctx = useContext(AiAdminContext);
  if (!ctx) return <div className="admin-error">Erreur : contexte non trouvé</div>;
  const getDefaultSchoolYear = (compositions) => {
    const keys = Object.keys(compositions || {});
    if (keys.length > 0) return keys[0];
    const now = new Date();
    return (now.getMonth() + 1) < 7 ? (now.getFullYear() - 1) + "-" + now.getFullYear() : now.getFullYear() + "-" + (now.getFullYear() + 1);
  };
    useEffect(() => { 
        ctx.fetchEleves && ctx.fetchEleves(); 
        ctx.fetchClasses && ctx.fetchClasses(); 
    }, []);
  
  // DEBUG : log ids pour comprendre le bug
  console.log('params id:', id, 'eleves ids:', (ctx.eleves||[]).map(e=>e._id));
  console.log(ctx.eleves);
  const { setSelected, showModal, setShowModal } = ctx;
  
  const eleve = (ctx.eleves || []).find(e => String(e._id) === String(id));
  const [gmapOpen, setGmapOpen] = useState(false)
  const [schoolYear, setSchoolYear] = useState(getDefaultSchoolYear(eleve?.compositions || {}));
  if (!eleve) return <div className="admin-error">Élève introuvable</div>;
  const classe = (ctx.classes || []).find(c => c._id === eleve.current_classe) || {}


  // Récupère toutes les années de scolarité pour progression globale
  const allFees = eleve.scolarity_fees_$_checkbox || {};
  const onEdit = e => { setSelected(e); setShowModal(true); }
  // Fusionne tous les dépôts pour une progression globale
  let totalArgent = 0, totalRiz = 0;
  Object.values(allFees).forEach(fees => {
    Object.values(fees||{}).forEach(v => {
      if (v.argent) totalArgent += Number(v.argent);
      if (v.riz) totalRiz += Number(v.riz);
    });
  });
  console.log(eleve);
  
  return !eleve ? <div>....loading.....</div>
    : <div className="person-detail">
      <button
        className="person-detail__close-btn"
        aria-label="Fermer"
        onClick={() => router.back()}
      >✕</button>
      {onEdit && !showModal &&(
        <button
          type="button"
          className="person-detail__editbtn"
          onClick={e => { e.stopPropagation(); e.preventDefault(); onEdit(eleve); }}
          tabIndex={0}
        >Éditer</button>
      )}
      {showModal && <button
          className="person-detail__editbtn"
          onClick={e => { e.stopPropagation(); e.preventDefault(); setShowModal(false); }}
        >Fermer Édition</button>
      }
      <img className="person-detail__photo" src={eleve.photo_$_file} alt="" />
      <h1 className="person-detail__title"><u>Élève:</u> {eleve.nom} {eleve.prenoms} ({eleve.sexe}) (<time dateTime={eleve.naissance_$_date}>{new Date(eleve.naissance_$_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</time>)</h1>
      <div className="person-detail__classe">
        <u>En classe de:</u> <Link href={`/admin/ecole/classes/${classe._id}`}>{classe.niveau} - {classe.alias}</Link>
      </div>
      <div className="person-detail__gmap">
        <u>Domicilié (coordonées gmap): </u>
        <button className="person-detail__gmap-btn" onClick={() => setGmapOpen(o => !o)}>
          {gmapOpen ? 'Cacher' : eleve.adresse_$_map}
        </button>
        {gmapOpen && (
          <div className="person-detail__gmap-map">
            <Gmap 
              initialPosition={[eleve.adresse_$_map?.lat, eleve.adresse_$_map?.lng]} 
              zoom={16}
            />
          </div>
        )}
      </div>

      <Parent parents={eleve.parents} />

      <IsInterneBlock form={eleve} />

      {/* <DocumentsBlock form={eleve} readOnly={true} /> */}

      <AbsencesBlock absences={eleve.absences} />

      <BonusBlock bonus={eleve.bonus} />

      <ManusBlock manus={eleve.manus} />

      <CompositionsBlock compositions={eleve.compositions} schoolYear={schoolYear} onChangeYear={setSchoolYear} />
              
      <AddNoteForm notes={eleve.notes} />

      <div className="person-detail__block person-detail__block--history">
        <h2 className="person-detail__subtitle">Historique des écoles</h2>
        <SchoolHistoryBlock schoolHistory={eleve.schoolHistory} />
      </div>
      <div className="person-detail__block person-detail__block--fees">
        <h2 className="person-detail__subtitle">Frais de scolarité</h2>
        {Object.keys(allFees).length === 0 ? <div>Aucun dépôt enregistré</div> :
          Object.entries(allFees).map(([year, fees]) => (
            <div key={year} className="person-detail__year-block">
              <div className="person-detail__year-title">{year}</div>
              <ScolarityFeesBlock fees={fees} schoolYear={year} />
            </div>
          ))
        }
        <div className="person-detail__footer-text">
          <b>Total sur toutes années :</b> {totalArgent} F | {totalRiz} kg riz
        </div>
      </div>
      <div className="person-detail__history-margin">
        <h2>Commentaires</h2>
        <CommentairesBlock commentaires={eleve.commentaires} />
      </div>
    </div>
}