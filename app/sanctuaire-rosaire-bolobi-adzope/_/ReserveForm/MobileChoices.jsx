"use client"

import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faChurch, faUsers, faUtensils, faIdCard, faCreditCard } from '@fortawesome/free-solid-svg-icons'

export default function MobileChoices({ onClickMobileChoices: onClick, isActive, fieldsetsValidation }) {
    const menuItems = [
        { className: "infos", label: "Contact", icon: faIdCard, titre: "Informations de contact" },
        { className: "type", label: "Évènement", icon: faChurch, titre: "Choisir un évènement" },
        { className: "dates", label: "Dates", icon: faCalendarDays, titre: "Choisir une date" },
        { className: "location", label: "Nombre", icon: faUsers, titre: "Choisir nombre participants" },
        { className: "meal", label: "Repas", icon: faUtensils, titre: "Choisir le repas" },
        // { className: "payment", label: "Paiement", icon: faCreditCard }
    ]
    , activeTitleToShow = menuItems.find(item => item.className.split(" ")[0] === isActive)?.titre
console.log(isActive);

    return <ul id="bolobiForm_choices_ul" className="bolobiForm_choices">
        <p>INSCRIPTION: </p>
        <p>SÉLECTIONNER UNE ÉTAPE</p>
        {menuItems.map((item, index) => (
            <li key={index} onClick={e=>{onClick(e)}} className={`${item.className}${index === 0 ? ' active' : ''} ${fieldsetsValidation[item.className] ? 'validated' : 'invalidated'}`}>
                <a href={`#${item.className}`}>
                    <FontAwesomeIcon icon={item.icon} /> <span>{item.label}</span>
                </a>
            </li>
        ))}
        <div>{activeTitleToShow}</div>
    </ul>
}
