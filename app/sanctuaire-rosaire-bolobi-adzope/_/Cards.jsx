import { useEffect } from "react"

const arr = [
    {cls:"lieuBeni", title:"Le Lieu Béni", content:"Étendu sur 18 hectares d'espace vert, le sanctuaire de Bolobi offre un cadre vallonné, serein et rafraîchissant. C'est un havre de paix où vous pouvez vous retirer du tumulte de la vie quotidienne pour vous connecter avec votre foi et trouver la tranquillité intérieure."}
    , {cls: "serenite", title: "L'Église de Sérénité", content: "L'église au sein du sanctuaire peut accueillir jusqu'à 150 fidèles assis. De plus, une spacieuse esplanade permet d'accueillir plusieurs centaines de personnes pour des célébrations en plein air. Cette église a été dédicacée le 10 Septembre 2016 par Monseigneur Alexis Touably Youlo, l'évêque du diocèse d'Agboville."}
    , {cls: "grotteMarial", title: "La Grotte Mariale", content:"Un joyau spirituel du sanctuaire est la Grotte Mariale dédiée à Notre Dame du Rosaire. Consacrée le 10 Septembre 2016 par Monseigneur Alexis Touably Youlo, cette grotte est située au cœur d'une vaste plantation de palmiers à huile. Elle a la capacité d'accueillir plusieurs centaines de pèlerins et de retraitants. De plus, les célébrations de la messe en plein air peuvent y avoir lieu, créant une atmosphère profondément connectée à la nature."}
    , {cls: "facilities", title: "Facilités d'Hébergement 1", content:"Si vous souhaitez prolonger votre séjour spirituel, le sanctuaire offre un centre d'accueil et d'hébergement avec une capacité de 150 à 200 places. Cet espace est ouvert aux organisateurs de retraites spirituelles, de pèlerinages, de récollections, d'excursions, ainsi qu'aux familles, aux personnes seules et aux convalescents. Le cadre paisible du sanctuaire crée un environnement propice à la réflexion et à la reconnexion avec soi-même."}
    , {cls: "facilitiesBis", title: "Solutions d'Hébergement 2", content:"Le sanctuaire propose des hébergements abordables pour répondre à vos besoins. Vous avez le choix entre des dortoirs avec salle d'eau extérieure à seulement 1500 francs CFA par jour et par personne. Des studios avec salle d'eau sont également disponibles; veuillez nous contacter pour plus d'informations sur les tarifs. De plus, le sanctuaire offre des options de restauration pour les pèlerins et les retraitants qui le souhaitent."}
    , {cls: "other", title: "Activités Inspirantes", content:"Les activités spirituelles abondent au Sanctuaire Notre Dame du Rosaire, y compris des prières quotidiennes, des prières à l'Esprit Saint et des prières d'intercession. De plus, ne manquez pas la journée nationale du Rosaire, qui est célébrée chaque année le 14 Août à Bolobi, rassemblant les cœurs et les esprits dans la prière et la méditation."}
]

export default function Cards() {
    
    const handleClick = e => {
        if(!e.target.closest('li').classList.contains('active'))
            document.querySelectorAll('main.sanctuaire_ndr>article>ul>li').forEach((elt,i) => {
                elt.classList.remove('active')
            })
        e.target.closest('li').classList.toggle('active')
    }
    
    return <ul>
        {arr.map((item,i) => <li key={"card_ndr_"+i} className={item.cls} onClick={handleClick}>
            <h4>{item.title}</h4>
            <p>{item.content}</p>
        </li> )}
    </ul>
}
