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
    
    const figure = e.target.closest('figure')
    const title = figure.querySelector('figcaption h3')?.innerText || "Produit inconnu"
    const price = parseFloat(figure.querySelector('.price')?.innerText) || 0
    const id = figure.querySelector('.toAddCart')?.dataset.id || "unknown"

    // GA4 : Suivi de la vue du produit
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'view_item', {
            currency: 'XOF',
            value: price,
            items: [{
                item_id: id,
                item_name: title,
                price: price
            }]
        });
    }

    modal.querySelector(".modal___header").innerHTML = figure.querySelector('.toPutInModal').innerHTML
    modal.querySelector(".modal___main").append(modal.querySelector(".modal___header .img"))
    modal.querySelector(".modal___main").append(modal.querySelector(".modal___header .content"))
    modal.querySelector(".modal___footer").append(modal.querySelector(".modal___header .options"))
    modal.querySelector(".modal___footer").append(modal.querySelector(".modal___header .localQty"))
}
, handleAddToCart = (e, setCartBox, miniCart) => {
    const el = e.target
    , id = el.dataset.id
    , coloris = el.dataset.coloris
    , couverture = el.dataset.couverture
    , option_name = el.dataset.option_name
    , figure = el.closest('figure')
    , title = figure.querySelector('figcaption h3')?.innerText || "Produit"
    , cart_id = JSON.stringify({id,title,coloris,couverture,option_name,price:el.dataset.price})
    , qty = figure.querySelector('.qty').value

    if(qty>0 && qty<100){
        // GA4 : Suivi de l'ajout au panier
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'add_to_cart', {
                currency: 'XOF',
                value: price * qty,
                items: [{
                    item_id: id,
                    item_name: title,
                    price: price,
                    quantity: parseInt(qty)
                }]
            });
        }

        setCartBox(miniCart(cart_id,qty))
        document.getElementById('panier')?.classList.add('active')
        setTimeout(()=>{document.getElementById('panier')?.classList.remove('active')}, 3000)
    } else alert("pb qty")

}
, handleProductsDisplay = (e) => { 
    console.log(e);
    
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
        document.querySelectorAll('.ecommerce>section>section>button').forEach(el => { 
            // alert('ok')
            el.classList.toggle('active')
        })
        document.querySelector('article#articles').classList.toggle('publication')
        document.querySelector('article#articles').classList.toggle('objet')
        setSelectOptions(Object.keys(Ecommerce_articles.articles_title_table)
            .map((item,i) => {
                // alert((document.querySelector('main>section>button.active').innerHTML.charAt(0) == "P")+"\n\n"+(document.querySelector('main>section>button.active').innerHTML.charAt(0))+"\n\n"+(item.charAt(0)=="_"))
                // alert((document.querySelector('main>section>button.active').innerHTML.charAt(0) == "P" && item.charAt(0) == "_")+"\n\n"+(document.querySelector('main>section>button.active').innerHTML.charAt(0) == "O" && item.charAt(0) != "_") )
                
                if( 
                    document.querySelector('main>section>section>button.active').innerHTML.charAt(0) == "P" && item.charAt(0) == "_" 
                    || document.querySelector('main>section>section>button.active').innerHTML.charAt(0) == "O" && item.charAt(0) != "_" 
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













