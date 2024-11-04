// "use client"

import { useEffect, useContext } from "react";
import Link from "next/link";

import LogSignIn from "./_/LogSignIn.jsx"
import Subscribe from "./_/Subscribe.jsx"
import MenuMain from "./_/MenuMain.jsx"
import Hgroup from "./_/Hgroup.jsx"
import SNS from "./_/SNS.jsx"
import Playbox from "./_/Playbox.jsx"
import MenuSecondary from "./_/MenuSecondary.jsx"
import AuthContext from "../stores/authContext.js"

export default function Header() {

    const { cartBox, isCartPage } = useContext(AuthContext)
    , getClass = (item, i) => { alert('okk') }

    //   useEffect(() => {
    //     console.log(pathname);

    //   }, [])


    return <header>
        <Hgroup />
        <SNS />
        <MenuMain />

        <LogSignIn />
        {!isCartPage && <>
            <Link
                href="panier-ecommerce-religieux"
                title="Accedez au panier ecommerce religieux chrétien de la librairie puissance divine d'abidjan"
                // title="Accéder à la page panier, ou visualiser son contenu, ou encore modifier le rapidement ici à la volé"
                id="panier"
                onClick={() => { setMenuActive("accueil") }}
            >
            </Link>
            {cartBox}
        </>}
        {/* <Subscribe /> */}
        {/* <MenuSecondary /> */}
        <Playbox />
    </header>
}
