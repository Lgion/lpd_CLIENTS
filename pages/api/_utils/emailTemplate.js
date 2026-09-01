/**
 * Template HTML5 responsive pour l'email de confirmation de réservation
 */

export function parseStaffContacts() {
  const raw = process.env.OTHERS_STAFF_WHATSAPP || '';
  const list = [];
  raw.split(',').forEach(entry => {
    const parts = entry.split(':');
    if (parts.length >= 2) {
      list.push({ name: parts[0].trim(), phone: parts[1].trim() });
    }
  });
  return list;
}

export function buildPricingLines(reservation) {
  const lines = [];
  const from = new Date(reservation.from);
  const to = new Date(reservation.to);
  const diffTime = Math.abs(to - from);
  let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (isNaN(nights) || nights <= 0) nights = 0;
  const participants = parseInt(reservation.participants, 10) || 0;
  const chambres = parseInt(reservation.individual_room_participants, 10) || 0;
  const dortoirs = Math.max(participants - chambres, 0);

  if (reservation.type_reservation === 'pray') {
    lines.push({ desc: `${participants} participant(s) × 500 FCFA`, amount: participants * 500 });
  } else if (reservation.type_reservation === 'celebration') {
    lines.push({ desc: `${participants} participant(s) × 500 FCFA`, amount: participants * 500 });
    if (reservation.meal_included && reservation.meal_plan) {
      const planRate = reservation.meal_plan == 2 ? 3000 : 2000;
      const planLabel = reservation.meal_plan == 2 ? '2 repas + pdj' : '1 repas + pdj';
      lines.push({ desc: `Repas (${planLabel}) × ${participants} pers.`, amount: participants * planRate });
    }
  } else {
    if (dortoirs > 0 && nights > 0) {
      lines.push({
        desc: `${dortoirs} pers. en dortoir × ${nights} nuit(s) × 3 000 FCFA`,
        amount: dortoirs * nights * 3000
      });
    }
    if (chambres > 0 && nights > 0) {
      lines.push({
        desc: `${chambres} chambre(s) indiv. × ${nights} nuit(s) × 10 000 FCFA`,
        amount: chambres * nights * 10000
      });
    }
    if (reservation.meal_included && reservation.meal_plan && nights > 0) {
      const fullDays = Math.max(nights - 1, 0);
      const dailyRate = reservation.meal_plan == 2 ? 3000 : 2000;
      const planLabel = reservation.meal_plan == 2 ? '2 repas + pdj' : '1 repas + pdj';
      if (fullDays > 0) {
        lines.push({
          desc: `Repas (${planLabel}) × ${participants} pers. × ${fullDays} jour(s) complet(s)`,
          amount: fullDays * dailyRate * participants
        });
      }
      if (nights >= 1) {
        lines.push({
          desc: `Repas bordure (Arrivée & Départ) × ${participants} pers. (2 jours × 1 repas/j × 2 000 FCFA)`,
          amount: 4000 * participants
        });
      }
    }
  }
  return { lines, nights };
}

export function generateReservationEmailHTML({ reservation, wavePaymentUrl, waveQrPic }) {
  const { lines, nights } = buildPricingLines(reservation);
  const contacts = parseStaffContacts();
  const directorPhone = process.env.DIRECTOR__WHATSAPP || process.env.NEXT_PUBLIC_DIRECTOR_WHATSAPP || '0779288293';
  const total = parseInt(reservation.montant_total, 10) || 0;
  const avance = parseInt(reservation.montant_avance, 10) || 0;
  const solde = Math.max(total - avance, 0);

  const formatDate = (d) => {
    try {
      return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date(d));
    } catch {
      return String(d);
    }
  };

  const contactItemsHTML = contacts.map(c => `
    <tr style="border-bottom: 1px solid #edf2f7;">
      <td style="padding: 8px 12px; font-weight: bold; color: #2d3748; text-transform: capitalize;">${c.name}</td>
      <td style="padding: 8px 12px; text-align: right;">
        <a href="tel:+225${c.phone}" style="color: #2b6cb0; text-decoration: none; font-weight: 600;">+225 ${c.phone}</a>
      </td>
    </tr>
  `).join('');

  const pricingRowsHTML = lines.map(l => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 12px; color: #4a5568; font-size: 14px;">${l.desc}</td>
      <td style="padding: 10px 12px; text-align: right; font-weight: 600; color: #2d3748; font-size: 14px;">
        ${l.amount.toLocaleString('fr-FR')} FCFA
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de réservation - Sanctuaire Notre Dame du Rosaire</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: Arial, Helvetica, sans-serif; color: #333333; -webkit-font-smoothing: antialiased;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f9; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- MAIN CONTAINER -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
          
          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%); padding: 30px 25px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; color: #c9a84c;">
                SANCTUAIRE NOTRE DAME DU ROSAIRE
              </h1>
              <p style="margin: 0; font-size: 14px; color: #e2e8f0; font-style: italic;">
                Bolobi, Adzopé &bull; Côte d'Ivoire
              </p>
            </td>
          </tr>

          <!-- BADGE & INTRO -->
          <tr>
            <td style="padding: 25px 25px 15px 25px;">
              <div style="background-color: #f0fff4; border-left: 4px solid #38a169; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 0; color: #276749; font-weight: 600; font-size: 15px;">
                  ✅ Votre demande de réservation a été enregistrée avec succès !
                </p>
              </div>
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4a5568;">
                Bonjour <strong>${reservation.names}</strong>,<br>
                Nous vous remercions pour votre demande de séjour au Sanctuaire Notre Dame du Rosaire de Bolobi. Voici le récapitulatif complet et détaillé de votre réservation.
              </p>
            </td>
          </tr>

          <!-- DETAILS CLIENT & SEJOUR -->
          <tr>
            <td style="padding: 0 25px 20px 25px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border-radius: 8px; padding: 15px;">
                <tr>
                  <td style="font-size: 14px; line-height: 1.7; color: #2d3748;">
                    <strong>👤 Nom complet :</strong> ${reservation.names}<br>
                    <strong>📞 Téléphone :</strong> ${reservation.phone_number}<br>
                    <strong>📧 Email :</strong> ${reservation.email || 'Non renseigné'}<br>
                    ${reservation.community ? `<strong>⛪ Communauté :</strong> ${reservation.community}<br>` : ''}
                    <strong>📅 Arrivée :</strong> ${formatDate(reservation.from)}<br>
                    ${reservation.to ? `<strong>📅 Départ :</strong> ${formatDate(reservation.to)} (${nights} nuit${nights > 1 ? 's' : ''})<br>` : ''}
                    <strong>👥 Participants :</strong> ${reservation.participants} personne(s)
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- PRICING BREAKDOWN TABLE -->
          <tr>
            <td style="padding: 0 25px 20px 25px;">
              <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1a2332; border-bottom: 2px solid #c9a84c; padding-bottom: 6px; display: inline-block;">
                📊 Décomposition du tarif
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                  <tr style="background-color: #edf2f7;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 13px; color: #718096; text-transform: uppercase;">Description</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 13px; color: #718096; text-transform: uppercase;">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  ${pricingRowsHTML}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- SUMMARY TOTAL / AVANCE / SOLDE -->
          <tr>
            <td style="padding: 0 25px 25px 25px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1a2332; border-radius: 8px; color: #ffffff; padding: 18px 20px;">
                <tr>
                  <td style="font-size: 14px; line-height: 1.8;">
                    <div style="display: flex; justify-content: space-between; font-size: 15px;">
                      <span>Montant total :</span>
                      <strong style="color: #ffffff;">${total.toLocaleString('fr-FR')} FCFA</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 16px; color: #c9a84c; font-weight: bold; margin-top: 4px;">
                      <span>Avance à régler (20% arrondi) :</span>
                      <span>${avance.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; color: #cbd5e0; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 6px;">
                      <span>Solde à régler sur place :</span>
                      <strong>${solde.toLocaleString('fr-FR')} FCFA</strong>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WAVE PAYMENT BUTTON -->
          ${wavePaymentUrl ? `
          <tr>
            <td align="center" style="padding: 0 25px 25px 25px;">
              <a href="${wavePaymentUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #1DC7EA 0%, #0D9FD6 100%); color: #ffffff; font-weight: bold; font-size: 16px; text-decoration: none; padding: 14px 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(13,159,214,0.3); text-align: center;">
                💳 Payer l'avance de ${avance.toLocaleString('fr-FR')} FCFA via Wave
              </a>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #718096;">
                Lien de paiement sécurisé Wave Direct
              </p>
            </td>
          </tr>
          ` : ''}

          <!-- CONTACT STAFF SECTION -->
          <tr>
            <td style="padding: 0 25px 25px 25px;">
              <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #1a2332; border-bottom: 2px solid #cbd5e0; padding-bottom: 4px;">
                📞 Contacts utiles du sanctuaire
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border-radius: 8px; padding: 6px 12px;">
                <tr style="border-bottom: 1px solid #edf2f7;">
                  <td style="padding: 8px 12px; font-weight: bold; color: #2d3748;">Père Gilbert (Directeur)</td>
                  <td style="padding: 8px 12px; text-align: right;">
                    <a href="tel:+225${directorPhone}" style="color: #2b6cb0; text-decoration: none; font-weight: 600; margin-right: 8px;">+225 ${directorPhone}</a>
                    <a href="https://wa.me/+225${directorPhone}" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">💬 WhatsApp</a>
                  </td>
                </tr>
                ${contacts.map(c => `
                  <tr style="border-bottom: 1px solid #edf2f7;">
                    <td style="padding: 8px 12px; font-weight: bold; color: #2d3748; text-transform: capitalize;">${c.name}</td>
                    <td style="padding: 8px 12px; text-align: right;">
                      <a href="tel:+225${c.phone}" style="color: #2b6cb0; text-decoration: none; font-weight: 600; margin-right: 8px;">+225 ${c.phone}</a>
                      <a href="https://wa.me/+225${c.phone}" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">💬 WhatsApp</a>
                    </td>
                  </tr>
                `).join('')}
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #edf2f7; padding: 20px 25px; text-align: center; font-size: 13px; color: #718096; line-height: 1.5;">
              <p style="margin: 0 0 5px 0; font-weight: 600; color: #4a5568;">
                Sanctuaire Notre Dame du Rosaire &bull; Bolobi, Adzopé
              </p>
              <p style="margin: 0;">
                Email : puissancedamour@yahoo.fr &bull; Tél : +225-07-09-36-06-72
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}
