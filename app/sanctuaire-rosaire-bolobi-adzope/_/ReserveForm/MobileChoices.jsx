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
    , onClick = e => {
        // console.log(item.textContent==e.target.textContent)
        // console.log(item.textContent)
        // console.log(e.target.textContent)

        // if (e.target.nodeName == "LI" || e.target.nodeName == "A") {

            // POUR ACTIVER LE LI CORRESPONDANT
            let lis = Array.from(e.target.closest('ul').querySelectorAll('li'))
            , f = Array.from(bolobiForm.querySelectorAll('fieldset'))
            , li = lis.find((item, i) => item.textContent == e.target.textContent)
            // console.log(li)
            lis.forEach((item, i) => item.classList.remove('active'))
            // li.classList.add('active')
            f.forEach((item, i) => item.classList.remove('active'))


            // POUR ACTIVER LE FIELDSET CORRESPONDANT
            const fieldsetClassName = e.target.closest('li')?.className.split(' ')[0]
            console.log(fieldsetClassName)
            document.querySelector("fieldset.active")?.classList.remove("active")
            document.querySelector("fieldset." + fieldsetClassName).className = "active " + document.querySelector("fieldset." + fieldsetClassName).className

        // }
        
    }
        

    return <ul className="bolobiForm_choices">
        <p>INSCRIPTION: </p>
        {menuItems.map((item, index) => (
            <li key={index} onClick={onClick} className={`${item.className}${index === 0 ? ' active' : ''}`}>
                <a href={`#${item.className}`}>
                    <FontAwesomeIcon icon={item.icon} /> <span>{item.label}</span>
                </a>
            </li>
        ))}
        <p>SÉLECTIONNER UNE ÉTAPE</p>
    </ul>
}
