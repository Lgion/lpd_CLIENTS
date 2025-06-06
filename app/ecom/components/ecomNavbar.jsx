import {handleProductsDisplay,handleSelect} from "../../../utils/handleEvents.js"
import { useContext } from "react"
import {createPortal} from "react-dom"
import EditMongoForm from "../../admin/school/EditMongoForm.jsx"
import AuthContext from "../../../stores/authContext.js"
import { useHover } from '../context/HoverContext.jsx'
import Modal from './Modal.jsx'



import { useState } from "react";
import AddArticleForm from './AddArticleForm.jsx';

export default function EcomNavbar({models,currentDatas,setSelectedCategory,setSelectedType}) {
    const {isAdmin} = useContext(AuthContext)
    const { hoveredTitle } = useHover()
    const [showAddModal, setShowAddModal] = useState(false);
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const handleAddArticle = async (data) => {
        setAdding(true);
        setAddError('');
        try {
            const res = await fetch('/api/ecom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) {
                setAddError(result.error || 'Erreur lors de l\'ajout');
                setAdding(false);
                return;
            }
            localStorage.removeItem('ecommerce_articles')
            setShowAddModal(false);
            setSuccessMessage('Article ajouté avec succès !');
            if (typeof window !== 'undefined') {
                if (typeof (window.onRefreshArticles) === 'function') {
                    window.onRefreshArticles();
                } else if (typeof location !== 'undefined') {
                    location.reload();
                }
            }
        } catch (err) {
            setAddError('Erreur lors de l\'ajout');
        } finally {
            setAdding(false);
            setTimeout(()=>setSuccessMessage(''), 3500);
        }
    }

    const handleSelectType = (e,type) => {
        setSelectedCategory('all')
        setSelectedType(type)
        const a = e.target.parentNode.querySelectorAll('button')
        console.log(a);
        console.log(type);
        console.log(a[type=="objet"?1:0]);
        
        
        
        a.forEach(ee=>{ee.classList.remove('active')})
        a[type=="objet"?1:0].classList.add('active')
    }

    return <>
        <section id="navbarEcom">
            <section>
                <button onClick={(e)=>{handleSelectType(e,"publication");}} className="active">Publications chrétiennes</button>
                <button onClick={(e)=>{handleSelectType(e,"objet");}}>Objets de piété</button>
            </section>
            
            {/* <div className="search-container">
                <input type="text" placeholder="Rechercher un article..." />
                <select id="ecommerce_select" onChange={handleSelect}>
                    <option value="all">Choisir un type d&apos;article</option>
                    {selectOptions}
                </select>
            </div> */}
            {document.querySelectorAll('#articles>figure[data-alaune]').length != document.querySelectorAll('#articles>figure[data-alaune="0"]').length && <button                         
                className={"aLaUne" + (window.__alauneFilter ? " active" : "")}
                onClick={e => {
                    const now = Date.now();
                    const btn = e.currentTarget;
                    const figures = document.querySelectorAll('#articles>figure');
                    if (!window.__alauneFilter) {
                        figures.forEach(fig => {
                            const alaune = parseInt(fig.getAttribute('data-alaune'), 10);
                            if (alaune !== 0 && alaune > now) fig.style.display = '';
                            else fig.style.display = 'none';
                        });
                        btn.classList.add('active');
                        window.__alauneFilter = true;
                    } else {
                        figures.forEach(fig => fig.style.display = '');
                        btn.classList.remove('active');
                        window.__alauneFilter = false;
                    }
                }}
            >À La Une</button>}

            <div className="howtoshow">
                <button onClick={handleProductsDisplay} className="active">▢</button>
                <button onClick={handleProductsDisplay}>─</button>
            </div>

            {isAdmin && <>
                <button 
                    title={"Ajouter une produit au ecommerce"}
                    onClick={()=>setShowAddModal(true)}
                >+</button>
                <Modal isOpen={showAddModal} onClose={()=>setShowAddModal(false)}>
                    <AddArticleForm 
                        onSubmit={handleAddArticle}
                        onCancel={()=>setShowAddModal(false)}
                    />
                </Modal>
            </>}
            <h4 className="hover-title">{hoveredTitle}</h4>
        </section>
        {successMessage && <div style={{position:'fixed',top:10,right:10,background:'#6c63ff',color:'#fff',padding:'1em 2em',borderRadius:8,zIndex:9999,boxShadow:'0 2px 8px #2225'}}> {successMessage} </div>}
    </>
}