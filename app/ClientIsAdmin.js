"use client"

import { useContext, useMemo, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from "@clerk/nextjs"

import AuthContext from "../stores/authContext.js"
import { AdminContextProvider } from '../stores/adminContext.js'
import NotConnectedPage from "./NotConnectedPage.jsx"
import AccessDenied from "./admin/AccessDenied"
import HeaderAdmin from "./HeaderAdmin"

export default function ClientIsAdmin({ children }) {
    const pathname = usePathname()
    const { isAdmin, setIsAdmin, setRole } = useContext(AuthContext)
    const { isLoaded, isSignedIn, user } = useUser()

    // Extraction synchrone des emails pour éviter tout délai d'effet
    const userEmails = useMemo(() => {
        if (!user) return []
        return [
            user?.primaryEmailAddress?.emailAddress,
            ...(user?.emailAddresses || []).map(e => e?.emailAddress)
        ].filter(Boolean).map(e => String(e).toLowerCase())
    }, [user])

    const envAdminRaw = (process.env.NEXT_PUBLIC_EMAIL_ADMIN || 'hi.cyril@gmail.com puissancedamour@yahoo.fr legion.athenienne@gmail.com').toLowerCase()

    // Calcul synchrone de l'état administrateur
    const isUserAdmin = useMemo(() => {
        if (!isSignedIn || !user || userEmails.length === 0) return false
        return userEmails.some(email => 
            envAdminRaw.includes(email) ||
            email.includes('legion.athenienne') ||
            email.includes('hi.cyril') ||
            email.includes('puissancedamour')
        )
    }, [isSignedIn, user, userEmails, envAdminRaw])

    // Trace détaillée d'information pour le débogage (Frontend Console)
    useEffect(() => {
        console.log('[DEBUG ADMIN Frontend ClientIsAdmin]', {
            pathname,
            isLoaded,
            isSignedIn,
            userId: user?.id || null,
            userEmails,
            envAdminRaw,
            isUserAdmin,
            contextIsAdmin: isAdmin,
            effectiveAdmin: isAdmin || isUserAdmin
        })
    }, [pathname, isLoaded, isSignedIn, user, userEmails, envAdminRaw, isUserAdmin, isAdmin])

    // Synchronisation avec AuthContext
    useEffect(() => {
        if (!isLoaded) return

        if (isUserAdmin) {
            if (!isAdmin) setIsAdmin(true)
            let myRole = "admin"
            const primaryEmail = userEmails[0] || ''
            if (primaryEmail.includes("puissancedamour")) myRole = "editeur"
            else if (primaryEmail.includes("prof")) myRole = "enseignant"
            setRole(myRole)
        } else if (!isSignedIn) {
            if (isAdmin) setIsAdmin(false)
        }
    }, [isLoaded, isSignedIn, isUserAdmin, isAdmin, setIsAdmin, setRole, userEmails])

    const isAdminPath = pathname?.indexOf('admin') !== -1

    if (!isAdminPath) return null

    if (!isLoaded) return <NotConnectedPage />

    // Si l'utilisateur est reconnu admin synchro ou dans le contexte, on accorde l'accès
    const effectiveAdmin = isAdmin || isUserAdmin

    if (!effectiveAdmin) return <AccessDenied />

    return (
        <AdminContextProvider>
            <HeaderAdmin />
            {children}
        </AdminContextProvider>
    )
}
