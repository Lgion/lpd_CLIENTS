"use client"

import {useContext, useMemo, useCallback, useEffect} from 'react'
import { usePathname } from 'next/navigation'
import { ClerkLoaded } from "@clerk/nextjs"

import AuthContext from "../stores/authContext.js"
import {AdminContextProvider} from '../stores/adminContext.js'
import NotConnectedPage from "./NotConnectedPage.jsx"
import AccessDenied from "./admin/AccessDenied"
import HeaderAdmin from "./HeaderAdmin"

export default function ClientIsAdmin({children}) {
    const pathname = usePathname()
    const {isAdmin, setIsAdmin} = useContext(AuthContext)

    // Ajout temporaire pour déboguer
    // setIsAdmin(true)
    
    useEffect(() => {
        console.log('ClientIsAdmin re-render causé par:', {
            pathname,
            isAdmin
        })
    }, [pathname, isAdmin])

    const renderContent = useCallback(() => {
        const isAdminPath = pathname?.indexOf('admin') !== -1
        
        console.log(isAdminPath);
        console.log(isAdmin);
        
        
        
        if (!isAdminPath) return null
        
        if (!ClerkLoaded) return <NotConnectedPage />

        if (!isAdmin) return <AccessDenied />
        
        return (
            <AdminContextProvider>
                <HeaderAdmin />
                {children}
            </AdminContextProvider>
        )
    }, [pathname, isAdmin, children])

    return useMemo(() => renderContent(), [renderContent])
}
