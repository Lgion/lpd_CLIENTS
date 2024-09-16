import React, { useRef, useState, useEffect, useMemo, useContext } from "react"
import dynamic from 'next/dynamic'
import { subDays, addDays, setHours, setMinutes, addMonths } from 'date-fns';
import {loadRadios} from '../../../_/swappy_radio'
// import styles from "./swappy_radio.module.scss"
import FormContext from "../../../../stores/formContext.js"
import Resume from "./Resume"
import Intro from "./Intro"
import MobileChoices from "./MobileChoices"
import FieldsetDate from "./FieldsetDate"
import FieldsetType from "./FieldsetType"
import FieldsetLocation from "./FieldsetLocation"
import FieldsetInfos from "./FieldsetInfos"
import FieldsetMeal from "./FieldsetMeal"




export default function ReserveForm() {

  const ulRef = useRef()
  // , fieldsets = ["dates","type","location","meal","infos"]
  , {FieldsetRadioStyled, SectionCheckboxStyled, templateScss} = useContext(FormContext)
  , titreH3 = "RÉSERVER UN SÉJOUR SUR LE CALENDRIER DU SANCTUAIRE <br /> (avance sur paiement demandé): "
  , sommaire = "RÉSERVER DATE"
  , onFieldset = e => {
    // console.log(e.target.className)
    // alert('ok')
    // alert(e.target.nodeName!="FIELDSET"?e.target.closest('fieldset').className:e.target.className)
    const f = e.target.nodeName!="FIELDSET"
      ? e.target.closest('fieldset').className
      : e.target.className

    // console.log(f)
    
    show_image.className = f.split(' ').at(-1)
  }
  
  useEffect(()=>{
    // participants
    document.querySelectorAll('fieldset.datepicker p').forEach((item,i) => {
      item.addEventListener("click", e => {
        console.log(document.querySelector("fieldset."+e.target.className))
        // document.querySelector("fieldset."+e.target.className).focus()
        document.querySelector("li."+e.target.className).click()
      })
    })
  }, [])
  useEffect(()=>{
    loadRadios()
    const a = Array.from(document.querySelectorAll("#bolobiForm fieldset"))
    , b = Array.from(type.querySelectorAll('section label'))
    a.forEach(item => {item.addEventListener("mouseover",onFieldset)})
    b.forEach((item,i) => {
      item.addEventListener("click", e => {
        let a = e.target.parentNode.querySelector("span:last-child").cloneNode(true)
        a.querySelector('span')?.remove()
        document.querySelector("p.type b").innerHTML = a.textContent
      })
    })
  }, [FieldsetRadioStyled])
  // const [dateRange, setDateRange] = useState(new Date(),null)
  // const [dateRange, setDateRange] = useState([new Date().setHours(9,0,0),null])
  const [dateRange, setDateRange] = useState([setHours(setMinutes(new Date(), 0), 9),null])
  , dateDiff = (date1, date2) => {
    var diff = {}							// Initialisation du retour
    var tmp = date2 - date1;
  
    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;					// Extraction du nombre de secondes
  
    tmp = Math.floor((tmp-diff.sec)/60);	// Nombre de minutes (partie entière)
    diff.min = tmp % 60;					// Extraction du nombre de minutes
  
    tmp = Math.floor((tmp-diff.min)/60);	// Nombre d'heures (entières)
    diff.hour = tmp % 24;					// Extraction du nombre d'heures
    
    tmp = Math.floor((tmp-diff.hour)/24);	// Nombre de jours restants
    diff.day = tmp;
    
    return diff;
  }
  , onChange = (update) => {
    // alert(+new Date(update[0]))
    let a = new Date(update[0])
    let b = new Date(update[1])
    console.log(a.toISOString())
    console.log(b.toISOString())
    // du.value = a.getFullYear()+"-"+a.getMonth().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })+"-"+a.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
    // au.value = b.getFullYear()+"-"+b.getMonth().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })+"-"+b.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
    du.value = a.toISOString().slice(0, 10)
    au.value = b.toISOString().slice(0, 10)
    // alert(a.toISOString().slice(0, 16))
    setDateRange(update);
    document.querySelector('p.dates b').innerHTML = dateDiff(new Date(du.value),new Date(au.value)).day
  }
  , handleDateChange = (e) => {
    if(du.value!="" && au.value!=""){
      onChange([new Date(du.value),new Date(au.value)])
    }
  }
  /*
  const [startDate, setStartDate] = useState(new Date())
  , [endDate, setEndDate] = useState(null)
  , onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  }
  */
  async function handleSubmit(e){
    alert('ok')
    // console.log(e.target);
    // console.log(Array.from(new FormData(e.target)))
    // console.log(Array.from(new FormData(e.target)).map(elt=>({[elt[0]]:elt[1]})))
    e.preventDefault()

    const fd = new FormData(e.target)
    , fd_ = {reservation: {}}
    document.querySelectorAll('input[type="radio"]:checked').forEach(elt=>{
        if(fd.has(elt.name))fd.set(elt.name,elt.id)
        else fd.append(elt.name,elt.id)
    })
    fd.set('sleep', (fd.get('sleep')=="on"?1:0))
    fd.delete('time-input')
    Array.from(fd).forEach(elt=>{fd_.reservation[elt[0]] = elt[1]})
    console.log(fd_);

    
    fetch("/api/reservation", {
        method: "POST"
        , headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fd_),
        //   body: JSON.stringify({oui:"n,on"}),
        //   body: new FormData(e.target),
    })
      .then(r => r.json())
      .then(data => {
        console.log(data)
      })
  }


  return <>
    <Intro {...{sommaire,titreH3}} />
    <form onSubmit={handleSubmit} id="bolobiForm">
      <MobileChoices />
      <section>
        <FieldsetDate {...{handleDateChange}} />
        <FieldsetRadioStyled id="type" className="type">
          <FieldsetType />
        </FieldsetRadioStyled>
        <FieldsetRadioStyled id="location" className="location">
          <FieldsetLocation />
          
          <hr />
          <section>
            <label htmlFor="un" className="radioLabel">
              <input id="un" type="radio" name="type_reservation" />
              <span className="radio"></span>
              <span>Chambre Commune <b>(3000Fcfa/personne la nuité)</b></span>
            </label>
            <label htmlFor="deux" className="radioLabel">
              <input id="deux" type="radio" name="type_reservation" />
              <span className="radio"></span>
              <span>Chambre Individuel <b>(10000Fcfa/personne la nuité)</b></span>
            </label>
            <label htmlFor="trois" className="radioLabel">
              <input id="trois" type="radio" name="type_reservation" />
              <span className="radio"></span>
              <span>Individuel <b>(1500Fcfa/personne)</b></span>
            </label>
          </section>
          <FieldsetMeal SectionCheckboxStyled={SectionCheckboxStyled} />
        </FieldsetRadioStyled>
        <FieldsetInfos />
      </section>
      <div id="show_image" />
      {/* https://github.com/Hacker0x01/react-datepicker/ */}
      <Resume {...{dateRange,setDateRange,onChange}} />
      <fieldset>
        <h4>Si vous souhaitez passer un message pour cette réservation, nous y tiendrons compte lorsque nous vous rapellons pour confirmer votre réservation: </h4>
        <textarea name="message" cols="30" rows="10"></textarea>
      </fieldset>
      <fieldset>
        <input type="submit" />
      </fieldset>
    </form>
  </>
}
