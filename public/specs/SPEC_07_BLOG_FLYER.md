# SPEC_07 — Blog : Générateur de Flyers Marketing & Blog IA Modulaire

## Contexte
Deux fonctionnalités sont requises sur la section `/blog` :
1. **Générateur de flyers** : Un composant permettant de créer des visuels promotionnels (flyers, affiches) pour le sanctuaire, le e-commerce et l'école.
2. **Blog IA modulaire** : Finaliser le composant de blog assisté par IA pour le rendre facilement réutilisable dans d'autres projets.

---

## PARTIE A — Générateur de Flyers Marketing

### Architecture

#### Nouveaux fichiers
```
app/blog/flyer/page.jsx                 ← Page principale du générateur
app/blog/flyer/FlyerEditor.jsx          ← Composant éditeur de flyer
app/blog/flyer/FlyerTemplates.js        ← Templates prédéfinis
app/blog/flyer/flyer.scss               ← Styles
pages/api/flyer.js                      ← API de sauvegarde/génération
```

### Navigation
Accessible depuis la page `/blog` via un bouton visible uniquement pour les admins :
```jsx
// Dans app/blog/page.jsx, après le bouton "Nouvel Article" :
{isAdmin && (
  <Link href="/blog/flyer" className="flyer-btn">
    🎨 Créer un Flyer
  </Link>
)}
```

### Fonctionnalités du Générateur

#### Canvas de création
- **Zone d'édition** basée sur HTML Canvas ou SVG (dimensions A4/A5/carré Instagram/Story)
- **Éléments éditables** :
  - Texte (titre, sous-titre, corps) avec polices, tailles, couleurs
  - Images (upload + bibliothèque d'images existantes du site)
  - Formes (rectangles, cercles, lignes) pour la décoration
  - Fond (couleur unie, dégradé, ou image)
- **Templates prédéfinis** par catégorie :
  - `sanctuaire` : Template de retraite spirituelle
  - `ecommerce` : Template de promotion produit
  - `ecole` : Template d'annonce école
  - `evenement` : Template d'événement/célébration

#### Formats d'export
- PNG haute résolution (pour impression)
- JPEG optimisé (pour partage WhatsApp/réseaux sociaux)
- PDF (pour impression professionnelle)

### Templates prédéfinis

```js
// app/blog/flyer/FlyerTemplates.js
export const templates = [
  {
    id: 'retraite_weekend',
    name: 'Retraite de Weekend',
    category: 'sanctuaire',
    dimensions: { width: 1080, height: 1920 }, // Story format
    elements: [
      { type: 'rect', x: 0, y: 0, w: '100%', h: '40%', fill: '#1a2332' },
      { type: 'text', content: 'RETRAITE SPIRITUELLE', x: '50%', y: '15%', 
        font: '42px Arial', color: '#c9a84c', align: 'center' },
      { type: 'text', content: 'Sanctuaire NDR de Bolobi', x: '50%', y: '22%',
        font: '24px Arial', color: 'white', align: 'center' },
      { type: 'text', content: '[DATES]', x: '50%', y: '55%',
        font: '36px Arial', color: '#1a2332', align: 'center' },
      { type: 'text', content: 'Contact: 07 09 36 06 72', x: '50%', y: '90%',
        font: '20px Arial', color: '#666', align: 'center' },
    ]
  },
  {
    id: 'promo_produit',
    name: 'Promotion Produit',
    category: 'ecommerce',
    dimensions: { width: 1080, height: 1080 }, // Carré Instagram
    elements: [
      // ... éléments de base
    ]
  },
  // ... autres templates
];
```

### Structure visuelle de l'éditeur
```
┌──────────────────────────────────────────────────────────────┐
│  🎨 CRÉER UN FLYER                                          │
├──────────────────────┬───────────────────────────────────────┤
│  PANNEAU OUTILS      │  ZONE DE TRAVAIL                      │
│                      │                                       │
│  📐 Format:          │  ┌───────────────────────────────┐   │
│  [Story ▼]           │  │                               │   │
│                      │  │   RETRAITE SPIRITUELLE        │   │
│  📝 Templates:       │  │                               │   │
│  [Retraite ▼]        │  │   Sanctuaire NDR de Bolobi    │   │
│                      │  │                               │   │
│  + Texte             │  │                               │   │
│  + Image             │  │   Du 15 au 17 Sept. 2026     │   │
│  + Forme             │  │                               │   │
│  + Fond              │  │                               │   │
│                      │  │   Contact: 07 09 36 06 72     │   │
│  ─────────────       │  └───────────────────────────────┘   │
│  Propriétés:         │                                       │
│  Police: [Arial ▼]   │  [📥 Télécharger PNG]                │
│  Taille: [42px]      │  [📄 Télécharger PDF]                │
│  Couleur: [#c9a84c]  │  [📱 Format WhatsApp]                │
│                      │                                       │
├──────────────────────┴───────────────────────────────────────┤
│  Flyers récents : [Flyer 1] [Flyer 2] [Flyer 3]            │
└──────────────────────────────────────────────────────────────┘
```

---

## PARTIE B — Blog IA Modulaire

### Objectif
Rendre le composant Blog existant (`app/blog/page.jsx`) portable et réutilisable dans d'autres projets Next.js avec un minimum de configuration.

### Architecture de modularisation

#### Structure du package exportable
```
lib/blog/
├── BlogModule.jsx          ← Composant principal (point d'entrée)
├── BlogPost.jsx            ← Affichage d'un article
├── BlogCategory.jsx        ← Liste des articles par catégorie
├── BlogForm.jsx            ← Formulaire de création/édition
├── BlogProvider.jsx        ← Context provider avec API hooks
├── blog.scss               ← Styles autonomes
├── index.js                ← Export principal
└── README.md               ← Documentation d'utilisation
```

#### API du composant
```jsx
// Utilisation dans un autre projet :
import { BlogModule } from '@/lib/blog';

<BlogModule 
  apiEndpoint="/api/posts"          // URL de l'API CRUD
  uploadEndpoint="/api/upload"      // URL pour l'upload d'images
  isAdmin={isAdmin}                 // Contrôle d'accès
  categories={['sanctuaire', 'actualités', 'spiritualité']}
  theme={{
    primaryColor: '#c9a84c',
    headerTitle: 'Blog du Sanctuaire'
  }}
/>
```

### Fonctionnalités IA à finaliser
Le blog actuel permet la création manuelle d'articles. Les améliorations IA suivantes doivent être ajoutées :

1. **Génération de contenu** : Bouton "✨ Générer avec l'IA" dans le formulaire qui :
   - Prend le titre en entrée
   - Génère un brouillon d'article (excerpt + contenu)
   - Utilise une API externe (OpenAI, Claude, ou similaire) via un endpoint backend
   
2. **Suggestions de tags/catégories** : Analyse automatique du contenu pour suggérer des catégories

3. **Correction/amélioration** : Bouton pour reformuler/corriger le contenu existant

### Nouveau endpoint API pour l'IA
```
pages/api/blog_ai.js
```

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { action, title, content } = req.body;
  
  // Proxy vers une API IA (à configurer)
  // Variable d'environnement : AI_API_KEY
  
  switch(action) {
    case 'generate':
      // Générer un article à partir du titre
      break;
    case 'improve':
      // Améliorer un contenu existant
      break;
    case 'suggest_category':
      // Suggérer une catégorie
      break;
  }
}
```

---

## Checklist de validation
- [ ] Le générateur de flyers est accessible depuis `/blog/flyer` (admin only)
- [ ] Au moins 3 templates prédéfinis sont disponibles (sanctuaire, ecommerce, école)
- [ ] L'export PNG et PDF fonctionne
- [ ] Le composant Blog est extrait dans `lib/blog/` avec une API claire
- [ ] Le `BlogModule` peut être importé avec un minimum de props
- [ ] Les styles du blog sont autonomes (pas de dépendance aux styles globaux du projet)
- [ ] Le bouton "Générer avec l'IA" produit un brouillon exploitable
