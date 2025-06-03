// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import modelReservation from './_/models/Reservation';
import mongoose from 'mongoose';

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
      montant_total, montant_avance
    } = req.body;
    // Validation rapide
    if (!names || !phone_number || !from || !to || !participants || !montant_total || !montant_avance) {
      return res.status(400).json({ success: false, message: 'Champs obligatoires manquants.' });
    }
    const reservation = await modelReservation.create({
      names,
      phone_number,
      email,
      from: new Date(from),
      to: new Date(to),
      participants,
      individual_room_participants,
      message,
      type_reservation,
      meal_included,
      montant_total,
      montant_avance,
      avance_payee: false,
      isValidated: false,
      isArchived: false,
      deletedAt: null,
      community: '0',
    });
    return res.status(201).json({ success: true, reservation });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
