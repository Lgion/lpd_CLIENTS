import React, { useState, useEffect } from 'react';
import HowToGuide from './HowToGuide';
import './HowTo.scss';

const HowTo = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedGuide, setSelectedGuide] = useState(null);

    // Verrouiller le scroll du body quand la modale est ouverte
    useEffect(() => {
        if (selectedGuide) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        
        // Nettoyage au démontage
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [selectedGuide]);

    const steps = [
        {
            id: "blog",
            title: "Blog & Articles",
            icon: "✍️",
            content: "Le blog permet de communiquer sur la vie du sanctuaire. Vous pouvez créer des articles manuellement ou utiliser l'assistant IA pour générer des brouillons. N'oubliez pas d'ajouter une image mise en avant pour chaque article.",
        },
        {
            id: "carousel",
            title: "Carrousels",
            icon: "🖼️",
            content: "Les carrousels sont les grandes images défilantes de la page d'accueil. Vous pouvez les mettre à jour, changer leur ordre ou ajouter des liens vers des pages spécifiques. Utilisez des images de haute qualité (WebP conseillé).",
        },
        {
            id: "auth",
            title: "Authentification & Admin",
            icon: "🔐",
            content: "L'accès à l'administration est protégé. Seuls les comptes avec le rôle 'admin' peuvent accéder à ces fonctionnalités. La gestion des utilisateurs se fait via l'interface Clerk intégrée.",
        },
        {
            id: "reservations",
            title: "Réservations",
            icon: "📅",
            content: "C'est ici que vous gérez les groupes et pèlerins. Vous pouvez valider les réservations après réception du paiement (Wave/Orange Money) et modifier les noms de communautés si nécessaire.",
        },
        {
            id: "school",
            title: "Dons & École",
            icon: "🎓",
            content: "Le système de dons permet de financer la scolarité des élèves. Une fois un don reçu, vous pouvez l'assigner à un élève spécifique pour que le donateur puisse suivre l'impact de sa générosité.",
        }
    ];

    return (
        <>
            <div className={`admin-howto ${isExpanded ? 'admin-howto--expanded' : ''}`}>
                <div className="admin-howto__header" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="admin-howto__header-main">
                        <h3>📖 Manuel d'Utilisation Rapide</h3>
                        <p>Bienvenue ! Cliquez pour découvrir comment gérer l'application efficacement.</p>
                    </div>
                    <button className="admin-howto__toggle">
                        {isExpanded ? '🔼 Fermer' : '🔽 Ouvrir le guide'}
                    </button>
                </div>

                {isExpanded && (
                    <div className="admin-howto__content">
                        <p className="admin-howto__roles-info">
                            <strong>Gestion des Privilèges :</strong> L'accès est divisé en trois niveaux. Les <em>Visiteurs</em> consultent le site, les <em>Membres</em> accèdent à leur historique, et les <strong>Administrateurs</strong> disposent du contrôle total sur les contenus, les ventes et les réservations présentés ci-dessous.
                        </p>

                        <div className="admin-howto__grid">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`admin-howto__card ${activeTab === index ? 'admin-howto__card--active' : ''}`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    <div className="admin-howto__card-icon">{step.icon}</div>
                                    <div className="admin-howto__card-body">
                                        <h4>{step.title}</h4>
                                        <p>{step.content}</p>
                                        <span 
                                            className="admin-howto__card-link"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedGuide(step.id);
                                            }}
                                        >
                                            En savoir plus →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {selectedGuide && (
                <div className="howto-local-modal-overlay" onClick={() => setSelectedGuide(null)}>
                    <div className="howto-local-modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="howto-local-modal-close" onClick={() => setSelectedGuide(null)}>×</button>
                        <div className="howto-local-modal-scroll">
                            <HowToGuide id={selectedGuide} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HowTo;
