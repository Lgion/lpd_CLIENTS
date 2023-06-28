import React, { useRef, useState, useEffect, useMemo, useContext } from "react"
import dynamic from 'next/dynamic'
import DatePicker from "react-datepicker"
import { subDays, addDays, setHours, setMinutes, addMonths } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css"
import {loadRadios} from '../../_/swappy_radio'
// import styles from "./swappy_radio.module.scss"
import FormContext from "../../../stores/formContext.js"




export default function ReserveForm() {

  const {FieldsetRadioStyled, SectionCheckboxStyled} = useContext(FormContext)
  
  useEffect(()=>{
    loadRadios()
  }, [FieldsetRadioStyled])
  // const [dateRange, setDateRange] = useState(new Date(),null)
  // const [dateRange, setDateRange] = useState([new Date().setHours(9,0,0),null])
  const [dateRange, setDateRange] = useState([setHours(setMinutes(new Date(), 0), 9),null])
  , [startDate, endDate] = dateRange
  , onChange = (update) => {
      // alert(+new Date(update[0]))
      let a = new Date(update[0])
      let b = new Date(update[1])
      // du.value = a.getFullYear()+"-"+a.getMonth().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })+"-"+a.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
      // au.value = b.getFullYear()+"-"+b.getMonth().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })+"-"+b.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
      du.value = a.toISOString().slice(0, 16)
      au.value = b.toISOString().slice(0, 16)
      alert(a.toISOString().slice(0, 16))
      setDateRange(update);
  }
  , filterPassedTime = (time) => {
    const selectedDate = new Date(time);

    return selectedDate.getHours() < 7 && selectedDate.getHours() > 22
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
    "use server"
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
   }

  return (
    <form onSubmit={handleSubmit}>
      <section>
          <fieldset>
            <h2>Informations générales: </h2>
            <label htmlFor="community">Communauté: </label>
            <input type="text" id="community" name="community" />
            <br />
            <label htmlFor="names">Nom, Prénoms *: </label>
            <input type="text" id="names" name="names" />
            <br />
            <label htmlFor="phone_number">Numéro de contact *: </label>
            <input type="tel" pattern="/^(\+225)?\d{8}$/" id="phone_number" name="phone_number" />
            <br />
            <label htmlFor="email">Email de contact *: </label>
            <input type="email" id="email" name="email" />
          </fieldset>
          <fieldset>
            <h2>Choisir une période (du DD/MM/YYYY au DD/MM/YYYY): </h2>
            <label htmlFor="du">Du: *</label>
            <input type="datetime-local" id="du" name="du" />
            <br />
            <label htmlFor="au">Au: *</label>
            <input type="datetime-local" id="au" name="au" />
          </fieldset>
          <FieldsetRadioStyled>
            <h2>Choisir le type de logement désiré (chambre à deux, ou dortoir): </h2>
            <label htmlFor="participants">Nombre de paticipants ? *</label>
            <input id="participants" type="number" name="participants" max="250" min="1" />
            <section>
              <label htmlFor="chambre" className="radioLabel">
                <input id="chambre" type="radio" name="sleep" />
                <span className="radio"></span>
                <span>chambre</span>
              </label>
              <label htmlFor="dortoirs" className="radioLabel">
                <input id="dortoirs" type="radio" name="sleep" />
                <span className="radio"></span>
                <span className="oko">dortoire</span>
              </label>
            </section>
          </FieldsetRadioStyled>
          <fieldset>
            <h2>Choisir si vous souhaitez que les repas vous soient préparé (3000Fcfa/jour): </h2>
            <SectionCheckboxStyled>
              <label htmlFor="meal">
                <input type="checkbox" id="meal" name="meal" />
                <span>Repas Inclus 🍔 😋 🍲</span>
                <i className="indicator">
                  <svg version="1.1" id="toggle" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 33 33" xmlSpace="preserve"
                  >
                    <path className="circ path" style={{fill:"none",strokeWidth:3,strokeLinejoin:"round",strokeMiterlimit:10}} d="M6.2,6.2L6.2,6.2
                      c-5.7,5.7-5.7,14.8,0,20.5l0,0c5.7,5.7,14.8,5.7,20.5,0l0,0c5.7-5.7,5.7-14.8,0-20.5l0,0C21.1,0.6,11.9,0.6,6.2,6.2z"
                    />
                    <polyline className="cross path" style={{fill:"none",stroke:"#CD4C10",strokeWidth:3,strokeLinejoin:"round",strokeMiterlimit:10}} points=" 11.4,11.4 21.6,21.6 "/>
                    <polyline className="cross path" style={{fill:"none",stroke:"#CD4C10",strokeWidth:3,strokeLinejoin:"round",strokeMiterlimit:10}} points="21.6,11.4 11.4,21.6  "/>
                    <polyline className="tick path" style={{fill:"none",stroke:"#557D25",strokeWidth:3,strokeLinejoin:"round",strokeMiterlimit:10}} points="10,17.3 13.8,21.1 
                      23,11.9 "
                    />
                  </svg>
                </i>
                <span>Sans repas 🚫</span>
              </label>
            </SectionCheckboxStyled>
          </fieldset>
          <FieldsetRadioStyled>
            <h2>Type de réservation (individuel, en groupe, vacances): *</h2>
            <section>
              <label htmlFor="un" className="radioLabel">
                <input id="un" type="radio" name="type_reservation" />
                <span className="radio"></span>
                <span>Individuel <b>(500Fcfa seulement par personne)</b></span>
              </label>
              <label htmlFor="deux" className="radioLabel">
                <input id="deux" type="radio" name="type_reservation" />
                <span className="radio"></span>
                <span>Individuel <b>(2500Fcfa/personne)</b></span>
              </label>
              <label htmlFor="trois" className="radioLabel">
                <input id="trois" type="radio" name="type_reservation" />
                <span className="radio"></span>
                <span>Individuel <b>(1500Fcfa/personne)</b></span>
              </label>
            </section>
          </FieldsetRadioStyled>
      </section>
      <img src="/img/_/bolobi/alle-bolobi.jpg" alt="" />
      {/* https://github.com/Hacker0x01/react-datepicker/ */}
      <fieldset className="datepicker">
        <DatePicker 
          // locale="fr-FR"
          dateFormat="d MMMM yyyy, h:mm aa"
          selected={startDate} 
          onChange={onChange} 
          onBlur={handleOnBlur}
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          // filterTime={filterPassedTime}
          minTime={setHours(setMinutes(new Date(), 0), 7)}
          maxTime={setHours(setMinutes(new Date(), 30), 22)}              
          maxDate={addMonths(new Date(), 18)}
          timeIntervals={15}
          monthsShown={3}

          // placeholderText="blablabla"
          shouldCloseOnSelect={false}
          isClearable={true}
          selectsRange
          inline
          // showTimeSelect
          showTimeInput
          // showMonthYearPicker
          // showFullMonthYearPicker


          // excludeDates={[addDays(new Date(), 25), addDays(new Date(), 26), addDays(new Date(), 27)]}
          highlightDates={highlightWithRanges}
          excludeDateIntervals={[{start: addDays(new Date(), 25), end: addDays(new Date(), 27) }]}
          // includeDateIntervals={[{ start: addDays(new Date(), 22), end: addDays(new Date(), 24) },]}
          // calendarStartDay={new Date().getDate()}

          // dateFormat="MM/yyyy"
          todayButton="yuuhooo, today c'est ajd !!!"
        />
      </fieldset>
      <fieldset>
        <h2>Si vous souhaitez passer un message pour cette réservation, nous y tiendront compte lorsque nous vous rapellons pour confirmer votre réservation: </h2>
        <textarea name="message" cols="30" rows="10"></textarea>
      </fieldset>
      <fieldset><input type="submit" /></fieldset>
    </form>
  )
}
