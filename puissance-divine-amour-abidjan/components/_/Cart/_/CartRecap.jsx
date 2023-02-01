import {useContext} from 'react'
import * as CartLS from "../../../../utils/favorisManager.js"
import * as Ecommerce_articles from "../../../../assets/datas/articles.js"
import CartPaypal from './CartPaypal';
import AuthContext from "../../../../stores/authContext.js"

export default function CartRecap() {

    const {userConnectedDatas} = useContext(AuthContext)
    ,  ls = CartLS.getAllFavoris()
    , cartArray = Object.keys(ls)
    , len = cartArray.length

    let li_cartArticles
    , totalProducts = 0
    , totalAmount = 0
    
    if(len==0)
        li_cartArticles = <li>Votre panier est vide..</li>
    else{
        totalProducts = len == 1 ? ls[cartArray[0]] : cartArray.reduce((a,b, index)=>{
            if(index==1)return parseInt(ls[a])+parseInt(ls[b])
            else return a+ls[b]
        })
        totalAmount = len == 1 ? ls[cartArray[0]]*JSON.parse(cartArray[0]).price : cartArray.reduce((a,b, index)=>{
            const price = [JSON.parse(a).price,JSON.parse(b).price]
            if(index==1)return parseInt(ls[a])*parseInt(price[0])+parseInt(ls[b])*parseInt(price[1])
            else return a+ls[b]*price[1]
        })
        li_cartArticles = cartArray.map(item => {
            const k = JSON.parse(item)
            // console.log(item)
            // console.log(k)
            const article = Ecommerce_articles.articles.data.find(el=>el.id_produits==k.id)
            // console.log(article)
            return <li>
                <img 
                src={"img/vente-religieuse/min/"+Ecommerce_articles.articles_img_table[article.nom]+"/"+article.img+".webp"} alt="dsfihdoi fdio hfds" />
                <span className="prix">{article.prix} </span>
                <p>{article.fr}</p>
                <input defaultValue="0" className="qty" type="number" min="1" max="99" title={"Choisir une quantité entre 1 et 99"} />
            </li>
        })
    }
        
    return <>
        <section>
            <div>
                <p>Vous avez {len} produit{len!=1 && "s"} ({totalProducts}) dans le panier.</p>
                <span title="Montant total">{totalAmount}</span>
            </div>
            <CartPaypal connected={userConnectedDatas} />
            
        </section>
        <ul>{li_cartArticles}</ul>
    </>
}
