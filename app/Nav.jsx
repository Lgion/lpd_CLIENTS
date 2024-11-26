import React, {useContext} from 'react'
import Link from "next/link"
import Image from "next/image"
import AuthContext from "../stores/authContext.js"

// import img1 from "./../public/img/ecommerce-catholique-saint-esprit-Dieu-amour.webp"

export default function Nav() {

    const {menuActive, mainmenu, myLoader,sommaire} = useContext(AuthContext)
    
    return <nav>
        <menu className="filAriane">
            <Link className="accueil" href="/" title="ecommerce religieux chrétien, sanctuaire du rosaire de bolobi, école catholique caritative d'adzopé saint martin de porez">
                    {/* <Image
                        loader={myLoader}
                        src={img1}
                        alt="Puissance Divine :  vente en ligne chrÃ©tien catholique, Puissance Divine :  vente en ligne religieux, Puissance Divine :  maria valtorta, Puissance Divine :  librairie vente en ligne, Puissance Divine :  maria valtorta, " 
                        title="sainte bible tob,  librairie ecommerce,  acheter publication religieuse chrÃ©tienne, ecommerce chrÃ©tien,  librairie ecommerce, " 
                        width="1"
                    /> */}
                    {/* <img src="/img/home.svg" alt="Page d'accueil de la librairie puissance divine d'amour" />  */}
                    
            </Link>
            {/* {console.log(menuActive)} */}
            {menuActive!="accueil" && menuActive && <>
                <span>&gt;</span>
                <Link className={menuActive} href={mainmenu.find(elt=>elt.id==menuActive)?.href} title={mainmenu.find(elt=>elt.id==menuActive)?.title}>
                    {/* <img src={"/img/"+menuActive+".svg"} alt={"Page '"+menuActive+"' de la librairie puissance divine d'amour"} /> */}
                </Link>
            </>}
        </menu>
        <h2 className="titrePage">
            {menuActive && <>
                <span>
                    <a 
                        href={"https://google.ci/search?q="+mainmenu.find(elt=>elt.id==menuActive)?.search}
                        title={"recherche google: "+mainmenu.find(elt=>elt.id==menuActive)?.search}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                    </a>
                    {mainmenu.find(elt=>elt.id==menuActive)?.titrePage[0]}
                </span>
                <a 
                    href={Object.values(mainmenu.find(elt=>elt.id==menuActive)?.sns)[0]}
                    title={"Facebook Page ("+menuActive+"): "+Object.keys(mainmenu.find(elt=>elt.id==menuActive)?.sns)[0]} 
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    {/* <img src={"/img/"+menuActive+".svg"} alt={"Page '"+menuActive+"' de la librairie puissance divine d'amour"} /> */}
                </a>
            </>}
        </h2>
        <h3 className="tagzonePage">
            {menuActive && <>
                {mainmenu.find(elt=>elt.id==menuActive)?.tagzone.map((elt,i)=><span key={"tagzone_"+menuActive+"_"+i}>{elt}, </span>)}
                <a target="_blank" href={mainmenu.find(elt=>elt.id==menuActive)?.sns[Object.keys(mainmenu.find(elt=>elt.id==menuActive)?.sns)[0]]} title={Object.keys(mainmenu.find(elt=>elt.id==menuActive)?.sns)[0]} rel="noopener noreferrer">
                    {/* <img src={"/img/"+menuActive+".svg"} alt={"Page '"+menuActive+"' de la librairie puissance divine d'amour"} /> */}
                </a>
            </>}
        </h3>
        {sommaire}
    </nav>
}
