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

                <div className="admin-dashboard__stat-card" style={{ borderLeft: '4px solid #4285F4' }}>
                    <div className="admin-dashboard__stat-card-icon" style={{ background: '#e8f0fe', color: '#4285F4' }}>📈</div>
                    <div className="admin-dashboard__stat-card-info">
                        <span className="stat-value">
                            {typeof stats?.gaData === 'object' ? stats.gaData.visitors : (stats?.gaData || '---')}
                        </span>
                        <span className="stat-label">Visiteurs (30J)</span>
                        {typeof stats?.gaData === 'object' && (
                            <span style={{ fontSize: '0.8em', color: '#666' }}>{stats.gaData.pageViews} vues</span>
                        )}
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

                {/* --- ANALYTICS SECTION (BEM) --- */}
                {typeof stats?.gaData === 'object' && (
                    <section className="admin-analytics">
                        <div className="admin-analytics__header">
                            <h2>
                                <span>📈</span> Statistiques de Visite (30 Derniers Jours)
                            </h2>
                        </div>
                        
                        <div className="admin-analytics__grid">
                            
                            {/* Performances Globales */}
                            <div className="admin-analytics__block">
                                <h3>Performances Globales</h3>
                                <div className="admin-analytics__list">
                                    <div className="admin-analytics__row">
                                        <label>Visiteurs Uniques:</label>
                                        <span className="admin-analytics__value admin-analytics__value--blue">{stats.gaData.visitors}</span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>Total des Visites (Sessions):</label>
                                        <span className="admin-analytics__value">{stats.gaData.sessions}</span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>Pages Vues:</label>
                                        <span className="admin-analytics__value">{stats.gaData.pageViews}</span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>Taux d'Engagement:</label>
                                        <span className="admin-analytics__value">{stats.gaData.engagementRate}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Origine Géographique */}
                            <div className="admin-analytics__block">
                                <h3>Origine Géographique</h3>
                                <div className="admin-analytics__list">
                                    {stats.gaData.countries?.length > 0 ? stats.gaData.countries.map((c, i) => (
                                        <div key={i} className="admin-analytics__item">
                                            <span className="admin-analytics__item-title">{c.country}</span>
                                            <span className="admin-analytics__item-badge">{c.users} visiteurs</span>
                                        </div>
                                    )) : (
                                        <span className="admin-dashboard__empty">Données géo. indisponibles</span>
                                    )}
                                </div>
                            </div>

                            {/* Actions & Engagement */}
                            <div className="admin-analytics__block">
                                <h3>Actions & Engagement</h3>
                                <div className="admin-analytics__list">
                                    <div className="admin-analytics__row">
                                        <label>💬 Clics WhatsApp:</label>
                                        <span className="admin-analytics__value admin-analytics__value--green">
                                            {stats.gaData.engagement?.contact_whatsapp || 0}
                                        </span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>👁️ Produits Consultés:</label>
                                        <span className="admin-analytics__value">
                                            {stats.gaData.engagement?.view_item || 0}
                                        </span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>🛒 Ajouts au Panier:</label>
                                        <span className="admin-analytics__value admin-analytics__value--blue">
                                            {stats.gaData.engagement?.add_to_cart || 0}
                                        </span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>❤️ Clic "Faire un Don":</label>
                                        <span className="admin-analytics__value">
                                            {stats.gaData.engagement?.begin_donation || 0}
                                        </span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>✅ Dons Confirmés:</label>
                                        <span className="admin-analytics__value admin-analytics__value--orange">
                                            {stats.gaData.engagement?.donation_complete || 0}
                                        </span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>📅 Bouton Réservation:</label>
                                        <span className="admin-analytics__value">
                                            {stats.gaData.engagement?.begin_reservation || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Performances E-commerce */}
                            <div className="admin-analytics__block">
                                <h3>Performances E-commerce</h3>
                                <div className="admin-analytics__list">
                                    <div className="admin-analytics__row">
                                        <label>Chiffre d'Affaires:</label>
                                        <span className="admin-analytics__value admin-analytics__value--blue">
                                            {stats.gaData.revenue?.toLocaleString('fr-FR')} XOF
                                        </span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>Transactions (Ventes):</label>
                                        <span className="admin-analytics__value">{stats.gaData.transactions}</span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>Panier Moyen:</label>
                                        <span className="admin-analytics__value">
                                            {stats.gaData.transactions > 0 ? Math.round(stats.gaData.revenue / stats.gaData.transactions).toLocaleString('fr-FR') : 0} XOF
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Top Produits Vendus */}
                            <div className="admin-analytics__block">
                                <h3>Top Produits Vendus</h3>
                                <div className="admin-analytics__list">
                                    {stats.gaData.topProducts?.length > 0 ? stats.gaData.topProducts.map((prod, index) => (
                                        <div key={index} className="admin-analytics__item">
                                            <span className="admin-analytics__item-title">{prod.name}</span>
                                            <span className="admin-analytics__item-badge">{prod.sold} vendus</span>
                                        </div>
                                    )) : (
                                        <span className="admin-dashboard__empty">Aucune vente ce mois-ci.</span>
                                    )}
                                </div>
                            </div>

                            {/* Top Pages */}
                            <div className="admin-analytics__block">
                                <h3>Top 5 des Pages</h3>
                                <div className="admin-analytics__list">
                                    {stats.gaData.topPages?.length > 0 ? stats.gaData.topPages.map((page, index) => (
                                        <div key={index} className="admin-analytics__item">
                                            <span className="admin-analytics__item-title">
                                                {page.title.split('-')[0]}
                                            </span>
                                            <span className="admin-analytics__item-badge">
                                                {page.views} vues
                                            </span>
                                        </div>
                                    )) : (
                                        <span className="admin-dashboard__empty">Aucune donnée enregistrée.</span>
                                    )}
                                </div>
                            </div>

                            {/* Générosité & École */}
                            <div className="admin-analytics__block">
                                <h3>Générosité & École</h3>
                                <div className="admin-analytics__list">
                                    <div className="admin-analytics__row">
                                        <label>Dons Reçus (30j):</label>
                                        <span className="admin-analytics__value admin-analytics__value--green">
                                            {stats.gaData.donationCount} dons
                                        </span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>Total Collecté:</label>
                                        <span className="admin-analytics__value">
                                            {stats.gaData.donationValue?.toLocaleString('fr-FR')} XOF
                                        </span>
                                    </div>
                                    <div className="admin-analytics__row">
                                        <label>Don Moyen:</label>
                                        <span className="admin-analytics__value">
                                            {stats.gaData.donationCount > 0 ? Math.round(stats.gaData.donationValue / stats.gaData.donationCount).toLocaleString('fr-FR') : 0} XOF
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Acquisition Sources */}
                            <div className="admin-analytics__block">
                                <h3>Origine du Trafic</h3>
                                <div className="admin-analytics__list">
                                    {stats.gaData.sources?.length > 0 ? stats.gaData.sources.map((src, index) => (
                                        <div key={index} className="admin-analytics__row">
                                            <label>
                                                {src.name === '(direct)' ? '🔗 Accès Direct' : src.name === 'google' ? '🔍 Google' : src.name.includes('facebook') ? '👥 Facebook' : src.name}
                                            </label>
                                            <span className="admin-analytics__value admin-analytics__value--blue">{src.sessions} sessions</span>
                                        </div>
                                    )) : (
                                          <span className="admin-dashboard__empty">Sources non identifiées.</span>
                                    )}
                                </div>
                            </div>

                            {/* Devices Distribution */}
                            <div className="admin-analytics__block">
                                <h3>Appareils Utilisés</h3>
                                <div className="admin-analytics__list">
                                    {stats.gaData.devices?.length > 0 ? stats.gaData.devices.map((device, index) => (
                                        <div key={index} className="admin-analytics__row">
                                            <span className="admin-analytics__item-device">
                                                {device.device === 'mobile' ? '📱 Mobile' : device.device === 'desktop' ? '💻 Ordinateur' : '💊 Tablette'}
                                            </span>
                                            <span className="admin-analytics__value">{device.users} visiteurs</span>
                                        </div>
                                    )) : (
                                          <span className="admin-dashboard__empty">Non identifiés.</span>
                                    )}
                                </div>
                            </div>

                            {/* Engagement per Page (Top Duration) */}
                            <div className="admin-analytics__block">
                                <h3>Attention par Page</h3>
                                <div className="admin-analytics__list">
                                    {stats.gaData.engagementPages?.length > 0 ? stats.gaData.engagementPages.map((page, index) => (
                                        <div key={index} className="admin-analytics__item">
                                            <span className="admin-analytics__item-title">
                                                {page.title.split('-')[0]}
                                            </span>
                                            <span className="admin-analytics__value admin-analytics__value--orange">
                                                {page.duration} sec
                                            </span>
                                        </div>
                                    )) : (
                                          <span className="admin-dashboard__empty">Données manquantes.</span>
                                    )}
                                </div>
                            </div>

                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
