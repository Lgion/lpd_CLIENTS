"use client"

import { useEffect, useContext } from 'react'
import { usePathname } from 'next/navigation'
import {EcomContextProvider} from '../stores/ecomContext.js'

import AuthContext from "../stores/authContext.js"
import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";

export default function ClientIsHome({children}) {

    const pathname = usePathname()
    , {isAdmin} = useContext(AuthContext)

    useEffect(() => {
        console.log(isAdmin);
    
    }, [isAdmin])
    
    return <EcomContextProvider>
        {((pathname && pathname?.indexOf('admin') == -1) || (!isAdmin && pathname?.indexOf('admin') != -1)) && <>
            <Header />

            <Nav />
        </>}
        {pathname?.indexOf('admin') == -1 && <>{children} <Footer /></>}
        
        
    </EcomContextProvider>
}
