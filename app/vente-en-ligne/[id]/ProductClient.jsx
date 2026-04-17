"use client";

import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import EcomContext from "../../../stores/ecomContext";
import "./product-page.scss";

export default function ProductClient({ article }) {
    const { setCartBox, miniCart, CartLS, updateCart } = useContext(EcomContext);
    const [qty, setQty] = useState(1);

    // Table de correspondance des dossiers d'images (identique à app/ecom/page.jsx)
    const articles_img_table = {
        'tableau/icone': "icone-religieuse",
        'livret P.D': "publication-puissance-divine",
        'bibles': "sainte-bible",
        'NEI': "sainte-bible",
        'texte&priere': "sainte-bible",
        'divers': "divers",
        'croixp': "croix-jesus",
        'croixm': "croix-jesus",
        'croix': "croix-jesus",
        'encens': "encens-priere",
        'statue': "statue-religieuse",
        'grotte': "statue-religieuse",
        'chapelet': "chapelet-priere",
        'aLaUne': "aLaUne",
    };

    // Construction du chemin de l'image
    const folder = articles_img_table[article.nom] || "divers";
    const imgPath = article.img ? `/img/vente-religieuse/${folder}/${article.img}.webp` : "/img/_/placeholder.webp";

    // GA4 : Tracking de la vue produit au chargement
    useEffect(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'view_item', {
                currency: 'XOF',
                value: parseFloat(article.prix),
                items: [{
                    item_id: article._id,
                    item_name: article.nom,
                    price: parseFloat(article.prix)
                }]
            });
        }
    }, [article]);

    const handleAddToCart = () => {
        if (qty < 1 || qty > 99) return alert("Quantité invalide");

        const cart_id = JSON.stringify({
            id: article._id,
            title: article.nom,
            price: article.prix
        });

        // Mise à jour du localStorage via votre manager existant
        const currentCart = CartLS.getAllFavoris();
        currentCart[cart_id] = (parseInt(currentCart[cart_id] || 0) + parseInt(qty)).toString();
        CartLS.saveArticle(currentCart);
        
        // Mise à jour du contexte et affichage du mini panier
        updateCart();
        setCartBox(miniCart());

        // GA4 : Tracking de l'ajout
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'add_to_cart', {
                currency: 'XOF',
                value: parseFloat(article.prix) * qty,
                items: [{
                    item_id: article._id,
                    item_name: article.nom,
                    price: parseFloat(article.prix),
                    quantity: parseInt(qty)
                }]
            });
        }

        // Petit feedback visuel (optionnel car miniCart s'affiche)
        document.getElementById('panier')?.classList.add('active');
        setTimeout(() => document.getElementById('panier')?.classList.remove('active'), 3000);
    };

    return (
        <div className="product-page">
            {/* Nouveau Header de Marque Premium */}
            <div className="product-brand-hero">
                <div className="product-brand-hero__content">
                    <Link href="/" title="Retour à l'accueil du Sanctuaire Bolobi & Librairie Puissance Divine" className="product-brand-hero__logo">
                        <span className="lib">Librairie</span> <span className="pui">Puissance</span> <span className="div">Divine</span>
                    </Link>
                    <p className="product-brand-hero__slogan">Nourrir votre foi, éclairer votre vie spirituelle</p>
                </div>
            </div>

            <div className="product-view">
                {/* Header de navigation de la page produit */}
                <header className="product-header">
                    <div className="product-header__container">
                        <Link href="/ecom" title="Revenir à la liste de tous les articles de la boutique chrétienne" className="product-header__back">
                            ← Retour au ecommerce
                        </Link>
                        <h1 className="titrePage" title={`Page produit : ${article.fr || article.nom}`} dangerouslySetInnerHTML={{ __html: article.fr || article.nom }}></h1>
                    </div>
                </header>

                <div className="product-view__container">
                    <div className="product-view__grid">
                        {/* Colonne Image */}
                        <div className="product-view__media">
                            <div className="product-view__image-wrapper">
                                <Image 
                                    src={imgPath} 
                                    alt={article.fr || article.nom}
                                    title={`Agrandissement de l'article religieux : ${article.fr || article.nom}`}
                                    width={600}
                                    height={600}
                                    priority
                                    className="product-view__image"
                                />
                            </div>
                        </div>

                        {/* Colonne Infos */}
                        <div className="product-view__content">
                            <div className="product-view__badge">{article.user_name === 'publication' ? '📜 Publication' : '🏺 Objet'}</div>
                            <h2 className="product-view__title" title={article.fr || article.nom} dangerouslySetInnerHTML={{ __html: article.fr || article.nom }}></h2>
                            {article.auteur && (
                                <p 
                                    className="product-view__author" 
                                    title={`Auteur de l'ouvrage : ${article.auteur.replace(/<[^>]*>?/gm, '')}`}
                                    dangerouslySetInnerHTML={{ __html: "Par " + article.auteur }}
                                ></p>
                            )}
                            
                            <div className="product-view__price">{parseFloat(article.prix).toLocaleString('fr-FR')} XOF</div>
                            
                            <div className="product-view__description">
                                <h3>Description</h3>
                                <p dangerouslySetInnerHTML={{ __html: article.fr1 || article.fr || "Aucune description disponible pour cet article." }}></p>
                            </div>

                            {article.taille && (
                                <div className="product-view__meta">
                                    <strong>Taille :</strong> {article.taille}
                                </div>
                            )}

                            <div className="product-view__actions">
                                <div className="product-view__qty-selector">
                                    <label>Quantité</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max="99" 
                                        value={qty} 
                                        onChange={(e) => setQty(e.target.value)}
                                    />
                                </div>
                                <button className="product-view__add-btn" onClick={handleAddToCart}>
                                    Ajouter au panier
                                </button>
                            </div>

                            <div className="product-view__security">
                                <span>✅ Paiement sécurisé via Wave / Orange Money</span>
                                <span>📦 Expédition rapide depuis le Sanctuaire</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
