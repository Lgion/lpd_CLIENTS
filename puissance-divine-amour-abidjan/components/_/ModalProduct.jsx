import React from 'react'
import { createPortal } from 'react-dom'

export default function ModalProduct({data,img}) {
    return <div className="ok">
        <img src={img} alt="dsfihdoi fdio hfds" />
        <figcaption>L'Évangile Révélé à Maria Valtorta</figcaption>
        <p>Coffret 1: La préparation (3 livrets)</p>
        <span className="prix">7500 (fcfa =&lt; ::before)</span>
        <button className="addToCart">add to cart</button>
    </div>
}
