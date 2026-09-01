import dbConnect from './lib/dbConnect';
import modelReservation from './_/models/Reservation';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER_CYR || process.env.EMAIL_USER_MAM,
    pass: process.env.EMAIL_PASS
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  try {
    await dbConnect();
    const { transcript, audioBlob } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ success: false, message: 'Transcription vocale manquante' });
    }

    const text = transcript.toLowerCase();

    // Traitement intelligent du texte pour extraire les informations de réservation
    const now = new Date();
    const dateFrom = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const dateTo = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const parsed = {
      names: 'Pèlerin (Dictée Vocale)',
      community: 'Non spécifié',
      phone_number: 'À recontacter',
      email: 'non_specifie@sanctuaire-bolobi.org',
      participants: 1,
      individual_room_participants: 0,
      type_reservation: 'retraite',
      from: dateFrom,
      to: dateTo,
      meal_included: true,
      meal_plan: 1,
      montant_total: 0,
      montant_avance: 0,
      message: `[RESERVE PAR VOIX DU SITE] Transcription : "${transcript}"`
    };

    // Nombre de participants
    const partMatch = text.match(/(\d+)\s*(personnes|participants|pèlerins|membres|retraitants|fidèles)/i);
    if (partMatch) {
      parsed.participants = parseInt(partMatch[1], 10);
    }

    // Chambres individuelles
    const indMatch = text.match(/(\d+)\s*(chambres|chambre)?\s*(individuelles|individuelle|ind)/i);
    if (indMatch) {
      parsed.individual_room_participants = parseInt(indMatch[1], 10);
    }

    // Numéro de téléphone
    const phoneMatch = text.match(/(0\d[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2}[\s\.]?\d{2})/);
    if (phoneMatch) {
      parsed.phone_number = phoneMatch[1].replace(/[\s\.]/g, '');
    }

    // Nom complet (ex: "je me nomme Alexandre Guitar")
    const nameMatch = text.match(/(je me nomme|m'appelle|je suis|nom est|monsieur|madame|père|frère|sœur|m\.|mme)\s+([a-zàâéèêëîïôùûüç\s]+?)(,|\.|$|de la|du|d'|téléphone|pour|je)/i);
    if (nameMatch && nameMatch[2]) {
      parsed.names = nameMatch[2].trim();
    }

    // Communauté / Paroisse (ex: "de la communauté XYZ")
    const commMatch = text.match(/(communauté|paroisse|groupe|légion|mouvement)\s+([a-zàâéèêëîïôùûüç0-9\s]+?)(,|\.|$|pour|avec|téléphone|je)/i);
    if (commMatch && commMatch[2]) {
      parsed.community = commMatch[2].trim().toUpperCase();
    }

    // Forfait repas
    if (text.includes('1 repas par jour') || text.includes('un repas par jour')) {
      parsed.meal_included = true;
      parsed.meal_plan = 1;
    } else if (text.includes('2 repas par jour') || text.includes('deux repas par jour')) {
      parsed.meal_included = true;
      parsed.meal_plan = 2;
    } else if (text.includes('aucun repas') || text.includes('sans repas')) {
      parsed.meal_included = false;
      parsed.meal_plan = 0;
    }

    // Calcul des montants estimatifs
    const nbNuits = 2;
    const prixNuitCommune = 3000;
    const prixNuitInd = 10000;
    const prixRepas = 2000;

    const indCount = parsed.individual_room_participants;
    const comCount = Math.max(0, parsed.participants - indCount);

    parsed.montant_total = (comCount * prixNuitCommune * nbNuits) + (indCount * prixNuitInd * nbNuits) + (parsed.participants * prixRepas * nbNuits);
    parsed.montant_avance = Math.ceil(parsed.montant_total * 0.2);

    // Sauvegarde en base MongoDB
    const newReservation = await modelReservation.create(parsed);

    // Envoi des emails aux administrateurs (NEXT_PUBLIC_EMAIL_ADMIN)
    const adminEmailsRaw = process.env.NEXT_PUBLIC_EMAIL_ADMIN || 'hi.cyril@gmail.com puissancedamour@yahoo.fr legion.athenienne@gmail.com';
    const adminEmails = adminEmailsRaw.split(' ').filter(Boolean);

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 800;">🎙️ Nouvelle Réservation Vocale</h2>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Sanctuaire Notre-Dame du Rosaire de Bolobi</p>
        </div>

        <div style="padding: 24px;">
          <div style="background: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Transcription Vocale Brute :</p>
            <p style="margin: 0; font-size: 15px; font-style: italic; color: #1e293b; line-height: 1.5;">"${transcript}"</p>
          </div>

          <h3 style="font-size: 16px; color: #0f172a; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">📋 Informations Extraites par l'IA :</h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 40%;">👤 Nom du pèlerin :</td>
              <td style="padding: 8px 0;">${parsed.names}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">⛪ Communauté / Paroisse :</td>
              <td style="padding: 8px 0;">${parsed.community}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">📞 Téléphone :</td>
              <td style="padding: 8px 0;"><a href="tel:${parsed.phone_number}" style="color: #2563eb; font-weight: bold; text-decoration: none;">${parsed.phone_number}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">👥 Nombre de pèlerins :</td>
              <td style="padding: 8px 0;">${parsed.participants} participant(s) ${indCount > 0 ? `(dont ${indCount} ch. indiv.)` : ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">💰 CA Estimé :</td>
              <td style="padding: 8px 0; font-weight: bold; color: #16a34a;">${parsed.montant_total.toLocaleString('fr-FR')} FCFA (Avance : ${parsed.montant_avance.toLocaleString('fr-FR')} FCFA)</td>
            </tr>
          </table>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://sanctuaire-bolobi.org/admin/sanctuaire" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none;">Valider la Réservation dans l'Admin</a>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
          Message généré automatiquement depuis le formulaire vocal du Sanctuaire de Bolobi.<br/>
          Emails administrateurs notifiés : ${adminEmails.join(', ')}
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: {
          name: 'Sanctuaire Vocale IA',
          address: process.env.EMAIL_USER_CYR || process.env.EMAIL_USER_MAM || 'hi.cyril@gmail.com'
        },
        to: adminEmails,
        subject: `[Sanctuaire Bolobi] 🎙️ Nouvelle Réservation Vocale : ${parsed.names} (${parsed.participants} pèlerins)`,
        html: emailHTML
      });
      console.log(`Email de réservation vocale envoyé à: ${adminEmails.join(', ')}`);
    } catch (emailErr) {
      console.error("Erreur d'envoi d'email admin:", emailErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Votre réservation vocale a été transmise avec succès aux administrateurs du Sanctuaire !',
      reservation: newReservation
    });
  } catch (error) {
    console.error('Erreur API Voice Reservation:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la réservation vocale', error: error.message });
  }
}
