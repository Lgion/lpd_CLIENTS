import {createContext, useEffect, useState, useMemo} from 'react'
// import netlifyIdentity from 'netlify-identity-widget'
import * as Ecommerce_articles from "./../assets/datas/articles.js"
import * as CartLS from "../utils/favorisManager.js"
//FIX localstorage: https://dev.to/collegewap/how-to-use-local-storage-in-nextjs-2l2j

/*
const AuthContext = createContext({
    user: null,
    login: ()=>{},
    logout: ()=>{},
    authReady: false
})
export default AuthContext
*/
const AuthContext = createContext({
    // ok: null,
    // cartBox: null,
    // setCartBox: null,
})
export default AuthContext

export const AuthContextProvider = ({children}) => {
    let handleQty = (e, ls) => { 
        // alert(localStorage.cart)
        
        if (typeof window !== "undefined"){
            ls[e.target.dataset.key] = e.target.value
            // CartLS.addArticle(e.target.dataset.key, e.target.value)
            CartLS.saveArticle(ls)
        }

        // alert(localStorage.cart)
    }
    , miniCart = (cart_id,qty) => {
        if (typeof window !== "undefined"){

            if(cart_id && qty)
                CartLS.addArticle(cart_id,qty)

            if(!cart_id){
                let clr = setTimeout(() => { setCartBox(miniCart(true)) }, 1000)
                return <ul className="miniCart"></ul>
            }else{
                const  ls = CartLS.getAllFavoris()
                , cartArray = Object.keys(ls)
                , len = cartArray.length
                if(len==0)
                    return <ul className="miniCart"><li>Votre panier est vide..</li></ul>
                
                const totalProducts = len == 1 ? ls[cartArray[0]] : cartArray.reduce((a,b, index)=>{
                    if(index==1)return parseInt(ls[a])+parseInt(ls[b])
                    else return a+ls[b]
                })
                , totalAmount = len == 1 ? ls[cartArray[0]]*JSON.parse(cartArray[0]).price : cartArray.reduce((a,b, index)=>{
                    const price = [JSON.parse(a).price,JSON.parse(b).price]
                    if(index==1)return parseInt(ls[a])*parseInt(price[0])+parseInt(ls[b])*parseInt(price[1])
                    else return a+ls[b]*price[1]
                })
                return <div className="miniCart">
                    <div>Vous avez {len} produit{len!=1 && "s"} ({totalProducts}) dans le panier.</div>
                    <div>Montant total: {totalAmount}</div>
                    <ul>{ 
                        cartArray.map((item,i) => {
                            const _item = JSON.parse(item)
                            // console.log(item)
                            // console.log(_item)
                            const article = Ecommerce_articles.articles.data.find(el=>el.id_produits==_item.id)
                            // console.log(article)
                            return <li key={"cart_item_"+i}>
                                <p>{article.fr}</p>
                                <input data-key={item} defaultValue={ls[item]} onChange={e=>{handleQty(e,ls)}} className="qty" type="number" min="1" max="99" title={"Choisir une quantité entre 1 et 99"} />
                                <button data-key={item} onClick={(e)=>{CartLS.deleteArticle(e.target.dataset.key);e.target.parentNode.remove();}}>⌫</button>
                        </li>
                        })
                    }</ul>
                </div>
            }
        }
    }
    , [cartBox, setCartBox] = useState(<>{miniCart()}</>)
    , [selectOptions, setSelectOptions] = useState(Object.keys(Ecommerce_articles.articles_title_table)
        .map((item,i) => {
            if(item.charAt(0) == "_")
                return <option value={item.replace(' ','_').replace('.','_').replace('/','_')} key={"option_"+i}>
                    {Ecommerce_articles.articles_title_table[item]}
                </option>
        })
    )
    , myLoader = ({ src, width, quality }) => {
        return `${src}?w=${width}&q=${quality || 75}`
    }
    , settingsSlider = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        adaptiveHeight: true
    }
    , mainmenu = [
        {id:"accueil",href:"/",title:"Librairie religieuse chrétienne Abidjan, Ecommerce chrétien, centre de retraite spirituelle à Bolobi (entre azaguié et yakasseme)",content:"Accueil",tagzone:["librairie","librairie religieuse","librairie religieuse chrétienne", "ecommerce chrétien", "sanctuaire bolobi", "retraites spirituelles"],titrePage:["Sanctuaire Notre Dame du Rosaire de Bolobi, et la Librairie Puissance Divine, vous souhaitent la bienvenue :)シツ"],sns:{"Puissance Divine d'Amour d'Abidjan Cocody 2plateaux rue des jardins":"https://www.facebook.com/genevieve.achi/"},search:"librairie+chrétienne+abidjan+cocody+2plateau"},
        // {id:"enseignements",href:"enseignements-spirituels-chretien-catholique",title:"Enseignements spirituels chrétien catholique Puissance Divine, jésus enseigne: l",content:"Enseignements",tagzone:[],titrePage:[],sns:{"librairie puissance divine abidjan rue des jardins": "https://www.facebook.com/abidjan.puissance.divine/","Maria Valtorta": "https://www.facebook.com/LibrairiePuissanceMariaValtorta/"}},
        {id:"activites-spirituelles",href:"/sanctuaire-rosaire-bolobi-adzope",title:"Sanctuaire du Rosaire de Bolobi: activités spirituelles religieuses chrétien catholique",content:"Sanctuaire du Rosaire de Bolobi",tagzone:["retraites de prières", "activités spirituelles", "lieu de loisir abidjan", "lieu de détente abidjan", "lieu de repos abidjan"],titrePage:["Retraites spirituelles en périphérie d'Abidjan au Sanctuaire Notre Dame du Rosaire de Bolobi"],sns:{"Sanctuaire notre Dame du Rosaire de Bolobi": "https://www.facebook.com/abidjan.sanctuaire.rosaire.bolobi/"},search:"retraite+spirituelle+sanctuaire+dame+rosaire+bolobi"},
        {id:"bolobi",href:"/bolobi-ecole-caritative-larve-msn",title:"Bolobi: école gratuite d'Adzopé, culture du poivre, élevage de mouches soldat noire, activités spirituelles religieuses chrétien catholique et protestant",content:"Oeuvre Caritatives",tagzone:["école caritative", "école saint martin de porèz de bolobi"],titrePage:["Les activités religieuses, caritatives, et économiques du sanctuaire de Bolobi, et de l'école St Martin de Porrez"],sns:{"École St Martin de Porèz de Bolobi": "https://www.facebook.com/abidjan.puissance.divine/"},search:"école+primaire+saint+martin+porès+bolobi+azaguié+yakasseme"},
        {id:"ecommerce",href:"/ecommerce-chretien-abidjan",title:"Ecommerce religieux chrétien catholique: icône grottes statues bibles",content:"Ecommerce Chrétien",tagzone:["ecommerce","librarie religieuse","librairie chrétienne","publication chrétiennes","objets de piété","bibles","saintes bibles", "icônes", "croix", "encens", "statue mariale", "grotte chrétienne", "chapelets de prière"],titrePage:["Ecommerce libraire puissance divine d'Amour, Cocody 2plateaux rue des jardins"],sns:{"librairie puissance divine abidjan rue des jardins": "https://www.facebook.com/abidjan.puissance.divine/","Maria Valtorta": "https://www.facebook.com/LibrairiePuissanceMariaValtorta/"},search:"ecommerce+religieux+chrétien+puissance+divine+amour"},
    ]
    , [menuActive, setMenuActive] = useState("")
    , [isCartPage, setIsCartPage] = useState(true)
    , [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => { 
        (()=>{setIsCartPage(document.querySelector('#__next>main.cart'))})()
    }, [])
    useEffect(() => { 
        console.log(menuActive);
        mainmenu.forEach(item=>{
            if(document.location.href.indexOf(item.href)!==-1 && item.id != menuActive){
                setMenuActive(item.id)
            }
            // else setMenuActive("accueil")
        })
        console.log(menuActive);
    }, [])
    /*
    const [user, setUser] = useState(null)
    const [authReady, setAuthReady] = useState(false)

    useEffect(()=>{
        netlifyIdentity.on('login',(user)=>{
            setUser(user)
            netlifyIdentity.close()
            console.log("login event");
        })
        netlifyIdentity.on('logout',(user)=>{
            setUser(null)
            console.log("logout event");
        })
        netlifyIdentity.on('init', (user)=>{
            setUser(user)
            setAuthReady(true)
            console.log(user);
            console.log('init event');
        })
        //init netlify identity connection
        netlifyIdentity.init()


        return ()=>{
            netlifyIdentity.off('login')
            netlifyIdentity.off('logout')
        }
    }, [])
    
    const login = () => {netlifyIdentity.open()}
    const logout = () => {netlifyIdentity.logout()}
    const context = {user,login,logout,authReady}
    */
    const context = {ok:"okokok", isAdmin, setIsAdmin, isCartPage, mainmenu, menuActive, setMenuActive, settingsSlider, myLoader, CartLS, cartBox, setCartBox, miniCart, selectOptions, setSelectOptions, handleQty}
    
    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}


