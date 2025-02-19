'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Ecommerce_articles from "../../../assets/datas/articles.js"
import Ecommerce_articles_OPTIONS from "../../../assets/datas/articles_options.js"
import { handleAddToCart } from "../../../utils/handleEvents.js"
import './style.scss'

export default function ProductPage({ params }) {
    const [product, setProduct] = useState(null)
    const [option, setOption] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [cartBox, setCartBox] = useState(false)

    const myLoader = ({ src }) => src

    useEffect(() => {
        // Trouver le produit correspondant à l'ID
        const foundProduct = Ecommerce_articles.articles.data.find(
            item => item.id_produits.toString() === params.id
        )
        
        if (foundProduct) {
            setProduct(foundProduct)
            // Trouver l'option correspondante
            const foundOption = Ecommerce_articles_OPTIONS.data.find(
                el => el.img_article === foundProduct.img && 
                (foundProduct.autre === (el.opt_nom||"") || foundProduct.taille === el.taille_||"")
            )
            setOption(foundOption)
        }
    }, [params.id])

    if (!product) {
        return (
            <main className="product-page">
                <div className="not-found">
                    <h1>Produit non trouvé</h1>
                    <Link href="/ecommerce-chretien-abidjan" className="back-link">
                        Retourner à la boutique
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="product-page">
            <nav className="breadcrumb">
                <Link href="/ecommerce-chretien-abidjan">Boutique</Link>
                <span> / </span>
                <span>{product.fr}</span>
            </nav>

            <div className="product-details">
                <div className="product-image">
                    <Image
                        loader={myLoader}
                        src={`/img/vente-religieuse/${Ecommerce_articles.articles_img_table[product.nom]}/${product.img}.webp`}
                        alt={product.fr}
                        width={600}
                        height={600}
                        objectFit="contain"
                        priority
                    />
                </div>

                <div className="product-info">
                    <h1>{product.fr}</h1>
                    
                    {option && (
                        <div className="product-options">
                            {option.coloris && (
                                <div className="option">
                                    <span className="label">Coloris:</span>
                                    <span className="value">{option.coloris}</span>
                                </div>
                            )}
                            {option.couverture && (
                                <div className="option">
                                    <span className="label">Couverture:</span>
                                    <span className="value">{option.couverture}</span>
                                </div>
                            )}
                            {option.opt_nom && (
                                <div className="option">
                                    <span className="label">Option:</span>
                                    <span className="value">{option.opt_nom}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="product-description">
                        <p>{product.fr1}</p>
                        {product.dimensions && (
                            <p className="dimensions">
                                <strong>Dimensions:</strong> {product.dimensions}
                            </p>
                        )}
                    </div>

                    <div className="price-section">
                        <div className="price">{product.prix} €</div>
                        <div className="quantity">
                            <label htmlFor="quantity">Quantité:</label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                max="99"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.min(Math.max(parseInt(e.target.value) || 1, 1), 99))}
                            />
                        </div>
                    </div>

                    <button
                        className="add-to-cart"
                        onClick={(e) => {
                            const fakeEvent = {
                                target: {
                                    dataset: {
                                        id: product.id_produits,
                                        coloris: option?.coloris || "",
                                        couverture: option?.couverture || "",
                                        option_name: option?.opt_nom || "",
                                        price: product.prix
                                    }
                                }
                            }
                            handleAddToCart(fakeEvent, setCartBox)
                        }}
                    >
                        Ajouter au panier
                    </button>
                </div>
            </div>
        </main>
    )
}
