import * as Ecommerce_articles from "./../assets/datas/articles.js"

export {
    handleModalShowProduct
    , handleAddToCart
    , handleProductsDisplay
    , handleSelect
    , handleSelectButtons
    , handleVariantButtonHover
}





let handleModalShowProduct = (e) => {
    const modal = document.querySelector('#modal')
    modal.classList.add('active')
    // console.log(document.querySelector('#modal .modal___main'))
    modal.querySelector(".modal___main").innerHTML = e.target.closest('figure').querySelector('.toPutInModal').innerHTML
    modal.querySelector(".modal___header").append(modal.querySelector(".modal___main figcaption"))
    modal.querySelector(".modal___footer").append(modal.querySelector(".modal___main .options"))
    modal.querySelector(".modal___footer").append(modal.querySelector(".modal___main .localQty"))
}
, handleAddToCart = (e, setCartBox, miniCart) => {
    // alert(setCartBox)
    // console.log(CartLS)
    const el = e.target
    , id = el.dataset.id
    , coloris = el.dataset.coloris
    , couverture = el.dataset.couverture
    , option_name = el.dataset.option_name
    , cart_id = JSON.stringify({id,coloris,couverture,option_name,price:el.dataset.price})
    , qty = el.closest('figure').querySelector('.qty').value
    // alert(qty)
    // alert(id+coloris+couverture+option_name)
    // console.log(Ecommerce_articles.articles.data)
    if(qty>0 && qty<100){
        setCartBox(miniCart(cart_id,qty))
        document.getElementById('panier')?.classList.add('active')
        setTimeout(()=>{document.getElementById('panier')?.classList.remove('active')}, 3000)
    }else alert("pb qty")

}
, handleProductsDisplay = (e) => { 
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
}
, handleSelect = (e) => { 

    if(e.target.value == "all")articles.classList.remove('filter')
    else articles.classList.add('filter')

    document.querySelectorAll('article>figure').forEach(el => { 
        el.classList.remove('on')
    })
    document.querySelectorAll('figure.'+(articles.classList.contains("publication") ? e.target.value.substr(1) : e.target.value)).forEach(el => { 
        el.classList.add('on')
    })
}
, handleSelectButtons = (e, setSelectOptions) => {
    // console.log(e.target)
    // console.log(setSelectOptions)
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
}
, handleVariantButtonHover = (item) => { 
    alert("action à faire pour les options d'un produit")
}













