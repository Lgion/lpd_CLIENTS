import React from 'react'
import Link from "next/link";

export default function CTA() {
  return (
    <article className='CTA'>
        <section>
            <h2>AU SANCTUAIRE ONTRE DAME DU ROSAIRE DE BOLOBI</h2>
            <h3>NOUS PROPOSONS EN CE LIEU UN HÉBERGEMENT POUR Y FAIRE DES PÉLÉRINAGES OU RETRAITES: </h3>
            <ul>
                <li><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>Personnelles</Link> <span>Pour se reposer ou se recueillir avec le seigneur dans un lieu calme loin du tumulte de la ville,</span></li>
                <li><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>Spirituelle</Link> <span>Si vous avez besoin pour votre groupe religieux chrétien d&acute;un lieux de prière avec une église et une grotte mariale,</span></li>
                <li><Link href={"/blog-de-bolobi-ecole-caritative-larve-msn#!"}>de vacances</Link> <span>Souvent pendant les grandes vacances de Juillet et d&acute;Août les jeûnes ont besoin de participer à une activité de groupe pour affermir la foi dans leur coeur</span></li>
            </ul>
            <h3>NOUS PROPOSONS ÉGALEMENT UN LIEU POUR ORGANISER: </h3>
            <ul>
                <li>Marriage</li>
                <li>conférence</li>
                <li>etc...</li>
            </ul>
        </section>
        <section>
            <h3>En cette période du mois de <span>Mai</span></h3>
            <p>nous porposon des réduction avec le code promo suivant</p>
            <input readOnly={true} value={"AAAA"} />
        </section>
    </article>
  )
}
