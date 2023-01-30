import {useState,useContext} from 'react'
import Link from "next/link";
import AuthContext from "../../stores/authContext.js"

export default function MenuMain() {

    const {cartBox,ok} = useContext(AuthContext)
    
    
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
                {id:"ecommerce",href:"ecommerce-chretien-abidjan",title:"Ecommerce religieux chrétien catholique: icône grottes statues bibles",content:"Ecommerce"},
                // {id:"enseignements",href:"enseignements-spirituels-chretien-catholique",title:"Enseignements spirituels chrétien catholique Puissance Divine, jésus enseigne: l",content:"Enseignements"},
                {id:"lieux-activites",href:"puissance-divine-fraternite-librairie-sanctuaire-rosaire",title:"Puissance Divine Abidjan : nos lieux et activités religieux chrétien catholique",content:"Lieux et Activités"},
                {id:"priere",href:"retraites-de-priere-spirituelles-abidjan-sanctuaire-rosaire",title:"Retraites spirituelles, assistance spirituelle, week-ends rosaire sanctuaire dame du rosaire bolobi",content:"Retraites-et-Prières"},
                ].map((item,i) => <li className={"menu "+item.id} key={"m1st___"+i}>

                        {item.id=="ecommerce" && <>
                            <Link
                                href="panier-ecommerce-pda"
                                title="Accedez au panier ecommerce librairie puissance divine"
                                ><a id="panier" title="Accéder à la page panier, ou visualiser son contenu, ou encore modifier le rapidement ici à la volé"></a>
                            </Link>
                            {cartBox}
                        </>}
                    <Link
                    href={item.href}
                    title={item.title}
                    id={item.id+"_menu"}
                    >
                        <a><span>
                        {item.content}
                        </span></a>
                    </Link>
                </li>
                )
            }
        </menu>
    </>
}
