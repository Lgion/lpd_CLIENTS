import dbConnect from './lib/dbConnect';
import modelPageConfig from './_/models/PageConfig';

const initialConfigs = {
  home: {
    pageId: 'home',
    titre: "SANCTUAIRE NOTRE-DAME DU ROSAIRE DE BOLOBI",
    sousTitre: "HAVRE DE PAIX ET DE PRIÈRE À ADZOPÉ",
    slogan: "« Venez à moi, vous tous qui meinez et ployez sous le fardeau, et moi je vous soulagerai »",
    logo: "/images/logo-sanctuaire.png",
    heroImage: "/images/hero-bolobi.jpg",
    paragraphes: [
      {
        ordre: 1,
        titre: "Un Lieu Saint de Grâce et de Recueillement",
        contenu: "Implanté au cœur de la verdure à Bolobi, le Sanctuaire Notre-Dame du Rosaire offre un cadre privilégié pour les retraites spirituelles, le recueillement individuel et les pèlerinages de groupes.",
        image: "/images/sanctuaire-vue.jpg"
      },
      {
        ordre: 2,
        titre: "Hébergement et Restauration pour vos Retraites",
        contenu: "Nous accueillons les pèlerins dans des conditions confortables avec une capacité totale de 220 à 250 places, des chambres individuelles et un service de restauration adapté.",
        image: "/images/hebergement.jpg"
      }
    ],
    metaTitle: "Sanctuaire Notre-Dame du Rosaire de Bolobi - Adzopé",
    metaDescription: "Portail officiel du Sanctuaire Notre-Dame du Rosaire de Bolobi à Adzopé. Retraites spirituelles, hébergement et prière.",
    couleurPrincipale: "#c9a84c",
    couleurSecondaire: "#1a2332"
  },
  sanctuaire: {
    pageId: 'sanctuaire',
    titre: "RETRAITES SPIRITUELLES ET SÉJOURS DE PRIÈRE",
    sousTitre: "SANCTUAIRE NOTRE-DAME DE BOLOBI",
    slogan: "Réservez votre séjour de ressourcement spirituel",
    logo: "/images/logo-sanctuaire.png",
    heroImage: "/images/hero-retraite.jpg",
    paragraphes: [
      {
        ordre: 1,
        titre: "Formules de Retraites Adaptées",
        contenu: "Que vous veniez en groupe de prière, en famille ou pour un repos individuel, le Sanctuaire vous propose un accompagnement et des espaces dédiés.",
        image: "/images/priere.jpg"
      }
    ],
    metaTitle: "Réservation de Retraite - Sanctuaire de Bolobi",
    metaDescription: "Réservez votre retraite spirituelle ou votre séjour au Sanctuaire Notre-Dame du Rosaire de Bolobi.",
    couleurPrincipale: "#2563eb",
    couleurSecondaire: "#0f172a"
  },
  blog: {
    pageId: 'blog',
    titre: "ACTUALITÉS ET ENSEIGNEMENTS SPIRITUELS",
    sousTitre: "LE BLOG DU SANCTUAIRE DE BOLOBI",
    slogan: "Nourrir sa foi au quotidien",
    metaTitle: "Blog & Enseignements - Sanctuaire de Bolobi",
    metaDescription: "Articles, méditations et actualités du Sanctuaire Notre-Dame du Rosaire de Bolobi.",
    couleurPrincipale: "#10b981",
    couleurSecondaire: "#064e3b"
  },
  ecommerce: {
    pageId: 'ecommerce',
    titre: "BOUTIQUE DU SANCTUAIRE",
    sousTitre: "OBJETS DE PIÉTÉ ET PRODUITS SPIRITUELS",
    slogan: "Soutenez le Sanctuaire à travers vos achats",
    metaTitle: "Boutique Officielle - Sanctuaire de Bolobi",
    metaDescription: "Rosaires, images saintes, bougies et livres spirituels du Sanctuaire de Bolobi.",
    couleurPrincipale: "#d97706",
    couleurSecondaire: "#78350f"
  }
};

export default async function handler(req, res) {
  await dbConnect();

  const { method, query, body } = req;
  const pageId = query.pageId || 'home';

  try {
    switch (method) {
      case 'GET': {
        let config = await modelPageConfig.findOne({ pageId });

        if (!config) {
          const defaultConfig = initialConfigs[pageId] || {
            pageId,
            titre: `Page ${pageId}`,
            sousTitre: "Description de la page",
            slogan: "Slogan par défaut",
            paragraphes: [],
            couleurPrincipale: "#c9a84c",
            couleurSecondaire: "#1a2332"
          };
          config = await modelPageConfig.create(defaultConfig);
        }

        return res.status(200).json(config);
      }

      case 'PUT':
      case 'POST': {
        const targetPageId = body.pageId || pageId;
        const updatedConfig = await modelPageConfig.findOneAndUpdate(
          { pageId: targetPageId },
          {
            ...body,
            pageId: targetPageId,
            updatedAt: Date.now()
          },
          { new: true, upsert: true }
        );

        return res.status(200).json(updatedConfig);
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).json({ message: `Méthode ${method} non autorisée` });
    }
  } catch (error) {
    console.error('Erreur API PageConfig:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}
