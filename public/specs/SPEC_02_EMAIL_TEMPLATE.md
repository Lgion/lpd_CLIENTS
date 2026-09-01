# SPEC_02 — Template HTML5 Email de Confirmation de Réservation

## Contexte
L'email de confirmation actuel (`pages/api/reservation_ai.js`, fonction `sendConfirmationEmail_bis()`, lignes 143-257) est un simple HTML inline sans mise en page professionnelle. Les problèmes identifiés :
1. Le calcul des prix n'est pas assez détaillé (pas de nombre de nuits × tarif)
2. Aucun bouton de paiement Wave
3. Aucun numéro de téléphone de contact du staff
4. Présentation basique peu rassurante pour le client

---

## Objectif
Créer un template HTML5 email professionnel, responsive, compatible avec les principaux clients email (Gmail, Yahoo, Outlook, Apple Mail). Le template sera un fichier séparé importable.

---

## Architecture

### Nouveau fichier
```
pages/api/_utils/emailTemplate.js
```

### Signature de la fonction
```js
/**
 * Génère le HTML de l'email de confirmation de réservation
 * @param {Object} reservation - Document Mongoose de la réservation
 * @param {string} wavePaymentUrl - URL Wave avec montant pré-rempli
 * @param {Object} contacts - Numéros de téléphone du staff parsés depuis env
 * @returns {string} HTML complet du template email
 */
export function generateReservationEmailHTML(reservation, wavePaymentUrl, contacts) { ... }
```

### Parsing des contacts depuis `.env`
```
OTHERS_STAFF_WHATSAPP=gaston:0779987454,ernestine:0708707719,cyrille:0704763132,maman:0709360672
```
⚠️ Le format actuel semble avoir un séparateur manquant entre `gaston:0779987454` et `ernestine:0708707719`. Corriger dans `.env` en ajoutant la virgule, puis parser :

```js
function parseStaffContacts() {
  const raw = process.env.OTHERS_STAFF_WHATSAPP || '';
  return raw.split(',').map(entry => {
    const [name, phone] = entry.split(':');
    return { name: name?.trim(), phone: phone?.trim() };
  }).filter(c => c.name && c.phone);
}
```

---

## Structure du Template Email

### Sections attendues

```
┌─────────────────────────────────────────────┐
│  🏠 LOGO + NOM DU SANCTUAIRE               │
│  (bannière avec gradient doré/bleu foncé)   │
├─────────────────────────────────────────────┤
│  ✅ Message de confirmation                 │
│  "Votre réservation a été enregistrée..."   │
├─────────────────────────────────────────────┤
│  📋 RÉCAPITULATIF DE LA RÉSERVATION         │
│  ┌─────────────────────────────────────┐    │
│  │ Nom complet : ...                   │    │
│  │ Communauté : ...                    │    │
│  │ Téléphone : ...                     │    │
│  │ Email : ...                         │    │
│  │ Type de réservation : ...           │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  📅 DÉTAILS DU SÉJOUR                      │
│  ┌─────────────────────────────────────┐    │
│  │ Date d'arrivée : Lundi 15 Sept.    │    │
│  │ Date de départ : Mercredi 17 Sept. │    │
│  │ Nombre de nuits : 2                │    │
│  │ Participants : 5                   │    │
│  │ Dont chambre indiv. : 1            │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  💰 DÉCOMPOSITION DES TARIFS (TABLEAU)      │
│  ┌──────────────────────────┬───────────┐   │
│  │ Description              │ Montant   │   │
│  ├──────────────────────────┼───────────┤   │
│  │ 4 pers. × dortoir × 2n  │ 24 000 F  │   │
│  │ 1 pers. × ch.indiv × 2n │ 20 000 F  │   │
│  │ Repas plan 2 × 5p × 1j  │ 15 000 F  │   │
│  │ Repas bordure × 5p      │ 10 000 F  │   │
│  ├──────────────────────────┼───────────┤   │
│  │ TOTAL                    │ 69 000 F  │   │
│  │ Avance demandée (20%)   │ 14 000 F  │   │
│  │ Solde à régler sur place │ 55 000 F  │   │
│  └──────────────────────────┴───────────┘   │
├─────────────────────────────────────────────┤
│  💳 PAYER L'AVANCE VIA WAVE                 │
│  ┌─────────────────────────────────────┐    │
│  │  [BOUTON WAVE — PAYER 14 000 FCFA]  │    │
│  └─────────────────────────────────────┘    │
│  (ou scannez le QR Code joint)              │
├─────────────────────────────────────────────┤
│  📞 CONTACTS UTILES                         │
│  ┌─────────────────────────────────────┐    │
│  │ 👤 P. Gilbert : 07 79 28 82 93     │    │
│  │ 👤 Gaston     : 07 79 98 74 54     │    │
│  │ 👤 Cyrille    : 07 04 76 31 32     │    │
│  │ 💸 Paiement (Maman): 07 09 36 06 72│    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  📝 Note : L'avance confirme votre          │
│  réservation. Solde à régler sur place.     │
├─────────────────────────────────────────────┤
│  🏛️ FOOTER                                  │
│  Sanctuaire Notre Dame du Rosaire           │
│  Bolobi, Route d'Adzopé, Côte d'Ivoire     │
└─────────────────────────────────────────────┘
```

---

## Contraintes Techniques Email HTML

### Compatibilité
- Utiliser des **tables HTML** pour la mise en page (pas de flexbox/grid)
- Styles **inline** uniquement (pas de `<style>` externe)
- Largeur max : **600px**, centré
- Police : `font-family: Arial, Helvetica, sans-serif` (safe)
- Images : Pas d'images locales (clients email les bloquent) — utiliser des emojis et des couleurs de fond

### Palette de couleurs
```
Fond principal : #f4f4f7
Bannière header : linear-gradient → fallback #1a2332 (bleu très foncé)
Accent doré : #c9a84c
Texte principal : #333333
Texte secondaire : #666666
Bouton Wave : #1DC7EA (bleu Wave)
Succès/Validation : #28a745
Bordure tableau : #e0e0e0
```

---

## Fichier `pages/api/reservation_ai.js` — Modifications

### Calcul détaillé des lignes de tarification
Le backend doit calculer et retourner un tableau de lignes de détail pour le template :

```js
function buildPricingLines(reservation) {
  const lines = [];
  const from = new Date(reservation.from);
  const to = new Date(reservation.to);
  const nights = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
  const participants = reservation.participants;
  const chambres = reservation.individual_room_participants || 0;
  const dortoirs = Math.max(participants - chambres, 0);

  if (reservation.type_reservation === 'pray') {
    lines.push({ desc: `${participants} participant(s) × 500 FCFA`, amount: participants * 500 });
  } else if (reservation.type_reservation === 'celebration') {
    lines.push({ desc: `${participants} participant(s) × 500 FCFA`, amount: participants * 500 });
    // + repas si applicable
  } else {
    if (dortoirs > 0) {
      lines.push({
        desc: `${dortoirs} pers. en dortoir × ${nights} nuit(s) × 3 000 FCFA`,
        amount: dortoirs * nights * 3000
      });
    }
    if (chambres > 0) {
      lines.push({
        desc: `${chambres} chambre(s) indiv. × ${nights} nuit(s) × 10 000 FCFA`,
        amount: chambres * nights * 10000
      });
    }
    if (reservation.meal_included && reservation.meal_plan) {
      const fullDays = Math.max(nights - 1, 0);
      const dailyRate = reservation.meal_plan === 2 ? 3000 : 2000;
      const planLabel = reservation.meal_plan === 2 ? '2 repas + pdj' : '1 repas + pdj';
      if (fullDays > 0) {
        lines.push({
          desc: `Repas (${planLabel}) × ${participants} pers. × ${fullDays} jour(s) complet(s)`,
          amount: fullDays * dailyRate * participants
        });
      }
      if (nights >= 1) {
        lines.push({
          desc: `Repas arrivée/départ × ${participants} pers. × 2 repas simples`,
          amount: 2 * 1000 * participants
        });
      }
    }
  }
  return lines;
}
```

### Intégration dans le handler
```js
// Après création de la réservation :
const pricingLines = buildPricingLines(reservation.toObject());
const contacts = parseStaffContacts();
const wavePaymentUrl = `${process.env.WAVE_LINK}${montant_avance_safe}`;

const emailHTML = generateReservationEmailHTML(
  reservation.toObject(),
  wavePaymentUrl,
  contacts,
  pricingLines
);

await transporter.sendMail({
  from: { name: 'Sanctuaire NDR Bolobi', address: process.env.EMAIL_USER_CYR },
  to: reservation.email,
  bcc: process.env.NEXT_PUBLIC_EMAIL_ADMIN,
  subject: `✅ Confirmation de réservation — ${reservation.names}`,
  html: emailHTML
});
```

---

## Checklist de validation
- [ ] L'email affiche un tableau détaillé des tarifs avec nombre de nuits visible
- [ ] Le bouton Wave est cliquable et contient le montant exact de l'avance arrondie
- [ ] Les numéros de téléphone du staff sont affichés (P. Gilbert, Gaston, Cyrille, Maman)
- [ ] L'email est lisible dans Gmail, Yahoo Mail et Outlook (tester avec Litmus ou Email on Acid)
- [ ] Le template est exporté dans un fichier séparé (`emailTemplate.js`) pour réutilisabilité
- [ ] Le `from` de l'email affiche "Sanctuaire NDR Bolobi"
- [ ] L'email est envoyé en `bcc` à tous les admins définis dans `NEXT_PUBLIC_EMAIL_ADMIN`
