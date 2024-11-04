



export default function MobileChoices() {
    return <ul className="dates" onClick={e => {
        // console.log(item.textContent==e.target.textContent)
        // console.log(item.textContent)
        // console.log(e.target.textContent)
        if (e.target.nodeName == "LI" || e.target.nodeName == "A") {
            let lis = Array.from(e.target.closest('ul').querySelectorAll('li'))
                , f = Array.from(bolobiForm.querySelectorAll('fieldset'))
                , li = lis.find((item, i) => item.textContent == e.target.textContent)
                , fieldsetClassName = li.className
            // console.log(li)
            lis.forEach((item, i) => item.classList.remove('active'))
            li.classList.add('active')
            f.forEach((item, i) => item.classList.remove('active'))
            document.querySelector("fieldset." + fieldsetClassName).className = "active " + document.querySelector("fieldset." + fieldsetClassName).className
        }
    }}>
        <p>dema,der à l'IA de générer des svg pour chaque li de ce ul</p>
        <li className="active dates"><a href="#dates">Dates</a></li>
        <li className="type"><a href="#type">Évènement</a></li>
        <li className="location"><a href="#location">Nombre</a></li>
        <li className="meal"><a href="#meal">Repas</a></li>
        <li className="infos"><a href="#infos">Infos</a></li>
    </ul>
}
