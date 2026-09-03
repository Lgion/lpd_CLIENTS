const mongoose = require('mongoose');

const PageConfigSchema = new mongoose.Schema({
  pageId: { 
    type: String, 
    required: true, 
    unique: true,
    enum: [
      'home',           // Page d'accueil publique
      'sanctuaire',     // Page retraites spirituelles
      'blog',           // Page blog
      'ecommerce',      // Page boutique
    ]
  },
  titre: { type: String, default: '' },
  sousTitre: { type: String, default: '' },
  slogan: { type: String, default: '' },
  logo: { type: String, default: '' },            // URL du logo
  heroImage: { type: String, default: '' },       // URL image principale/bannière
  paragraphes: [{
    ordre: { type: Number, default: 0 },
    titre: { type: String, default: '' },
    contenu: { type: String, default: '' },       // Supporte le Markdown
    image: { type: String, default: '' },         // URL image optionnelle
  }],
  metaTitle: { type: String, default: '' },       // SEO
  metaDescription: { type: String, default: '' }, // SEO
  couleurPrincipale: { type: String, default: '#c9a84c' },
  couleurSecondaire: { type: String, default: '#1a2332' },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, default: '' },
});

const modelPageConfig = !mongoose.modelNames().includes('PageConfig_PDA')
  ? mongoose.model('PageConfig_PDA', PageConfigSchema)
  : mongoose.model('PageConfig_PDA');

module.exports = modelPageConfig;
