"use client"

import { useEffect, useContext, useState } from "react";
import Link from "next/link";

import LogSignIn from "./_/LogSignIn.jsx"
import Subscribe from "./_/Subscribe.jsx"
import MenuMain from "./_/MenuMain.jsx"
import Hgroup from "./_/Hgroup.jsx"
import SNS from "./_/SNS.jsx"
import Playbox from "./_/Playbox.jsx"
import MenuSecondary from "./_/MenuSecondary.jsx"
import AuthContext from "../stores/authContext.js"
import EcomContext from "../stores/ecomContext.js"

export default function Header() {

    const { cartBox, isCartPage } = useContext(AuthContext)
    const { miniCart } = useContext(EcomContext)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    return <header>
        <Hgroup />
        <SNS />
        {/* <MenuMain /> */}

        <LogSignIn />
        {!isCartPage && <>
            <Link
                href="panier-ecommerce-religieux"
                title="Accedez au panier ecommerce religieux chrétien de la librairie puissance divine d'abidjan"
                id="panier"
                className={isScrolled ? 'is-sticky' : ''}
            >
            </Link>

            {miniCart()}

        </>}

    </header>
}
