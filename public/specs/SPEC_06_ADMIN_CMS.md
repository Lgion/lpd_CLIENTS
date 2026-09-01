# SPEC_06 — Accueil Admin : CMS de Personnalisation des Pages

## Contexte
L'administrateur doit pouvoir modifier les contenus principaux des pages publiques (titre, slogan, logo, images, paragraphes) directement depuis la page d'accueil de l'administration (`/admin`), sans intervention technique.

---

## Fichier principal impacté
- `app/admin/page.jsx` — Accueil du dashboard admin

---

## 1. Modèle de Données — Configuration des Pages

### Nouveau modèle Mongoose
```
pages/api/_/models/PageConfig.js
```

```js
import mongoose from 'mongoose';

const PageConfigSchema = new mongoose.Schema({
  pageId: { 
    type: String, 
    required: true, 
    unique: true,
    enum: [
      'home',           // Page d'accueil publique
      'sanctuaire',     // Page retraites spirituelles
      'blog',           // Page blog
      'ecommerce',      // Page boutique (si existante)
    ]
  },
  titre: { type: String },
  sousTitre: { type: String },
  slogan: { type: String },
  logo: { type: String },            // URL du logo
  heroImage: { type: String },       // URL image principale/bannière
  paragraphes: [{
    ordre: { type: Number },
    titre: { type: String },
    contenu: { type: String },       // Supporte le Markdown
    image: { type: String },         // URL image optionnelle
  }],
  metaTitle: { type: String },       // SEO
  metaDescription: { type: String }, // SEO
  couleurPrincipale: { type: String, default: '#c9a84c' },
  couleurSecondaire: { type: String, default: '#1a2332' },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String },       // Email de l'admin qui a modifié
});

export default mongoose.models.PageConfig || mongoose.model('PageConfig', PageConfigSchema);
```

---

## 2. API Endpoint

### Nouveau fichier
```
pages/api/page_config.js
```

```
GET    /api/page_config?pageId=home    → Récupérer la config d'une page
PUT    /api/page_config?pageId=home    → Mettre à jour la config
POST   /api/page_config                → Créer une config initiale (seed)
```

---

## 3. Composant CMS dans l'Accueil Admin

### Nouveau composant
```
app/admin/components/PageEditor.jsx
```

### Fonctionnalités
- **Sélection de la page** à modifier via un dropdown
- **Formulaire d'édition** avec :
  - Input texte pour titre, sous-titre, slogan
  - Upload d'image pour logo et hero image (via `/api/upload`)
  - Éditeur de paragraphes (ajout/suppression/réordonnement drag-and-drop)
  - Textarea Markdown pour les contenus riches
  - Inputs couleur pour les couleurs principales
- **Prévisualisation en direct** du rendu
- **Bouton de sauvegarde** avec feedback visuel

### Structure visuelle
```
┌──────────────────────────────────────────────────────────┐
│  🎨 PERSONNALISER LES PAGES DU SITE                     │
├──────────────────────────────────────────────────────────┤
│  Page à modifier : [Page d'accueil ▼]                   │
├───────────────────────┬──────────────────────────────────┤
│  ÉDITEUR              │  APERÇU EN DIRECT                │
│                       │                                  │
│  Titre:               │  ┌──────────────────────────┐   │
│  [_______________]    │  │ SANCTUAIRE NOTRE DAME    │   │
│                       │  │ DU ROSAIRE DE BOLOBI     │   │
│  Slogan:              │  │                          │   │
│  [_______________]    │  │ "Votre havre de paix..." │   │
│                       │  │                          │   │
│  Logo: [Upload 📁]    │  │ [Image bannière]         │   │
│  Image: [Upload 📁]   │  └──────────────────────────┘   │
│                       │                                  │
│  Paragraphes:         │                                  │
│  ┌─ §1 ─────────────┐│                                  │
│  │ Titre: [_______]  ││                                  │
│  │ Contenu: [____]   ││                                  │
│  │ [🗑️] [↑] [↓]     ││                                  │
│  └───────────────────┘│                                  │
│  [+ Ajouter paragr.]  │                                  │
│                       │                                  │
│  [💾 Sauvegarder]     │                                  │
├───────────────────────┴──────────────────────────────────┤
│  Dernière modification : 31/08/2026 par hi.cyril@...     │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Consommation côté Frontend Public

### Hook personnalisé
```
utils/usePageConfig.js
```

```js
import { useState, useEffect } from 'react';

export function usePageConfig(pageId) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/page_config?pageId=${pageId}`)
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pageId]);
  
  return { config, loading };
}
```

### Utilisation dans les pages publiques
```jsx
// Dans app/retraites-spirituelles-bolobi/page.jsx :
const { config } = usePageConfig('sanctuaire');

// Puis utiliser config.titre, config.slogan, config.heroImage, etc.
// Avec fallback sur les valeurs statiques actuelles
```

---

## 5. Intégration dans `app/admin/page.jsx`

Ajouter le composant `PageEditor` dans la page d'accueil admin, après le bloc des statistiques existant :

```jsx
import PageEditor from './components/PageEditor';

// Dans le return, après </div> du content-grid :
<section className="admin-dashboard__section admin-dashboard__section--full">
  <PageEditor />
</section>
```

---

## Considérations de sécurité
- L'API `page_config` ne doit être modifiable que si l'utilisateur est authentifié et admin
- Valider les inputs pour éviter l'injection XSS dans les contenus Markdown
- Limiter la taille des uploads d'images

---

## Checklist de validation
- [ ] L'éditeur CMS est accessible depuis la page d'accueil admin
- [ ] Modification du titre, sous-titre, slogan et images fonctionne
- [ ] L'ajout/suppression/réordonnement des paragraphes fonctionne
- [ ] La prévisualisation en direct reflète les changements
- [ ] Les pages publiques utilisent les configs sauvegardées (avec fallback)
- [ ] Les uploads d'images passent par l'API `/api/upload` existante
- [ ] La dernière date de modification est affichée
