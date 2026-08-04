import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';

export default function AdminReservationToolbarModal({ reservations = [], onRefresh }) {
  // Détection de l'utilisateur connecté via Clerk ou localStorage
  const { isSignedIn, user } = useUser();
  const [isClientConnected, setIsClientConnected] = useState(false);

  useEffect(() => {
    // Vérification de la connexion (Clerk ou localStorage)
    const localUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (isSignedIn || user || localUser) {
      setIsClientConnected(true);
    }
  }, [isSignedIn, user]);

  // États pour la barre sticky & la modale
  const [showArchived, setShowArchived] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoPercent, setPromoPercent] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: '' });

  // États de filtrage pour le select sticky (année, participants, communauté, tel, email)
  const [filterYear, setFilterYear] = useState('ALL');
  const [filterMinParticipants, setFilterMinParticipants] = useState('');
  const [filterCommunity, setFilterCommunity] = useState('ALL');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterEmail, setFilterEmail] = useState('');

  // Formulaire d'édition de la réservation courante
  const [editForm, setEditForm] = useState(null);

  // Réservation sélectionnée
  const currentReservation = reservations.find(r => r._id === selectedId);

  // Extraire les années disponibles dans le jeu de données
  const availableYears = useMemo(() => {
    const yearsSet = new Set();
    reservations.forEach(r => {
      if (r.from) {
        const y = new Date(r.from).getFullYear();
        if (!isNaN(y)) yearsSet.add(y);
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [reservations]);

  // Extraire la liste unique des communautés ayant déjà effectué des réservations au sanctuaire
  const availableCommunities = useMemo(() => {
    const communitiesSet = new Set();
    reservations.forEach(r => {
      const comm = (r.community || '').trim();
      if (comm && comm !== '##NOT_APPLICABLE##' && comm !== '##NA##' && comm !== 'N/A') {
        communitiesSet.add(comm);
      }
    });
    return Array.from(communitiesSet).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [reservations]);

  // Réinitialiser le formulaire d'édition au changement de réservation sélectionnée
  useEffect(() => {
    if (currentReservation) {
      setEditForm({
        names: currentReservation.names || '',
        community: currentReservation.community || '',
        phone_number: currentReservation.phone_number || '',
        email: currentReservation.email || '',
        from: currentReservation.from ? currentReservation.from.substring(0, 10) : '',
        to: currentReservation.to ? currentReservation.to.substring(0, 10) : '',
        type_reservation: currentReservation.type_reservation || 'retraite',
        participants: currentReservation.participants || 1,
        individual_room_participants: currentReservation.individual_room_participants || 0,
        meal_included: !!currentReservation.meal_included,
        meal_plan: currentReservation.meal_plan || '',
        montant_total: currentReservation.montant_total || 0,
        montant_avance: currentReservation.montant_avance || 0,
        message: currentReservation.message || '',
      });
      setIsEditMode(false);
      setShowPromoInput(false);
      setFeedbackMsg({ text: '', type: '' });
    }
  }, [selectedId, currentReservation]);

  // Si l'utilisateur n'est pas connecté, ne pas afficher l'interface admin
  if (!isClientConnected) {
    return null;
  }

  // Filtrer dynamiquement les réservations selon tous les critères
  const filteredReservations = reservations.filter(r => {
    // 1. Filtre Archivées / Non archivées
    const archiveMatch = showArchived ? !!r.isArchived : !r.isArchived;
    if (!archiveMatch) return false;

    // 2. Filtre par Année
    if (filterYear !== 'ALL') {
      const y = r.from ? new Date(r.from).getFullYear() : null;
      if (y !== parseInt(filterYear, 10)) return false;
    }

    // 3. Filtre par Nombre de participants (minimum)
    if (filterMinParticipants !== '') {
      const minP = parseInt(filterMinParticipants, 10);
      if (!isNaN(minP) && (r.participants || 0) < minP) return false;
    }

    // 4. Filtre par Communauté (Sélection parmi les communautés existantes)
    if (filterCommunity !== 'ALL') {
      const comm = (r.community || '').trim();
      if (comm !== filterCommunity) return false;
    }

    // 5. Filtre par N° de téléphone
    if (filterPhone.trim() !== '') {
      const query = filterPhone.trim();
      const phone = (r.phone_number || '');
      if (!phone.includes(query)) return false;
    }

    // 6. Filtre par Email
    if (filterEmail.trim() !== '') {
      const query = filterEmail.toLowerCase().trim();
      const mail = (r.email || '').toLowerCase();
      if (!mail.includes(query)) return false;
    }

    return true;
  });

  // Revenir à l'option par défaut
  const handleResetSelect = () => {
    setSelectedId('');
    setIsEditMode(false);
    setShowPromoInput(false);
    setFeedbackMsg({ text: '', type: '' });
  };

  // Réinitialiser tous les filtres de recherche
  const handleResetFilters = () => {
    setFilterYear('ALL');
    setFilterMinParticipants('');
    setFilterCommunity('ALL');
    setFilterPhone('');
    setFilterEmail('');
  };

  const hasActiveFilters = filterYear !== 'ALL' || filterMinParticipants !== '' || filterCommunity !== 'ALL' || filterPhone !== '' || filterEmail !== '';

  // Helper pour afficher les dates lisibles
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('fr-FR');
  };

  // --- ACTIONS CRUD & ADMIN --- //

  const handleToggleValidation = async () => {
    if (!currentReservation) return;
    setLoadingAction(true);
    try {
      const newStatus = !currentReservation.isValidated;
      const res = await fetch(`/api/reservation?id=${currentReservation._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentReservation, isValidated: newStatus }),
      });
      if (res.ok) {
        setFeedbackMsg({ text: `Réservation ${newStatus ? 'validée' : 'invalidée'} avec succès.`, type: 'success' });
        if (onRefresh) onRefresh();
      } else {
        setFeedbackMsg({ text: 'Erreur lors du changement de statut de validation.', type: 'error' });
      }
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleTogglePayment = async () => {
    if (!currentReservation) return;
    setLoadingAction(true);
    try {
      const newPaymentStatus = !currentReservation.avance_payee;
      const res = await fetch(`/api/reservation?id=${currentReservation._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentReservation, avance_payee: newPaymentStatus, isValidated: newPaymentStatus ? true : currentReservation.isValidated }),
      });
      if (res.ok) {
        setFeedbackMsg({ text: `Statut paiement d'avance mis à jour : ${newPaymentStatus ? 'PAYÉ' : 'NON PAYÉ'}.`, type: 'success' });
        if (onRefresh) onRefresh();
      } else {
        setFeedbackMsg({ text: 'Erreur lors de la mise à jour du statut de paiement.', type: 'error' });
      }
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleToggleArchive = async () => {
    if (!currentReservation) return;
    setLoadingAction(true);
    try {
      const newArchiveStatus = !currentReservation.isArchived;
      const res = await fetch(`/api/reservation?id=${currentReservation._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentReservation, isArchived: newArchiveStatus }),
      });
      if (res.ok) {
        setFeedbackMsg({ text: `Réservation ${newArchiveStatus ? 'archivée' : 'désarchivée'} avec succès.`, type: 'success' });
        if (onRefresh) onRefresh();
      } else {
        setFeedbackMsg({ text: 'Erreur lors de l\'archivage.', type: 'error' });
      }
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleApplyPromotion = async () => {
    if (!currentReservation || !promoPercent) return;
    const percent = parseFloat(promoPercent);
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      setFeedbackMsg({ text: 'Pourcentage invalide (ex: 10, 20).', type: 'error' });
      return;
    }
    setLoadingAction(true);
    try {
      const newTotal = Math.round((currentReservation.montant_total || 0) * (1 - percent / 100));
      const newAdvance = Math.round((currentReservation.montant_avance || 0) * (1 - percent / 100));
      const res = await fetch(`/api/reservation?id=${currentReservation._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentReservation,
          montant_total: newTotal,
          montant_avance: newAdvance,
        }),
      });
      if (res.ok) {
        setFeedbackMsg({ text: `Promotion de ${percent}% appliquée avec succès !`, type: 'success' });
        setShowPromoInput(false);
        setPromoPercent('');
        if (onRefresh) onRefresh();
      } else {
        setFeedbackMsg({ text: 'Erreur lors de l\'application de la promotion.', type: 'error' });
      }
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteReservation = async () => {
    if (!currentReservation) return;
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement la réservation de ${currentReservation.names || currentReservation.community} ?`)) {
      return;
    }
    setLoadingAction(true);
    try {
      const res = await fetch(`/api/reservation?id=${currentReservation._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        handleResetSelect();
        if (onRefresh) onRefresh();
      } else {
        setFeedbackMsg({ text: 'Erreur lors de la suppression de la réservation.', type: 'error' });
      }
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSaveEditForm = async (e) => {
    e.preventDefault();
    if (!currentReservation || !editForm) return;
    setLoadingAction(true);
    try {
      const updatedData = {
        ...currentReservation,
        ...editForm,
        from: editForm.from ? new Date(editForm.from) : currentReservation.from,
        to: editForm.to ? new Date(editForm.to) : currentReservation.to,
        participants: parseInt(editForm.participants, 10) || 1,
        individual_room_participants: parseInt(editForm.individual_room_participants, 10) || 0,
        montant_total: parseFloat(editForm.montant_total) || 0,
        montant_avance: parseFloat(editForm.montant_avance) || 0,
      };

      const res = await fetch(`/api/reservation?id=${currentReservation._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        setFeedbackMsg({ text: 'Réservation modifiée et enregistrée avec succès !', type: 'success' });
        setIsEditMode(false);
        if (onRefresh) onRefresh();
      } else {
        setFeedbackMsg({ text: 'Erreur lors de l\'enregistrement des modifications.', type: 'error' });
      }
    } catch (err) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="admin-reservation-toolbar-container">
      {/* BARRE STICKY DE SÉLECTION ADMIN */}
      <div className="admin-sticky-bar">
        <div className="admin-sticky-bar__header">
          <div className="admin-sticky-bar__title">
            👑 <strong>Administration des Réservations</strong>
          </div>
          <label className="admin-sticky-bar__checkbox-label">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => {
                setShowArchived(e.target.checked);
                setSelectedId('');
              }}
            />
            Afficher les archivées ({filteredReservations.length})
          </label>
        </div>

        {/* Ligne de filtres : Année, Participants, Communauté (Select), Tel, Email */}
        <div className="admin-sticky-bar__filters-row">
          <div className="filter-group">
            <span className="filter-label">📅 Année</span>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="admin-filter-input"
            >
              <option value="ALL">Toutes les années</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">👥 Min pers.</span>
            <input
              type="number"
              min="0"
              placeholder="Ex: 5"
              value={filterMinParticipants}
              onChange={(e) => setFilterMinParticipants(e.target.value)}
              className="admin-filter-input filter-input--short"
            />
          </div>

          <div className="filter-group filter-group--wide">
            <span className="filter-label">🏛️ Communauté</span>
            <select
              value={filterCommunity}
              onChange={(e) => setFilterCommunity(e.target.value)}
              className="admin-filter-input"
            >
              <option value="ALL">Toutes les communautés ({availableCommunities.length})</option>
              {availableCommunities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">📞 Tél.</span>
            <input
              type="text"
              placeholder="N° téléphone"
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
              className="admin-filter-input"
            />
          </div>

          <div className="filter-group">
            <span className="filter-label">✉️ Email</span>
            <input
              type="text"
              placeholder="Email client"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
              className="admin-filter-input"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="admin-filter-reset-btn"
              onClick={handleResetFilters}
              title="Effacer tous les filtres de recherche"
            >
              🧹 Effacer filtres
            </button>
          )}
        </div>

        {/* Sélecteur principal de réservation */}
        <div className="admin-sticky-bar__select-row">
          <select
            className="admin-sticky-bar__select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">
              -- {filteredReservations.length > 0 ? `Sélectionner une réservation (${filteredReservations.length} disponible${filteredReservations.length > 1 ? 's' : ''})...` : 'Aucune réservation ne correspond aux filtres'} --
            </option>
            {filteredReservations.map((r) => {
              const datesText = `${formatDate(r.from)} → ${formatDate(r.to)}`;
              const clientName = r.community && r.community !== '##NA##' ? `${r.community} (${r.names})` : r.names || 'Inconnu';
              const statusText = r.isValidated ? '✅ Validée' : '⏳ Attente';
              const paymentText = r.avance_payee ? '💳 Payée' : '❌ Non payée';

              return (
                <option key={r._id} value={r._id}>
                  [{datesText}] - {clientName} ({r.phone_number}) - {r.participants || 1} pers. - {r.montant_total || 0} F CFA - {statusText} - {paymentText}
                </option>
              );
            })}
          </select>

          {selectedId && (
            <button
              type="button"
              className="admin-sticky-bar__reset-btn"
              onClick={handleResetSelect}
              title="Revenir à l'option par défaut"
            >
              🔄 Option par défaut (Reset)
            </button>
          )}
        </div>
      </div>

      {/* MODALE DE GESTION FIXED APPARAISSANT LORSQU'UNE OPTION EST SÉLECTIONNÉE */}
      {selectedId && currentReservation && (
        <div className="admin-modal-overlay">
          <div className="admin-reservation-modal">
            {/* Header de la Modale */}
            <div className="admin-modal__header">
              <div className="admin-modal__title">
                <h3>🛠️ Gestion de Réservation #{currentReservation._id.substring(currentReservation._id.length - 6)}</h3>
                <div className="admin-modal__badges">
                  <span className={`badge ${currentReservation.isValidated ? 'badge--success' : 'badge--warning'}`}>
                    {currentReservation.isValidated ? '✅ Validée' : '⏳ Non validée'}
                  </span>
                  <span className={`badge ${currentReservation.avance_payee ? 'badge--primary' : 'badge--danger'}`}>
                    {currentReservation.avance_payee ? '💳 Avance Payée' : '💵 Avance Non Payée'}
                  </span>
                  {currentReservation.isArchived && (
                    <span className="badge badge--dark">📦 Archivée</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="admin-modal__close-btn"
                onClick={handleResetSelect}
                title="Fermer la modale et réinitialiser la sélection"
              >
                ✕ Fermer (Option par défaut)
              </button>
            </div>

            {/* Message de feedback */}
            {feedbackMsg.text && (
              <div className={`admin-modal__feedback admin-modal__feedback--${feedbackMsg.type}`}>
                {feedbackMsg.text}
              </div>
            )}

            {/* Barre d'Actions Rapides CRUD */}
            <div className="admin-modal__actions-bar">
              <button
                type="button"
                className={`action-btn ${currentReservation.isValidated ? 'action-btn--orange' : 'action-btn--green'}`}
                onClick={handleToggleValidation}
                disabled={loadingAction}
              >
                {currentReservation.isValidated ? '🛑 Invalider' : '✅ Valider'}
              </button>

              <button
                type="button"
                className={`action-btn ${currentReservation.avance_payee ? 'action-btn--orange' : 'action-btn--blue'}`}
                onClick={handleTogglePayment}
                disabled={loadingAction}
              >
                {currentReservation.avance_payee ? '❌ Annuler Avance' : '💳 Marquer Avance Payée'}
              </button>

              <button
                type="button"
                className="action-btn action-btn--gray"
                onClick={handleToggleArchive}
                disabled={loadingAction}
              >
                {currentReservation.isArchived ? '📂 Désarchiver' : '📦 Archiver'}
              </button>

              <button
                type="button"
                className="action-btn action-btn--purple"
                onClick={() => setShowPromoInput(!showPromoInput)}
                disabled={loadingAction}
              >
                🏷️ Promo / Réduction %
              </button>

              <button
                type="button"
                className={`action-btn ${isEditMode ? 'action-btn--dark' : 'action-btn--teal'}`}
                onClick={() => setIsEditMode(!isEditMode)}
                disabled={loadingAction}
              >
                {isEditMode ? '👁️ Mode Lecture' : '✏️ Éditer / Modifier'}
              </button>

              <button
                type="button"
                className="action-btn action-btn--red"
                onClick={handleDeleteReservation}
                disabled={loadingAction}
              >
                🗑️ Supprimer
              </button>
            </div>

            {/* Input Promo Inline */}
            {showPromoInput && (
              <div className="admin-modal__promo-box">
                <label>Appliquer un pourcentage de réduction (%) : </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Ex: 20 pour 20%"
                  value={promoPercent}
                  onChange={(e) => setPromoPercent(e.target.value)}
                />
                <button type="button" onClick={handleApplyPromotion} disabled={loadingAction}>
                  Appliquer la réduction
                </button>
              </div>
            )}

            {/* Corps de la modale: Mode Édition ou Mode Affichage */}
            <div className="admin-modal__body">
              {isEditMode && editForm ? (
                <form className="admin-modal__edit-form" onSubmit={handleSaveEditForm}>
                  <h4>✏️ Formulaire de modification complète (CRUD Update)</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nom complet *</label>
                      <input name="names" value={editForm.names} onChange={handleEditChange} required />
                    </div>
                    <div className="form-group">
                      <label>Communauté</label>
                      <input name="community" value={editForm.community} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label>Téléphone *</label>
                      <input name="phone_number" value={editForm.phone_number} onChange={handleEditChange} required />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input name="email" type="email" value={editForm.email} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label>Type de réservation</label>
                      <select name="type_reservation" value={editForm.type_reservation} onChange={handleEditChange}>
                        <option value="retraite">Retraite de groupe</option>
                        <option value="pray">Prière ponctuelle</option>
                        <option value="individuel">Retraite individuelle</option>
                        <option value="celebration">Célébration</option>
                        <option value="repos">Séjour Repos-Détente</option>
                        <option value="longTerm">Vacances / Long séjour</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date d'arrivée *</label>
                      <input name="from" type="date" value={editForm.from} onChange={handleEditChange} required />
                    </div>
                    <div className="form-group">
                      <label>Date de départ</label>
                      <input name="to" type="date" value={editForm.to} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label>Nombre de participants</label>
                      <input name="participants" type="number" min="1" value={editForm.participants} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label>Chambres individuelles</label>
                      <input name="individual_room_participants" type="number" min="0" value={editForm.individual_room_participants} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label>Montant total (FCFA)</label>
                      <input name="montant_total" type="number" value={editForm.montant_total} onChange={handleEditChange} />
                    </div>
                    <div className="form-group">
                      <label>Montant de l'avance (FCFA)</label>
                      <input name="montant_avance" type="number" value={editForm.montant_avance} onChange={handleEditChange} />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>
                      <input name="meal_included" type="checkbox" checked={editForm.meal_included} onChange={handleEditChange} />
                      Repas inclus
                    </label>
                  </div>

                  {editForm.meal_included && (
                    <div className="form-group full-width">
                      <label>Plan de repas</label>
                      <select name="meal_plan" value={editForm.meal_plan} onChange={handleEditChange}>
                        <option value="1">1 repas + 1 petit déjeuner (2.000 FCFA/jour/pers.)</option>
                        <option value="2">2 repas + 1 petit déjeuner (3.000 FCFA/jour/pers.)</option>
                      </select>
                    </div>
                  )}

                  <div className="form-group full-width">
                    <label>Message / Note</label>
                    <textarea name="message" value={editForm.message} onChange={handleEditChange} />
                  </div>

                  <div className="edit-form-actions">
                    <button type="submit" className="save-btn" disabled={loadingAction}>
                      💾 Enregistrer les modifications
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => setIsEditMode(false)}>
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="admin-modal__details-grid">
                  <div className="details-card">
                    <h5>👤 Client & Communauté</h5>
                    <p><strong>Nom complet :</strong> {currentReservation.names || 'N/A'}</p>
                    <p><strong>Communauté :</strong> {currentReservation.community && currentReservation.community !== '##NA##' ? currentReservation.community : 'Non spécifiée'}</p>
                    <p><strong>Téléphone :</strong> {currentReservation.phone_number || 'N/A'}</p>
                    <p><strong>Email :</strong> {currentReservation.email || 'Non fourni'}</p>
                    <p><strong>Message :</strong> {currentReservation.message || 'Aucun message'}</p>
                  </div>

                  <div className="details-card">
                    <h5>📆 Séjour & Hébergement</h5>
                    <p><strong>Type :</strong> {currentReservation.type_reservation || 'retraite'}</p>
                    <p><strong>Date arrivée :</strong> {formatDate(currentReservation.from)}</p>
                    <p><strong>Date départ :</strong> {formatDate(currentReservation.to)}</p>
                    <p><strong>Participants :</strong> {currentReservation.participants || 1} personne(s)</p>
                    <p><strong>Chambres indiv. :</strong> {currentReservation.individual_room_participants || 0}</p>
                  </div>

                  <div className="details-card">
                    <h5>🍽️ Repas & Option</h5>
                    <p><strong>Repas inclus :</strong> {currentReservation.meal_included ? 'Oui' : 'Non'}</p>
                    {currentReservation.meal_included && (
                      <p><strong>Plan :</strong> {currentReservation.meal_plan === '2' || currentReservation.meal_plan === 2 ? '2 repas + 1 déj.' : '1 repas + 1 déj.'}</p>
                    )}
                  </div>

                  <div className="details-card">
                    <h5>💰 Détails Financiers</h5>
                    <p><strong>Montant Total :</strong> <span className="price">{currentReservation.montant_total || 0} F CFA</span></p>
                    <p><strong>Avance Demandée :</strong> <span className="price price--advance">{currentReservation.montant_avance || 0} F CFA</span></p>
                    <p><strong>Statut Avance :</strong> {currentReservation.avance_payee ? '✅ Réglée' : '❌ En attente'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
