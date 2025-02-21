"use client"

import {useState,useEffect,useContext} from 'react'
import Link from "next/link"
import Image from "next/image"
import AuthContext from "../../stores/authContext.js"
// import Nav from '../../components/Nav.jsx'
import ModalProduct from './_/ModalProduct.jsx'
import Intro from './components/Intro.jsx'
import IntroVideo from './components/IntroVideo.jsx'
import EcomNavbar from './components/ecomNavbar.jsx'
import "./style.scss"
import * as Ecommerce_articles from "../../assets/datas/articles.js"
import Ecommerce_articles_OPTIONS from "../../assets/datas/articles_options.js"
import {handleModalShowProduct,handleAddToCart,handleProductsDisplay,handleSelect,handleSelectButtons,handleVariantButtonHover} from "../../utils/handleEvents.js"
import BlogCategory from '../_/Blog/BlogCategory'
import ArticleGrid from './components/ArticleGrid'
import { HoverProvider } from './context/HoverContext'
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
        <HoverProvider>
            <main className="ecommerce">
                <IntroVideo />
                <Intro handleProductsDisplay={handleProductsDisplay} />
                <EcomNavbar {...{models,currentDatas}} />
                <ArticleGrid 
                    Ecommerce_articles={Ecommerce_articles}
                    Ecommerce_articles_OPTIONS={Ecommerce_articles_OPTIONS}
                    myLoader={myLoader}
                    setCartBox={setCartBox}
                    handleAddToCart={handleAddToCart}
                    handleVariantButtonHover={handleVariantButtonHover}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                    handleModalShowProduct={handleModalShowProduct}
                    isAdmin={isAdmin}
                    miniCart={miniCart}
                />
                <BlogCategory {...{categoryPosts,headings}} />
            </main>
        </HoverProvider>
    )
}

export default EcommercePage
