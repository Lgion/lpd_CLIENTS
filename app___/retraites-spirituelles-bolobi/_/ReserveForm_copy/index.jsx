import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../assets/scss/index_ai_reserveForm.scss';
import Intro from '../ReserveForm/Intro';
import ValidationSection from './ValidationSection'; // Importer ValidationSection

const initialState = {
  names: '',
  community: '',
  phone_number: '',
  email: '',
  from: '',
  to: '',
  participants: 1,
  individual_room_participants: 0,
  message: '',
  type_reservation: 'retraite',
  meal_included: false,
  meal_plan: '', // 1 ou 2
  montant_total: '',
  montant_avance: '',
};

const typeOptions = [
  { value: 'retraite', label: 'Retraite de groupe (générallement le weekend)' },
  { value: 'pray', label: 'Prière ponctuelle (recollection, veillé, 100avé...)' },
  { value: 'individuel', label: 'Retraite de prière Individuelle' },
  { value: 'celebration', label: 'Célébration (mariage, baptême, conférence...)' },
  { value: 'repos', label: 'Séjour Repos-Détente' },
  { value: 'longTerm', label: 'Vacances / Long séjour' },
];

const titreH3 = "RÉSERVER UN SÉJOUR SUR LE CALENDRIER DU SANCTUAIRE (avance sur paiement demandé): "
, sommaire = "RÉSERVER DATE"

export default function ReserveForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [reservationData, setReservationData] = useState(null); // Ajouter un état pour stocker les données de réservation

  // Calcul automatique du montant total
  React.useEffect(() => {
    const participants = parseInt(form.participants, 10) || 0;
    // Cas prière ponctuelle
    if (form.type_reservation === 'pray') {
      setForm(prev => ({ ...prev, montant_total: participants > 0 ? participants * 500 : '' }));
      return;
    }
    // Cas célébration : pas de nuitée, mais repas possible
    if (form.type_reservation === 'celebration') {
      let montant = participants > 0 ? participants * 500 : 0;
      if (form.meal_included && form.meal_plan && participants > 0) {
        const planTarif = form.meal_plan === '2' ? 3000 : 2000;
        montant += participants * planTarif; // 1 jour
      }
      setForm(prev => ({ ...prev, montant_total: montant > 0 ? montant : '' }));
      return;
    }
    // Si dates non valides, on ne calcule pas
    if (!form.from || !form.to) return;
    const fromDate = new Date(form.from);
    const toDate = new Date(form.to);
    // On compte le nombre de nuits (ex: du 1 au 2 = 1 nuit)
    const diffTime = toDate.getTime() - fromDate.getTime();
    let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (isNaN(nights) || nights <= 0) nights = 0;
    const chambres = parseInt(form.individual_room_participants, 10) || 0;
    const dortoirs = Math.max(participants - chambres, 0);
    let montant = (dortoirs * nights * 3000) + (chambres * nights * 10000);
    // Ajout du tarif repas si inclus
    if (form.meal_included && form.meal_plan && nights > 0 && participants > 0) {
      const planTarif = form.meal_plan === '2' ? 3000 : 2000;
      montant += nights * participants * planTarif;
    }
    setForm(prev => ({ ...prev, montant_total: nights > 0 ? montant : '' }));
  }, [form.from, form.to, form.participants, form.individual_room_participants, form.meal_included, form.meal_plan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Si on change le type de réservation, réinitialiser les champs dépendants
    if (name === 'type_reservation') {
      setForm((prev) => ({
        ...prev,
        type_reservation: value,
        // Réinitialiser les champs non pertinents
        individual_room_participants: 0,
        meal_included: false,
        meal_plan: '',
        // On réinitialise la date de départ sauf pour les types qui n'en ont pas besoin
        to: (value === 'celebration' || value === 'pray') ? '' : prev.to,
      }));
      return;
    }
    // Empêcher une date de départ antérieure à la date d'arrivée
    if (name === 'to') {
      if (form.from && value && new Date(value) < new Date(form.from)) {
        // On ignore la modification
        return;
      }
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      // Validation rapide côté client
      if (!form.names || !form.phone_number || !form.from || !form.to || !form.participants || !form.montant_total || !form.montant_avance) {
        setError('Merci de remplir tous les champs obligatoires.');
        setLoading(false);
        return;
      }
      const res = await axios.post('/api/reservation_ai', form);
      if (res.data && res.data.success) {
        setSuccess('Réservation enregistrée avec succès !');
        setReservationData(res.data); // Stocker les données de réservation
        // On ne réinitialise plus le formulaire
      } else {
        setError(res.data?.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <Intro {...{sommaire,titreH3}} />
    <div id="form_reservation" className="ai-reserve-form__container">
      <h2 className="ai-reserve-form__title">Réserver une retraite spirituelle</h2>
      <form className="ai-reserve-form" onSubmit={handleSubmit}>
        <div className="ai-reserve-form__row">
          <label>Nom complet *</label>
          <input name="names" value={form.names} onChange={handleChange} required placeholder="Votre nom" />
        </div>
        <div className="ai-reserve-form__row">
          <label>Communauté</label>
          <input name="community" value={form.community} onChange={handleChange} placeholder="(Optionnel) Ex: Paroisse, groupe, mouvement..." />
        </div>
        <div className="ai-reserve-form__row">
          <label>Téléphone *</label>
          <input name="phone_number" value={form.phone_number} onChange={handleChange} required placeholder="Votre numéro" />
        </div>
        <div className="ai-reserve-form__row">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Votre email" />
        </div>
        <div className="ai-reserve-form__row ai-reserve-form__row--dates">
          <div>
            <label>Date {form.type_reservation === 'pray' ? 'de la prière' : form.type_reservation === 'celebration' ? 'de la célébration' : "d'arrivée"} *</label>
            <input name="from" type="date" value={form.from} onChange={handleChange} required />
          </div>
          {(form.type_reservation !== 'pray' && form.type_reservation !== 'celebration') && (
          <div>
            <label>Date de départ *</label>
            <input name="to" type="date" value={form.to} onChange={handleChange} required style={!form.to ? {background:'#ffeaea',borderColor:'#d32f2f'} : {}} />
          </div>
          )}
        </div>
        <div className="ai-reserve-form__row">
          <label>Nombre de participants *</label>
          <input name="participants" type="number" min="1" value={form.participants} onChange={handleChange} required />
        </div>
        {!(form.type_reservation === 'pray' || form.type_reservation === 'celebration') && (
        <div className="ai-reserve-form__row">
          <label>Chambres individuelles</label>
          <input name="individual_room_participants" type="number" min="0" value={form.individual_room_participants} onChange={handleChange} />
        </div>
        )}
        <div className="ai-reserve-form__row">
          <label>Type de réservation *</label>
          <select name="type_reservation" value={form.type_reservation} onChange={handleChange} required>
            {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        {form.type_reservation !== 'pray' && (
        <>
        {/* Pour célébration et autres, repas possible sauf prière ponctuelle */}
        <div className="ai-reserve-form__row ai-reserve-form__row--checkbox">
          <label>
            <input name="meal_included" type="checkbox" checked={form.meal_included} onChange={handleChange} />
            Repas inclus
          </label>
        </div>
        {form.meal_included && (
          <div className="ai-reserve-form__row">
            <label>Plan de repas *</label>
            <select name="meal_plan" value={form.meal_plan} onChange={handleChange} required
              style={!form.meal_plan ? {background:'#ffeaea',borderColor:'#d32f2f'} : {}}>
              <option value="">Choisir le plan</option>
              <option value="1">1 repas + 1 petit déjeuner (2.000 FCFA/jour/pers.)</option>
              <option value="2">2 repas + 1 petit déjeuner (3.000 FCFA/jour/pers.)</option>
            </select>
          </div>
        )}
        </>
        )}
        {/* Pour prière ponctuelle, pas de repas possible */}
        <div className="ai-reserve-form__row">
          <label>Montant total (FCFA) *</label>
          <input name="montant_total" type="number" min="0" value={form.montant_total} readOnly tabIndex={-1} style={{ background: '#e9ecef', cursor: 'not-allowed' }} required />
          <div className="ai-reserve-form__desc-montant" style={{fontSize:'.97em',color:'#555',marginTop:'0.2em'}}>
            {(() => {
              const fromDate = form.from ? new Date(form.from) : null;
              const toDate = form.to ? new Date(form.to) : null;
              let nights = 0;
              if (fromDate && toDate) {
                const diffTime = toDate.getTime() - fromDate.getTime();
                nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (isNaN(nights) || nights <= 0) nights = 0;
              }
              const participants = parseInt(form.participants, 10) || 0;
              const chambres = parseInt(form.individual_room_participants, 10) || 0;
              const dortoirs = Math.max(participants - chambres, 0);
              let details = [];
              if (form.type_reservation === 'pray') {
                if (participants > 0) details.push(`${participants * 500} FCFA, pour ${participants} participant${participants>1?'s':''} x 500 FCFA`);
                return (
                  <>
                    <span>Prix unique : <b>500 FCFA/participant</b></span><br/>
                    {details.length > 0 && <div>Détail : {details.map((d, i) => <div key={i}>{d}</div>)}</div>}
                  </>
                );
              }
              if (form.type_reservation === 'celebration') {
                if (participants > 0) details.push(`${participants * 500} FCFA, pour ${participants} participant${participants>1?'s':''} x 500 FCFA`);
                if (form.meal_included && form.meal_plan && participants > 0) {
                  const planTarif = form.meal_plan === '2' ? 3000 : 2000;
                  const planLabel = form.meal_plan === '2' ? '2 repas + 1 petit déj.' : '1 repas + 1 petit déj.';
                  details.push(`${participants * planTarif} FCFA, pour ${participants} pers. x (${planLabel})`);
                }
                return (
                  <>
                    <span>Prix unique : <b>500 FCFA/participant</b>{form.meal_included && form.meal_plan ? <> | Repas : <b>{form.meal_plan === '2' ? '3.000' : '2.000'} FCFA/pers.</b></> : null}</span><br/>
                    {details.length > 0 && <div>Détail : {details.map((d, i) => <div key={i}>{d}</div>)}</div>}
                  </>
                );
              }
              if (nights > 0) {
                if (dortoirs > 0) details.push(`${dortoirs * nights * 3000} FCFA, pour ${dortoirs} pers. en dortoir x ${nights} nuit${nights>1?'s':''} x 3.000 FCFA`);
                if (chambres > 0) details.push(`${chambres * nights * 10000} FCFA, pour ${chambres} chambre${chambres>1?'s':''} individuelle${chambres>1?'s':''} x ${nights} nuit${nights>1?'s':''} x 10.000 FCFA`);
                if (form.meal_included && form.meal_plan && participants > 0) {
                  const planTarif = form.meal_plan === '2' ? 3000 : 2000;
                  const planLabel = form.meal_plan === '2' ? '2 repas + 1 petit déj. ('+planTarif+' FCFA/jour/pers.)' : '1 repas + 1 petit déj. ('+planTarif+' FCFA/jour/pers.)';
                  details.push(`${(participants * (nights+1) * planTarif).toLocaleString()} FCFA, pour ${participants} pers. x ${nights+1} jour${nights>1?'s':''} x (${planLabel})`);
                }
              }
              return (
                <>
                  <span>Nombre de nuits : <b>{nights}</b> | Dortoir : <b>3.000 FCFA/nuit</b> | Chambre individuelle : <b>10.000 FCFA/nuit</b>{form.meal_included && form.meal_plan ? <> | Repas : <b>{form.meal_plan === '2' ? '3.000' : '2.000'} FCFA/jour/pers.</b></> : null}</span><br/>
                  {details.length > 0 && <div>Détail : {details.map((d, i) => <div key={i}>{d}</div>)}</div>}
                </>
              );
            })()}
          </div>
        </div>
        <div className="ai-reserve-form__row">
          <label>Montant de l'avance (€) *</label>
          <input name="montant_avance" type="number" min="0" value={form.montant_avance} onChange={handleChange} 
            placeholder={form.montant_total ? `Ex: ${Math.ceil(form.montant_total*0.2)} FCFA (20% de ${form.montant_total}F CFA)` : ''} required />
        </div>
        <div className="ai-reserve-form__row">
          <label>Message</label>
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Votre message (optionnel)" />
        </div>
        {error && <div className="ai-reserve-form__error">{error}</div>}
        {success && (
          <>
            <div className="ai-reserve-form__success">{success}</div>
            {reservationData && (
              <ValidationSection reservationData={form} />
            )}
          </>
        )}
        {!success && (
          <button className="ai-reserve-form__submit" type="submit" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer la réservation'}
          </button>
        )}
      </form>
    </div>
  </>);
}