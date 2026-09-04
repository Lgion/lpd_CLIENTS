"use client"

import React, { useState, useEffect } from 'react'

export default function BtnCTA() {
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsFullscreenOpen(false);
            }
        };
        if (isFullscreenOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isFullscreenOpen]);

    return (
        <>
            <div className="form_cta_fixed_btns">
                <a 
                    href="https://wa.me/2250779288293" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="Contactez nous sur WhatsApp pour plus d'informations"
                ></a>
                
                <button
                    type="button"
                    className="btn_cta_calendar"
                    onClick={() => setIsFullscreenOpen(true)}
                    title="Afficher le calendrier liturgique en taille maximale sur tout l'écran"
                    aria-label="Afficher le calendrier des retraites en plein écran"
                >
                </button>

                <a 
                    href="#form_reservation" 
                    title="Remplir le formulaire de réservation pour votre séjour au sanctuaire de Bolobi"
                ></a>
            </div>

            {/* Modale plein écran maximale */}
            {isFullscreenOpen && (
                <div 
                    className="fullscreen_calendar_modal_backdrop" 
                    onClick={() => setIsFullscreenOpen(false)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div 
                        className="fullscreen_calendar_modal_content" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="fullscreen_calendar_close_btn"
                            onClick={() => setIsFullscreenOpen(false)}
                            aria-label="Fermer la vue plein écran"
                            title="Fermer"
                        >
                            ✕
                        </button>
                        <img
                            src="/calendrier-permanent-bolobi.webp"
                            alt="Calendrier Liturgique Annuel du Sanctuaire de Bolobi - Vue Maximale"
                            className="fullscreen_calendar_img"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
