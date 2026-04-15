// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import modelReservation from './_/models/Reservation'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'

// Configurer le transporteur d'email
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER, // votre adresse gmail
//     pass: process.env.EMAIL_PASS  // votre mot de passe d'application gmail
//     // LIEN POUR CRÉER UN MOT DE PASSE D'APPLCIATION: 
//     // https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4Pv88u1tQAu32DzpYoL5lkR20vdGY_xWV6q_1gJSQViWmNd1fCrNX4CcpKMMyaHUVQEOch66VkCr0TvUj0zk8O6iUXLCMdFf33DWXQ_Ix-izoy1EPE
//   }
// });
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
// // // Les avantages de SMTP2GO par rapport à Gmail sont :
  /*
  Pour utiliser SMTP2GO :
  - Créez un compte gratuit sur SMTP2GO (https://www.smtp2go.com/)
  - Dans votre fichier .env.local, ajoutez ces variables :
  SMTP2GO_USER=votre_utilisateur_smtp2go
  SMTP2GO_PASS=votre_mot_de_passe_smtp2go
  */
// const transporter = nodemailer.createTransport({
//   host: 'mail.smtp2go.com',
//   port: 2525,
//   secure: false,
//   auth: {
//     user: process.env.SMTP2GO_USER,
//     pass: process.env.SMTP2GO_PASS
//   }
// });

async function sendConfirmationEmail(reservation) {
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
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">Confirmation de réservation - Sanctuaire Notre Dame du Rosaire</h2>
        <p>Bonjour,</p>
        <p>Votre réservation a été enregistrée avec succès.</p>
        
        <h3 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 5px;">Informations de contact :</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Nom :</strong> ${reservation.names}</li>
          <li><strong>Communauté :</strong> ${reservation.community || 'N/A'}</li>
          <li><strong>Téléphone :</strong> ${reservation.phone_number}</li>
          <li><strong>Email :</strong> ${reservation.email}</li>
        </ul>

        <h3 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 5px;">Détails du séjour :</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Date d'arrivée :</strong> ${new Date(reservation.from).toLocaleDateString('fr-FR')}</li>
          <li><strong>Date de départ :</strong> ${new Date(reservation.to).toLocaleDateString('fr-FR')}</li>
          <li><strong>Nombre de participants :</strong> ${reservation.participants}</li>
          ${reservation.individual_room_participants > 0 ? 
            `<li><strong>Dont en chambre individuelle :</strong> ${reservation.individual_room_participants}</li>` : ''}
        </ul>

        <h3 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 5px;">Hébergement :</h3>
        <ul style="list-style: none; padding-left: 0;">
          ${chambresIndividuelles ? `<li>${chambresIndividuelles}</li>` : ''}
          ${chambresCollectives ? `<li>${chambresCollectives}</li>` : ''}
        </ul>

        ${reservation.meal_included ? detailsRepas : '<p>Repas non inclus dans la réservation.</p>'}

        ${reservation.message ? `
        <h3 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 5px;">Message :</h3>
        <p>${reservation.message}</p>` : ''}

        <h3 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 5px;">Paiement :</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Montant total :</strong> ${reservation.montant_total.toLocaleString('fr-FR')} FCFA</li>
          <li><strong>Montant de l'avance à payer :</strong> ${reservation.montant_avance.toLocaleString('fr-FR')} FCFA</li>
        </ul>

        <p style="font-style: italic; color: #e74c3c; font-weight: bold; margin-top: 20px;">
          Note : L'avance doit être payée pour confirmer définitivement votre réservation.
        </p>
        
        <p>Merci de votre confiance !</p>
        
        <p style="color: #666; font-size: 0.9em; border-top: 1px solid #eee; padding-top: 10px; margin-top: 30px;">
          <strong>Sanctuaire Notre Dame du Rosaire</strong><br>
          Bolobi, Adzopé<br>
          Côte d'Ivoire
        </p>
        <p style="margin-top: 20px; text-align: center;">
          <a href="https://bolobi.ci/admin/sanctuaire" style="display: inline-block; padding: 10px 20px; background-color: #2c3e50; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Gérer les réservations (Admin)
          </a>
        </p>
      </div>
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
    console.error('Erreur détaillée lors de l\'envoi de l\'email:', error);
    return false;
  }
}

async function sendPaymentConfirmationEmail(reservation) {
  try {
    // Vérifier la connexion SMTP
    await transporter.verify();
    
    // Préparer le contenu de l'email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #27ae60;">Confirmation de paiement - Sanctuaire Notre Dame du Rosaire</h2>
        <p>Bonjour,</p>
        <p>Nous confirmons la réception de votre paiement d'avance de <strong>${reservation.montant_avance.toLocaleString('fr-FR')} FCFA</strong> pour votre réservation.</p>
        
        <h3 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 5px;">Rappel des détails du séjour :</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Date d'arrivée :</strong> ${new Date(reservation.from).toLocaleDateString('fr-FR')}</li>
          <li><strong>Date de départ :</strong> ${new Date(reservation.to).toLocaleDateString('fr-FR')}</li>
          <li><strong>Nombre de participants :</strong> ${reservation.participants}</li>
        </ul>

        <h3 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 5px;">Situation de paiement :</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Montant total :</strong> ${reservation.montant_total.toLocaleString('fr-FR')} FCFA</li>
          <li><strong>Avance payée :</strong> ${reservation.montant_avance.toLocaleString('fr-FR')} FCFA</li>
          <li style="font-weight: bold; color: #2c3e50;"><strong>Reste à payer sur place :</strong> ${(reservation.montant_total - reservation.montant_avance).toLocaleString('fr-FR')} FCFA</li>
        </ul>

        <p style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; border: 1px solid #c3e6cb; margin-top: 20px;">
          Votre réservation est maintenant <strong>confirmée</strong>.
        </p>
        
        <p>Merci de votre confiance !</p>
        
        <p style="color: #666; font-size: 0.9em; border-top: 1px solid #eee; padding-top: 10px; margin-top: 30px;">
          <strong>Sanctuaire Notre Dame du Rosaire</strong><br>
          Bolobi, Adzopé<br>
          Côte d'Ivoire
        </p>
        <p style="margin-top: 20px; text-align: center;">
          <a href="https://bolobi.ci/admin/sanctuaire" style="display: inline-block; padding: 10px 20px; background-color: #27ae60; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Gérer les réservations (Admin)
          </a>
        </p>
      </div>
    `;

    // Envoyer l'email
    const info = await transporter.sendMail({
      from: {
        name: 'Sanctuaire Notre Dame du Rosaire',
        address: process.env.EMAIL_USER_CYR
      },
      to: reservation.email,
      subject: 'Confirmation de paiement - Sanctuaire Notre Dame du Rosaire',
      html: emailContent
    });

    console.log('Email de confirmation de paiement envoyé avec succès:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation de paiement:', error);
    return false;
  }
}

export default async function handler(req, res) {
  console.log('API - Méthode reçue:', req.method);

  // Connexion à MongoDB si nécessaire
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI)
  }

  try {
    switch (req.method) {
      case 'GET':
        const reservations = await modelReservation.find({})
          .sort({ from: -1 })
        return res.status(200).json(reservations)

      case 'POST':
        console.log('API - POST - Création d\'une nouvelle réservation');
        try {
          const newReservation = await modelReservation.create(req.body.reservation);
          console.log('API - POST - Réservation créée avec succès');
          
          // Envoyer l'email de confirmation
          await sendConfirmationEmail(newReservation.toObject());
          
          return res.status(201).json(newReservation);
        } catch (createError) {
          console.error('API - POST - Erreur lors de la création:', createError);
          return res.status(400).json({ 
            message: 'Erreur lors de la création de la réservation',
            error: createError.message
          });
        }
      case 'PUT':
        const { id } = req.query;
        if (req.body.action === 'validatePayment') {
          const reservation = await modelReservation.findById(id);
          if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
          reservation.avance_payee = true;
          reservation.isValidated = true;
          await sendPaymentConfirmationEmail(reservation);
          const updatedReservation = await reservation.save();
          return res.status(200).json(updatedReservation);
        }
        const updatedReservation = await modelReservation.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedReservation) return res.status(404).json({ message: 'Réservation non trouvée' })
        return res.status(200).json(updatedReservation)
      case 'DELETE':
        const deletedReservation = await modelReservation.findByIdAndDelete(req.query.id)
        if (!deletedReservation) return res.status(404).json({ message: 'Réservation non trouvée' })
        return res.status(200).json({ message: 'Réservation supprimée avec succès' })
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).json({ message: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('API - Erreur générale:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

