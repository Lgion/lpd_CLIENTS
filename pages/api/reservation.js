// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import modelReservation from './_/models/Reservation'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'

// Configurer le transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // votre adresse gmail
    pass: process.env.EMAIL_PASS  // votre mot de passe d'application gmail
    // LIEN POUR CRÉER UN MOT DE PASSE D'APPLCIATION: 
    // https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4Pv88u1tQAu32DzpYoL5lkR20vdGY_xWV6q_1gJSQViWmNd1fCrNX4CcpKMMyaHUVQEOch66VkCr0TvUj0zk8O6iUXLCMdFf33DWXQ_Ix-izoy1EPE
  }
});

async function sendConfirmationEmail(reservation) {
  try {
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
      <h3>Paiement :</h3>
      <p>Montant total : ${reservation.montant_total} FCFA</p>
      <p>Montant de l'avance à payer : ${reservation.montant_avance} FCFA</p>
      <p>Merci de votre confiance !</p>
    `;

    // Envoyer l'email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: reservation.email,
      bcc: "puissancedamour@yahoo.fr",
      subject: 'Confirmation de réservation - Sanctuaire Notre Dame du Rosaire',
      html: emailContent
    });

    console.log('Email envoyé avec succès:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
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
          
          // Envoyer l'email de confirmation
          await sendConfirmationEmail({
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
        const { id } = req.query
        const updatedReservation = await modelReservation.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        )
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
