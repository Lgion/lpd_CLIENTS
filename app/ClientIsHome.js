"use client"

import { useEffect, useContext } from 'react'
import { usePathname } from 'next/navigation'
import { EcomContextProvider } from '../stores/ecomContext.js'

import AuthContext from "../stores/authContext.js"
import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";

export default function ClientIsHome({ children }) {
    const pathname = usePathname();
    const { isAdmin } = useContext(AuthContext);

    const isProductPage = pathname?.indexOf('vente-en-ligne') !== -1;
    const isAdminPage = pathname?.indexOf('admin') !== -1;

    useEffect(() => {
        console.log("IsAdmin:", isAdmin);
    }, [isAdmin]);

    return (
        <EcomContextProvider>
            {((pathname && !isAdminPage && !isProductPage) || (!isAdmin && isAdminPage)) && (
                <>
                    <Header />
                    <Nav />
                </>
            )}
            
            {!isAdminPage && (
                <>
                    {children}
                    {!isProductPage && <Footer />}
                </>
            )}


            {/* Seul ClientIsAdmin gère l'affichage de children pour les pages Admin */}
        </EcomContextProvider>
    );
}
