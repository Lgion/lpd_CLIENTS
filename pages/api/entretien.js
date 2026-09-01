import dbConnect from './lib/dbConnect';
import modelEntretien from './_/models/Entretien';

const initialEntretiens = [
  {
    titre: "Dépannage & Vidange Groupe Électrogène 15 kVA",
    categorie: "entretien",
    priorite: "urgente",
    statut: "en_cours",
    description: "Diagnostic de l'alternateur, remplacement des filtres à huile et à carburant",
    cout_estime: 180000,
    cout_reel: 0,
    responsable: "M. Gaston",
    fournisseur: "Ets Élec-Abidjan",
    notes: "Intervention en cours depuis lundi"
  },
  {
    titre: "Réparation de la fuite de toiture Dortoir B",
    categorie: "reparation",
    priorite: "haute",
    statut: "planifie",
    description: "Remplacement de 15 tôles ondulées endommagées par les récentes intempéries",
    cout_estime: 250000,
    cout_reel: 0,
    responsable: "P. Gilbert",
    fournisseur: "SODEBAT CI",
    notes: "Chantier prévu le week-end prochain"
  },
  {
    titre: "Remplacement de la pompe de forage eau potable",
    categorie: "reparation",
    priorite: "urgente",
    statut: "en_cours",
    description: "Achat et installation d'une nouvelle pompe immergée 2.2kW avec coffret de protection électrique",
    cout_estime: 450000,
    cout_reel: 420000,
    responsable: "M. Gaston",
    fournisseur: "Hydro-Service Adzopé",
    notes: "Livraison de la pompe prévue sous 24h"
  },
  {
    titre: "Rénovation & Peinture de la Chapelle Notre-Dame",
    categorie: "renovation",
    priorite: "normale",
    statut: "termine",
    description: "Nettoyage des façades intérieures/extérieures et application de 2 couches de peinture acrylique",
    cout_estime: 600000,
    cout_reel: 580000,
    responsable: "P. Gilbert",
    fournisseur: "Déco Peinture CI",
    notes: "Travaux terminés avec succès pour la fête patronale"
  },
  {
    titre: "Recharge & Révision des 12 Extincteurs du Sanctuaire",
    categorie: "entretien",
    priorite: "normale",
    statut: "termine",
    description: "Vérification annuelle de la pression et renouvellement de la poudre extinctrice ABC",
    cout_estime: 120000,
    cout_reel: 120000,
    responsable: "M. Gaston",
    fournisseur: "SécuriFeu CI",
    notes: "Vignettes de conformité apposées"
  }
];

export default async function handler(req, res) {
  await dbConnect();

  const { method, query, body } = req;
  const { id, statut, categorie, priorite } = query;

  try {
    switch (method) {
      case 'GET': {
        let entretiens = await modelEntretien.find({}).sort({ date_planification: -1 });

        // Auto-seed si la base est vide
        if (entretiens.length === 0) {
          console.log('Seeding initial Entretien items...');
          entretiens = await modelEntretien.insertMany(initialEntretiens);
        }

        const filter = {};
        if (statut && statut !== 'all') filter.statut = statut;
        if (categorie && categorie !== 'all') filter.categorie = categorie;
        if (priorite && priorite !== 'all') filter.priorite = priorite;

        if (Object.keys(filter).length > 0) {
          entretiens = await modelEntretien.find(filter).sort({ date_planification: -1 });
        }

        return res.status(200).json(entretiens);
      }

      case 'POST': {
        const newEntretien = await modelEntretien.create(body);
        return res.status(201).json(newEntretien);
      }

      case 'PUT': {
        if (!id) {
          return res.status(400).json({ message: 'ID requis pour la modification' });
        }
        const updatedEntretien = await modelEntretien.findByIdAndUpdate(
          id,
          { ...body, updatedAt: Date.now() },
          { new: true }
        );
        if (!updatedEntretien) {
          return res.status(404).json({ message: 'Entretien non trouvé' });
        }
        return res.status(200).json(updatedEntretien);
      }

      case 'DELETE': {
        if (!id) {
          return res.status(400).json({ message: 'ID requis pour la suppression' });
        }
        const deletedEntretien = await modelEntretien.findByIdAndDelete(id);
        if (!deletedEntretien) {
          return res.status(404).json({ message: 'Entretien non trouvé' });
        }
        return res.status(200).json({ message: 'Entretien supprimé avec succès' });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Méthode ${method} non autorisée` });
    }
  } catch (error) {
    console.error('Erreur API Entretien:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}
