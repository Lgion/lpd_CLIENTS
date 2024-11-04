"use client"


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
  , {FieldsetRadioStyled, SectionCheckboxStyled, dateDiff, formNdrToggleImg, toggleFormNdrImg, templateScss} = useContext(FormContext)
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
  , dateDiffDuAu = e => dateDiff(new Date(du.value),new Date(au.value))
  
  useEffect(()=>{
    // participants
    document.querySelectorAll('fieldset.datepicker p').forEach((item,i) => {
      item.addEventListener("click", e => {
        const tmp = e.target.className
        console.log(document.querySelector("fieldset"+(tmp&&"."+e.target.className)))
        // document.querySelector("fieldset."+e.target.className).focus()
        console.log("li."+e.target.className)
        document.querySelector("li"+(tmp&&"."+e.target.className)).click()
      })
    })
    document.querySelector('fieldset.datepicker>article.dates>div').removeAttribute('style')
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
        document.querySelector("article.type>b").innerHTML = a.textContent
      })
    })
  }, [FieldsetRadioStyled])
  // const [dateRange, setDateRange] = useState(new Date(),null)
  // const [dateRange, setDateRange] = useState([new Date().setHours(9,0,0),null])
  const [dateRange, setDateRange] = useState([setHours(setMinutes(new Date(), 0), 9),null])
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
    console.log(dateDiffDuAu());
    document.querySelector('article.dates>b').innerHTML = dateDiffDuAu().day +"jours"
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



      <section
        className = { formNdrToggleImg && "on" }
      >

        <FieldsetDate {...{handleDateChange,toggleFormNdrImg,dateDiffDuAu}} />

        <FieldsetRadioStyled id="type" className="type">
          <FieldsetType {...{toggleFormNdrImg}} />
        </FieldsetRadioStyled>

        <FieldsetRadioStyled id="location" className="location">
          <FieldsetLocation {...{toggleFormNdrImg}} />
          
          {/* <hr />

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
          </section> */}

        </FieldsetRadioStyled>
        
        <FieldsetMeal  {...{SectionCheckboxStyled,toggleFormNdrImg}} />
        
        <FieldsetInfos {...{toggleFormNdrImg}} />

      </section>



      <div 
        id="show_image" 
      />



      {/* https://github.com/Hacker0x01/react-datepicker/ */}
      <Resume {...{dateRange,setDateRange,onChange}} />



      <fieldset>
        <h4>Si vous souhaitez passer un message pour cette réservation, nous y tiendrons compte lorsque nous vous rapellons pour confirmer votre réservation: </h4>
        <textarea name="message" cols="30" rows="10"></textarea>
      </fieldset>

      <fieldset>
        <input type="submit" value="Réserver" />
      </fieldset>


      
    </form>
  </>
}
