import {handleProductsDisplay,handleSelect} from "../../../utils/handleEvents.js"
import { useContext } from "react"
import {createPortal} from "react-dom"
import EditMongoForm from "../../admin/school/EditMongoForm.jsx"
import AuthContext from "../../../stores/authContext.js"
import { useHover } from '../context/HoverContext.jsx'



export default function EcomNavbar({models,currentDatas,setSelectedCategory,setSelectedType}) {
    const {isAdmin} = useContext(AuthContext)
    const { hoveredTitle } = useHover()

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

    return <section id="navbarEcom">
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

        <div className="howtoshow">
            <button onClick={handleProductsDisplay} className="active">▢</button>
            <button onClick={handleProductsDisplay}>─</button>
        </div>

        {isAdmin && <>
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
        <h4 className="hover-title">{hoveredTitle}</h4>
    </section>
}