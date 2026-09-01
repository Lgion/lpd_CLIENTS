# SPEC_05 — Admin Sanctuaire : Inventaire du Matériel & Frais d'Entretien

## Contexte
Le sanctuaire dispose d'équipements et de matériel nécessitant un suivi rigoureux : meubles, outils de jardinage, matériel de cuisine, équipements électriques, plomberie, etc. Deux composants sont nécessaires :
1. **Inventaire du matériel** : Catalogue de tout le matériel disponible
2. **Suivi des réparations/entretiens** : Historique catégorisé et chiffré des travaux effectués ou planifiés

---

## Architecture

### Nouveaux fichiers
```
pages/api/_/models/Inventaire.js        ← Modèle Mongoose
pages/api/_/models/Entretien.js         ← Modèle Mongoose
pages/api/inventaire.js                 ← API CRUD inventaire
pages/api/entretien.js                  ← API CRUD entretien
app/admin/sanctuaire/inventaire.jsx     ← Composant inventaire (importé dans page.jsx)
app/admin/sanctuaire/entretien.jsx      ← Composant entretien (importé dans page.jsx)
```

---

## 1. Modèle Mongoose — Inventaire

```js
// pages/api/_/models/Inventaire.js
import mongoose from 'mongoose';

const InventaireSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  categorie: { 
    type: String, 
    required: true,
    enum: [
      'mobilier',        // Tables, chaises, lits, armoires
      'cuisine',         // Ustensiles, réfrigérateurs, fourneaux
      'jardinage',       // Outils de jardinage, tondeuse
      'electricite',     // Groupes électrogènes, câblages
      'plomberie',       // Pompes, tuyaux, robinets
      'literie',         // Draps, couvertures, oreillers, moustiquaires
      'nettoyage',       // Produits d'entretien, balais
      'liturgique',      // Objets de culte, autels
      'securite',        // Extincteurs, lampes de secours
      'informatique',    // Ordinateurs, imprimantes
      'autre'
    ]
  },
  description: { type: String },
  quantite: { type: Number, required: true, default: 1 },
  etat: { 
    type: String, 
    enum: ['neuf', 'bon', 'usage', 'a_reparer', 'hors_service'],
    default: 'bon'
  },
  localisation: { type: String },       // Ex: "Dortoir A", "Cuisine", "Chapelle"
  date_acquisition: { type: Date },
  prix_acquisition: { type: Number },    // En FCFA
  photo: { type: String },               // URL de la photo (optionnel)
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Inventaire || mongoose.model('Inventaire', InventaireSchema);
```

---

## 2. Modèle Mongoose — Entretien

```js
// pages/api/_/models/Entretien.js
import mongoose from 'mongoose';

const EntretienSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  categorie: {
    type: String,
    required: true,
    enum: [
      'reparation',       // Réparation d'un équipement existant
      'entretien',        // Entretien préventif courant
      'renovation',       // Travaux de rénovation
      'achat',            // Achat de nouveau matériel
      'construction',     // Travaux de construction
      'autre'
    ]
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
  description: { type: String, required: true },
  cout_estime: { type: Number },         // Devis en FCFA
  cout_reel: { type: Number },           // Coût final après travaux
  date_planification: { type: Date, default: Date.now },
  date_realisation: { type: Date },
  responsable: { type: String },         // Nom de la personne en charge
  fournisseur: { type: String },         // Artisan / entreprise
  inventaire_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventaire' }, // Lien optionnel
  photos_avant: [{ type: String }],      // URLs
  photos_apres: [{ type: String }],      // URLs
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Entretien || mongoose.model('Entretien', EntretienSchema);
```

---

## 3. API CRUD

### `pages/api/inventaire.js`
```
GET    /api/inventaire              → Liste tout l'inventaire (avec filtrage par categorie/etat en query)
POST   /api/inventaire              → Créer un item
PUT    /api/inventaire?id=xxx       → Modifier un item
DELETE /api/inventaire?id=xxx       → Supprimer un item
```

### `pages/api/entretien.js`
```
GET    /api/entretien               → Liste tous les entretiens (avec filtrage par statut/categorie)
POST   /api/entretien               → Créer un entretien
PUT    /api/entretien?id=xxx        → Modifier un entretien
DELETE /api/entretien?id=xxx        → Supprimer un entretien
```

---

## 4. Composant UI — Inventaire

### Fonctionnalités
- **Tableau filtrable** par catégorie, état, localisation
- **Barre de recherche** textuelle
- **Badge d'état** coloré (vert=neuf/bon, jaune=usagé, rouge=hors_service/à_réparer)
- **Modal de création/édition** avec upload de photo
- **Compteurs résumés** : Total items, Items à réparer, Valeur totale estimée

### Structure visuelle
```
┌─────────────────────────────────────────────────┐
│  📦 INVENTAIRE DU MATÉRIEL                      │
├────────────┬────────────┬──────────────────────┤
│ 142 items  │ 8 à réparer│ Valeur: 3 500 000 F  │
├────────────┴────────────┴──────────────────────┤
│ [Recherche...]  [Catégorie ▼]  [État ▼]        │
│ [+ Ajouter un équipement]                      │
├────────────────────────────────────────────────┤
│  Nom         │ Cat.    │ Qté │ État  │ Lieu    │
│  Chaises     │ Mobilier│  25 │ 🟢Bon │ Salle A │
│  Tondeuse    │ Jardin  │   1 │ 🔴Rep │ Garage  │
│  ...         │ ...     │ ... │ ...   │ ...     │
└────────────────────────────────────────────────┘
```

---

## 5. Composant UI — Suivi des Entretiens & Réparations

### Fonctionnalités
- **Vue chronologique** des travaux (planifiés → en cours → terminés)
- **Filtrage** par catégorie, priorité, statut
- **Calcul automatique** du budget total engagé vs budget réel
- **Lien optionnel** avec un item de l'inventaire
- **Photos avant/après** pour documenter les travaux

### Structure visuelle
```
┌──────────────────────────────────────────────────┐
│  🔧 SUIVI DES RÉPARATIONS & ENTRETIENS          │
├──────────┬──────────┬──────────┬────────────────┤
│ 12 total │ 3 en     │ Budget   │ Budget réel    │
│          │ cours    │ estimé   │                │
│          │          │ 850 000F │ 720 000F       │
├──────────┴──────────┴──────────┴────────────────┤
│ [+ Nouveau devis/réparation]                    │
│ [Statut ▼]  [Catégorie ▼]  [Priorité ▼]        │
├────────────────────────────────────────────────┤
│  🔴 URGENT  Toiture fuite salle B              │
│     Statut: En cours | Devis: 250 000 F        │
│     Artisan: M. Koné | Date: 15/09/2026        │
│                                                │
│  🟡 NORMAL  Remplacement 5 matelas dortoir     │
│     Statut: Planifié | Devis: 125 000 F        │
│     ...                                        │
└────────────────────────────────────────────────┘
```

---

## 6. Intégration dans `page.jsx`

### Système d'onglets
Ajouter un système d'onglets en haut de la page `app/admin/sanctuaire/page.jsx` :

```jsx
const [activeTab, setActiveTab] = useState('reservations');

// Dans le return :
<div className="sanctuaire-admin__tabs">
  <button 
    className={activeTab === 'reservations' ? 'active' : ''} 
    onClick={() => setActiveTab('reservations')}
  >
    📅 Réservations
  </button>
  <button 
    className={activeTab === 'inventaire' ? 'active' : ''} 
    onClick={() => setActiveTab('inventaire')}
  >
    📦 Inventaire
  </button>
  <button 
    className={activeTab === 'entretien' ? 'active' : ''} 
    onClick={() => setActiveTab('entretien')}
  >
    🔧 Entretiens
  </button>
</div>

{activeTab === 'reservations' && /* contenu existant */}
{activeTab === 'inventaire' && <InventaireManager />}
{activeTab === 'entretien' && <EntretienManager />}
```

---

## Checklist de validation
- [ ] L'inventaire permet le CRUD complet avec catégorisation
- [ ] Les badges d'état sont visuellement distincts
- [ ] Le suivi d'entretien affiche le delta budget estimé vs réel
- [ ] La navigation par onglets n'interfère pas avec le tableau des réservations
- [ ] Les photos d'inventaire et de travaux peuvent être uploadées via `/api/upload`
- [ ] Les données persistent en MongoDB (collections `inventaires` et `entretiens`)
