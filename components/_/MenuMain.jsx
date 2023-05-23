import {useState,useContext, useEffect} from 'react'
import Link from "next/link";
import AuthContext from "../../stores/authContext.js"

export default function MenuMain() {

    const {cartBox} = useContext(AuthContext)
    , [isCartPage, setIsCartPage] = useState(true)

    useEffect(() => { 
        (()=>{setIsCartPage(document.querySelector('#__next>main.cart'))})()

    })
    
    
    return <>
        <div id="blogB">
            <a
                href="http://bolobi.ci"
                rel="noreferrer"
                target="_blank"
                title="Blog du Sanctuaire notre Dame du Rosaire"
            >
                Blog <span>bolobi.ci</span>
            </a>
        </div>
        <menu>
            {
                [
                // {id:"objectifs",href:"objectifs-apostoliques",title:"Évangéliser aider rassembler les chrétiens sanctification saint esprit",content:"Objectifs"},
                {id:"ecommerce",href:"/ecommerce-chretien-abidjan",title:"Ecommerce religieux chrétien catholique: icône grottes statues bibles",content:"Ecommerce Chrétien"},
                // {id:"enseignements",href:"enseignements-spirituels-chretien-catholique",title:"Enseignements spirituels chrétien catholique Puissance Divine, jésus enseigne: l",content:"Enseignements"},
                {id:"activites-spirituelles",href:"/sanctuaire-rosaire-bolobi-adzope",title:"Sanctuaire du Rosaire de Bolobi: activités spirituelles religieuses chrétien catholique",content:"Sanctuaire du Rosaire de Bolobi"},
                {id:"blog",href:"/blog-de-bolobi-ecole-caritative-larve-msn",title:"Blog de Bolobi: école gratuite d'Adzopé, culture du poivre, élevage de mouches soldat noire, activités spirituelles religieuses chrétien catholique et protestant",content:"Blog de Bolobi"},
                ].map((item,i) => <li className={"menu "+item.id} key={"m1st___"+i}>

                    {!isCartPage && item.id=="ecommerce" && <>
                        <Link
                            href="panier-ecommerce-pda"
                            title="Accedez au panier ecommerce librairie puissance divine"
                            // title="Accéder à la page panier, ou visualiser son contenu, ou encore modifier le rapidement ici à la volé"
                            id="panier" 
                            >
                        </Link>
                        {cartBox}
                    </>}
                    <Link
                        href={item.href}
                        title={item.title}
                        id={item.id+"_menu"}
                    >
                        <span>
                        {item.content}
                        </span>
                    </Link>
                </li>
                )
            }
        </menu>
    </>
}
