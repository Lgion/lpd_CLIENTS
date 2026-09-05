import { useState, useEffect, useContext, useMemo } from 'react'
import Link from "next/link";
import { SignInButton, SignUpButton, UserProfile, UserButton, useAuth, useUser, SignedIn, SignedOut, useClerk } from "@clerk/nextjs"

import AuthContext from "../../stores/authContext.js"

export default function LogSignIn() {

    const [isCartPage, setIsCartPage] = useState()
        , { isAdmin, setIsAdmin, role, setRole } = useContext(AuthContext)
        , { isLoaded, isSignedIn, user } = useUser()
        , { signOut } = useClerk();

    // Extraction synchrone des e-mails utilisateur
    const userEmails = useMemo(() => {
        if (!user) return []
        return [
            user?.primaryEmailAddress?.emailAddress,
            ...(user?.emailAddresses || []).map(e => e?.emailAddress)
        ].filter(Boolean).map(e => String(e).toLowerCase())
    }, [user])

    const envAdminRaw = (process.env.NEXT_PUBLIC_EMAIL_ADMIN || 'hi.cyril@gmail.com puissancedamour@yahoo.fr legion.athenienne@gmail.com').toLowerCase()

    // Evaluation synchrone du statut administrateur
    const isUserAdmin = useMemo(() => {
        if (!isSignedIn || !user || userEmails.length === 0) return false
        return userEmails.some(email => 
            envAdminRaw.includes(email) ||
            email.includes('legion.athenienne') ||
            email.includes('hi.cyril') ||
            email.includes('puissancedamour')
        )
    }, [isSignedIn, user, userEmails, envAdminRaw])

    // Trace détaillée frontend
    useEffect(() => {
        console.log('[DEBUG ADMIN Frontend LogSignIn]', {
            isLoaded,
            isSignedIn,
            userId: user?.id || null,
            userEmails: JSON.stringify(userEmails),
            isUserAdmin,
            contextIsAdmin: isAdmin
        })
    }, [isLoaded, isSignedIn, user, userEmails, isUserAdmin, isAdmin])

    // Redirection automatique vers /admin dès la connexion d'un administrateur
    useEffect(() => {
        if (!isLoaded || !isSignedIn || !isUserAdmin) return

        const redirectDone = sessionStorage.getItem('admin_login_redirect_done')
        if (!redirectDone) {
            sessionStorage.setItem('admin_login_redirect_done', 'true')
            console.log('[DEBUG ADMIN LogSignIn] Redirection automatique vers /admin pour le compte admin connecté')
            window.location.href = '/admin'
        }
    }, [isLoaded, isSignedIn, isUserAdmin])

    useEffect(() => {
        if (!isLoaded) return

        if (!isSignedIn || !user) {
            if (isAdmin) setIsAdmin(false)
            sessionStorage.removeItem('admin_login_redirect_done')
            return
        }

        if (isUserAdmin) {
            if (!isAdmin) setIsAdmin(true)
            let myRole = "admin"
            const primaryEmail = userEmails[0] || ''
            if (primaryEmail.includes("puissancedamour")) myRole = "editeur"
            else if (primaryEmail.includes("prof")) myRole = "enseignant"
            setRole(myRole)
        } else {
            if (isAdmin) setIsAdmin(false)
        }

        // --- Ajout récupération/création user MongoDB et stockage localStorage ---
        const email = user?.primaryEmailAddress?.emailAddress;
        if (email && !localStorage.getItem('user')) {
            fetch(`/api/users?email=${encodeURIComponent(email)}`)
                .then(async res => {
                    if (res.ok) {
                        const data = await res.json();
                        localStorage.setItem('user', JSON.stringify(data.user));
                    } else if (res.status === 404) {
                        // Créer l'utilisateur si non trouvé
                        return fetch('/api/users', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email }),
                        })
                            .then(res => res.json())
                            .then(data => {
                                localStorage.setItem('user', JSON.stringify(data.user));
                            });
                    }
                })
                .catch(err => {
                    console.error('Erreur lors de la récupération/creation du user:', err);
                });
        }
        // --- Fin ajout ---
    }, [isLoaded, user, isSignedIn, isAdmin, setIsAdmin, setRole, isUserAdmin, userEmails])

    useEffect(() => {
        (() => { setIsCartPage(document.querySelector('#__next>main.cart')) })()
    }, [])

    const effectiveAdmin = isAdmin || isUserAdmin

    return <div id="log_and_sign_in" className={isSignedIn ? "connected" : ""}>
        <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/admin" fallbackRedirectUrl="/admin" title="Se connecter/S'inscrire">&nbsp;</SignInButton>
        </SignedOut>

        <SignedIn>
            <UserButton afterSignOutUrl="/" />
            {effectiveAdmin && (
                <Link href="/admin" style={{ fontSize: '0.8rem', padding: '2px 8px', background: '#333', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
                    Admin
                </Link>
            )}
        </SignedIn>
        <form id="connexion" action="index.php?admin=ok" method="post">
            <input type="text" name="user" placeholder="nom utilisateur" />
            <input type="password" name="pwd" placeholder="**********" />
            <input
                style={{
                    padding: 0,
                    width: "95%",
                    height: "50px",
                    cursor: "pointer",
                    color: "goldenrod",
                    fontSize: "1em",
                }}
                type="submit"
                value="ok"
            />
        </form>
    </div>
}
