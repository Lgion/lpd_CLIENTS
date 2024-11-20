// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import modelReservation from './_/models/Reservation'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  // Connexion à MongoDB si nécessaire
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI)
  }

  try {
    switch (req.method) {
      case 'GET':
        // Récupérer toutes les réservations
        const reservations = await modelReservation.find({})
          .sort({ from: -1 }) // Trier par date décroissante
        return res.status(200).json(reservations)

      case 'POST':
        // Créer une nouvelle réservation
        const newReservation = await modelReservation.create(req.body)
        return res.status(201).json(newReservation)

      case 'PUT':
        // Modifier une réservation existante
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
    console.error('Erreur API réservation:', error)
    return res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}
