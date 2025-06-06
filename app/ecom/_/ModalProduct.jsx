import Link from "next/link"
import Image from "next/image"
import AuthContext from "../../../stores/authContext.js"
import styles from './ShareButton.module.css'

export default function ModalProduct({myLoader, item, img, setCartBox, option, handleAddToCart}) {
    const handleChange = e => {
        const qty = parseInt(e.target.value);
        e.target.value = Math.min(Math.max(qty, 1), 99);
    }

    return (
        <div className="modal___product">
            <div className="modal___header">
                <h2>{item.fr}</h2>
                {option && (
                    <div className="product-variants">
                        {option.coloris && <span className="variant-tag">Coloris: {option.coloris}</span>}
                        {option.couverture && <span className="variant-tag">Couverture: {option.couverture}</span>}
                        {option.opt_nom && <span className="variant-tag">Option: {option.opt_nom}</span>}
                    </div>
                )}
            </div>

            <div className="modal___content">
                <div className="product-image">
                    <Image
                        loader={myLoader}
                        src={img}
                        alt={item.fr__}
                        width={400}
                        height={400}
                        objectFit="contain"
                    />
                </div>
                
                <div className="product-details">
                    <div className="description">
                        <p>{item.fr1}</p>
                        {item.dimensions && (
                            <p className="dimensions">
                                <strong>Dimensions:</strong> {item.dimensions}
                            </p>
                        )}
                    </div>

                    <div className="price-section">
                        <div className="price">{item.prix} €</div>
                        <div className="quantity">
                            <label htmlFor="qty">Quantité:</label>
                            <input
                                id="qty"
                                className="qty-input"
                                onChange={handleChange}
                                defaultValue="1"
                                type="number"
                                min="1"
                                max="99"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal___footer">
                <Link
                    href={`vente-en-ligne/${item.id_produits}`}
                    className="view-details"
                    target="_blank"
                >
                    Ouvrir lien direct du produit
                </Link>
                <div className="shareOneProduct" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div className={styles.shareDropdown}>
                        <button 
                            className={styles.shareBtn}
                            title="Partager"
                        >
                        </button>
                        <div className={styles.shareMenu}>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/vente-en-ligne/${item.id_produits}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.shareOption+" fb"}
                                title="Partager sur Facebook"
                            >
                            </a>
                            <a
                                href={`https://wa.me/?text=Découvrez ${encodeURIComponent(item.nom)} sur notre boutique chrétienne ${encodeURIComponent(`${window.location.origin}/vente-en-ligne/${item.id_produits}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.shareOption+" wa"}
                                title="Partager sur WhatsApp"
                            >
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=Découvrez ${encodeURIComponent(item.nom)} sur notre boutique chrétienne&url=${encodeURIComponent(`${window.location.origin}/vente-en-ligne/${item.id_produits}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.shareOption+" x"}
                                title="Partager sur Twitter"
                            >
                            </a>
                        </div>
                    </div>
                </div>
                <button
                    className="add-to-cart"
                    onClick={(e) => handleAddToCart(e, setCartBox)}
                    data-id={item.id_produits}
                    data-coloris={option?.coloris || ""}
                    data-couverture={option?.couverture || ""}
                    data-option_name={option?.opt_nom || ""}
                    data-price={item.prix}
                >
                    Ajouter au panier
                </button>
            </div>
        </div>
    )
}
