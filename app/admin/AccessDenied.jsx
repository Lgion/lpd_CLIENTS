'use client'

import { useEffect } from 'react'
import { SignInButton, SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs'
import Link from 'next/link'

export default function AccessDenied() {
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()

  useEffect(() => {
    console.log('[DEBUG ADMIN Frontend AccessDenied Rendered]', {
      isSignedIn,
      userEmail: user?.primaryEmailAddress?.emailAddress || 'NON_CONNECTE',
      userId: user?.id || null
    })
  }, [user, isSignedIn])

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          🔒
        </div>
        
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '0.75rem'
        }}>
          Accès Administrateur Requis
        </h2>

        <p style={{
          color: '#94a3b8',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          {user ? (
            <>
              Vous êtes connecté avec <strong style={{ color: '#e2e8f0' }}>{user.primaryEmailAddress?.emailAddress}</strong>, mais ce compte ne possède pas les privilèges administrateur.
            </>
          ) : (
            <>
              Votre session a expiré ou vous n'êtes pas connecté. Veuillez vous connecter avec votre compte administrateur pour accéder à cette interface.
            </>
          )}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/admin" fallbackRedirectUrl="/admin">
              <button style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                backgroundColor: '#c9a84c',
                color: '#0f172a',
                fontWeight: '600',
                fontSize: '1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                boxShadow: '0 4px 6px -1px rgba(201, 168, 76, 0.3)'
              }}>
                🔑 Se connecter à l'administration
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <button 
              onClick={() => signOut()}
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              🔄 Se déconnecter pour changer de compte
            </button>
          </SignedIn>

          <Link 
            href="/" 
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}
          >
            ← Retourner à l'accueil du site
          </Link>
        </div>
      </div>
    </div>
  )
}
