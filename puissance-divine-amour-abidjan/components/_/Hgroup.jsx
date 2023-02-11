// import React from 'react'
import Link from "next/link"
import Image from "next/image"
// import img1 from "./../../public/img/ecommerce-chretien-notre-dame-toute-graces.webp"
// import img2 from "./../../public/img/ecommerce-catholique-saint-esprit-Dieu-amour.webp"

export default function Hgroup() {
    const myLoader = ({ src, width, quality }) => {
        return `https://example.com/${src}?w=${width}&q=${quality || 75}`
    }
    return <>
        <h1>
            <Link href="/">
                <a id="logo" >
                    {/* <Image
                        loader={myLoader}
                        src={img1}
                        alt={"Librairie Puisance Divine, Abidjan, cocody 2 plateaux"}
                        className=" absolute cg"
                        width={200}
                    /> */}
                </a>
            </Link>
            <Link href="/">
                <a>
                    {/* <Image
                        loader={myLoader}
                        src={img2}
                        alt={"Librairie Puisance Divine, Abidjan, cocody 2 plateaux"}
                        className=" absolute cg"
                    /> */}
                </a>
            </Link>
            <span>Puissance Divine</span>
        </h1>
        <h2>
            <strong>Évangélisation</strong>, <strong>Prière</strong> et{" "}
            <strong>Assistance spirituelle</strong>
        </h2>
    </>
}
