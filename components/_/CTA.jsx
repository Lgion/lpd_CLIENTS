import React from 'react'
import Link from "next/link";

export default function CTA() {
  return (
    <article className='CTA'>
        <h3>AU SANCTUAIRE ONTRE DAME DU ROSAIRE DE BOLOBI</h3>
        <section>
            {/* <h4>Solutions d'hébergement pour les pélérins et retraitants: </h4> */}
            <h4>HÉBERGEMENTS & LIEU DE REPOS: </h4>
            <p>* 180 places d'hébergement, les chambres sont ventilés avec moustiquaire, l'électricité tourne au solaire et à l'essence.</p>
            <p>* Équipements de sonorisation disponible à la location</p>
            <ul>
                <li className='journee'><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>1000Ave</Link></li>
                <li className='journee'><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>Veillé</Link></li>
                <li className='journee'><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>Recollection</Link></li>
                <li className='weekend'><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>Retraite weekend</Link></li>
                <li className='long'><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>Vacances, long-terme</Link></li>
                <li className='ceremonie'><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>Conférence, Célébrations(Mariage, baptême), ..</Link></li>
                <li className='individuelle'><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>Retraite individuelle</Link></li>
            </ul>
            {/* <ul>
                <li><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>Chambre individuelle (1-2)</Link> <span>Pour se reposer ou se recueillir avec le seigneur dans un lieu calme loin du tumulte de la ville,</span></li>
                <li><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>Chambre collective (4-10)</Link> <span>Lors d'une <u>retraites de prière</u></span></li>
                <li><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>Long-Terme (selon le nombre, dortoir ou individuelle)</Link> <span>Pour les <u>groupes scolaires</u> de vacance, ou les <u>personnes en convalescence</u> par exmeple</span></li>
            </ul>
            <h4>NOUS PROPOSONS ÉGALEMENT UN LIEU POUR ORGANISER: </h4>
            <ul>
                <li>Marriage</li>
                <li>conférence</li>
                <li>etc...</li>
            </ul>
            */}
        </section>
        {/*
        <section>
            <h3>En cette période du mois de <span>Mai</span></h3>
            <p>nous porposon des réduction avec le code promo suivant</p>
            <input readOnly={true} value={"AAAA"} />
        </section>
        */}
    </article>
  )
}
