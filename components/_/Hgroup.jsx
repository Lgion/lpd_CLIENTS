import {useState, useEffect, useContext} from 'react'
import Link from "next/link"
import Image from "next/image"
import AuthContext from "../../stores/authContext.js"
import img1 from "./../../public/img/ecommerce-chretien-notre-dame-toute-graces.webp"
import img2 from "./../../public/img/ecommerce-catholique-saint-esprit-Dieu-amour.webp"
import ecommerce from "./../../public/img/librairie-puissance-divine/librairie-religieuse-exterieur.webp"
import sanctuaire from "./../../public/img/_/eglise-du-rosaire-bolobi/eglise-exterieur.jpg"
import bolobi from "./../../public/img/_/bolobi/croix-bolobi.jpg"
import accueil from "./../../public/accueil.jpeg"

export default function Hgroup() {
    const myLoader = ({ src, width, quality }) => {
        return `${src}?w=${width}&q=${quality || 75}`
    }
    , {menuActive, setMenuActive} = useContext(AuthContext)
    , [imageContextuelMenu, setImageContextuelMenu] = useState(accueil)

    useEffect(()=>{
        console.log(menuActive);
        setMenuActive(menuActive == "" ? "accueil" : menuActive)
        switch(menuActive){
            case "ecommerce":setImageContextuelMenu(ecommerce)
            break;
            case "activites-spirituelles":setImageContextuelMenu(sanctuaire)
            break;
            case "bolobi":setImageContextuelMenu(bolobi)
            break;
            default: setImageContextuelMenu(accueil)
        }
    }, [menuActive])
    
    return <>
        <h1>
            <Link href="/" 
                id="logo" 
                onClick={()=>{setMenuActive("accueil")}}
                title="Librairie Puisance Divine, Abidjan, cocody 2 plateaux" >
                    <Image
                        // loader={myLoader}
                        src={img1}
                        alt={"Librairie Puisance Divine, Abidjan, cocody 2 plateaux"}
                        className=""
                        width={200}                                    height={200}
                        // fill="layout"
                    />
            </Link>
            <Link href="/" 
                className="imageContextuelMenu" 
                onClick={()=>{setMenuActive("accueil")}}
                title="Librairie religieuse chrétienne, abidjan 2plateaux rue des jardins">
                    <Image
                        // loader={myLoader}
                        src={imageContextuelMenu}
                        alt={"Librairie Puisance Divine, Abidjan, cocody 2 plateaux"}
                        className=""
                        width={200}                                    height={200}
                        // fill="layout"
                    />
            </Link>
            <Link href="/" 
                onClick={()=>{setMenuActive("accueil")}}
                title="Librairie religieuse chrétienne, abidjan 2plateaux rue des jardins">
                    <Image
                        // loader={myLoader}
                        src={img2}
                        alt={"Librairie Puisance Divine, Abidjan, cocody 2 plateaux"}
                        className=""
                        width={200}                                    height={200}
                        // fill="layout"
                    />
            </Link>
            {/* <span>Puissance Divine</span> */}
        </h1>
        <h2>
            SANCTUAIRE Notre Dame du ROSAIRE de Bolobi
            {/* <strong>Évangélisation</strong>, <strong>Prière</strong> et{" "}
            <strong>Assistance spirituelle</strong> */}
        </h2>
    </>
}
