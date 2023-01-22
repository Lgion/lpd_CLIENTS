import {useState,useEffect,useContext} from 'react'
import {createPortal} from "react-dom";
import Link from "next/link";
import Head from "next/head"
import AuthContext from "../stores/authContext.js"
import Nav from '../components/Nav'
import ModalProduct from '../components/_/ModalProduct'
import Ecommerce_articles_OPTIONS from "./../assets/datas/articles_options.js"
import * as Ecommerce_articles from "./../assets/datas/articles.js"
import * as CartLS from "./../assets/favorisManager.js"

export default function Ecommerce() {
    const {ok} = useContext(AuthContext)
    , id=3
    
    let a
    , [selectOptions, setSelectOptions] = useState(Object.keys(Ecommerce_articles.articles_title_table)
        .map((item,i) => {
            if(item.charAt(0) == "_")
                return <option value={item.replace(' ','_').replace('.','_').replace('/','_')} key={"option_"+i}>
                    {Ecommerce_articles.articles_title_table[item]}
                </option>
        })
    )

    useEffect(() => { 
        console.log(Ecommerce_articles)

        document.querySelectorAll('.ecommerce>section>button').forEach(el => { 
            el.addEventListener('click',e => {
                console.log(e.target)
                if(!e.target.classList.contains('active')){
                    let tmp = []
                    document.querySelectorAll('.ecommerce>section>button').forEach(el => { 
                        el.classList.toggle('active')
                    })
                    document.querySelector('article#articles').classList.toggle('publication')
                    document.querySelector('article#articles').classList.toggle('objet')
                    setSelectOptions(Object.keys(Ecommerce_articles.articles_title_table)
                        .map((item,i) => {
                            // alert((document.querySelector('main>section>button.active').innerHTML.charAt(0) == "P")+"\n\n"+(document.querySelector('main>section>button.active').innerHTML.charAt(0))+"\n\n"+(item.charAt(0)=="_"))
                            // alert((document.querySelector('main>section>button.active').innerHTML.charAt(0) == "P" && item.charAt(0) == "_")+"\n\n"+(document.querySelector('main>section>button.active').innerHTML.charAt(0) == "O" && item.charAt(0) != "_") )
                            
                            if( 
                                document.querySelector('main>section>button.active').innerHTML.charAt(0) == "P" && item.charAt(0) == "_" 
                                || document.querySelector('main>section>button.active').innerHTML.charAt(0) == "O" && item.charAt(0) != "_" 
                            )
                                return <option value={item.replace(' ','_').replace('.','_').replace('/','_')} key={"option_"+i}>
                                    {Ecommerce_articles.articles_title_table[item]}
                                </option>
                            else return ""
                        })
                    )
                }
            })
        })
        document.querySelector('#ecommerce_select').addEventListener('change', (e) => { 

            if(e.target.value == "all")articles.classList.remove('filter')
            else articles.classList.add('filter')

            document.querySelectorAll('article>figure').forEach(el => { 
                el.classList.remove('on')
            })
            document.querySelectorAll('figure.'+(articles.classList.contains("publication") ? e.target.value.substr(1) : e.target.value)).forEach(el => { 
                el.classList.add('on')
            })
        })
        document.querySelectorAll('.howtoshow button').forEach(el=>{
            el.addEventListener('click', (e) => { 
                console.log('e.target.parentNode:', e.target.parentNode)
                e.target.parentNode.querySelectorAll('button').forEach(el=>{el.classList.remove('active')})
                e.target.classList.add('active')
                switch(e.target.innerHTML){
                    case"▢":
                        document.getElementById('articles').classList.remove("lines")
                        document.getElementById('articles').classList.add("cards")
                    break
                    case"─":
                        document.getElementById('articles').classList.remove("cards")
                        document.getElementById('articles').classList.add("lines")
                    break
                }
            })
        })
        document.querySelectorAll('.showArticleModal').forEach((elt,i) => {
            elt.addEventListener('click', (e) => {
                document.querySelector('#modal').classList.add('active')
                console.log(document.querySelector('#modal .modal___main'))
                document.querySelector("#modal .modal___main").innerHTML = e.target.closest('figure').querySelector('.ok').innerHTML
            })
        })
        document.querySelectorAll('.addToCart').forEach((elt,i) => {
            elt.addEventListener('click', (e) => {
                console.log(CartLS)
                const el = e.target
                , id = el.dataset.id
                , coloris = el.dataset.coloris
                , couverture = el.dataset.couverture
                , option_name = el.dataset.option_name
                , cart_id = JSON.stringify({id,coloris,couverture,option_name})
                , qty = el.closest('figure').querySelector('.qty').value
                // alert(qty)
                // alert(id+coloris+couverture+option_name)
                if(qty>0 && qty<100)
                    CartLS.addArticle(cart_id,qty)
                else alert("pb qty")

            })
        })
        
        
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
                <button className="active">Publications chrétiennes</button>
                <div className="howtoshow">
                    <button className="active">▢</button>
                    <button>─</button>
                </div>
                <button>Objets de piété</button>
                <select id="ecommerce_select">
                    <option value="all">Choisir un type d'article</option>
                    {selectOptions}
                </select>
            </section>
            <article id="articles" className="publication cards">
                {
                    Ecommerce_articles.articles.data.map((item,i) => {
                        let option = Ecommerce_articles_OPTIONS.data.find(el=>el.img_article==item.img&&(item.autre==(el.opt_nom||"") || item.taille==el.taille_||""))
                        item.fr_ = strip_tags(item.fr)
                        if(item.id_produits==15)console.log(option)

                        return <figure className={item.user_name +" "+item.nom.replace(' ','_').replace('.','_').replace('/','_')} key={"figure_"+i}>
                                <ModalProduct data={item} img={"img/vente-religieuse/min/"+Ecommerce_articles.articles_img_table[item.nom]+"/"+item.img+".webp"} />
                                <img src={"img/vente-religieuse/min/"+Ecommerce_articles.articles_img_table[item.nom]+"/"+item.img+".webp"} alt="dsfihdoi fdio hfds" />
                                <figcaption title={item.fr}>{item.fr_}</figcaption>
                                {/* <figcaption dangerouslySetInnerHTML={{__html: item.fr}} title={item.fr_}></figcaption> */}
                                {/* <p className="description" dangerouslySetInnerHTML={{__html: "<div>"+item.fr1+"</div>"}}></p> */}
                                <p className="dimensions">{item.dimensions}</p>
                                <span className="prix">{item.prix} </span>
                                {/* <span>{item.id_produits && JSON.stringify(option)}</span> */}
                                { option &&<>
                                        <span className="coloris">{option.coloris}</span>
                                        <span className="couverture">{option.couverture}</span>
                                        <span className="option_name">{option.opt_nom}</span>
                                    </>
                                }
                                <Link href={"vente-en-ligne/"+id}>
                                    <a target="_blank">open</a>
                                </Link>
                                <input defaultValue="0" className="qty" type="number" min="1" max="99"/>
                                <button className="showArticleModal">afficher article</button>
                                <button className="addToCart" 
                                    data-id={item.id_produits}
                                    data-coloris={option?.coloris || ""}
                                    data-couverture={option?.couverture || ""}
                                    data-option_name={option?.opt_nom || ""}
                                >add to cart</button>
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