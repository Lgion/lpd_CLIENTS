import {useState} from 'react'
import MoneyGiftProjects from './MoneyGiftProjects'
import ShowProject from './ShowProject'
import Projects from './Projects'


export default function MoneyGift() {

    let [projectLabel, setProjectLabel] = useState("Sanctuaire")
    , [subProject, setSubProject] = useState(null)
    , projectsCategories = [
        "Sanctuaire"
        , {name: "École",src:"void",projects: [{src:"youtube.png",title:"un petit test",stats:{start:new Date("09/01/2023"),desired:12000000,got:1560000,nbr:18}},{src:"valtorta.png",title:"un autre petit teeeest",stats:{start:""+new Date("09/30/2023"),desired:2500000,got:825000,nbr:18}}], etc:"..."}
        , {name: "Chapelle",src:"void",projects: [], etc:"..."}
        , {name: "Grotte",src:"void",projects: [], etc:"..."}
    ]
    , statsIcons = {start:"📅", desired:"📅", got:"📅", nbr:"📅"}
    
    return <>
        <p className="money">
            Vous pouvez nous faire un don financier: 
            <ol className='safe'>
                <li>("<u>Tout le sanctuaire NDR de Bolobi</u>") en soutenant un de nos <span>${projectsCategories.length-1} projets</span> actuel du sanctuaire que nous vous présentons ci-dessous</li>
                <li>("<u>École</u>", "<u>Chapelle</u>", "<u>Grotte</u>") en soutenant l'ensemble de l'oeuvre Saint Martin de Porrez</li>
            </ol>
        </p>
        <p className='money'>Vous pourrez bien-sûr associer un petit message pour personnalisé à votre don :)</p>
        {/* <Projects /> */}
        <MoneyGiftProjects setItem={setProjectLabel} setProject={setSubProject} projects={projectsCategories} />
        {console.log(subProject)}
        <ShowProject item={projectLabel} subProject={subProject} statsIcons={statsIcons} />
        <fieldset className="safe money">
            <input type="number" id="montant" name="montant" />
            <label htmlFor="montant">Montant</label>
            <span>Vous souhaitez faire <u>un don de</u>: </span>
        </fieldset>
        <fieldset className="safe money">
            <textarea name=""></textarea>
            <label>Décrivez, s'il vous plaît, l'objet de votre don en espèce..</label>
        </fieldset>
    </>
}