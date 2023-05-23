import React,{useContext} from 'react'
import Image from "next/image"
import Link from "next/link"
import * as Ecommerce_articles from "./../../assets/datas/articles.js"
import Ecommerce_articles_OPTIONS from "./../../assets/datas/articles_options.js"
import {handleModalShowProduct,handleAddToCart,handleProductsDisplay,handleSelect,handleSelectButtons,handleVariantButtonHover} from "./../../utils/handleEvents.js"
import AuthContext from "../../stores/authContext.js"


let bestSellersArticles = Ecommerce_articles.articles.data.filter(item=>{
    return item.id_produits == 20
})
, item = bestSellersArticles[0]
, option = Ecommerce_articles_OPTIONS.data.find(el=>el.img_article==item.img&&(item.autre==(el.opt_nom||"") || item.taille==el.taille_||""))
, img = "img/vente-religieuse/min/"+Ecommerce_articles.articles_img_table[item.nom]+"/"+item.img+".webp"
, strip_tags = (html, ...rest) => {
    //PROCESS STRING
    if(rest.length < 2) {
        html=html.replace(/<\/?(?!\!)[^>]*>/gi, '');
    } else {
        var allowed = rest[1];
        var specified = eval("["+rest[2]+"]" );
        if(allowed){
            var regex='</?(?!(' + specified.join('|') + '))\b[^>]*>';
            html=html.replace(new RegExp(regex, 'gi'), '');
        } else{
            var regex='</?(' + specified.join('|') + ')\b[^>]*>';
            html=html.replace(new RegExp(regex, 'gi'), '');
        }
    }
    //CHANGE NAME TO CLEAN JUST BECAUSE  
    var clean_string = html;
    //RETURN THE CLEAN STRING
    return clean_string;
}
item.fr_ = item.fr.replace("<br>").replace("<br/>")
item.fr__ = strip_tags(item.fr)

function BestSellers() {

    const {myLoader, setCartBox, miniCart} = useContext(AuthContext)

    return (
        // <figure className={item.user_name +" "+item.nom.replace(' ','_').replace('.','_').replace('/','_')}>
        <article className={"bestseller"}>
                {/* <ModalProduct {...{myLoader, item, setCartBox, option, handleAddToCart, img:"img/vente-religieuse/min/"+Ecommerce_articles.articles_img_table[item.nom]+"/"+item.img+".webp"}} /> */}
                <Image
                    loader={myLoader}
                    src={"img/vente-religieuse/"+Ecommerce_articles.articles_img_table[item.nom]+"/"+item.img+".webp"}
                    alt="dsfihdoi fdio hfds"
                    // width={"100"}
                    // height={"100"}
                    fill={"true"}
                />
                <section className="details">
                    <h2>{item.fr__}</h2>
                    <p className="dimensions">{item.dimensions}</p>
                    <p>{item.fr1 != "" ? item.fr1 : "AUCUNE DESCRIPTION DISPONIBLE POUR CE PRODUIT."}</p>
                    {/* <span>{item.id_produits && JSON.stringify(option)}</span> */}
                    <button className="options" onClick={handleVariantButtonHover}>
                        <span>Ɏ</span>
                        { option &&<>
                                {option.coloris && <div className="coloris">{option.coloris}</div>}
                                {option.couverture && <div className="couverture">{option.couverture}</div>}
                                {option.opt_nom && <div className="option_name">{option.opt_nom}</div>}
                            </>
                        }
                    </button>
                </section>
                <section className="buying_details">
                    <span className="prix">{item.prix} </span>
                    <input defaultValue="0" className="qty" type="number" min="1" max="99" title={"Choisir une quantité entre 1 et 99"} />
                    <button className="addToCart"
                        onClick={(e)=>{handleAddToCart(e,setCartBox, miniCart)}}
                        data-id={item.id_produits}
                        data-coloris={option?.coloris || ""}
                        data-couverture={option?.couverture || ""}
                        data-option_name={option?.opt_nom || ""}
                        data-price={item.prix}
                        title={"Ajouter au panier"}
                    ></button>
                    {/* <button className="showArticleModal" onClick={handleModalShowProduct} title={"Afficher article"}>🔎</button> */}
                </section>
        </article>
    )
}

export default BestSellers