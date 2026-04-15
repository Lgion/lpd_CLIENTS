 "use client"

import Link from 'next/link';
import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AiAdminContext } from '../../../../../stores/ai_adminContext';
import Gmap from '../../../../_/Gmap_plus';

export default function EnseignantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const ctx = useContext(AiAdminContext);
  if (!ctx) return <div className="admin-error">Erreur : contexte non trouvé</div>;
  useEffect(() => {
    ctx.fetchEnseignants && ctx.fetchEnseignants();
    ctx.fetchClasses && ctx.fetchClasses();
  }, []);

  const { setSelected, showModal, setShowModal } = ctx;
  const enseignant = (ctx.enseignants || []).find(e => String(e._id) === String(id));
  const classe = ctx.classes.find(c=>c._id==enseignant.current_classes)
  const [gmapOpen, setGmapOpen] = useState(false)

  if (!enseignant) return <div className="admin-error">Enseignant introuvable</div>;

  return !enseignant ? <div>....loading.....</div>
    : <div className="person-detail person-detail--relative">
      <button
        className="person-detail__close-btn"
        aria-label="Fermer"
        onClick={() => router.back()}
      >✕</button>
      {setSelected && !showModal && (
        <button
          type="button"
          className="person-detail__editbtn"
          onClick={e => { e.stopPropagation(); e.preventDefault(); setSelected(enseignant); setShowModal(true); }}
          tabIndex={0}
        >Éditer</button>
      )}
      {showModal && <button
          className="person-detail__editbtn"
          onClick={e => { e.stopPropagation(); e.preventDefault(); setShowModal(false); }}
        >Fermer Édition</button>
      }
      <img className="person-detail__photo" src={enseignant.photo_$_file || '/default-photo.png'} alt="" />
      <h1 className="person-detail__title"><u>Enseignant :</u> {enseignant.nom} {enseignant.prenoms} ({enseignant.sexe}) <span className="person-detail__subtitle-light">[<time dateTime={enseignant.naissance_$_date}>{enseignant.naissance_$_date ? new Date(enseignant.naissance_$_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</time>]</span></h1>
      <div className="person-detail__classe">
        <u>Classe principale :</u> <Link href={`/admin/ecole/classes/${classe._id}`}>{classe.niveau} - {classe.alias}</Link>
      </div>
      <div className="person-detail__gmap">
        <u>Domicilié (coordonées gmap): </u>
        <button className="person-detail__gmap-btn" onClick={() => setGmapOpen(o => !o)}>
          {gmapOpen ? 'Cacher' : enseignant.adresse_$_map}
        </button>
        {gmapOpen && (
          <div className="person-detail__gmap-map">
            <Gmap 
              initialPosition={[enseignant.adresse_$_map?.lat, enseignant.adresse_$_map?.lng]} 
              zoom={16}
            />
          </div>
        )}
      </div>
      <div className="person-detail__contact">
        <u>Contact :</u><br/>
        <span className="person-detail__contact-item"><b>Téléphone : </b>{enseignant.phone_$_tel  || <span className="person-detail__empty-text">Non renseigné</span>}</span>
        <span className="person-detail__contact-item"><b>Email : </b>{enseignant.email_$_email || <span className="person-detail__empty-text">Non renseigné</span>}</span>
      </div>
      {/* Ajoute ici d'autres blocs d'infos si besoin */}
    </div>
}