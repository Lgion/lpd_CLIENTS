"use client"

import {useState,useEffect,useContext} from 'react'
import Link from "next/link"
import Image from "next/image"
import AuthContext from "../../stores/authContext.js"
// import Nav from '../../components/Nav.jsx'
import ModalProduct from './_/ModalProduct.jsx'
import Intro from './components/Intro.jsx'
import EcomNavbar from './components/ecomNavbar.jsx'
import "./style.scss"
import "../../assets/scss/index_ecom_ai.scss"
// import * as Ecommerce_articles from "../../assets/datas/articles.js"
// import Ecommerce_articles_OPTIONS from "../../assets/datas/articles_options.js"
import {handleModalShowProduct,handleAddToCart,handleProductsDisplay,handleSelect,handleVariantButtonHover} from "../../utils/handleEvents.js"
import BlogCategory from '../_/Blog/BlogCategory'
import ArticleGrid from './components/ArticleGrid'
import AddArticleForm from './components/AddArticleForm.jsx';
import { HoverProvider } from './context/HoverContext'
// import { getEcommerceData } from './actions'

function EcommercePage() {
    const [ecommerce_articles, setEcommerce_articles] = useState({});
    const [ecommerce_articles_OPTIONS, setEcommerce_articles_OPTIONS] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Vérifie d'abord le localStorage
        const localArticles = window.localStorage.getItem('ecommerce_articles');
        const localOptions = window.localStorage.getItem('ecommerce_articles_OPTIONS');
        let hasLocal = false;
        if (localArticles && localOptions) {
            try {
                const parsedArticles = JSON.parse(localArticles);
                const parsedOptions = JSON.parse(localOptions);
                setEcommerce_articles(parsedArticles);
                setEcommerce_articles_OPTIONS(parsedOptions);
                setLoading(false);
                hasLocal = true;
            } catch (e) {
                // Si parsing échoue, on continue avec le fetch
            }
        }
        if (!hasLocal) {
            fetch('/api/ecom')
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(data => {
                    const articlesObj = {articles: {data: data.articles},articles_img_table,articles_title_table};
                    const optionsObj = {data: data.options};
                    setEcommerce_articles(articlesObj);
                    setEcommerce_articles_OPTIONS(optionsObj);
                    window.localStorage.setItem('ecommerce_articles', JSON.stringify(articlesObj));
                    window.localStorage.setItem('ecommerce_articles_OPTIONS', JSON.stringify(optionsObj));
                    setLoading(false);
                })
                .catch(err => {
                    setError('Erreur lors du chargement des articles');
                    setLoading(false);
                });
        }
    }, []);

    if (loading) return <div>Chargement des articles...</div>;
    if (error) return <div>{error}</div>;

    return <Ecommerce Ecommerce_articles={ecommerce_articles} Ecommerce_articles_OPTIONS={ecommerce_articles_OPTIONS} />;
}

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
}
const articles_title_table = {
    'tableau/icone': "Icônes Religieuses",
    '_livret P.D': "Publication Puissance Divine",
    '_bibles': "Saintes Bibles",
            'NEI': "NEI",
            'texte&priere': "Textes & Prières",
    'croixp': "Croix Posées",
    'croixm': "Croix Murales",
    'croix': "Croix Jésus",
    'encens': "Encens",
    'statue': "Statue Religieuse",
    'grotte': "Grotte Religieuse",
    'chapelet': "Chapelet de Prière",
    'divers': "Divers",
    '_divers': "Divers",
}

const categories = [
    { label: "tableau_icone", color: "orange", name: "Icônes Religieuses"},
    { label: "livret_P_D", color: "teal", name: "Publication Puissance Divine"},
    { label: "bibles", color: "purple", name: "Saintes Bibles"},
    { label: "NEI", color: "blue", name: "NEI"},
    { label: "texte_priere", color: "green", name: "Textes & Prières"},
    { label: "divers", color: "orange", name: "Croix Posées"},
    { label: "croixp", color: "red", name: "Croix Murales"},
    { label: "croixm", color: "teal", name: "Croix Jésus"},
    { label: "croix", color: "gold", name: "Encens"},
    { label: "encens", color: "silver", name: "Statue Religieuse"},
    { label: "statue", color: "brown", name: "Grotte Religieuse"},
    { label: "grotte", color: "pink", name: "Chapelet de Prière"},
    { label: "chapelet", color: "wheat", name: "Divers autreproduits" }
];

function Ecommerce({Ecommerce_articles,Ecommerce_articles_OPTIONS,categoryPosts,models={}}) {
    const {isAdmin, myLoader, setCartBox, miniCart, selectOptions, setSelectOptions} = useContext(AuthContext)
    , id=3
    , headings = {
        h3:"CATÉGORIE: \"LIBRARIE PUISSANCE DIVINE D'AMOUR\""
    }
    // Nouvel état pour l'article en cours d'édition
    const [editingArticle, setEditingArticle] = useState(null);
    
    const handleUpdate = async (e, item) => {
        e.preventDefault();
        if (!item || !item._id) return alert('Article invalide ou ID manquant');
        try {
            const res = await fetch('/api/ecom', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            const data = await res.json();
            if (res.ok && data.article) {
                alert('Article modifié avec succès.');
                setEditingArticle(null);
                window.localStorage.removeItem('ecommerce_articles');
                location.reload();
            } else {
                alert('Erreur lors de la modification : ' + (data.error || (data.errors && data.errors.join('; '))));
            }
        } catch (err) {
            alert('Erreur lors de la modification : ' + err.message);
        }
    };

    // Fonction pour ouvrir le formulaire d'édition
    const openEditForm = (item) => setEditingArticle(item);
    // Fonction pour fermer le formulaire
    const closeEditForm = () => setEditingArticle(null);

    const handleDelete = async (e) => {
        e.preventDefault();
        const id = e.target.dataset._id;
        const src = e.target.dataset.src;
        if (!id) return alert('ID manquant');
        const doSupp = confirm("Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.");
        if (!doSupp) return;
        try {
            const res = await fetch(`/api/ecom?id=${id}&src=${src}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok && data.success) {
                alert('Article supprimé avec succès.');
                // Option : rafraîchir la liste sans reload si tu utilises un state local
                window.localStorage.removeItem('ecommerce_articles');
                location.reload();
            } else {
                alert('Erreur lors de la suppression : ' + (data.error || (data.errors && data.errors.join('; '))));
            }
        } catch (err) {
            alert('Erreur lors de la suppression : ' + err.message);
        }
    }
    
    let [currentDatas, setCurrentDatas] = useState({})
    , [selectedCategory, setSelectedCategory] = useState("all")
    , [selectedType, setSelectedType] = useState("publication")

    useEffect(() => { 
        console.log("console.log(Ecommerce_articles)");
        console.log(categoryPosts);
        setCartBox(miniCart(true))
    }, [])
    
    return (
        <HoverProvider>
            <main className="ecommerce">
                {editingArticle && (
                    <div className="modal-edit-article" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:1000000,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <div style={{background:'#fff',padding:32,borderRadius:12,boxShadow:'0 8px 32px #0003',minWidth:340,maxWidth:480,height:"80%",overflowY:"scroll",position:'relative'}}>
                            <button onClick={closeEditForm} style={{position:'absolute',top:8,right:8,fontSize:24,lineHeight:1,border:'none',background:'none',cursor:'pointer'}}>&times;</button>
                            <AddArticleForm
                                onSubmit={item => handleUpdate({ preventDefault:()=>{} }, { ...editingArticle, ...item })}
                                onCancel={closeEditForm}
                                initialData={editingArticle}
                            />
                        </div>
                    </div>
                )}
                <Intro {...{selectedCategory,categories,setSelectedCategory}} />
                <EcomNavbar {...{models,currentDatas,setSelectedCategory,setSelectedType,categories}} />
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
                    selectedCategory={selectedCategory}
                    selectedType={selectedType}
                    openEditForm={openEditForm}
                />
                <BlogCategory {...{categoryPosts,headings}} />
            </main>
        </HoverProvider>
    );
}

export default EcommercePage
