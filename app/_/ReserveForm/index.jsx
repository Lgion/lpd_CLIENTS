import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../assets/scss/index_ai_reserveForm.scss';
import Intro from './Intro';
import ValidationSection from './ValidationSection'; // Importer ValidationSection
import ReservationCalendar from './ReservationCalendar';
import AdminReservationToolbarModal from './AdminReservationToolbarModal';
import VoiceReservationSection from './VoiceReservationSection';

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
  const [formMode, setFormMode] = useState('classic'); // 'classic' | 'audio'
  const [form, setForm] = useState(initialState);
  const [allReservations, setAllReservations] = useState([]);

  const fetchAllReservations = async () => {
    try {
      const res = await fetch('/api/reservation');
      if (res.ok) {
        const data = await res.json();
        setAllReservations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Erreur chargement réservations:', err);
    }
  };

  useEffect(() => {
    fetchAllReservations();
  }, []);

  const handleSelectCalendarDates = (fromStr, toStr) => {
    setForm(prev => ({
      ...prev,
      from: fromStr || '',
      to: toStr || (prev.type_reservation === 'pray' || prev.type_reservation === 'celebration' ? '' : prev.to)
    }));
  };

  // Pré-remplissage du formulaire avec les infos du user localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setForm(form => ({
          ...form,
          names: user.fullName || form.names || '',
          email: user.email || form.email || '',
          phone_number: user.tel || form.phone_number || '',
          community: user.communaute || form.community || '',
          // Ajoute d'autres correspondances ici si besoin
        }));
      } catch (e) {
        // Optionnel: gérer l'erreur de parsing
      }
    }
  }, []);
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
    // Ajout du tarif repas si inclus (1 repas/j = 2 000 FCFA, 2 repas/j = 3 000 FCFA, jamais de 1000F)
    if (form.meal_included && form.meal_plan && nights > 0 && participants > 0) {
      const fullDays = Math.max(nights - 1, 0); // Jours intermédiaires (samedi, etc.)
      const borderDaysCost = nights >= 1 ? 4000 : 0; // 2 jours de bordure (Arrivée & Départ = 1 repas/j = 2 000 FCFA × 2 = 4 000 FCFA total / pers)
      const dailyRate = form.meal_plan === '2' ? 3000 : 2000;
      montant += (fullDays * dailyRate + borderDaysCost) * participants;
    }
    setForm(prev => {
      const newTotal = nights > 0 ? montant : '';
      const suggestedAdvance = newTotal ? Math.ceil((newTotal * 0.2) / 1000) * 1000 : '';
      return {
        ...prev,
        montant_total: newTotal,
        montant_avance: prev.montant_avance || suggestedAdvance
      };
    });
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
      const isDateToRequired = form.type_reservation !== 'pray' && form.type_reservation !== 'celebration';

      // Debug: log form values to identify missing fields
      console.log('Form validation - Current form values:', {
        names: form.names,
        phone_number: form.phone_number,
        from: form.from,
        to: form.to,
        participants: form.participants,
        montant_total: form.montant_total,
        montant_avance: form.montant_avance,
        type_reservation: form.type_reservation,
        isDateToRequired
      });

      // Check each required field individually for better error reporting
      const missingFields = [];
      if (!form.names) missingFields.push('Nom complet');
      if (!form.phone_number) missingFields.push('Téléphone');
      if (!form.from) missingFields.push('Date d\'arrivée');
      if (isDateToRequired && !form.to) missingFields.push('Date de départ');
      if (!form.participants) missingFields.push('Nombre de participants');
      if (!form.montant_total) missingFields.push('Montant total');
      if (!form.montant_avance) missingFields.push('Montant de l\'avance');

      if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields);
        setError(`Champs obligatoires manquants: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }
      const res = await axios.post('/api/reservation_ai', form);
      if (res.data && res.data.success) {
        // alert("a")
        setSuccess('Réservation enregistrée avec succès !');
        // alert("b")
        setReservationData(res.data); // Stocker les données de réservation
        // alert("c")
        const user = JSON.parse(localStorage.getItem('user')) || {};
        // alert("d"+user)
        const userToSave = {
          email: user.email || form.email,
          fullName: user.fullName || form.names,
          tel: user.tel || form.phone_number,
          communaute: user.communaute || form.community,
          options: user.options,
          commandes: user.commandes || { sanctuaire: [], ecom: [] },
        };
        // alert("e")
        localStorage.setItem('user', JSON.stringify(userToSave));
        // alert("f")
        await axios.post('/api/users', userToSave);
        fetchAllReservations();
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
    <Intro {...{ sommaire, titreH3 }} />

    {/* BOUTONS SWITCHER MODE FORMULAIRE CLASSIC vs AUDIO VOCAL */}
    <div className="mode-switcher-bar" style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: '24px 0 32px 0', flexWrap: 'wrap' }}>
      <button
        type="button"
        className={`mode-switch-btn ${formMode === 'classic' ? 'mode-switch-btn--active' : ''}`}
        onClick={() => setFormMode('classic')}
        style={{
          padding: '14px 28px',
          borderRadius: 50,
          border: '2px solid #2563eb',
          background: formMode === 'classic' ? '#2563eb' : '#ffffff',
          color: formMode === 'classic' ? '#ffffff' : '#2563eb',
          fontWeight: 800,
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: formMode === 'classic' ? '0 6px 20px rgba(37,99,235,0.3)' : 'none'
        }}
      >
        📝 Formulaire Classique
      </button>

      <button
        type="button"
        className={`mode-switch-btn ${formMode === 'audio' ? 'mode-switch-btn--active' : ''}`}
        onClick={() => setFormMode('audio')}
        style={{
          padding: '14px 28px',
          borderRadius: 50,
          border: '2px solid #2563eb',
          background: formMode === 'audio' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
          color: formMode === 'audio' ? '#ffffff' : '#2563eb',
          fontWeight: 800,
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: formMode === 'audio' ? '0 6px 20px rgba(37,99,235,0.3)' : 'none'
        }}
      >
        🎙️ Mode Réservation Vocale (Guidée IA)
      </button>
    </div>

    {formMode === 'audio' && (
      <VoiceReservationSection
        onVoiceSuccess={(data) => {
          setReservationData(data);
        }}
      />
    )}

    {formMode === 'classic' && (
      <div id="form_reservation" className="ai-reserve-form__container">
        <AdminReservationToolbarModal
          reservations={allReservations}
          onRefresh={fetchAllReservations}
        />
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
          <div className="ai-reserve-form__row">
            <label>Type de réservation *</label>
            <select name="type_reservation" value={form.type_reservation} onChange={handleChange} required>
              <option value={null}>---Choisir un type de réservation---</option>
              {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="ai-reserve-form__row ai-reserve-form__row--dates">
            <div>
              <label>Date {form.type_reservation === 'pray' ? 'de la prière' : form.type_reservation === 'celebration' ? 'de la célébration' : "d'arrivée"} *</label>
              <input name="from" type="date" value={form.from} onChange={handleChange} required />
            </div>
            {(form.type_reservation !== 'pray' && form.type_reservation !== 'celebration') && (
              <div>
                <label>Date de départ *</label>
                <input name="to" type="date" value={form.to} onChange={handleChange} required style={!form.to ? { background: '#ffeaea', borderColor: '#d32f2f' } : {}} />
              </div>
            )}
          </div>
          <ReservationCalendar
            reservations={allReservations}
            selectedFrom={form.from}
            selectedTo={form.to}
            onSelectDates={handleSelectCalendarDates}
            typeReservation={form.type_reservation}
          />
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
                    style={!form.meal_plan ? { background: '#ffeaea', borderColor: '#d32f2f' } : {}}>
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
            <div className="ai-reserve-form__desc-montant" style={{ fontSize: '.97em', color: '#555', marginTop: '0.2em' }}>
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
                  if (participants > 0) details.push(`${participants * 500} FCFA, pour ${participants} participant${participants > 1 ? 's' : ''} x 500 FCFA`);
                  return (
                    <>
                      <span>Prix unique : <b>500 FCFA/participant</b></span><br />
                      {details.length > 0 && <div>Détail : {details.map((d, i) => <div key={i}>{d}</div>)}</div>}
                    </>
                  );
                }
                if (form.type_reservation === 'celebration') {
                  if (participants > 0) details.push(`${participants * 500} FCFA, pour ${participants} participant${participants > 1 ? 's' : ''} x 500 FCFA`);
                  if (form.meal_included && form.meal_plan && participants > 0) {
                    const planTarif = form.meal_plan === '2' ? 3000 : 2000;
                    const planLabel = form.meal_plan === '2' ? '2 repas + 1 petit déj.' : '1 repas + 1 petit déj.';
                    details.push(`${participants * planTarif} FCFA, pour ${participants} pers. x (${planLabel})`);
                  }
                  return (
                    <>
                      <span>Prix unique : <b>500 FCFA/participant</b>{form.meal_included && form.meal_plan ? <> | Repas : <b>{form.meal_plan === '2' ? '3.000' : '2.000'} FCFA/pers.</b></> : null}</span><br />
                      {details.length > 0 && <div>Détail : {details.map((d, i) => <div key={i}>{d}</div>)}</div>}
                    </>
                  );
                }
                if (nights > 0) {
                  if (dortoirs > 0) details.push(`${dortoirs * nights * 3000} FCFA, pour ${dortoirs} pers. en dortoir x ${nights} nuit${nights > 1 ? 's' : ''} x 3.000 FCFA`);
                  if (chambres > 0) details.push(`${chambres * nights * 10000} FCFA, pour ${chambres} chambre${chambres > 1 ? 's' : ''} individuelle${chambres > 1 ? 's' : ''} x ${nights} nuit${nights > 1 ? 's' : ''} x 10.000 FCFA`);
                  if (form.meal_included && form.meal_plan && participants > 0) {
                    const fullDays = Math.max(nights - 1, 0);
                    const borderDaysCost = nights >= 1 ? 4000 : 0;
                    const dailyRate = form.meal_plan === '2' ? 3000 : 2000;
                    const planLabel = form.meal_plan === '2' ? '2 repas/j (3.000 FCFA)' : '1 repas/j (2.000 FCFA)';
                    const mealTotal = (fullDays * dailyRate + borderDaysCost) * participants;
                    details.push(`${mealTotal.toLocaleString()} FCFA, pour ${participants} pers. x (${fullDays}j. intermédiaires [${planLabel}] + 2j. bordure [1 repas/j = 2.000 FCFA/j = 4.000 FCFA total])`);
                  }
                }
                return (
                  <>
                    <span>Nombre de nuits : <b>{nights}</b> | Dortoir : <b>3.000 FCFA/nuit</b> | Chambre individuelle : <b>10.000 FCFA/nuit</b>{form.meal_included && form.meal_plan ? <> | Repas : <b>{form.meal_plan === '2' ? '3.000' : '2.000'} FCFA/jour/pers.</b></> : null}</span><br />
                    {details.length > 0 && <div>Détail : {details.map((d, i) => <div key={i}>{d}</div>)}</div>}
                  </>
                );
              })()}
            </div>
          </div>
          <div className="ai-reserve-form__row">
            <label>Montant de l'avance (FCFA, arrondi au 1 000 FCFA près) *</label>
            <input
              name="montant_avance"
              type="number"
              min="0"
              step="1000"
              value={form.montant_avance}
              onChange={handleChange}
              onBlur={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val && val % 1000 !== 0) {
                  const rounded = Math.ceil(val / 1000) * 1000;
                  setForm(prev => ({ ...prev, montant_avance: rounded }));
                }
              }}
              placeholder={form.montant_total ? `Ex: ${Math.ceil((form.montant_total * 0.2) / 1000) * 1000} FCFA (20% arrondi)` : ''}
              required
            />
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
                <ValidationSection reservationData={reservationData} />
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
    )}
  </>);
}