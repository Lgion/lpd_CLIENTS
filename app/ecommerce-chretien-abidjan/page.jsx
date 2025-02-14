"use client"

import {useState,useEffect,useContext} from 'react'
import {createPortal} from "react-dom"
import Link from "next/link"
import Image from "next/image"
import AuthContext from "../../stores/authContext.js"
// import Nav from '../../components/Nav.jsx'
import ModalProduct from './_/ModalProduct.jsx'
import * as Ecommerce_articles from "../../assets/datas/articles.js"
import Ecommerce_articles_OPTIONS from "../../assets/datas/articles_options.js"
import {handleModalShowProduct,handleAddToCart,handleProductsDisplay,handleSelect,handleSelectButtons,handleVariantButtonHover} from "../../utils/handleEvents.js"
import BlogCategory from '../_/Blog/BlogCategory'
import EditMongoForm from "../admin/school/EditMongoForm.jsx"
// import { getEcommerceData } from './actions'

async function EcommercePage() {
    // const { categoryPosts } = await getEcommerceData()
    
    return <Ecommerce />
}

function Ecommerce({categoryPosts,models={}}) {
    const {myLoader, setCartBox, miniCart, selectOptions, setSelectOptions} = useContext(AuthContext)
    , id=3
    , headings = {
        h3:"CATÉGORIE: \"LIBRARIE PUISSANCE DIVINE D'AMOUR\""
    }
    , handleUpdate = (e,item) => {
        e.stopPropagation()
        alert(item)
        console.log(item);
        setCurrentDatas(item)
        modal.classList.add('active')
        document.querySelectorAll('#modal .modal___main>form').forEach(elt=>{elt.classList.remove('active')})
        document.querySelector('#modal .modal___main>form.ecommerce_update').classList.add('active')
    }
    , handleDelete = (e) => {
        console.log(e.target);
        console.log(e.target.dataset);
        const doSupp = confirm("Êtes-vous sûr de vouloir supprimer cette photo du diapo ?")
        if(doSupp)fetch(`/api/diapo?_id=${e.target.dataset._id}&src=${e.target.dataset.src}`, {
            method: "DELETE"
        })
    }
    
    let {isAdmin} = useContext(AuthContext)
    , [currentDatas, setCurrentDatas] = useState({})

    useEffect(() => { 
        console.log("console.log(Ecommerce_articles)");
        console.log(categoryPosts);
        setCartBox(miniCart(true))
    }, [])
    
    return (
        <main className="ecommerce">
            <section>
                <button onClick={(e)=>{handleSelectButtons(e,setSelectOptions)}} className="active">Publications chrétiennes</button>
                <div className="howtoshow">
                    <button onClick={handleProductsDisplay} className="active">▢</button>
                    <button onClick={handleProductsDisplay}>─</button>
                </div>
                {isAdmin.toString()}
                { isAdmin && <>
                    <button 
                        title={"Ajouter une produit au ecommerce"}
                        onClick={e=>{
                            modal.classList.add('active')
                            document.querySelector('#modal .modal___main>form.ecommerce').classList.add('active')
                        }}
                    >+</button>
                    {typeof window !== 'undefined' && createPortal(
                        <EditMongoForm 
                            modelKey={"ecommerce"} 
                            model={models?.schemaEcommerce?.paths || {}} 
                        />
                        , document.querySelector('#modal .modal___main')
                    )}
                    {typeof window !== 'undefined' && createPortal(
                        <EditMongoForm 
                            modelKey={"ecommerce"} 
                            model={models?.schemaEcommerce?.paths || {}} 
                            datas={currentDatas}
                        />
                        , document.querySelector('#modal .modal___main')
                    )}
                </>}
                <button onClick={(e)=>{handleSelectButtons(e,setSelectOptions)}}>Objets de piété</button>
                <select id="ecommerce_select" onChange={handleSelect}>
                    <option value="all">Choisir un type d&apos;article</option>
                    {selectOptions}
                </select>
            </section>
            <article id="articles" className="publication cards">
                {
                    Ecommerce_articles.articles.data.map((item,i) => {
                        let option = Ecommerce_articles_OPTIONS.data.find(el=>el.img_article==item.img&&(item.autre==(el.opt_nom||"") || item.taille==el.taille_||""))
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
                        // if(item.id_produits==15)console.log(option)

                        return <figure className={item.user_name +" "+item.nom.replace(' ','_').replace('.','_').replace('/','_')} key={"figure_"+i}>
                                <ModalProduct {...{
                                    myLoader
                                    , item
                                    , setCartBox
                                    , option
                                    , handleAddToCart
                                    , img:"img/vente-religieuse/"+Ecommerce_articles.articles_img_table[item.nom]+"/"+item.img+".webp"
                                }} />
                                <Image
                                    loader={myLoader}
                                    src={"img/vente-religieuse/min/"+Ecommerce_articles.articles_img_table[item.nom]+"/"+item.img+".webp"}
                                    alt="dsfihdoi fdio hfds"
                                    fill={true}
                                />
                                <button className="options" onClick={handleVariantButtonHover}>
                                    <span>Ɏ</span>
                                    { option &&<>
                                            {option.coloris && <div className="coloris">{option.coloris}</div>}
                                            {option.couverture && <div className="couverture">{option.couverture}</div>}
                                            {option.opt_nom && <div className="option_name">{option.opt_nom}</div>}
                                        </>
                                    }
                                    { isAdmin && <ul>
                                        <li onClick={(e)=>{alert('ok');handleUpdate(e,item);alert('wesh')}}>edit</li>
                                        <li onClick={handleDelete} data-_id={item._id} data-src={item.src_$_file}>delete</li>
                                    </ul>}
                                </button>
                                <figcaption title={item.fr}>{item.fr__}</figcaption>
                                {/* <figcaption dangerouslySetInnerHTML={{__html: item.fr}} title={item.fr_}></figcaption> */}
                                {/* <p className="description" dangerouslySetInnerHTML={{__html: "<div>"+item.fr1+"</div>"}}></p> */}
                                <p className="dimensions">{item.dimensions}</p>
                                <span className="prix">{item.prix} </span>
                                {/* <span>{item.id_produits && JSON.stringify(option)}</span> */}
                                <Link 
                                    href={"vente-en-ligne/"+item.id_produits}
                                    target="_blank" title={"Afficher le produit"}
                                >
                                </Link>
                                <section>
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
                                    <button className="showArticleModal" onClick={e=>{handleModalShowProduct(e);}} title={"Afficher article"}>🔎</button>
                                </section>
                        </figure>
                    })
                }
            </article>
            <BlogCategory {...{categoryPosts,headings}} />
        </main>
    )
}

export default EcommercePage
