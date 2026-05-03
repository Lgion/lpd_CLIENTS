'use client'

import React from 'react'
import Link from 'next/link'

const howtoContent = {
    blog: {
        title: "Gestion du Blog & des Articles",
        icon: "✍️",
        description: "Apprenez à partager les actualités du sanctuaire avec votre communauté.",
        authorizations: [
            "Ajout de nouveaux articles sur le site public",
            "Modification et suppression d'articles existants",
            "Accès à l'Assistant de génération par IA",
            "Gestion des médias et des images à la une"
        ],
        steps: [
            {
                title: "Accéder au module Blog",
                text: "Rendez-vous dans la section 'Contenu' puis 'Blog' du menu latéral ou utilisez le bouton direct sur le tableau de bord."
            },
            {
                title: "Créer un nouvel article",
                text: "Cliquez sur 'Nouvel Article'. Vous devrez remplir un titre accrocheur, le corps de l'article et surtout choisir une 'Image à la une' qui illustrera l'article sur le site."
            },
            {
                title: "Utiliser l'Assistant IA",
                text: "Si vous manquez d'inspiration, cliquez sur 'Générer avec l'IA'. Donnez quelques mots-clés et l'assistant rédigera un brouillon complet que vous pourrez ensuite ajuster."
            },
            {
                title: "Publication et Validation",
                text: "Une fois terminé, cliquez sur 'Publier'. L'article apparaîtra instantanément dans la section actualités du site public."
            }
        ],
        tips: "Conseil : Privilégiez des images au format WebP pour un chargement rapide et essayez de publier au moins un article par semaine pour garder le site vivant.",
        target: "/blog"
    },
    carousel: {
        title: "Gestion des Carrousels",
        icon: "🖼️",
        description: "Maîtrisez les visuels de votre page d'accueil.",
        authorizations: [
            "Mise à jour des images de la page d'accueil",
            "Gestion de l'ordre d'affichage des slides",
            "Configuration des liens de redirection sur les images",
            "Suppression de visuels obsolètes"
        ],
        steps: [
            {
                title: "Choisir le carrousel",
                text: "L'application possède plusieurs carrousels (Accueil, Sanctuaire, etc.). Sélectionnez celui que vous souhaitez modifier."
            },
            {
                title: "Ajouter/Modifier une image",
                text: "Téléchargez une image de haute qualité. Vous pouvez ajouter un titre et un bouton d'action (lien) qui s'affichera par-dessus l'image."
            },
            {
                title: "Gérer l'ordre",
                text: "Faites glisser les images pour modifier leur ordre d'apparition sur le site public."
            }
        ],
        tips: "Utilisez des images de dimension 1920x1080px pour un rendu optimal sur tous les écrans.",
        target: null
    },
    auth: {
        title: "Sécurité & Accès Admin",
        icon: "🔐",
        description: "Comprendre comment sont gérés les accès à l'administration.",
        authorizations: [
            "Gestion des privilèges utilisateurs",
            "Accès aux logs de connexion et de sécurité",
            "Attribution du rôle Administrateur via Clerk"
        ],
        steps: [
            {
                title: "Système Clerk",
                text: "Nous utilisons Clerk pour l'authentification. C'est un système robuste qui gère la connexion, l'inscription et la récupération de mot de passe."
            },
            {
                title: "Rôles Utilisateurs",
                text: "Seuls les utilisateurs marqués comme 'Admin' dans la base de données peuvent accéder à ces pages. Si un utilisateur n'a pas les droits, il sera automatiquement redirigé."
            }
        ],
        tips: "Ne partagez jamais vos identifiants. Si un nouveau collaborateur a besoin d'accès, contactez le support technique.",
        target: null
    },
    reservations: {
        title: "Gestion des Réservations",
        icon: "📅",
        description: "Suivez et validez les demandes de pèlerinage et de retraite.",
        authorizations: [
            "Validation officielle des réservations après paiement",
            "Modification des informations de groupes (nom, effectif)",
            "Gestion du calendrier et des créneaux disponibles",
            "Accès aux statistiques de fréquentation"
        ],
        steps: [
            {
                title: "Liste des demandes",
                text: "Toutes les nouvelles réservations arrivent dans l'onglet 'Sanctuaire'. Elles sont marquées 'En attente' par défaut."
            },
            {
                title: "Validation du paiement",
                text: "Une fois que vous avez vérifié la réception de l'acompte (Wave ou Orange Money), cliquez sur 'Valider' pour confirmer la réservation."
            },
            {
                title: "Correction des infos",
                text: "Vous pouvez modifier les noms de communautés ou le nombre de participants si le client vous contacte pour un changement."
            }
        ],
        tips: "Pensez à rappeler les groupes qui n'ont pas encore renseigné le nom de leur communauté pour un meilleur accueil.",
        target: "/admin/sanctuaire"
    },
    school: {
        title: "Dons & École Caritative",
        icon: "🎓",
        description: "Gérez la générosité des donateurs et le soutien aux élèves.",
        authorizations: [
            "Enregistrement et validation des dons reçus",
            "Assignation des élèves aux donateurs (Sponsorship)",
            "Mise à jour des profils d'élèves",
            "Suivi de l'impact financier de l'école"
        ],
        steps: [
            {
                title: "Réception des dons",
                text: "Suivez les dons entrants pour la scolarité. Chaque don doit être validé manuellement après vérification bancaire."
            },
            {
                title: "Assignation des élèves",
                text: "Pour chaque don, vous devez choisir un élève de l'école. Cela permet d'envoyer un message personnalisé au donateur avec les infos de l'enfant qu'il soutient."
            }
        ],
        tips: "Une bonne assignation des élèves encourage les donateurs à renouveler leur soutien chaque année.",
        target: "/admin/school"
    }
}

export default function HowToGuide({ id }) {
    const content = howtoContent[id]

    console.log('Rendering HowToGuide with id:', id, 'content found:', !!content);

    if (!content) {
        return (
            <div className="howto-detail__error">
                <h2>Guide non trouvé</h2>
            </div>
        )
    }

    return (
        <div className="howto-detail-content">
            <header className="howto-detail__header">
                <span className="howto-detail__icon">{content.icon}</span>
                <div>
                    <h1>{content.title}</h1>
                    <p>{content.description}</p>
                </div>
            </header>

            <div className="howto-detail__main-grid">
                <div className="howto-detail__steps">
                    {/* Section Autorisations */}
                    <div className="howto-detail__auth-card">
                        <h3>🔑 Autorisations Admin</h3>
                        <ul>
                            {content.authorizations.map((auth, i) => (
                                <li key={i}>{auth}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Étapes pédagogiques */}
                    {content.steps.map((step, index) => (
                        <div key={index} className="howto-detail__step-card">
                            <span className="howto-detail__step-number">{index + 1}</span>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </div>
                    ))}
                </div>

                <aside className="howto-detail__sidebar">
                    <div className="howto-detail__tip-box">
                        <h4>💡 Astuce de Pro</h4>
                        <p>{content.tips}</p>
                    </div>

                    {content.target && (
                        <div className="howto-detail__action-box">
                            <h4>Prêt à essayer ?</h4>
                            <a target="_blank" href={content.target} className="howto-detail__btn">
                                Aller au module {content.title.split(' ')[2] || ''}
                            </a>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    )
}
