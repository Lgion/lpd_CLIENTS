"use client"

import Link from "next/link";
import Cards from "./Cards";




export default function Article() {
    return <article>
        <h3 id="firstH3" data-icon="1">Bienvenue au Sanctuaire Notre Dame du Rosaire à Bolobi, Abidjan, Côte d'Ivoire</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/Yv3BHtHt3Pg?si=e2Kepaxuk2NhGbK1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        <p>Si vous êtes à la recherche d'<b>un lieu de paix, de prière et de recueillement au cœur de la nature</b>, le <Link href="#">Sanctuaire Notre Dame du Rosaire à Bolobi</Link> est l'endroit idéal pour vous.</p>
        <p>Niché dans les magnifiques collines verdoyantes du <b>diocèse d'Agboville</b>, en périphérie du grand Abidjan sur la <b>route Abidjan-Adzopé</b>, s'étendant sur 18Ha, ce sanctuaire chrétien offre une expérience spirituelle apaisante et unique.</p>
        <p>Voici les principaux spots et infrastructures du Sanctuare ND du Rosaire de Bolobi: </p>
        <Cards />
        <p>encore un peu de blablabla pour présenter les différents types d'activités possibles au Sanctuaire... Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque suscipit, explicabo aperiam, eius eaque ratione, iusto deleniti quos iste quasi non assumenda rem neque quaerat sit in voluptatibus provident sed!</p>
        {/* <SliderInArticle carousel={carouselBolobi} carouselName="carouselBolobi_spirituel" /> */}
        {/* <button onClick={()=>{setShowArticle(!showArticle)}}>Afficher {!showArticle?"plus":"moins"}...</button> */}

    </article>
}
