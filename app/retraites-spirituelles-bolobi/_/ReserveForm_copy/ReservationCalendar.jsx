import React, { useState, useEffect, useMemo } from 'react';

export default function ReservationCalendar({ selectedFrom, selectedTo, onSelectDates, typeReservation, reservations: propReservations }) {
  const [isOpen, setIsOpen] = useState(true); // État pliable (foldable)
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [activeDayDetails, setActiveDayDetails] = useState(null);

  // Synchroniser avec propReservations si fourni par le parent
  useEffect(() => {
    if (propReservations && Array.isArray(propReservations)) {
      setReservations(propReservations);
      setLoading(false);
    }
  }, [propReservations]);

  // Charger les réservations depuis l'API si non fournies
  useEffect(() => {
    if (propReservations && Array.isArray(propReservations)) return;
    let isMounted = true;
    async function fetchReservations() {
      try {
        setLoading(true);
        const res = await fetch('/api/reservation');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setReservations(Array.isArray(data) ? data : []);
          }
        }
      } catch (err) {
        console.error('Erreur chargement réservations calendrier:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchReservations();
    return () => { isMounted = false; };
  }, [propReservations]);

  // Helper pour formate la date au format YYYY-MM-DD
  const toYMD = (d) => {
    if (!d) return null;
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return null;
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Mapper l'occupation par jour (groupCount, totalRetreatants, list)
  const occupationMap = useMemo(() => {
    const map = {};
    if (!reservations || !Array.isArray(reservations)) return map;

    reservations.forEach((res) => {
      if (res.isArchived) return; // Ignorer les archives si spécifié
      if (!res.from) return;

      const startDate = new Date(res.from);
      const endDate = res.to ? new Date(res.to) : new Date(res.from);

      // Normaliser le début et la fin à minuit
      let cur = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const last = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

      while (cur <= last) {
        const ymd = toYMD(cur);
        if (ymd) {
          if (!map[ymd]) {
            map[ymd] = { groupCount: 0, retreatants: 0, list: [] };
          }
          map[ymd].groupCount += 1;
          map[ymd].retreatants += (parseInt(res.participants, 10) || 1);
          map[ymd].list.push(res);
        }
        cur.setDate(cur.getDate() + 1);
      }
    });

    return map;
  }, [reservations]);

  // Navigation du calendrier
  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const goToday = () => {
    setCurrentDate(new Date());
  };

  // Construction de la grille du mois
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Premier jour du mois (0 = Dimanche, 1 = Lundi ...)
  const firstDayOfMonth = new Date(year, month, 1);
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysGrid = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(new Date(year, month, d));
  }

  const todayYMD = toYMD(new Date());

  // Clic sur un jour du calendrier
  const handleDayClick = (dayDate) => {
    if (!dayDate) return;
    const ymd = toYMD(dayDate);
    const dayData = occupationMap[ymd];

    setActiveDayDetails({
      ymd,
      dateStr: dayDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      info: dayData || { groupCount: 0, retreatants: 0, list: [] }
    });

    // Alimenter le formulaire si le callback existe
    if (onSelectDates) {
      if (typeReservation === 'pray' || typeReservation === 'celebration') {
        onSelectDates(ymd, '');
      } else {
        if (!selectedFrom || (selectedFrom && selectedTo)) {
          onSelectDates(ymd, '');
        } else if (selectedFrom && !selectedTo) {
          if (ymd >= selectedFrom) {
            onSelectDates(selectedFrom, ymd);
          } else {
            onSelectDates(ymd, '');
          }
        }
      }
    }
  };

  return (
    <div className={`ai-reservation-calendar ${isOpen ? 'ai-reservation-calendar--open' : 'ai-reservation-calendar--collapsed'}`}>
      {/* Banner / Header cliquable pour replier / déplier */}
      <div 
        className="ai-reservation-calendar__toggle-bar" 
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Replier le calendrier" : "Déplier le calendrier"}
      >
        <div className="toggle-bar__title">
          <span>📅</span> <strong>Calendrier de Disponibilité & Occupation</strong>
        </div>
        <button type="button" className="toggle-bar__btn">
          {isOpen ? '▲ Masquer' : '▼ Voir les disponibilités'}
        </button>
      </div>

      {/* Contenu dépliable */}
      {isOpen && (
        <div className="ai-reservation-calendar__body">
          <div className="ai-reservation-calendar__header">
            <div className="ai-reservation-calendar__month-info">
              {monthNames[month]} {year}
            </div>
            <div className="ai-reservation-calendar__controls">
              <button type="button" onClick={prevMonth} className="ai-reservation-calendar__btn">&lt;</button>
              <button type="button" onClick={nextMonth} className="ai-reservation-calendar__btn">&gt;</button>
              <button type="button" onClick={goToday} className="ai-reservation-calendar__btn-today">Aujourd'hui</button>
            </div>
          </div>

          {/* Légende d'occupation */}
          <div className="ai-reservation-calendar__legend">
            <span className="legend-item legend-item--free">
              <span className="dot dot--free"></span> Libres
            </span>
            <span className="legend-item legend-item--low">
              <span className="dot dot--low"></span> 1 groupe (Occupation faible)
            </span>
            <span className="legend-item legend-item--medium">
              <span className="dot dot--medium"></span> 2 groupes (Moyenne)
            </span>
            <span className="legend-item legend-item--high">
              <span className="dot dot--high"></span> 3+ groupes (Élevée)
            </span>
          </div>

          {loading && <div className="ai-reservation-calendar__loading">Chargement du calendrier...</div>}

          {!loading && (
            <div className="ai-reservation-calendar__grid">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(dayName => (
                <div key={dayName} className="ai-reservation-calendar__day-header">
                  {dayName}
                </div>
              ))}

              {daysGrid.map((dayDate, idx) => {
                if (!dayDate) {
                  return <div key={`empty-${idx}`} className="ai-reservation-calendar__cell ai-reservation-calendar__cell--empty"></div>;
                }

                const ymd = toYMD(dayDate);
                const occ = occupationMap[ymd];
                const groupCount = occ ? occ.groupCount : 0;
                const retreatants = occ ? occ.retreatants : 0;
                const isToday = ymd === todayYMD;

                const isSelectedFrom = selectedFrom === ymd;
                const isSelectedTo = selectedTo === ymd;
                const isInSelectedRange = selectedFrom && selectedTo && ymd > selectedFrom && ymd < selectedTo;

                let levelClass = 'cell--free';
                if (groupCount === 1) levelClass = 'cell--low';
                else if (groupCount === 2) levelClass = 'cell--medium';
                else if (groupCount >= 3) levelClass = 'cell--high';

                return (
                  <div
                    key={ymd}
                    onClick={() => handleDayClick(dayDate)}
                    className={`ai-reservation-calendar__cell ${levelClass} ${isToday ? 'cell--today' : ''} ${isSelectedFrom ? 'cell--selected-from' : ''} ${isSelectedTo ? 'cell--selected-to' : ''} ${isInSelectedRange ? 'cell--in-range' : ''}`}
                    title={groupCount > 0 ? `${groupCount} groupe(s) - ${retreatants} retraitant(s) estimé(s)` : 'Aucune réservation'}
                  >
                    <div className="cell__day-num">{dayDate.getDate()}</div>
                    
                    {groupCount > 0 ? (
                      <div className="cell__occupation-badge">
                        <span className="badge-groups">{groupCount} grp{groupCount > 1 ? 's' : ''}</span>
                        <span className="badge-people">👤 {retreatants}</span>
                      </div>
                    ) : (
                      <div className="cell__free-label">Libre</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Détails du jour sélectionné */}
          {activeDayDetails && (
            <div className="ai-reservation-calendar__details-panel">
              <div className="details-panel__header">
                <strong>📆 {activeDayDetails.dateStr}</strong>
                <button type="button" onClick={() => setActiveDayDetails(null)} className="details-panel__close">✕</button>
              </div>
              {activeDayDetails.info.groupCount === 0 ? (
                <p className="details-panel__status details-panel__status--free">
                  ✅ Aucune réservation enregistrée à cette date. Le sanctuaire est libre.
                </p>
              ) : (
                <div className="details-panel__status">
                  <p>
                    ⚠️ <strong>{activeDayDetails.info.groupCount} groupe(s) en séjour simultané</strong> ({activeDayDetails.info.retreatants} retraitant(s) estimé(s)) :
                  </p>
                  <ul className="details-panel__list">
                    {activeDayDetails.info.list.map((res, i) => (
                      <li key={i}>
                        <strong>{res.community && res.community !== '##NA##' && res.community !== '##NOT_APPLICABLE##' ? res.community : res.names}</strong> — {res.participants || 1} personne(s) 
                        <span className="details-panel__type"> ({res.type_reservation || 'retraite'})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
