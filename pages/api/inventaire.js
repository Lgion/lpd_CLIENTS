import dbConnect from './lib/dbConnect';
import modelInventaire from './_/models/Inventaire';

const initialInventaire = [
  {
    nom: "Chaises empilables VIP (Salle d'accueil)",
    categorie: "mobilier",
    quantite: 50,
    etat: "bon",
    localisation: "Grande Salle d'Accueil",
    prix_acquisition: 15000,
    notes: "Chaises en PVC tressé résistant avec accoudoirs"
  },
  {
    nom: "Tondeuse à gazon thermique Honda",
    categorie: "jardinage",
    quantite: 2,
    etat: "bon",
    localisation: "Garage & Espaces Verts",
    prix_acquisition: 350000,
    notes: "Moteur 4 temps, révisée en Juillet 2026"
  },
  {
    nom: "Groupe électrogène Caterpillar 15 kVA",
    categorie: "electricite",
    quantite: 1,
    etat: "a_reparer",
    localisation: "Local Technique Général",
    prix_acquisition: 2500000,
    notes: "Souci d'alternateur, pièces commandées"
  },
  {
    nom: "Climatiseurs Split Inverter 2.5 CV",
    categorie: "electricite",
    quantite: 8,
    etat: "bon",
    localisation: "Pavillon des Pères & Secrétariat",
    prix_acquisition: 280000,
    notes: "Marque Samsung Eco-Inverter"
  },
  {
    nom: "Matelas Mousse Haute Densité (2 places)",
    categorie: "literie",
    quantite: 40,
    etat: "usage",
    localisation: "Dortoirs Pèlerins A & B",
    prix_acquisition: 45000,
    notes: "Housses lavables intégrées"
  },
  {
    nom: "Fourneau à gaz professionnel 4 feux",
    categorie: "cuisine",
    quantite: 2,
    etat: "bon",
    localisation: "Grande Cuisine Communautaire",
    prix_acquisition: 450000,
    notes: "Inox alimentaire avec four à convecteur"
  },
  {
    nom: "Autel en bois massif sculpté",
    categorie: "liturgique",
    quantite: 1,
    etat: "neuf",
    localisation: "Chapelle Principale Notre-Dame",
    prix_acquisition: 850000,
    notes: "Bois d'iroko sculpté à la main"
  },
  {
    nom: "Système de Sonorisation (Enceintes + Micro HF)",
    categorie: "informatique",
    quantite: 1,
    etat: "bon",
    localisation: "Espace de Prière Extérieur",
    prix_acquisition: 650000,
    notes: "2 enceintes amplifiées Yamaha + table de mixage"
  },
  {
    nom: "Extincteurs à poudre ABC 6kg",
    categorie: "securite",
    quantite: 12,
    etat: "neuf",
    localisation: "Couloirs, Cuisine & Dortoirs",
    prix_acquisition: 35000,
    notes: "Contrôle annuel valide jusqu'en 2027"
  },
  {
    nom: "Pompe immergée de forage eau potable",
    categorie: "plomberie",
    quantite: 1,
    etat: "hors_service",
    localisation: "Puits de Forage Est",
    prix_acquisition: 420000,
    notes: "Moteur grillé suite surtension"
  }
];

export default async function handler(req, res) {
  await dbConnect();

  const { method, query, body } = req;
  const { id, categorie, etat } = query;

  try {
    switch (method) {
      case 'GET': {
        let items = await modelInventaire.find({}).sort({ createdAt: -1 });

        // Auto-seed si la base est vide
        if (items.length === 0) {
          console.log('Seeding initial Inventaire items...');
          items = await modelInventaire.insertMany(initialInventaire);
        }

        const filter = {};
        if (categorie && categorie !== 'all') filter.categorie = categorie;
        if (etat && etat !== 'all') filter.etat = etat;

        if (Object.keys(filter).length > 0) {
          items = await modelInventaire.find(filter).sort({ createdAt: -1 });
        }

        return res.status(200).json(items);
      }

      case 'POST': {
        const newItem = await modelInventaire.create(body);
        return res.status(201).json(newItem);
      }

      case 'PUT': {
        if (!id) {
          return res.status(400).json({ message: 'ID requis pour la modification' });
        }
        const updatedItem = await modelInventaire.findByIdAndUpdate(
          id,
          { ...body, updatedAt: Date.now() },
          { new: true }
        );
        if (!updatedItem) {
          return res.status(404).json({ message: 'Équipement non trouvé' });
        }
        return res.status(200).json(updatedItem);
      }

      case 'DELETE': {
        if (!id) {
          return res.status(400).json({ message: 'ID requis pour la suppression' });
        }
        const deletedItem = await modelInventaire.findByIdAndDelete(id);
        if (!deletedItem) {
          return res.status(404).json({ message: 'Équipement non trouvé' });
        }
        return res.status(200).json({ message: 'Équipement supprimé avec succès' });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Méthode ${method} non autorisée` });
    }
  } catch (error) {
    console.error('Erreur API Inventaire:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}
