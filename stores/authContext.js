import {createContext, useEffect, useState} from 'react'
// import netlifyIdentity from 'netlify-identity-widget'
import * as Ecommerce_articles from "./../assets/datas/articles.js"
import * as CartLS from "../utils/favorisManager.js"

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
    let userConnectedDatas = {email: "email@exemple.com"}
    // let userConnectedDatas = false
    , handleQty = (e, ls) => { 
        // alert(localStorage.cart)
        
        
        ls[e.target.dataset.key] = e.target.value
        // CartLS.addArticle(e.target.dataset.key, e.target.value)
        CartLS.saveArticle(ls)

        // alert(localStorage.cart)
    }
    , miniCart = (cart_id,qty) => {
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
                    cartArray.map(item => {
                        const _item = JSON.parse(item)
                        // console.log(item)
                        // console.log(_item)
                        const article = Ecommerce_articles.articles.data.find(el=>el.id_produits==_item.id)
                        // console.log(article)
                        return <li>
                            <p>{article.fr}</p>
                            <input data-key={item} defaultValue={ls[item]} onChange={e=>{handleQty(e,ls)}} className="qty" type="number" min="1" max="99" title={"Choisir une quantité entre 1 et 99"} />
                            <button data-key={item} onClick={(e)=>{CartLS.deleteArticle(e.target.dataset.key);e.target.parentNode.remove();}}>⌫</button>
                    </li>
                    })
                }</ul>
            </div>
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
    const context = {ok:"okokok",cartBox, setCartBox, miniCart, selectOptions, setSelectOptions, userConnectedDatas, handleQty}
    
    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}


