"use client"

import { useEffect, useContext } from 'react'
import { usePathname } from 'next/navigation'

import AuthContext from "../stores/authContext.js"
import Header from "./Header";
import Nav from "./Nav";

export default function ClientIsHome({children}) {

    const pathname = usePathname()
    , {isAdmin} = useContext(AuthContext)

    useEffect(() => {
        console.log(isAdmin);
    
    }, [isAdmin])
    
    return <>
        {((pathname && pathname?.indexOf('admin') == -1) || (!isAdmin && pathname?.indexOf('admin') != -1)) && <>
            <Header />

            <Nav />
        </>}
        {pathname?.indexOf('admin') == -1 && children}
    </>
}
