// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import modelReservation from './_/models/Reservation';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true pour le port 465, false pour les autres ports
  auth: {
    user: process.env.EMAIL_USER_CYR, // votre adresse gmail
    pass: process.env.EMAIL_PASS  // votre mot de passe d'application gmail
    // LIEN POUR CRÉER UN MOT DE PASSE D'APPLCIATION: 
    // https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4Pv88u1tQAu32DzpYoL5lkR20vdGY_xWV6q_1gJSQViWmNd1fCrNX4CcpKMMyaHUVQEOch66VkCr0TvUj0zk8O6iUXLCMdFf33DWXQ_Ix-izoy1EPE
  },
  tls: {
    rejectUnauthorized: false // Attention: à utiliser uniquement en développement
  }
});

// Connexion rapide à MongoDB si nécessaire
async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pda';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }
  await dbConnect();
  try {
    const {
      names, phone_number, email, from, to, participants,
      individual_room_participants, message, type_reservation, meal_included,
      meal_plan, community,
      montant_total, montant_avance
    } = req.body;
    // Validation rapide
    const isDateToRequired = type_reservation !== 'pray' && type_reservation !== 'celebration';
    
    if (!names || !phone_number || !from || (isDateToRequired && !to) || !participants || !montant_total || !montant_avance) {
      return res.status(400).json({ success: false, message: 'Champs obligatoires manquants.' });
    }
    const reservation = await modelReservation.create({
      names,
      phone_number,
      email: email || 'non-fourni@exemple.com', // Valeur par défaut si email vide,
      from: new Date(from),
      to: to ? new Date(to) : new Date(from), // Utiliser la date d'arrivée si pas de date de départ
      participants,
      individual_room_participants,
      message,
      type_reservation,
      meal_included,
      meal_plan: meal_included ? meal_plan : undefined,
      montant_total,
      montant_avance,
      avance_payee: false,
      isValidated: false,
      isArchived: false,
      deletedAt: null,
      community: community || '',
    });


    // Envoyer l'email de confirmation
    // const tmp = await sendConfirmationEmail({
    //   ...reservation
    //   // ...newReservation.toObject(),
    //   // email: req.body.reservation.email
    // });
    const tmp = await sendConfirmationEmail_bis(reservation.toObject());

    return res.status(201).json({ success: true, reservation });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}


async function sendConfirmationEmail(reservation) {
  try{
    // Préparer le contenu de l'email
    const emailContent = `
      <h2>Confirmation de réservation - Sanctuaire Notre Dame du Rosaire</h2>
      <p>Bonjour,</p>
      <p>Votre réservation a été enregistrée avec succès.</p>
      
      <h3>Détails de la réservation :</h3>
      <ul>
        <li>Communauté : ${reservation.community}</li>
        <li>Nom : ${reservation.names}</li>
        <li>N° téléphone : ${reservation.phone_number}</li>
        <li>Email : ${reservation.email || "Email non fourni"}</li>
        <li>Message : ${reservation.message || "Aucun message associé"}</li>
      </ul>

      
      <p>Merci de votre confiance !</p>
      
      <p style="color: #666; font-size: 0.9em;">
        Sanctuaire Notre Dame du Rosaire<br>
        Bolobi, Adzopé<br>
        Côte d'Ivoire
      </p>
    `;

    // Envoyer l'email
    const info = await transporter.sendMail({
      from: {
        name: 'Sanctuaire Notre Dame du Rosaire',
        address: process.env.EMAIL_USER_CYR
      },
      to: reservation.email,
      bcc: process.env.NEXT_PUBLIC_EMAIL_ADMIN,
      subject: 'Confirmation de réservation - Sanctuaire Notre Dame du Rosaire',
      html: emailContent
    });

    console.log('Email envoyé avec succès:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi de l\'email:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });
    
    if (error.code === 'ESOCKET') {
      console.error('Erreur de connexion au serveur SMTP. Vérifiez votre connexion Internet et les paramètres du serveur SMTP.');
    } else if (error.code === 'EAUTH') {
      console.error('Erreur d\'authentification. Vérifiez vos identifiants SMTP2GO_USER et SMTP2GO_PASS.');
    }
    
    return false;
  }
}

async function sendConfirmationEmail_bis(reservation) {
  try {
    // Vérifier la connexion SMTP
    await transporter.verify();
    console.log('Connexion SMTP vérifiée avec succès');

    // Calculer les détails des chambres
    const chambresIndividuelles = reservation.individual_room_participants > 0 
      ? `<li>Chambre(s) individuelle(s) : ${reservation.individual_room_participants} personne(s) × 10,000 FCFA/nuit</li>` 
      : '';
    const chambresCollectives = reservation.participants - reservation.individual_room_participants > 0
      ? `<li>Chambre(s) collective(s) : ${reservation.participants - reservation.individual_room_participants} personne(s) × 3,000 FCFA/nuit</li>`
      : '';

    // Préparer les détails des repas
    let detailsRepas = '';
    if (reservation.meal_included) {
      const planRepas = reservation.meal_plan === 1 
        ? '1 repas + petit-déjeuner (2,000 FCFA/jour/personne)'
        : '2 repas + petit-déjeuner (3,000 FCFA/jour/personne)';
      
      detailsRepas = `
        <h3>Détails des repas :</h3>
        <ul>
          <li>Plan choisi : ${planRepas}</li>
          ${reservation.meals.breakfast ? `<li>Petit-déjeuner : ${reservation.meals.breakfast}</li>` : ''}
          ${reservation.meals.lunch ? `<li>Déjeuner : ${reservation.meals.lunch}</li>` : ''}
          ${reservation.meals.dinner ? `<li>Dîner : ${reservation.meals.dinner}</li>` : ''}
        </ul>
      `;
    }

    // Préparer le contenu de l'email
    const emailContent = `
      <h2>Confirmation de réservation - Sanctuaire Notre Dame du Rosaire</h2>
      <p>Bonjour,</p>
      <p>Votre réservation a été enregistrée avec succès.</p>
      
      <h3>Détails de la réservation :</h3>
      <ul>
        <li>Date d'arrivée : ${new Date(reservation.from).toLocaleDateString()}</li>
        <li>Date de départ : ${new Date(reservation.to).toLocaleDateString()}</li>
        <li>Nombre de participants : ${reservation.participants}</li>
        ${reservation.individual_room_participants > 0 ? 
          `<li>Dont en chambre individuelle : ${reservation.individual_room_participants}</li>` : ''}
      </ul>

      <h3>Hébergement :</h3>
      <ul>
        ${chambresIndividuelles}
        ${chambresCollectives}
      </ul>

      ${reservation.meal_included ? detailsRepas : '<p>Repas non inclus dans la réservation.</p>'}

      <h3>Paiement :</h3>
      <ul>
        <li>Montant total : ${reservation.montant_total} FCFA</li>
        <li>Montant de l'avance à payer : ${reservation.montant_avance} FCFA</li>
      </ul>

      <p style="font-style: italic;">Note : L'avance doit être payée pour confirmer définitivement votre réservation.</p>
      
      <p>Merci de votre confiance !</p>
      
      <p style="color: #666; font-size: 0.9em;">
        Sanctuaire Notre Dame du Rosaire<br>
        Bolobi, Adzopé<br>
        Côte d'Ivoire
      </p>
    `;

    // Envoyer l'email
    const info = await transporter.sendMail({
      from: {
        name: 'Sanctuaire Notre Dame du Rosaire',
        address: process.env.EMAIL_USER_MAM
      },
      to: reservation.email,
      bcc: process.env.NEXT_PUBLIC_EMAIL_ADMIN,
      subject: 'Confirmation de réservation - Sanctuaire Notre Dame du Rosaire',
      html: emailContent
    });

    console.log('Email envoyé avec succès:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi de l\'email:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });
    
    if (error.code === 'ESOCKET') {
      console.error('Erreur de connexion au serveur SMTP. Vérifiez votre connexion Internet et les paramètres du serveur SMTP.');
    } else if (error.code === 'EAUTH') {
      console.error('Erreur d\'authentification. Vérifiez vos identifiants SMTP2GO_USER et SMTP2GO_PASS.');
    }
    
    return false;
  }
}