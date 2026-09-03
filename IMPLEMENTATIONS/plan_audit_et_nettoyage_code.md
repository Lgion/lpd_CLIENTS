# Plan d'Action & Spécifications : Audit, Traque des Fichiers Morts et Optimisation du Code

## 1. Contexte & Objectifs

Le projet **lpd_sanctuaire** (développé sous Next.js avec Clerk, Mongoose et Tailwind/SCSS) a évolué en accumulant plusieurs répertoires de sauvegarde, des fichiers dupliqués (ex: `app___`, `* copy.js`, `ReserveForm_copy`), et d'éventuelles dépendances ou ressources orphelines.

Afin de garantir une base de code saine, maintenable et performante, le travail est structuré en **deux phases majeures** :
1. **Phase 1 : Traque et suppression propre de tous les fichiers morts, orphelins et obsolètes.**
2. **Phase 2 : Audit de qualité du code et plan de refactorisation / optimisation.**

---

## 2. Plan d'Action Global (Master Roadmap / TodoList)

```mermaid
graph TD
    A[Phase 1.1: Cartographie & Analyse Statique] --> B[Phase 1.2: Matrice d'Orphelinage & Validation]
    B --> C[Phase 1.3: Purge Sécurisée & Verifications Build]
    C --> D[Phase 2.1: Audit de Qualité du Code & Architecture]
    D --> E[Phase 2.2: Rapport des Pistes d'Amélioration]
    E --> F[Phase 2.3: Exécution des Refactorisations Validées]
```

### 📋 Checklist d'Exécution par Jalons

#### 🟢 Phase 1 : Traque et Purge des Fichiers Morts & Inutilisés [COMPLÉTÉ]
- [x] **Jalon 1.1 — Cartographie de l'arborescence & Répertoires Suspects**
  - [x] Lister exhaustivement les répertoires hors-flux (`app___`, `tmp`, `app/_/Blog_/`, `pages/api/_/models/old/`).
  - [x] Parser l'intégralité des imports du projet (`app/`, `pages/api/`, `stores/`, `utils/`, `styles/`).
  - [x] Recenser et purger les sauvegardes manuelles (`ClientIsAdmin copy.js`, `ReserveForm_copy/`, `*_.js`).
- [x] **Jalon 1.2 — Analyse des Dépendances `package.json`**
  - [x] Supprimer les paquets npm obsolètes (`express`, `cors`, `bcrypt`, `multer`, `formidable`, `fs` stub, loaders Webpack redondants).
  - [x] Installer la dépendance manquante `@fortawesome/fontawesome-svg-core`.
- [x] **Jalon 1.3 — Purge & Refactoring des Imports & Validation Build**
  - [x] Corriger tous les imports cassés (`authContext_.js` -> `authContext.js`, `ReserveForm_copy` -> `ReserveForm`, `models/old/` -> `models/`).
  - [x] Nettoyer la configuration SCSS orpheline (`searchBarCharged.scss`).
  - [x] **Validation totale** : Compilation `npm run build` exécutée avec succès (0 erreur, 11 pages statiques + routes API générées).

---

#### 🔵 Phase 2 : Audit de Qualité du Code & Améliorations [EN COURS]
- [/] **Jalon 2.1 — Audit de Structure & Cohérence Architecturelle**
  - [ ] Évaluer la coexistence App Router (`app/`) et Pages Router (`pages/api/`).
  - [ ] Analyser la gestion d'état (`stores/`) et les utilitaires (`utils/`).
  - [ ] Contrôler la sécurité des endpoints API et la gestion des rôles (Clerk + Mongoose).
- [ ] **Jalon 2.2 — Audit de Performance, Sécurité et Code Smells**
  - [ ] Identifier le code dupliqué et les opportunités de refactoring.
  - [ ] Détecter les optimisations SCSS et opportunités Tailwind.
- [ ] **Jalon 2.3 — Spécification & Application des Améliorations**
  - [ ] Proposer des refactorisations ciblées et appliquer les améliorations retenues.

---

## 3. Spécifications Fonctionnelles (SF)

### SF-01 : Périmètre & Typologie des Éléments Suspects
Le système de détection doit classifier les fichiers du projet en 5 catégories distinctes :

| Catégorie | Description / Exemple dans `lpd_sanctuaire` | Action Préconisée |
| :--- | :--- | :--- |
| **Dossiers Fantômes (Backups)** | Répertoires de sauvegarde manuelle créés hors convention (ex: `app___`). | **Suppression complète** après confirmation d'absence de code unique. |
| **Fichiers Dupliqués / Copie** | Fichiers résiduels de développement (ex: `ClientIsAdmin copy.js`, `ReserveForm_copy/`, `page_oldhomepage.js`). | **Suppression** après comparaison diff avec la version active. |
| **Code Source Orphelin** | Composants JSX, modules JS, hooks ou styles non importés directement ou indirectement par les points d'entrée (`layout.js`, `page.jsx`, `pages/api/*`). | **Vérification AST / Grep** puis suppression. |
| **Assets Statiques Morts** | Images, polices, fichiers JSON dans `public/` ou `assets/` n'apparaissant dans aucune chaîne de texte ni import SCSS/JSX. | **Archivage / Purge**. |
| **Dépendances Fantômes** | Paquets `package.json` jamais requis ou importés. | **Désinstallation (`npm uninstall`)**. |

### SF-02 : Règles de Sécurité et Non-Régression
1. **Principe du Zero Breakage** : Aucun fichier ne doit être supprimé sans qu'un graphe d'import n'ait confirmé l'absence totale de référence (y compris via `dynamic import` ou `require`).
2. **Sauvegarde Atomique** : Toute opération de suppression doit être précédée d'un commit Git dédié, permettant un rollback immédiat si un composant dynamique ou une API réflexive l'utilisait.
3. **Validation de Build** : Une suppression me sera validée uniquement si la commande de construction du projet s'exécute sans avertissement d'import manquant.

---

## 4. Spécifications Techniques (ST)

### ST-01 : Algorithme de Détection des Fichiers Orphelins (AST & Graph Search)

```mermaid
flowchart TD
    Start[Début de l'Analyse] --> Entries[Identifier les Points d'Entrée Root]
    Entries --> EntryList["- app/**/page.jsx & layout.js\n- pages/api/**/*.js\n- middleware.js\n- next.config.ts"]
    EntryList --> ParseImports[Résoudre récursivement tous les imports/requires]
    ParseImports --> BuildGraph[Construire le Graphe de Dépendances Actives]
    BuildGraph --> ScanFiles[Lister tous les fichiers du projet dans app, pages, stores, utils, styles]
    ScanFiles --> Compare{Fichier présent dans le Graphe Actif ?}
    Compare -- Oui --> Active[Fichier Actif - Conserver]
    Compare -- Non --> CheckDynamic{Présent dans String/Dynamic Import ?}
    CheckDynamic -- Oui --> Suspect[Marquer à Réviser]
    CheckDynamic -- Non --> DeadFile[Marquer comme FICHIER MORT]
```

### ST-02 : Analyse Stratégique des Dépendances `package.json`
Une révision spécifique de `package.json` sera menée pour identifier les incohérences techniques :
* **Modules Express / Serverless** : Recherche de l'utilité de `express`, `cors`, `multer`, `formidable`, `bcrypt` dans une application Next.js (souvent remplacés nativement par Next.js Request/Response API et Clerk/Mongoose).
* **Loaders Webpack superflus** : Détection des paquets `css-loader`, `sass-loader`, `style-loader` qui peuvent créer des conflits avec la gestion native du SASS par Next.js.
* **Bibliothèques de date / cartes redondantes** : Présence conjointe de `moment` et `date-fns`, ou `leaflet` / `@googlemaps/react-wrapper`.

### ST-03 : Grille d'Évaluation de la Qualité du Code (Phase 2)
Pendant la Phase 2, chaque composant et route conservé sera évalué selon 5 axes de qualité :
1. **Architecture & Découpage** : Séparation propre entre logique UI, gestion d'état (`stores/`) et requêtes API.
2. **Gestion des Rôles & Sécurité** : Vérification des contrôles d'accès Admin (`ClientIsAdmin.js`, `AdminReservationToolbarModal.jsx`, etc.) pour éviter toute fuite de privilège.
3. **Standardisation des Styles** : Élimination des collisions entre SCSS Modules, globals.css et Tailwind CSS.
4. **Performance Client/Serveur** : Bon usage des directives `'use client'` vs Server Components dans Next.js App Router.
5. **Typage et Lisibilité** : Cohérence des props, clarté du nommage, élimination du code mort interne (fonctions/variables inutilisées).

---

## 5. Prochaines Étapes Immédiates

1. **Validation du Plan & des Spécifications** par l'utilisateur.
2. **Lancement du Jalon 1.1 & 1.2** : Génération de la liste précise des fichiers morts identifiés (notamment la purge du dossier `app___` et des copies), ainsi que le rapport des dépendances inutilisées.
