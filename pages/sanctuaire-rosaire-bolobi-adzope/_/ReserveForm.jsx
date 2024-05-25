import React, { useRef, useState, useEffect, useMemo, useContext } from "react"
import dynamic from 'next/dynamic'
import DatePicker from "react-datepicker"
import { subDays, addDays, setHours, setMinutes, addMonths } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css"
import {loadRadios} from '../../_/swappy_radio'
// import styles from "./swappy_radio.module.scss"
import FormContext from "../../../stores/formContext.js"




export default function ReserveForm() {

  const ulRef = useRef()
  // , fieldsets = ["dates","type","location","meal","infos"]
  , {FieldsetRadioStyled, SectionCheckboxStyled, templateScss} = useContext(FormContext)
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
    participants
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
  , [startDate, endDate] = dateRange
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
  , filterPassedTime = (time) => {
    const selectedDate = new Date(time);

    return selectedDate.getHours() < 7 && selectedDate.getHours() > 22
  }
  , handleDateChange = (e) => {
    if(du.value!="" && au.value!=""){
      onChange([new Date(du.value),new Date(au.value)])
    }
  }
  , highlightWithRanges = [
    {
      "react-datepicker__day--highlighted-custom-1": [
        subDays(new Date(), 4),
        subDays(new Date(), 3),
        subDays(new Date(), 2),
        subDays(new Date(), 1),
      ],
    },
    {
      "react-datepicker__day--highlighted-custom-2": [
        addDays(new Date(), 1),
        addDays(new Date(), 2),
        addDays(new Date(), 3),
        addDays(new Date(), 4),
      ],
    },
  ]
  , handleOnBlur = ({ target: { value } }) => {
    const date = new Date(value);
    if (isValid(date)) {
      console.log("date: %s", format(date, "dd/MM/yyyy"));
      alert(dateRange)
      setDateRange([startDate, endDate])
    } else {
      console.log("value: %s", date);
    }
  }
  , handleMealChange = (e) => {
    if(e.target.checked){
      document.forms[2].meal.checked = true
      const a = e.target.parentNode.cloneNode(true)
      console.log(a)
      a.querySelector('input').remove()
      console.log(a)
      document.querySelector('p.meal b').innerHTML = a.textContent
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
    <h3 id="trois">RÉSERVER UN SÉJOUR SUR LE CALENDRIER DU SANCTUAIRE <br /> (avance sur paiement demandé): </h3>
    <p>Le sanctuaire ND Rosaire de Bolobi est <u>alimenté en électricité par l'énergie solaire</u>, <u><b>un groupe électrogène complète cette source</b> en cas de temps défavorable</u>.</p>
    <p>Les solutions d'hébergement du sanctuaire vont de la chambre individuel-couple, au chambre communes de 4 à 12 personnes, jusqu'aux dortoirs d'environ 80 places. Les chambres et les dortoirs sont protégés par des moustiques. * <i>Aucun accessoire d'hébergement n'est fourni (drap, oreillet, etc), ces effets sont à la charge du pèlerin</i>.</p>
    <p>Enfin, des <b>solutions de restauration</b> sont à disposition des retraitants selon 2 formules:
        <ol className='safe'>
            <li>Les retraitants peuvent se faire eux-même la cuisine,</li>
            <li>Les retraitants peuvent <u>commander</u> les repas (3000Fcfa les <u>2 repas + petit déjeuner</u>, ou 1500Fcfa pour <u>1 repas</u>)</li>
        </ol>
    </p>
    <form onSubmit={handleSubmit} id="bolobiForm">
      <ul className="dates" onClick={e => {
        // console.log(item.textContent==e.target.textContent)
        // console.log(item.textContent)
        // console.log(e.target.textContent)
        if(e.target.nodeName=="LI"||e.target.nodeName=="A"){
          let lis = Array.from(e.target.closest('ul').querySelectorAll('li'))
          , f = Array.from(bolobiForm.querySelectorAll('fieldset'))
          , li = lis.find((item,i) => item.textContent==e.target.textContent)
          , fieldsetClassName = li.className
          // console.log(li)
          lis.forEach((item,i) => item.classList.remove('active'))
          li.classList.add('active')
          f.forEach((item,i) => item.classList.remove('active'))
          document.querySelector("fieldset."+fieldsetClassName).className = "active "+document.querySelector("fieldset."+fieldsetClassName).className
        }
      }}>
        <li className="active dates"><a href="#dates">Dates</a></li>
        <li className="type"><a href="#type">Évènement</a></li>
        <li className="location"><a href="#location">Nombre</a></li>
        <li className="meal"><a href="#meal">Repas</a></li>
        <li className="infos"><a href="#infos">Infos</a></li>
      </ul>
      <section>
        <fieldset className="active dates">
          <h4>Choisir une période (du DD/MM/YYYY au DD/MM/YYYY): </h4>
          <label htmlFor="du">Du: *</label>
          <input type="date" id="du" name="du" onChange={handleDateChange} />
          <br />
          <label htmlFor="au">Au: *</label>
          <input type="date" id="au" name="au" onChange={handleDateChange} />
        </fieldset>
        <FieldsetRadioStyled id="type" className="type">
          <h4>Quel type d'évènement souhaitez vous organiser à Bolobi ? </h4>
          <section>
              <label htmlFor="pray" className="radioLabel">
                <input id="pray" value="pray" type="radio" name="type_reservation" />
                <span className="radio bottom"></span>
                <span>Prière ponctuelle <span>(100Avé, veillée, recollection, ...)</span></span>
              </label>
              <label htmlFor="celebration" className="radioLabel">
                <input id="celebration" value="celebration" type="radio" name="type_reservation" />
                <span className="radio bottom"></span>
                <span>Célébration <span>(mariage, baptême, conférence, ...)</span></span>
              </label>
              <label htmlFor="retraite" className="radioLabel">
                <input id="retraite" value="retraite" type="radio" name="type_reservation" />
                <span className="radio bottom"></span>
                <span>Retraite de prière <b>de groupe</b> <span>(le weekend généralement)</span></span>
              </label>
              <label htmlFor="individuel" className="radioLabel">
                <input id="individuel" value="individuel" type="radio" name="type_reservation" />
                <span className="radio"></span>
                <span>Retraite de prière <b>individuelle</b></span>
              </label>
              <label htmlFor="repos" className="radioLabel">
                <input id="repos" value="repos" type="radio" name="type_reservation" />
                <span className="radio"></span>
                <span>Repos<br />Détente<br />Convalescence <span>(individuel ou petit groupe)</span></span>
              </label>
              <label htmlFor="longTerm" className="radioLabel">
                <input id="longTerm" value="longTerm" type="radio" name="type_reservation" />
                <span className="radio"></span>
                <span>Vacances / long séjour <span>(maximum 2 mois)</span></span>
              </label>
          </section>
        </FieldsetRadioStyled>
        <FieldsetRadioStyled id="location" className="location">
          <h4>Choisir le type de logement désiré <br/> (chambre à deux, ou dortoir): </h4>
          <label htmlFor="participants">Nombre de paticipants total ? *</label>
          <input id="participants" type="number" name="participants" max="250" min="1" onChange={e => {
            document.querySelector("p.location b").innerHTML = parseInt(e.target.value) - parseInt(individual_room_participants.value)
          }} />
          <section>
            <label htmlFor="dortoirs" className="radioLabel">
              <input id="dortoirs" type="checkbox" name="sleep" />
              <span className="radio"></span>
              <span>Chambre Commune <b>(<b>3000Fcfa</b>/personne la nuité)</b></span>
              {/* <span className="oko">dortoire</span> */}
            </label>
            <label htmlFor="chambre" className="radioLabel">
              <input id="chambre" type="checkbox" name="sleep" />
              <span className="radio"></span>
              <span>Chambre Individuel <b>(<b>10000Fcfa</b>/personne la nuité)</b></span>
              {/* <span>chambre</span> */}
              <input id="individual_room_participants" type="number" name="individual_room_participants" defaultValue={0} max="10" min="0"onChange={e => {
                document.querySelector("p.location_ b").innerHTML = e.target.value
                document.querySelector("p.location b").innerHTML = parseInt(participants.value) - parseInt(e.target.value)
              }} />
            </label>
          </section>
          {/* 
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
          */}
        </FieldsetRadioStyled>
        <fieldset className="infos">
          <h4>Informations générales: </h4>
          <label htmlFor="community">Communauté: 
            <input type="text" id="community" name="community" />
          </label>
          <br />
          <label htmlFor="names">Nom, Prénoms du responsable <span className="alert">*</span>: 
            <input type="text" id="names" name="names" required />
          </label>
          <br />
          <label htmlFor="phone_number">Numéro de contact <span className="alert">*</span>: 
            <input type="tel" pattern="/^(\+225)?\d{8}$/" id="phone_number" name="phone_number" required />
          </label>
          <br />
          <label htmlFor="email">Email de contact: 
            <input type="email" id="email" name="email" />
          </label>
        </fieldset>
      </section>
      <div id="show_image" />
      {/* https://github.com/Hacker0x01/react-datepicker/ */}
      <fieldset className="datepicker">
        <h4>RÉCAPITULATIF: </h4>
        <DatePicker 
          // locale="fr-FR"
          // dateFormat="d MMMM yyyy, h:mm aa"
          dateFormat="d MMMM yyyy"
          selected={startDate} 
          onChange={onChange} 
          onBlur={handleOnBlur}
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          // filterTime={filterPassedTime}
          // minTime={setHours(setMinutes(new Date(), 0), 7)}
          // maxTime={setHours(setMinutes(new Date(), 30), 22)}              
          maxDate={addMonths(new Date(), 18)}
          timeIntervals={15}
          monthsShown={1}

          // placeholderText="blablabla"
          shouldCloseOnSelect={false}
          isClearable={true}
          selectsRange
          inline
          // showTimeSelect
          // showTimeInput
          // showMonthYearPicker
          // showFullMonthYearPicker


          // excludeDates={[addDays(new Date(), 25), addDays(new Date(), 26), addDays(new Date(), 27)]}
          highlightDates={highlightWithRanges}
          excludeDateIntervals={[{start: addDays(new Date(), 25), end: addDays(new Date(), 27) }]}
          // includeDateIntervals={[{ start: addDays(new Date(), 22), end: addDays(new Date(), 24) },]}
          // calendarStartDay={new Date().getDate()}

          // dateFormat="MM/yyyy"
          todayButton="Réservation dates à Bolobi"
        />
        <p className="type"><span>Type de réservation:</span> <b>🚫</b></p>
        <p className="dates"><span>Nombre de nuités:</span> <b>🚫</b></p>
        <p className="location"><span>Nombre de participant estimé (chbres communes):</span> <b>🚫</b> (3.000 Fcfa la nuit)</p>
        <p className="location_"><span>Nombre de chambres individuelles nécessaires:</span> <b>🚫</b> (10.000 Fcfa la nuit)</p>
        <p className="meal"><span>Nombre de repas:</span> <b>Aucun</b></p>
        <p className="infos"></p>
        <p style={{color:"red"}}>*il faut que je rajoute un bouton en bas à droite en position:fixed, pour permettre de sauter directement au formulaire, ou aux différents fieldsets du formulaire</p>
      </fieldset>
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
