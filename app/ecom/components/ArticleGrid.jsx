import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ModalProduct from '../_/ModalProduct';
import Modal from './Modal';
import { useHover } from '../context/HoverContext';

const strip_tags = (html, ...rest) => {
    if (rest.length < 2) {
        html = html.replace(/<\/?(?!\!)[^>]*>/gi, '');
    } else {
        var allowed = rest[1];
        var specified = eval("[" + rest[2] + "]");
        if (allowed) {
            var regex = '</?(?!(' + specified.join('|') + '))\b[^>]*>';
            html = html.replace(new RegExp(regex, 'gi'), '');
        } else {
            var regex = '</?(' + specified.join('|') + ')\b[^>]*>';
            html = html.replace(new RegExp(regex, 'gi'), '');
        }
    }
    return html;
};

export default function ArticleGrid({
    Ecommerce_articles,
    Ecommerce_articles_OPTIONS,
    myLoader,
    setCartBox,
    handleAddToCart,
    handleVariantButtonHover,
    handleUpdate,
    handleDelete,
    isAdmin,
    miniCart,
    selectedCategory,
    selectedType,
    openEditForm,
    searchQuery = ""
}) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { setHoveredTitle } = useHover();

    const handleModalShow = (item, option) => {
        setSelectedProduct({ item, option });
    };

    // Filtrage dynamique basé sur la recherche
    const filteredArticles = Ecommerce_articles.articles.data.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
            item.nom.toLowerCase().includes(query) || 
            (item.auteur && item.auteur.toLowerCase().includes(query)) ||
            (item.fr && item.fr.toLowerCase().includes(query))
        );
    });

    return (
        <>
            <article id="articles" className={selectedType + " " + selectedCategory + " cardsAI"}>
                {filteredArticles.map((item, i) => {
                    let option = Ecommerce_articles_OPTIONS.data.find(
                        el => el.img_article == item.img
                        // && (item.autre == (el.opt_nom||"") || item.taille == el.taille_||"")
                    );

                    item.fr_ = item.fr.replace("<br>").replace("<br/>");
                    item.fr__ = strip_tags(item.fr);



                    return (
                        <figure
                            className={item.user_name + " " + item.nom.replace(' ', '_').replace('.', '_').replace('/', '_').replace('&', '_')}
                            key={"figure_" + i}
                            onMouseEnter={() => setHoveredTitle(item.fr__)}
                            onMouseLeave={() => setHoveredTitle('')}
                            data-aLaUne={item.alaune || 0}
                        >
                            <div>
                                <Image
                                    loader={myLoader}
                                    src={`img/vente-religieuse/min/${Ecommerce_articles.articles_img_table[item.nom]}/${item.img}.webp`}
                                    alt={item.fr__ || "Product image"}
                                    fill={true}
                                />
                            </div>
                            <div className="info-container">
                                {(option || isAdmin) && <button className="options"
                                // onClick={handleVariantButtonHover}
                                >
                                    <span>Ɏ</span>
                                    {option && <>
                                        {option.coloris && <div className="coloris">{option.coloris}</div>}
                                        {option.couverture && <div className="couverture"
                                            onClick={e => {
                                                const tmp = e.target.closest('figure');
                                                if (tmp.isActive == undefined) {
                                                    tmp.isActive = true
                                                    alert("couverture ajoutée")
                                                } else {
                                                    tmp.isActive = !tmp.isActive
                                                    alert("couverture retiré")
                                                }
                                            }}
                                            onMouseOver={e => { const tmp = e.target.closest('figure').querySelector('img').srcset; if (tmp.indexOf('-cov') == -1) e.target.closest('figure').querySelector('img').srcset = tmp.replaceAll('.webp', '-cov.webp') }}
                                            onMouseOut={e => { const tmp_ = e.target.closest('figure'); const tmp = tmp_.querySelector('img').srcset; if (!e.target.closest('figure').isActive && tmp.indexOf('-cov') !== -1) e.target.closest('figure').querySelector('img').srcset = tmp.replaceAll('-cov.webp', '.webp') }}
                                        >avec couverture: +{option.couverture} Fcfa</div>}
                                        {option.opt_nom && <div className="option_name">{option.opt_nom}</div>}
                                    </>}
                                    {isAdmin && <ul class="admin_btns">
                                        <li onClick={() => openEditForm(item)}>edit</li>
                                        <li onClick={handleDelete} data-_id={item._id} data-src={`img/vente-religieuse/min/${Ecommerce_articles.articles_img_table[item.nom]}/${item.img}.webp`}>delete</li>
                                    </ul>}
                                </button>}
                                <figcaption title={item.fr}>{item.fr__}</figcaption>
                                <p className="dimensions">{item.dimensions}</p>
                                <span className="prix">{item.prix} €</span>
                                <section>
                                    <input
                                        defaultValue="1"
                                        className="qty"
                                        type="number"
                                        min="1"
                                        max="99"
                                        title="Choisir une quantité entre 1 et 99"
                                    />
                                    <button
                                        className="addToCart"
                                        onClick={(e) => handleAddToCart(e, setCartBox, miniCart)}
                                        data-id={item.id_produits}
                                        data-coloris={option?.coloris || ""}
                                        data-couverture={option?.couverture || ""}
                                        data-option_name={option?.opt_nom || ""}
                                        data-price={item.prix}
                                        title="Ajouter au panier"
                                    >
                                        Ajouter au panier
                                    </button>
                                    <button
                                        className="showArticleModal"
                                        onClick={() => handleModalShow(item, option)}
                                        title="Afficher article"
                                    >
                                        🔎
                                    </button>
                                </section>
                            </div>
                            <Link
                                href={`/vente-en-ligne/${item.id_produits}`}
                                target="_blank"
                                title="Afficher le produit"
                            >-&gt; page produit</Link>
                        </figure>
                    );
                })}
            </article>

            <Modal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            >
                {selectedProduct && (
                    <ModalProduct
                        myLoader={myLoader}
                        item={selectedProduct.item}
                        setCartBox={setCartBox}
                        option={selectedProduct.option}
                        handleAddToCart={handleAddToCart}
                        img={`img/vente-religieuse/${Ecommerce_articles.articles_img_table[selectedProduct.item.nom]}/${selectedProduct.item.img}.webp`}
                    />
                )}
            </Modal>
        </>
    );
}
