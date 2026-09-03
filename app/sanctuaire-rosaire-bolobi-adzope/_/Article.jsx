"use client"

import Link from "next/link";
import Cards from "./Cards";
import IntroVideo from './components/IntroVideo'
import CalendrierLiturgique from '../../retraites-spirituelles-bolobi/_/components/CalendrierLiturgique'
import { usePageConfig } from '../../../utils/usePageConfig'

export default function Article() {
    const { config } = usePageConfig('sanctuaire');

    return (
        <article>
            {config?.titre && (
                <div className="cms-dynamic-header" style={{ marginBottom: 20 }}>
                    <h2 style={{ color: config.couleurPrincipale || '#c9a84c', fontSize: '1.8rem', fontWeight: 900 }}>
                        {config.titre}
                    </h2>
                    {config.sousTitre && <h4 style={{ color: '#64748b' }}>{config.sousTitre}</h4>}
                    {config.slogan && <p style={{ fontStyle: 'italic', color: '#475569' }}>{config.slogan}</p>}
                </div>
            )}

            <h3>Itinéraire vidéo vers le Sanctuaire notre Dame Raosaire Bolobi</h3>
            <p>Situé sur l'<b>axe routier Abidjan-Adzopé</b>, cette vidéo explique <b>comment se rendre au <u>Sanctuaire Notre Dame du Rosaire de Bolobi</u></b>.</p>
            <IntroVideo />

            <h3 id="firstH3" data-icon="1">Bienvenue au Sanctuaire Notre Dame du Rosaire à Bolobi, Abidjan, Côte d'Ivoire</h3>

            <p>Si vous êtes à la recherche d'<b>un lieu de paix, de prière et de recueillement au cœur de la nature</b>, le <Link href="#">Sanctuaire Notre Dame du Rosaire à Bolobi</Link> est l'endroit idéal pour vous.</p>
            <p>Niché dans les magnifiques collines verdoyantes du <b>diocèse d'Agboville</b>, en périphérie du grand Abidjan sur la <b>route Abidjan-Adzopé</b>, s'étendant sur 18Ha, ce sanctuaire chrétien offre une expérience spirituelle apaisante et unique.</p>

            {/* PARAGRAPHES DYNAMIQUES DU CMS */}
            {config?.paragraphes && config.paragraphes.length > 0 && (
                <div className="cms-dynamic-paragraphs" style={{ margin: '24px 0' }}>
                    {config.paragraphes.map((p, i) => (
                        <div key={i} className="cms-p-block" style={{ marginBottom: 18 }}>
                            {p.titre && <h4 style={{ color: config.couleurPrincipale || '#2563eb', fontWeight: 800 }}>{p.titre}</h4>}
                            {p.contenu && <p style={{ lineHeight: 1.6 }}>{p.contenu}</p>}
                            {p.image && <img src={p.image} alt={p.titre || 'Illustration'} style={{ maxWidth: '100%', borderRadius: 12, marginTop: 8 }} />}
                        </div>
                    ))}
                </div>
            )}

            <p>Voici les principaux thèmes relatifs au Sanctuare ND du Rosaire de Bolobi: </p>
            <Cards />

            <CalendrierLiturgique />
        </article>
    );
}
