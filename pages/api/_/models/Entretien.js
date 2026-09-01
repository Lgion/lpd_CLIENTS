const mongoose = require('mongoose');

const EntretienSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  categorie: {
    type: String,
    required: true,
    enum: [
      'reparation',
      'entretien',
      'renovation',
      'achat',
      'construction',
      'autre'
    ],
    default: 'entretien'
  },
  priorite: {
    type: String,
    enum: ['basse', 'normale', 'haute', 'urgente'],
    default: 'normale'
  },
  statut: {
    type: String,
    enum: ['planifie', 'en_cours', 'termine', 'annule'],
    default: 'planifie'
  },
  description: { type: String, default: '' },
  cout_estime: { type: Number, default: 0 },
  cout_reel: { type: Number, default: 0 },
  date_planification: { type: Date, default: Date.now },
  date_realisation: { type: Date },
  responsable: { type: String, default: '' },
  fournisseur: { type: String, default: '' },
  inventaire_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventaire_PDA' },
  photos_avant: [{ type: String }],
  photos_apres: [{ type: String }],
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const modelEntretien = !mongoose.modelNames().includes('Entretien_PDA')
  ? mongoose.model('Entretien_PDA', EntretienSchema)
  : mongoose.model('Entretien_PDA');

module.exports = modelEntretien;
