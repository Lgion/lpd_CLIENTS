import React from 'react'
import Link from "next/link"
import Image from "next/image"

// import img1 from "./../public/img/ecommerce-catholique-saint-esprit-Dieu-amour.webp"

export default function Nav() {
    const myLoader = ({ src, width, quality }) => {
        return `https://example.com/${src}?w=${width}&q=${quality || 75}`
    }
    
    return <nav>
        <h2 className="filAriane">
            <Link href="/">
                <a  title="sainte bible tob,  librairie ecommerce,  acheter publication religieuse chrÃ©tienne, ecommerce chrÃ©tien,  librairie ecommerce, ">
                    {/* <Image
                        loader={myLoader}
                        src={img1}
                        alt="Puissance Divine :  vente en ligne chrÃ©tien catholique, Puissance Divine :  vente en ligne religieux, Puissance Divine :  maria valtorta, Puissance Divine :  librairie vente en ligne, Puissance Divine :  maria valtorta, " 
                        title="sainte bible tob,  librairie ecommerce,  acheter publication religieuse chrÃ©tienne, ecommerce chrÃ©tien,  librairie ecommerce, " 
                        width="1"
                    /> */}
                    Accueil
                </a>
            </Link>
        </h2>
        <h3 className="titrePage">{"titre à intégrer"}</h3>
        <h4 className="tagzonePage">{"tagzone à intégrer"}</h4>
    </nav>
}
