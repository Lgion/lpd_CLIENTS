import React from 'react'
import Link from "next/link"
import Image from "next/image"

export default function ModalProduct({item,img,setCartBox,option,handleAddToCart}) {

    const LocalCart = () => <div className="localCart">
        local cart
    </div>
    , handleChange = e => { 

    }
    , myLoader = ({ src, width, quality }) => {
        return `https://example.com/${src}?w=${width}&q=${quality || 75}`
    }
    
    return <div className="toPutInModal">
        <div className="img">
            <Image
                loader={myLoader}
                src={img}
                alt={item.fr__}
            />
        </div>
        <div className="content">
            <figcaption>{item.fr}</figcaption>
            <p>{item.fr1}</p>
            <div className="prix">{item.prix}</div>
            <div className="modalCartContainer">
                <LocalCart />
                <button className="addToCart" 
                    onClick={(e)=>{handleAddToCart(e,setCartBox, miniCart)}}
                    data-id={item.id_produits}
                    data-coloris={option?.coloris || ""}
                    data-couverture={option?.couverture || ""}
                    data-option_name={option?.opt_nom || ""}
                    data-price={item.prix}
                    title={"Ajouter au panier"}
                ></button>
            </div>
        </div>

        { option &&<div className="options">
                    <span className="coloris">{option.coloris}</span>
                    <span className="couverture">{option.couverture}</span>
                    <span className="option_name">{option.opt_nom}</span>
                </div>
        }
        <input className="localQty" onChange={handleChange} defaultValue="0" type="number" min="1" max="99"/>
    </div>
}
