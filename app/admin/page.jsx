'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [latestReservations, setLatestReservations] = useState([])
    const [latestSales, setLatestSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const response = await fetch('/api/admin/dashboard_stats')
                if (!response.ok) throw new Error('Erreur lors du chargement des données')
                const data = await response.json()
                setStats(data.stats)
                setLatestReservations(data.latestReservations)
                setLatestSales(data.latestSales)
                setLoading(false)
            } catch (err) {
                console.error(err)
                setError(err.message)
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                Chargement du tableau de bord...
            </div>
        )
    }

    if (error) {
        return (
            <div className="admin-error">
                <h2>Oups! Une erreur est survenue</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Réessayer</button>
            </div>
        )
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-dashboard__header">
                <h1>Tableau de Bord</h1>
                <p>Bienvenue dans l'interface de gestion Bolobi. Voici un aperçu de l'activité récente.</p>
            </header>

            <div className="admin-dashboard__stats-grid">
                <div className="admin-dashboard__stat-card">
                    <div className="admin-dashboard__stat-card-icon admin-dashboard__stat-card-icon--blue">📅</div>
                    <div className="admin-dashboard__stat-card-info">
                        <span className="stat-value">{stats?.totalReservations || 0}</span>
                        <span className="stat-label">Réservations</span>
                    </div>
                </div>
                
                <div className="admin-dashboard__stat-card">
                    <div className="admin-dashboard__stat-card-icon admin-dashboard__stat-card-icon--green">🛍️</div>
                    <div className="admin-dashboard__stat-card-info">
                        <span className="stat-value">{stats?.totalSalesCount || 0}</span>
                        <span className="stat-label">Ventes Ecommerce</span>
                    </div>
                </div>

                <div className="admin-dashboard__stat-card">
                    <div className="admin-dashboard__stat-card-icon admin-dashboard__stat-card-icon--purple">💰</div>
                    <div className="admin-dashboard__stat-card-info">
                        <span className="stat-value">{(stats?.totalSalesRevenue || 0).toLocaleString('fr-FR')} FCFA</span>
                        <span className="stat-label">Chiffre d'Affaires</span>
                    </div>
                </div>

                <div className="admin-dashboard__stat-card">
                    <div className="admin-dashboard__stat-card-icon admin-dashboard__stat-card-icon--orange">📦</div>
                    <div className="admin-dashboard__stat-card-info">
                        <span className="stat-value">{stats?.totalProducts || 0}</span>
                        <span className="stat-label">Produits en Stock</span>
                    </div>
                </div>
            </div>

            <div className="admin-dashboard__content-grid">
                <section className="admin-dashboard__section">
                    <div className="admin-dashboard__section-header">
                        <h2>Dernières Réservations</h2>
                        <Link href="/admin/sanctuaire" className="view-all">Tout voir →</Link>
                    </div>
                    <div className="admin-dashboard__list">
                        {latestReservations.length > 0 ? (
                            latestReservations.map((res) => (
                                <div key={res._id} className="admin-dashboard__list-item">
                                    <div className="admin-dashboard__list-item-main">
                                        <span className="title">{res.names}</span>
                                        <span className="subtitle">
                                            {new Date(res.from).toLocaleDateString('fr-FR')} - {res.participants} participants
                                        </span>
                                    </div>
                                    <div className="admin-dashboard__list-item-meta">
                                        <span className="amount">{(res.montant_total || 0).toLocaleString('fr-FR')} FCFA</span>
                                        <span className="date">
                                            {res.isValidated ? "✅ Confirmé" : "⏳ En attente"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="admin-dashboard__empty">Aucune réservation récente.</div>
                        )}
                    </div>
                </section>

                <section className="admin-dashboard__section">
                    <div className="admin-dashboard__section-header">
                        <h2>Ventes Récentes</h2>
                        <Link href="/admin/ecommerce" className="view-all">Gérer les produits →</Link>
                    </div>
                    <div className="admin-dashboard__list">
                        {latestSales.length > 0 ? (
                            latestSales.map((sale, index) => (
                                <div key={`${sale.id_produits}-${index}`} className="admin-dashboard__list-item">
                                    <div className="admin-dashboard__list-item-main">
                                        <span className="title" dangerouslySetInnerHTML={{ __html: sale.fr || 'Produit sans titre' }} />
                                        <span className="subtitle">Client: {sale.userName}</span>
                                    </div>
                                    <div className="admin-dashboard__list-item-meta">
                                        <span className="amount">{(parseFloat(sale.total) || 0).toLocaleString('fr-FR')} FCFA</span>
                                        <span className="date">
                                            {sale.date ? new Date(sale.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="admin-dashboard__empty">Aucune vente enregistrée récemment.</div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
