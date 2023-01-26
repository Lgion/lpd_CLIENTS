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
    let miniCart = (cart_id,qty) => {
        if(cart_id && qty)
            CartLS.addArticle(cart_id,qty)
        if(!cart_id)return <ul className="miniCart"></ul>
        else return <ul className="miniCart">{ 
            Object.keys(CartLS.getAllFavoris()).map(item => {
                const k = JSON.parse(item)
                // console.log(item)
                // console.log(k)
                const article = Ecommerce_articles.articles.data.find(el=>el.id_produits==k.id)
                // console.log(article)
                return <li>
                    {article.fr}
                </li>
            })
        }</ul>
    }
    , [cartBox, setCartBox] = useState(<ul className="miniCart">{miniCart()}</ul>)
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
    const context = {ok:"okokok",cartBox, setCartBox, miniCart, selectOptions, setSelectOptions}
    
    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}


