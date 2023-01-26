import {useState,useEffect,useContext} from 'react'
import {createPortal} from "react-dom";
import Link from "next/link";
import Head from "next/head"
import AuthContext from "../stores/authContext.js"
import Nav from '../components/Nav'
import ModalProduct from '../components/_/ModalProduct'
import * as Ecommerce_articles from "./../assets/datas/articles.js"
import Ecommerce_articles_OPTIONS from "./../assets/datas/articles_options.js"
import {handleModalShowProduct,handleAddToCart,handleProductsDisplay,handleSelect,handleSelectButtons} from "./../utils/handleEvents.js"

export default function Ecommerce() {
    const {setCartBox, miniCart, selectOptions, setSelectOptions} = useContext(AuthContext)
    , id=3
    
    let a

    useEffect(() => { 
        console.log(Ecommerce_articles)

        setCartBox(miniCart(true))
        
        console.log(Ecommerce_articles.articles_title_table)
    }, [])
    
    return <>
        <Head>
        <title>Create Next Appppp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        </Head>




        <main className="ecommerce">
            <Nav />
            <section>
                <button onClick={(e)=>{handleSelectButtons(e,setSelectOptions)}} className="active">Publications chrétiennes</button>
                <div className="howtoshow">
                    <button onClick={handleProductsDisplay} className="active">▢</button>
                    <button onClick={handleProductsDisplay}>─</button>
                </div>
                <button onClick={handleSelectButtons}>Objets de piété</button>
                <select id="ecommerce_select" onChange={handleSelect}>
                    <option value="all">Choisir un type d'article</option>
                    {selectOptions}
                </select>
            </section>
            <article id="articles" className="publication cards">
                {
                    Ecommerce_articles.articles.data.map((item,i) => {
                        let option = Ecommerce_articles_OPTIONS.data.find(el=>el.img_article==item.img&&(item.autre==(el.opt_nom||"") || item.taille==el.taille_||""))
                        item.fr_ = item.fr.replace("<br>").replace("<br/>")
                        item.fr__ = strip_tags(item.fr)
                        if(item.id_produits==15)console.log(option)

                        return <figure className={item.user_name +" "+item.nom.replace(' ','_').replace('.','_').replace('/','_')} key={"figure_"+i}>
                                <ModalProduct {...{item, setCartBox, option, handleAddToCart, img:"img/vente-religieuse/min/"+Ecommerce_articles.articles_img_table[item.nom]+"/"+item.img+".webp"}} />
                                <img src={"img/vente-religieuse/min/"+Ecommerce_articles.articles_img_table[item.nom]+"/"+item.img+".webp"} alt="dsfihdoi fdio hfds" />
                                <figcaption title={item.fr}>{item.fr__}</figcaption>
                                {/* <figcaption dangerouslySetInnerHTML={{__html: item.fr}} title={item.fr_}></figcaption> */}
                                {/* <p className="description" dangerouslySetInnerHTML={{__html: "<div>"+item.fr1+"</div>"}}></p> */}
                                <p className="dimensions">{item.dimensions}</p>
                                <span className="prix">{item.prix} </span>
                                {/* <span>{item.id_produits && JSON.stringify(option)}</span> */}
                                <Link href={"vente-en-ligne/"+item.id_produits}>
                                    <a target="_blank" title={"Afficher le produit"}></a>
                                </Link>
                                <input defaultValue="0" className="qty" type="number" min="1" max="99"/>
                                { option &&<>
                                        <span className="coloris">{option.coloris}</span>
                                        <span className="couverture">{option.couverture}</span>
                                        <span className="option_name">{option.opt_nom}</span>
                                    </>
                                }
                                <button className="showArticleModal" onClick={handleModalShowProduct}>afficher article</button>
                                <button className="addToCart" 
                                    onClick={(e)=>{handleAddToCart(e,setCartBox, miniCart)}}
                                    data-id={item.id_produits}
                                    data-coloris={option?.coloris || ""}
                                    data-couverture={option?.couverture || ""}
                                    data-option_name={option?.opt_nom || ""}
                                    title={"Ajouter au panier"}
                                ></button>
                        </figure>
                    })
                }
            </article>
        </main>
    </>
}

function Ok(){
    
    return createPortal(
        <span>okok</span>
        , document.querySelector('#modal .modal___main')
    )
}
function strip_tags(html){
    //PROCESS STRING
    if(arguments.length < 3) {
        html=html.replace(/<\/?(?!\!)[^>]*>/gi, '');
    } else {
        var allowed = arguments[1];
        var specified = eval("["+arguments[2]+"]" );
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