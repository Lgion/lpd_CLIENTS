"use client"

import React, { useState } from 'react'
import Image from 'next/image'

export default function CalendrierLiturgique() {
    const [isOpen, setIsOpen] = useState(false);

    const retraites = [
        {
            titre: "Retraite de la Toussaint",
            dates: "30 octobre – 1er novembre 2026",
            description: "De l'énigme à la lumière : quand les saints nous apprennent à voir face à face.",
            verset: "1 Co 13,12",
            badge: "Automne",
            icon: "✝️"
        },
        {
            titre: "Retraite de l'Avent",
            dates: "27 – 29 novembre 2026",
            description: "Notre attente dans la lumière de l'attente de la Sainte Vierge.",
            verset: "Lc 1,26-38",
            badge: "Avent",
            icon: "🕯️"
        },
        {
            titre: "Retraite du Carême",
            dates: "12 – 14 février 2027",
            description: "Le besoin de conversion ; « Reviens à moi de tout ton cœur ».",
            verset: "Jl 2,12-13",
            badge: "Carême",
            icon: "🌿"
        },
        {
            titre: "Retraite de Pâques",
            dates: "26 – 29 mars 2027",
            description: "De la tombe à la vie ; résurrection avec le Christ. « Pour que nous marchions nous aussi dans une vie nouvelle ».",
            verset: "Rm 6,4",
            badge: "Pâques",
            icon: "🌅"
        },
        {
            titre: "Retraite Mariale",
            dates: "13 – 15 août 2027",
            description: "Origine et signification du titre de Marie corédemptrice avec le Christ pour le salut du monde.",
            verset: "Gn 3,15 ; Lc 1,38",
            badge: "Grand Rassemblement",
            icon: "🌹"
        }
    ];

    const piliers = [
        { icon: "🍷", label: "Eucharistie" },
        { icon: "📖", label: "Enseignements" },
        { icon: "🕊️", label: "Confessions" },
        { icon: "☀️", label: "Adoration" },
        { icon: "🌿", label: "Temps de silence" },
        { icon: "🤝", label: "Accompagnement spirituel" }
    ];

    return (
        <section className="calendrier_liturgique_wrapper">
            <h3 id="calendrier-retraites" data-icon="3" data-sommaire="Programme des Retraites 2026-2027">
                Programme & Calendrier Liturgique des Retraites 2026-2027
            </h3>

            <p className="intro_text">
                Les <strong>Frères de Saint-Jean</strong> et l'<strong>Écosanctuaire Marial de Bolobi</strong> vous proposent un cycle complet de retraites spirituelles tout au long de l'année 2026-2027 sous le thème : <br />
                <em>« Retrouver Dieu — Retrouver la paix. Retrouver l'essentiel. »</em>
            </p>

            {/* Zone Affiche & Actions */}
            <div className="affiche_container_card">
                <div className="affiche_preview" onClick={() => setIsOpen(true)}>
                    <img
                        src="/calendrier-permanent-bolobi.webp"
                        alt="Affiche Officielle des Retraites Spirituelles 2026-2027 au Sanctuaire Marial de Bolobi"
                        className="affiche_img"
                    />
                    <div className="affiche_overlay">
                        <span className="btn_zoom">🔍 Agrandir l'affiche HD</span>
                    </div>
                </div>

                <div className="affiche_actions">
                    <h4>Affiche Officielle du Sanctuaire</h4>
                    <p>Consultez ou téléchargez le calendrier permanent des retraites 2026-2027 au format haute définition.</p>
                    
                    <div className="action_buttons">
                        <button type="button" className="btn_action primary" onClick={() => setIsOpen(true)}>
                            🔍 Agrandir l'affiche
                        </button>
                        <a 
                            href="/calendrier-permanent-bolobi.jpg" 
                            download="Calendrier-Retraites-Bolobi-2026-2027.jpg"
                            className="btn_action secondary"
                            title="Télécharger la version JPG de l'affiche"
                        >
                            📥 Télécharger l'affiche (JPG)
                        </a>
                        <a 
                            href="https://wa.me/2250779288293?text=Bonjour%20Père%20Gilbert,%20je%20souhaite%20des%20renseignements%20sur%20les%20retraites%20spirituelles%202026-2027." 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn_action whatsapp"
                            title="Renseignements et inscriptions auprès du Père Gilbert via WhatsApp"
                        >
                            📱 Contact & Inscriptions (WhatsApp)
                        </a>
                    </div>
                </div>
            </div>

            {/* Piliers du Sanctuaire */}
            <div className="piliers_bar">
                {piliers.map((item, idx) => (
                    <div key={"pilier_" + idx} className="pilier_item">
                        <span className="pilier_icon">{item.icon}</span>
                        <span className="pilier_label">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Grille des Retraites */}
            <div className="retraites_grid">
                {retraites.map((item, idx) => (
                    <div key={"retraite_" + idx} className="retraite_card">
                        <div className="retraite_header">
                            <span className="retraite_icon">{item.icon}</span>
                            <div>
                                <span className="retraite_badge">{item.badge}</span>
                                <h4>{item.titre}</h4>
                                <span className="retraite_date">📅 {item.dates}</span>
                            </div>
                        </div>
                        <p className="retraite_desc">« {item.description} »</p>
                        <span className="retraite_verset">{item.verset}</span>
                    </div>
                ))}
            </div>

            {/* Modal Lightbox */}
            {isOpen && (
                <div className="lightbox_backdrop" onClick={() => setIsOpen(false)}>
                    <div className="lightbox_modal" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="lightbox_close" 
                            onClick={() => setIsOpen(false)}
                            aria-label="Fermer la vue agrandie"
                        >
                            ✕
                        </button>
                        <div className="lightbox_header">
                            <h4>Retraites Spirituelles 2026-2027 — Sanctuaire Marial de Bolobi</h4>
                        </div>
                        <div className="lightbox_body">
                            <img
                                src="/calendrier-permanent-bolobi.webp"
                                alt="Affiche agrandie du Calendrier Liturgique Bolobi"
                                className="lightbox_full_img"
                            />
                        </div>
                        <div className="lightbox_footer">
                            <a 
                                href="/calendrier-permanent-bolobi.jpg" 
                                download="Calendrier-Retraites-Bolobi-2026-2027.jpg"
                                className="btn_action secondary"
                            >
                                📥 Télécharger en HD
                            </a>
                            <a 
                                href="https://wa.me/2250779288293?text=Bonjour%20Père%20Gilbert,%20je%20souhaite%20des%20renseignements%20sur%20les%20retraites%20spirituelles%20de%20Bolobi." 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn_action whatsapp"
                            >
                                📱 Renseignements (Père Gilbert : 07 79 28 82 93)
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
