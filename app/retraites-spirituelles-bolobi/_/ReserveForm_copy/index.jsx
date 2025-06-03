import React, { useState } from 'react';
import axios from 'axios';
import '../../../../assets/scss/index_ai_reserveForm.scss';

const initialState = {
  names: '',
  phone_number: '',
  email: '',
  from: '',
  to: '',
  participants: 1,
  individual_room_participants: 0,
  message: '',
  type_reservation: 'retraite',
  meal_included: false,
  montant_total: '',
  montant_avance: '',
};

const typeOptions = [
  { value: 'retraite', label: 'Retraite' },
  { value: 'pray', label: 'Prière' },
  { value: 'individuel', label: 'Individuel' },
  { value: 'celebration', label: 'Célébration' },
  { value: 'repos', label: 'Repos' },
  { value: 'longTerm', label: 'Long séjour' },
];

export default function ReserveForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
        setForm(initialState);
      } else {
        setError(res.data?.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-reserve-form__container">
      <h2 className="ai-reserve-form__title">Réserver une retraite spirituelle</h2>
      <form className="ai-reserve-form" onSubmit={handleSubmit}>
        <div className="ai-reserve-form__row">
          <label>Nom complet *</label>
          <input name="names" value={form.names} onChange={handleChange} required placeholder="Votre nom" />
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
            <label>Date d'arrivée *</label>
            <input name="from" type="date" value={form.from} onChange={handleChange} required />
          </div>
          <div>
            <label>Date de départ *</label>
            <input name="to" type="date" value={form.to} onChange={handleChange} required />
          </div>
        </div>
        <div className="ai-reserve-form__row">
          <label>Nombre de participants *</label>
          <input name="participants" type="number" min="1" value={form.participants} onChange={handleChange} required />
        </div>
        <div className="ai-reserve-form__row">
          <label>Chambres individuelles</label>
          <input name="individual_room_participants" type="number" min="0" value={form.individual_room_participants} onChange={handleChange} />
        </div>
        <div className="ai-reserve-form__row">
          <label>Type de réservation *</label>
          <select name="type_reservation" value={form.type_reservation} onChange={handleChange} required>
            {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="ai-reserve-form__row ai-reserve-form__row--checkbox">
          <label>
            <input name="meal_included" type="checkbox" checked={form.meal_included} onChange={handleChange} />
            Repas inclus
          </label>
        </div>
        <div className="ai-reserve-form__row">
          <label>Montant total (€) *</label>
          <input name="montant_total" type="number" min="0" value={form.montant_total} onChange={handleChange} required />
        </div>
        <div className="ai-reserve-form__row">
          <label>Montant de l'avance (€) *</label>
          <input name="montant_avance" type="number" min="0" value={form.montant_avance} onChange={handleChange} required />
        </div>
        <div className="ai-reserve-form__row">
          <label>Message</label>
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Votre message (optionnel)" />
        </div>
        {error && <div className="ai-reserve-form__error">{error}</div>}
        {success && <div className="ai-reserve-form__success">{success}</div>}
        <button className="ai-reserve-form__submit" type="submit" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer la réservation'}</button>
      </form>
    </div>
  );
}