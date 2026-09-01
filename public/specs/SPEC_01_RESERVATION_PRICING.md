# SPEC_01 — Réservation : Arrondi Avance, Formule Repas & Bouton Wave

## Contexte
La page de réservation (`/retraites-spirituelles-bolobi`) permet aux visiteurs de réserver un séjour au sanctuaire. Trois problèmes critiques ont été identifiés :
1. Le montant de l'avance n'est pas arrondi au 1 000 FCFA près
2. Le calcul des repas pour le jour d'arrivée et de départ crée un chevauchement potentiel
3. Aucun bouton de paiement Wave direct n'est affiché après validation

---

## 1. Arrondi de l'Avance au 1 000 FCFA

### Fichiers impactés
- `app/retraites-spirituelles-bolobi/_/ReserveForm_copy/index.jsx` (lignes 368-372)
- `app/retraites-spirituelles-bolobi/_/ReserveForm_copy/ValidationSection.jsx` (ligne 25)
- `pages/api/reservation_ai.js` (ligne 59)

### Règle métier
```
montant_avance_arrondi = Math.ceil(montant_avance / 1000) * 1000
```
- Le montant de l'avance DOIT toujours être arrondi **au supérieur** au 1 000 FCFA le plus proche.
- Ex: 14 500 FCFA → 15 000 FCFA ; 21 001 FCFA → 22 000 FCFA ; 10 000 FCFA → 10 000 FCFA (inchangé).

### Implémentation
1. **Frontend — `index.jsx`** : Appliquer l'arrondi dans le placeholder de suggestion d'avance (ligne 371) ET ajouter un `onBlur` handler sur l'input `montant_avance` :
   ```jsx
   const roundAdvance = (value) => Math.ceil(value / 1000) * 1000;
   
   // Dans le placeholder (ligne 371) :
   placeholder={form.montant_total ? `Ex: ${roundAdvance(Math.ceil(form.montant_total * 0.2))} FCFA (20% arrondi)` : ''}
   
   // Handler onBlur à ajouter :
   onBlur={(e) => {
     const val = parseInt(e.target.value, 10);
     if (val && val % 1000 !== 0) {
       setForm(prev => ({ ...prev, montant_avance: roundAdvance(val) }));
     }
   }}
   ```

2. **Backend — `reservation_ai.js`** : Appliquer aussi l'arrondi côté serveur avant stockage (double sécurité) :
   ```js
   // Avant modelReservation.create() :
   const montant_avance_safe = Math.ceil(parseInt(montant_avance, 10) / 1000) * 1000;
   ```

3. **ValidationSection.jsx** : Afficher le montant arrondi dans le récapitulatif.

---

## 2. Formule Repas — Lissage Jour d'Arrivée & Jour de Départ

### Problème actuel
Le calcul actuel (`index.jsx`, lignes 118-123) multiplie `nights × participants × planTarif` pour les repas. Or :
- **Jour d'arrivée** : Le client arrive souvent en milieu de journée → max 1 déjeuner + 1 dîner (pas de petit-déj).
- **Jour de départ** : Le client part le matin → uniquement 1 petit-déjeuner (pas de déjeuner ni dîner).
- **Chevauchement actuel** : En comptant `nights` jours de repas, on sous-facture (les repas sont sur `nights + 1` jours). Mais en comptant `nights + 1` avec un plan 2 repas/jour, on surfacture les demi-journées.

### Règle métier retenue
**Règle absolue des tarifs repas au sanctuaire :**
- Il n'existe **JAMAIS** de tarif repas à 500 FCFA ni à 1 000 FCFA.
- **1 repas par jour (+ petit-déjeuner inclus)** = **2 000 FCFA / jour / participant**.
- **2 repas par jour (+ petit-déjeuner inclus)** = **3 000 FCFA / jour / participant**.

**Pour un séjour de N nuits (ex: du vendredi au dimanche = 2 nuits, 3 jours calendaires) :**

1. **Jours de bordure (Arrivée & Départ)** :
   - Comptés comme **1 repas par jour de bordure** = **2 000 FCFA / jour / participant**.
   - Les 2 jours de bordure (arrivée + départ) coûtent ensemble **4 000 FCFA par participant** ($2000 + 2000$), quel que soit le plan choisi.

2. **Jours intermédiaires ($N - 1$ jours complets, ex: le samedi)** :
   - Seuls ces jours appliquent le tarif du plan choisi par l'utilisateur :
     - Plan 1 repas/j : **2 000 FCFA / jour / participant**
     - Plan 2 repas/j : **3 000 FCFA / jour / participant**

**Formule finale :**
```
jours_intermediaires = Math.max(nights - 1, 0)
cout_bordure = nights >= 1 ? 4000 : 0   // 2 000F jour d'arrivée + 2 000F jour de départ

cout_repas = (jours_intermediaires × tarif_plan + cout_bordure) × participants
```

### Implémentation
```jsx
if (form.meal_included && form.meal_plan && nights > 0 && participants > 0) {
  const fullDays = Math.max(nights - 1, 0); // Jours intermédiaires
  const borderDaysCost = nights >= 1 ? 4000 : 0; // 2 jours de bordure à 2 000 FCFA / jour / pers (4 000 FCFA total)
  const dailyRate = form.meal_plan === '2' ? 3000 : 2000;
  montant += (fullDays * dailyRate + borderDaysCost) * participants;
}
```

### Description affichée au client (bloc détail)
```
Repas : X jours intermédiaires × [plan] + 2 jours de bordure (1 repas/j = 2 000 FCFA/j = 4 000 FCFA total/pers)
```

---

## 3. Bouton de Paiement Wave Direct

### Contexte
Après validation du formulaire de réservation, le client voit un QR code statique (`/qrcode.png`). Il faut ajouter un **bouton cliquable** redirigeant vers le lien Wave avec le montant pré-rempli.

### Variable d'environnement
```
WAVE_LINK=https://pay.wave.com/m/M_ci_tk7yljaMIDFk/c/ci/?amount=
WAVE_QR_PIC=wave_qr.pdf
```
⚠️ Cette variable est **côté serveur uniquement**. Pour l'utiliser côté client, il faut :
- Soit la préfixer `NEXT_PUBLIC_WAVE_LINK`
- Soit la retourner depuis l'API `reservation_ai.js` dans la réponse

### Solution retenue : Retour API
Modifier `pages/api/reservation_ai.js` (ligne 76) pour inclure le lien Wave dans la réponse :
```js
const wavePaymentUrl = `${process.env.WAVE_LINK}${montant_avance_safe}`;
return res.status(201).json({ 
  success: true, 
  reservation,
  wavePaymentUrl 
});
```

### Fichier impacté
- `app/retraites-spirituelles-bolobi/_/ReserveForm_copy/ValidationSection.jsx`

### Implémentation UI
```jsx
// Après le QR code, ajouter :
<a 
  href={reservationData.wavePaymentUrl} 
  target="_blank" 
  rel="noopener noreferrer"
  className="wave-payment-btn"
>
  💳 Payer l'avance de {reservationData.montant_avance}F via Wave
</a>
```

### Style du bouton Wave
```scss
.wave-payment-btn {
  display: inline-block;
  background: linear-gradient(135deg, #1DC7EA, #0D9FD6);
  color: white;
  font-weight: 700;
  font-size: 1.1em;
  padding: 14px 32px;
  border-radius: 12px;
  text-decoration: none;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(13, 159, 214, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(13, 159, 214, 0.45);
  }
}
```

---

## Checklist de validation
- [ ] L'avance affichée au client est toujours un multiple de 1 000 FCFA
- [ ] L'avance stockée en BDD est arrondie (double vérification backend)
- [ ] Le calcul des repas ne surfacture pas les jours d'arrivée/départ
- [ ] Le détail affiché au client distingue clairement les repas de bordure
- [ ] Le bouton Wave est visible après soumission réussie du formulaire
- [ ] Le lien Wave contient le bon montant d'avance arrondi
- [ ] Le QR code s'affiche correctement (vérifier que `/public/qrcode.png` existe)
