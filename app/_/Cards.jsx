import { useEffect } from "react"

const arr = [
    {cls:"sanctuaire", title:"SANCTUAIRE", content:"Étendu sur 18 hectares d'espace vert, c'est le nom du lac qui traverse ce terrain. Le sanctuaire de Bolobi offre un cadre vallonné, serein et rafraîchissant. C'est un havre de paix où vous pouvez vous retirer du tumulte de la vie quotidienne pour vous connecter avec votre foi et trouver la tranquillité intérieure."}
    // , {cls:"priere", title:"Prière", content:"Étendu sur 18 hectares d'espace vert, le sanctuaire de Bolobi offre un cadre vallonné, serein et rafraîchissant. C'est un havre de paix où vous pouvez vous retirer du tumulte de la vie quotidienne pour vous connecter avec votre foi et trouver la tranquillité intérieure."}
    , {cls: "eglise", title: "ÉGLISE", content: "L'église a été dédicacée le 10 Septembre 2016 par Monseigneur Alexis Touably Youlo, l'évêque du diocèse d'Agboville. Grâce à son esplanade, elle peut accueillir jusqu'à 200 fidèles."}
    , {cls: "grotteMarial", title: "GROTTE MARIALE", content:"Un joyau spirituel du sanctuaire est la Grotte Mariale dédiée à Notre Dame du Rosaire. Consacrée le 10 Septembre 2016 par Monseigneur Alexis Touably Youl. Cette grotte est située au cœur d'une vaste plantation de palmiers à huile. Des célébrations de messe en plein air peuvent y avoir lieu, créant une atmosphère profondément connectée à la nature."}
    , {cls: "ecole", title: "ÉCOLE", content:"C'est une oeuvre caritative du sanctuaire. Elle offre aux enfants des ouvriers autour du sanctuaire une école primaire gratuite. elle a actuellement (2024-2025) 80 élèves du CP1 au CM1"}
    , {cls: "economie", title: "ÉCONOMIE", content:"Pour subvenir aux besoins du sanctuaire et de l'école, nous avons créé: 1) Un élevage d'escargots, 2) Un élevage de poulets de chair, 3) des cultures de bananes, patates douces, navets, etc. 4) Nous avons en projet des étant piscicoles."}
    // , {cls: "facilitiesBis", title: "Solutions d'Hébergement 2", content:"Le sanctuaire propose des hébergements abordables pour répondre à vos besoins. Vous avez le choix entre des dortoirs avec salle d'eau extérieure à seulement 1500 francs CFA par jour et par personne. Des studios avec salle d'eau sont également disponibles; veuillez nous contacter pour plus d'informations sur les tarifs. De plus, le sanctuaire offre des options de restauration pour les pèlerins et les retraitants qui le souhaitent."}
    // , {cls: "other", title: "Activités Inspirantes", content:"Les activités spirituelles abondent au Sanctuaire Notre Dame du Rosaire, y compris des prières quotidiennes, des prières à l'Esprit Saint et des prières d'intercession. De plus, ne manquez pas la journée nationale du Rosaire, qui est célébrée chaque année le 14 Août à Bolobi, rassemblant les cœurs et les esprits dans la prière et la méditation."}
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
