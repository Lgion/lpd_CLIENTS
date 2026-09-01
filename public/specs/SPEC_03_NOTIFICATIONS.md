# SPEC_03 — Notifications WhatsApp Multi-Destinataires & Alertes Réservation

## Contexte
Deux besoins distincts mais liés :
1. **Notifications automatiques** : Lorsqu'une réservation est effectuée, P. Gilbert et Gaston doivent être notifiés.
2. **Relais WhatsApp** : Lorsqu'un visiteur clique sur le bouton WhatsApp de la page pour contacter P. Gilbert, Gaston (et potentiellement d'autres membres du staff) doivent aussi recevoir le message en arrière-plan.

---

## 1. Notifications de Réservation au Staff

### Problème
Actuellement, seul un email est envoyé aux admins en BCC. Aucune notification instantanée (WhatsApp ou autre) n'est envoyée.

### Solution retenue : Notification par Email individuel aux membres du staff
Le bouton WhatsApp client-side ne permet pas d'envoyer à plusieurs destinataires. La solution la plus fiable et immédiate est de :
1. **Envoyer un email d'alerte distinct** à Gaston et P. Gilbert lors de chaque nouvelle réservation
2. (Optionnel, Phase ultérieure) Intégrer l'API WhatsApp Business Cloud pour des notifications push

### Variables d'environnement à ajouter
```env
# Emails du staff pour notifications (séparés par virgule)
STAFF_NOTIFICATION_EMAILS=gaston@email.com,pgilbert@email.com
```

> **Alternative immédiate si pas d'email** : Utiliser l'API WhatsApp Business (gratuit jusqu'à 1 000 messages/mois avec Meta). Cependant, cela nécessite un numéro de téléphone vérifié et une approbation Meta. Pour la V1, on reste sur les emails.

### Fichier impacté
- `pages/api/reservation_ai.js`

### Implémentation — Email d'alerte Staff
Ajouter une fonction d'alerte après la création de la réservation :

```js
async function sendStaffAlert(reservation) {
  const contacts = parseStaffContacts(); // Depuis OTHERS_STAFF_WHATSAPP
  const staffEmails = process.env.STAFF_NOTIFICATION_EMAILS || '';
  
  if (!staffEmails) return;
  
  const from = new Date(reservation.from);
  const to = new Date(reservation.to);
  const nights = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
  
  const alertHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 500px;">
      <h2 style="color: #1a2332;">🔔 Nouvelle Réservation !</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; font-weight: bold;">Nom :</td><td>${reservation.names}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Communauté :</td><td>${reservation.community}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Téléphone :</td><td>${reservation.phone_number}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Dates :</td><td>${from.toLocaleDateString('fr-FR')} → ${to.toLocaleDateString('fr-FR')} (${nights} nuit(s))</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Participants :</td><td>${reservation.participants}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Montant total :</td><td>${reservation.montant_total} FCFA</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Avance :</td><td>${reservation.montant_avance} FCFA</td></tr>
      </table>
      <p style="margin-top: 16px;">
        <a href="https://librairie-puissance-divine.ci/admin/sanctuaire" 
           style="background: #c9a84c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
          Voir dans l'administration →
        </a>
      </p>
    </div>
  `;
  
  try {
    await transporter.sendMail({
      from: { name: 'Alerte Sanctuaire Bolobi', address: process.env.EMAIL_USER_CYR },
      to: staffEmails,
      subject: `🔔 Nouvelle réservation : ${reservation.names} — ${reservation.montant_total} FCFA`,
      html: alertHTML
    });
  } catch (err) {
    console.error('Erreur envoi alerte staff:', err);
  }
}
```

### Intégration dans le handler principal
```js
// Après `sendConfirmationEmail_bis()` :
await sendStaffAlert(reservation.toObject());
```

---

## 2. Relais WhatsApp — Message Multi-Destinataires

### Problème
Le bouton WhatsApp dans `app/_/SNS.jsx` (ligne 24) ouvre un lien `wa.me` direct vers un seul numéro. Les autres membres du staff ne voient pas le message.

### Contrainte technique
Un lien `wa.me` ne peut cibler qu'un seul numéro. Il est impossible d'envoyer nativement à plusieurs destinataires via un lien côté navigateur.

### Solution : API Proxy Backend

#### Nouveau endpoint API
```
pages/api/whatsapp_relay.js
```

#### Flow
```
1. Visiteur clique sur bouton WhatsApp
2. → Appel fetch('/api/whatsapp_relay', { method: 'POST', body: { message } })
3. → Backend envoie un email d'alerte aux destinataires configurés
4. → Puis redirige le visiteur vers wa.me/+225{DIRECTOR__WHATSAPP}
```

#### Implémentation Frontend (`app/_/SNS.jsx`)
```jsx
const handleWhatsAppClick = async (e) => {
  e.preventDefault();
  const message = waMessage;
  
  // Envoyer le relais en arrière-plan (fire and forget)
  fetch('/api/whatsapp_relay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sender: 'Visiteur du site' })
  }).catch(console.error);
  
  // Ouvrir WhatsApp immédiatement vers P. Gilbert
  window.open(
    `https://wa.me/+225${process.env.NEXT_PUBLIC_DIRECTOR_WHATSAPP}?text=${encodeURIComponent(message)}`,
    '_blank'
  );
};
```

#### Implémentation Backend (`pages/api/whatsapp_relay.js`)
```js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER_CYR,
    pass: process.env.EMAIL_PASS
  }
});

function parseStaffContacts() {
  const raw = process.env.OTHERS_STAFF_WHATSAPP || '';
  return raw.split(',').map(entry => {
    const [name, phone] = entry.split(':');
    return { name: name?.trim(), phone: phone?.trim() };
  }).filter(c => c.name && c.phone);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { message, sender } = req.body;
  const contacts = parseStaffContacts();
  const staffEmails = process.env.STAFF_NOTIFICATION_EMAILS;
  
  if (!staffEmails) return res.status(200).json({ ok: true, note: 'No staff emails configured' });
  
  const alertHTML = `
    <div style="font-family: Arial, sans-serif;">
      <h3>💬 Nouveau message WhatsApp depuis le site</h3>
      <p><strong>Expéditeur :</strong> ${sender || 'Visiteur'}</p>
      <p><strong>Message :</strong></p>
      <blockquote style="border-left: 3px solid #25D366; padding-left: 12px; color: #333;">
        ${message}
      </blockquote>
      <p style="color: #888; font-size: 0.9em;">
        Ce message a été envoyé à P. Gilbert via WhatsApp. 
        Vous recevez cette copie car vous êtes inscrit dans les notifications du sanctuaire.
      </p>
    </div>
  `;
  
  try {
    await transporter.sendMail({
      from: { name: 'Sanctuaire Bolobi — WhatsApp', address: process.env.EMAIL_USER_CYR },
      to: staffEmails,
      subject: `💬 Message WhatsApp : ${(message || '').substring(0, 50)}...`,
      html: alertHTML
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erreur relais WhatsApp:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
```

### Variables d'environnement à ajouter/modifier
```env
# Rendre le numéro du directeur accessible côté client
NEXT_PUBLIC_DIRECTOR_WHATSAPP=0779288293

# Emails du staff pour recevoir les alertes 
STAFF_NOTIFICATION_EMAILS=gaston@email.com,pgilbert@email.com
```

---

## Checklist de validation
- [ ] Chaque nouvelle réservation déclenche un email d'alerte au staff
- [ ] L'email d'alerte contient un lien direct vers `/admin/sanctuaire`
- [ ] Le clic sur le bouton WhatsApp envoie en parallèle une copie email au staff
- [ ] L'expérience utilisateur WhatsApp n'est PAS ralentie (fire-and-forget)
- [ ] Les variables d'environnement sont correctement documentées
- [ ] Le format de `OTHERS_STAFF_WHATSAPP` est corrigé (virgules entre chaque contact)
