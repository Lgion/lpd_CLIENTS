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

async function sendPaymentConfirmationEmail(reservation) {
  try {
    // Vérifier la connexion SMTP
    await transporter.verify();
    
    // Préparer le contenu de l'email
    const emailContent = `
      <h2>Confirmation de paiement - Sanctuaire Notre Dame du Rosaire</h2>
      <p>Bonjour,</p>
      <p>Nous confirmons la réception de votre paiement d'avance de ${reservation.montant_avance} FCFA pour votre réservation.</p>
      
      <h3>Rappel des détails de la réservation :</h3>
      <ul>
        <li>Date d'arrivée : ${new Date(reservation.from).toLocaleDateString()}</li>
        <li>Date de départ : ${new Date(reservation.to).toLocaleDateString()}</li>
        <li>Nombre de participants : ${reservation.participants}</li>
      </ul>

      <h3>Paiement :</h3>
      <ul>
        <li>Montant total : ${reservation.montant_total} FCFA</li>
        <li>Avance payée : ${reservation.montant_avance} FCFA</li>
        <li>Reste à payer sur place : ${reservation.montant_total - reservation.montant_avance} FCFA</li>
      </ul>

      <p>Votre réservation est maintenant <strong>confirmée</strong>.</p>
      
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
        address: process.env.SMTP2GO_USER
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
  console.log('API - Corps de la requête:', req.body);

  // Connexion à MongoDB si nécessaire
  if (mongoose.connection.readyState !== 1) {
    console.log('API - Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('API - Connecté à MongoDB');
  }

  try {
    switch (req.method) {
      case 'GET':
        // Récupérer toutes les réservations
        console.log('API - GET - Récupération des réservations');
        const reservations = await modelReservation.find({})
          .sort({ from: -1 }) // Trier par date décroissante
        return res.status(200).json(reservations)

      case 'POST':
        // Créer une nouvelle réservation
        console.log('API - POST - Création d\'une nouvelle réservation');
        console.log('API - POST - Données reçues:', req.body);
        
        try {
          const newReservation = await modelReservation.create(req.body.reservation);
          console.log('API - POST - Réservation créée avec succès:', newReservation);
          
          return res.status(200).json({blablabla: "msg temporaire"});
          // Envoyer l'email de confirmation
          const tmp = await sendConfirmationEmail({
            ...newReservation.toObject(),
            email: req.body.reservation.email
          });
          
          return res.status(201).json(newReservation);
        } catch (createError) {
          console.error('API - POST - Erreur lors de la création:', createError);
          return res.status(400).json({ 
            message: 'Erreur lors de la création de la réservation',
            error: createError.message,
            details: createError
          });
        }

      case 'PUT':
        // Modifier une réservation existante
        console.log('API - PUT - Modification d\'une réservation');
        const { id } = req.query;
        
        // Vérifier si c'est une validation de paiement
        if (req.body.action === 'validatePayment') {
          const reservation = await modelReservation.findById(id);
          if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
          }
          
          // Mettre à jour le statut de paiement
          reservation.avance_payee = true;
          reservation.isValidated = true;
          
          // Envoyer un email de confirmation de paiement
          await sendPaymentConfirmationEmail(reservation);
          
          const updatedReservation = await reservation.save();
          return res.status(200).json(updatedReservation);
        }
        
        // Modification normale de la réservation
        const updatedReservation = await modelReservation.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );
        if (!updatedReservation) {
          return res.status(404).json({ message: 'Réservation non trouvée' })
        }
        return res.status(200).json(updatedReservation)

      case 'DELETE':
        // Supprimer une réservation
        console.log('API - DELETE - Suppression d\'une réservation');
        const deletedReservation = await modelReservation.findByIdAndDelete(req.query.id)
        if (!deletedReservation) {
          return res.status(404).json({ message: 'Réservation non trouvée' })
        }
        return res.status(200).json({ message: 'Réservation supprimée avec succès' })

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).json({ message: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error('API - Erreur générale:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
