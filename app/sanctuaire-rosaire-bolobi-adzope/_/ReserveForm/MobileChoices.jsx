"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faChurch, faUsers, faUtensils, faIdCard, faCreditCard } from '@fortawesome/free-solid-svg-icons'

export default function MobileChoices() {
    const menuItems = [
        { className: "dates", label: "Dates", icon: faCalendarDays },
        { className: "type", label: "Évènement", icon: faChurch },
        { className: "location", label: "Nombre", icon: faUsers },
        { className: "meal", label: "Repas", icon: faUtensils },
        { className: "infos", label: "Contact", icon: faIdCard },
        // { className: "payment", label: "Paiement", icon: faCreditCard }
    ]

    return <ul className="bolobiForm_choices" onClick={e => {
        const fieldsetClassName = e.target.closest('li')?.className.split(' ')[0]
        if (fieldsetClassName) {
            document.querySelector("fieldset.active")?.classList.remove("active")
            document.querySelector("fieldset." + fieldsetClassName).className = "active " + document.querySelector("fieldset." + fieldsetClassName).className
        }
    }}>
        <p>SÉLECTIONNER UNE ÉTAPE DE L'INSCRIPTION: </p>
        {menuItems.map((item, index) => (
            <li key={index} className={`${item.className}${index === 0 ? ' active' : ''}`}>
                <a href={`#${item.className}`}>
                    <FontAwesomeIcon icon={item.icon} /> {item.label}
                </a>
            </li>
        ))}
    </ul>
}
