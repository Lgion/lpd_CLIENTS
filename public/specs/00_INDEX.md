# 📋 Spécifications Techniques — Sanctuaire NDR Bolobi

## Architecture Générale du Projet
- **Framework** : Next.js 15.5.20 (App Router + Pages Router API)
- **Auth** : Clerk (@clerk/nextjs ^6.2.0)
- **BDD** : MongoDB Atlas via Mongoose ^8.8.0
- **Email** : Nodemailer (SMTP Gmail)
- **CSS** : SCSS + Ant Design (antd ^5.22.2)
- **Paiement** : Wave CI (lien direct)

## Variables d'Environnement Référencées
| Variable | Usage |
|---|---|
| `NEXT_PUBLIC_EMAIL_ADMIN` | Liste des emails admin (séparés par espaces) |
| `WAVE_LINK` | URL de paiement Wave avec paramètre `?amount=` |
| `OTHERS_STAFF_WHATSAPP` | Contacts staff format `nom:numero,...` |
| `DIRECTOR__WHATSAPP` | Numéro WhatsApp du Directeur (P. Gilbert) |
| `EMAIL_USER_CYR` / `EMAIL_USER_MAM` | Comptes SMTP d'envoi |
| `EMAIL_PASS` | Mot de passe d'application Gmail |

---

## Table des Spécifications

| # | Fichier | Portée | Priorité |
|---|---|---|---|
| 01 | [SPEC_01_RESERVATION_PRICING.md](./SPEC_01_RESERVATION_PRICING.md) | Page réservation — Arrondi avance, formule repas J1/Dernier jour, bouton Wave | 🔴 P1 |
| 02 | [SPEC_02_EMAIL_TEMPLATE.md](./SPEC_02_EMAIL_TEMPLATE.md) | API — Template HTML5 email de confirmation professionnel | 🔴 P1 |
| 03 | [SPEC_03_NOTIFICATIONS.md](./SPEC_03_NOTIFICATIONS.md) | API + Page — Notifications WhatsApp multi-destinataires | 🔴 P1 |
| 04 | [SPEC_04_ADMIN_SANCTUAIRE_CA.md](./SPEC_04_ADMIN_SANCTUAIRE_CA.md) | Admin/Sanctuaire — CA Estimé vs Calculé, métriques financières | 🟡 P2 |
| 05 | [SPEC_05_ADMIN_INVENTAIRE.md](./SPEC_05_ADMIN_INVENTAIRE.md) | Admin/Sanctuaire — Inventaire matériel & Frais d'entretien | 🟡 P2 |
| 06 | [SPEC_06_ADMIN_CMS.md](./SPEC_06_ADMIN_CMS.md) | Accueil Admin — CMS personnalisation des pages | 🟢 P3 |
| 07 | [SPEC_07_BLOG_FLYER.md](./SPEC_07_BLOG_FLYER.md) | Blog — Générateur de flyers marketing + Blog IA modulaire | 🟢 P3 |
| 08 | [SPEC_08_FOOTER_PREMIUM.md](./SPEC_08_FOOTER_PREMIUM.md) | Layout — Footer premium avec photos équipe et animations | 🟡 P2 |
