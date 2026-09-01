# SPEC_04 — Admin Sanctuaire : CA Estimé vs Calculé & Métriques Financières

## Contexte
La page d'administration du sanctuaire (`/admin/sanctuaire`) affiche actuellement un tableau de réservations avec filtres. Il manque un **panneau de métriques financières** montrant :
- Le **CA Estimé** : somme des `montant_total` de TOUTES les réservations (validées ou non)
- Le **CA Calculé** : somme des `montant_total` des réservations VALIDÉES uniquement
- Les réservations en attente de validation avec un call-to-action

---

## Fichier principal impacté
- `app/admin/sanctuaire/page.jsx`

---

## 1. Calcul des Métriques

### Données déjà disponibles
Le state `reservations` (ligne 11) contient déjà toutes les réservations chargées depuis `/api/reservation`. Chaque réservation possède :
- `montant_total` (number)
- `montant_avance` (number)
- `isValidated` (boolean)
- `avance_payee` (boolean)
- `isArchived` (boolean)

### Métriques à calculer (useMemo)
```jsx
const metrics = useMemo(() => {
  const active = reservations.filter(r => !r.isArchived);
  const validated = active.filter(r => r.isValidated);
  const pending = active.filter(r => !r.isValidated);
  const paid = active.filter(r => r.avance_payee);
  
  return {
    // CA Estimé : toutes réservations actives (validées ou non)
    caEstime: active.reduce((sum, r) => sum + (r.montant_total || 0), 0),
    
    // CA Calculé : uniquement les validées
    caCalcule: validated.reduce((sum, r) => sum + (r.montant_total || 0), 0),
    
    // Avances encaissées
    totalAvancesPayees: paid.reduce((sum, r) => sum + (r.montant_avance || 0), 0),
    
    // Avances en attente
    totalAvancesEnAttente: active.filter(r => !r.avance_payee)
      .reduce((sum, r) => sum + (r.montant_avance || 0), 0),
    
    // Compteurs
    totalActive: active.length,
    totalValidated: validated.length,
    totalPending: pending.length,
    totalPaid: paid.length,
    
    // Solde restant à percevoir (montant_total - montant_avance pour les validées)
    soldeRestant: validated.reduce((sum, r) => 
      sum + ((r.montant_total || 0) - (r.montant_avance || 0)), 0
    ),
    
    // Liste des réservations en attente (pour le call-to-action)
    pendingList: pending,
  };
}, [reservations]);
```

---

## 2. Composant UI : Panneau de Métriques

### Position dans le DOM
Insérer **avant** le composant `<Table>` (ligne 422), après le bloc header (ligne 420).

### Structure
```
┌──────────────────────────────────────────────────────────────┐
│  💰 TABLEAU DE BORD FINANCIER                                │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  CA Estimé   │  CA Calculé  │  Avances     │  Solde         │
│  (tout)      │  (validées)  │  encaissées  │  restant       │
│  1 250 000 F │  980 000 F   │  294 000 F   │  686 000 F     │
│  25 résa.    │  20 résa.    │  18 payées   │  à percevoir   │
├──────────────┴──────────────┴──────────────┴────────────────┤
│  ⚠️ 5 réservations en attente de validation                  │
│  [Voir et valider →]                                        │
└──────────────────────────────────────────────────────────────┘
```

### Implémentation JSX
```jsx
<div className="sanctuaire-admin__metrics">
  <h2 className="sanctuaire-admin__metrics-title">💰 Tableau de Bord Financier</h2>
  
  <div className="sanctuaire-admin__metrics-grid">
    <div className="metric-card metric-card--estimate">
      <span className="metric-card__label">CA Estimé</span>
      <span className="metric-card__value">
        {metrics.caEstime.toLocaleString('fr-FR')} F
      </span>
      <span className="metric-card__sub">
        {metrics.totalActive} réservation(s) active(s)
      </span>
    </div>
    
    <div className="metric-card metric-card--calculated">
      <span className="metric-card__label">CA Calculé</span>
      <span className="metric-card__value">
        {metrics.caCalcule.toLocaleString('fr-FR')} F
      </span>
      <span className="metric-card__sub">
        {metrics.totalValidated} réservation(s) validée(s)
      </span>
    </div>
    
    <div className="metric-card metric-card--paid">
      <span className="metric-card__label">Avances encaissées</span>
      <span className="metric-card__value">
        {metrics.totalAvancesPayees.toLocaleString('fr-FR')} F
      </span>
      <span className="metric-card__sub">
        {metrics.totalPaid} paiement(s) reçu(s)
      </span>
    </div>
    
    <div className="metric-card metric-card--remaining">
      <span className="metric-card__label">Solde à percevoir</span>
      <span className="metric-card__value">
        {metrics.soldeRestant.toLocaleString('fr-FR')} F
      </span>
      <span className="metric-card__sub">sur les réservations validées</span>
    </div>
  </div>
  
  {metrics.totalPending > 0 && (
    <div className="sanctuaire-admin__metrics-alert">
      <span>⚠️ <strong>{metrics.totalPending}</strong> réservation(s) en attente de validation</span>
      <span className="metrics-alert__amount">
        Montant potentiel : {(metrics.caEstime - metrics.caCalcule).toLocaleString('fr-FR')} F
      </span>
    </div>
  )}
</div>
```

---

## 3. Styles SCSS

### Fichier impacté
- `assets/scss/admin.scss` (ajouter en fin de fichier)

```scss
.sanctuaire-admin__metrics {
  margin-bottom: 2rem;
  
  &-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #1a2332;
  }
  
  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  &-alert {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    padding: 12px 20px;
    font-size: 0.95rem;
  }
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border-left: 4px solid #ccc;
  
  &__label {
    display: block;
    font-size: 0.85rem;
    color: #888;
    margin-bottom: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  &__value {
    display: block;
    font-size: 1.6rem;
    font-weight: 700;
    color: #1a2332;
  }
  
  &__sub {
    display: block;
    font-size: 0.8rem;
    color: #aaa;
    margin-top: 0.3rem;
  }
  
  &--estimate { border-left-color: #6c757d; }
  &--calculated { border-left-color: #28a745; }
  &--paid { border-left-color: #17a2b8; }
  &--remaining { border-left-color: #ffc107; }
}
```

---

## Checklist de validation
- [ ] Le CA Estimé inclut TOUTES les réservations actives (non archivées)
- [ ] Le CA Calculé n'inclut que les réservations validées (`isValidated === true`)
- [ ] Les avances encaissées correspondent aux réservations avec `avance_payee === true`
- [ ] Le panneau d'alerte apparaît seulement si des réservations sont en attente
- [ ] Les montants sont formatés en format français avec séparateur de milliers
- [ ] Le panneau est responsive (grid adaptatif)
- [ ] Les données se mettent à jour en temps réel quand on valide/invalide une réservation
