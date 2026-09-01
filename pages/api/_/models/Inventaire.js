const mongoose = require('mongoose');

const InventaireSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  categorie: { 
    type: String, 
    required: true,
    enum: [
      'mobilier',
      'cuisine',
      'jardinage',
      'electricite',
      'plomberie',
      'literie',
      'nettoyage',
      'liturgique',
      'securite',
      'informatique',
      'autre'
    ],
    default: 'autre'
  },
  description: { type: String, default: '' },
  quantite: { type: Number, required: true, default: 1 },
  etat: { 
    type: String, 
    enum: ['neuf', 'bon', 'usage', 'a_reparer', 'hors_service'],
    default: 'bon'
  },
  localisation: { type: String, default: '' },
  date_acquisition: { type: Date, default: Date.now },
  prix_acquisition: { type: Number, default: 0 },
  photo: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const modelInventaire = !mongoose.modelNames().includes('Inventaire_PDA')
  ? mongoose.model('Inventaire_PDA', InventaireSchema)
  : mongoose.model('Inventaire_PDA');

module.exports = modelInventaire;
