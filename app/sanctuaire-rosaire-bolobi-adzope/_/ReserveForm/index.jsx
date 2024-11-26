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
import FieldsetPayment from "./FieldsetPayment"
import ValidationSection from "./ValidationSection"

export default function ReserveForm() { 

  const [isFormValidated, setIsFormValidated] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [participants, setParticipants] = useState(1);
  const [individualRoomParticipants, setIndividualRoomParticipants] = useState(0);
  const [mealPlan, setMealPlan] = useState(0);
  const [customMealData, setCustomMealData] = useState(null);

  // Gestionnaires pour les changements
  const handleParticipantsChange = (value) => {
    const newValue = parseInt(value) || 1;
    setParticipants(newValue);
    // Ajuster le nombre de chambres individuelles si nécessaire
    if (individualRoomParticipants > newValue) {
      setIndividualRoomParticipants(newValue);
    }
    // Mettre à jour l'affichage
    document.querySelector("article.nuites>b").innerHTML = newValue;
    document.querySelector("article.location>b").innerHTML = newValue - individualRoomParticipants;
  };

  const handleIndividualRoomChange = (value) => {
    const newValue = parseInt(value) || 0;
    setIndividualRoomParticipants(newValue);
    // Mettre à jour l'affichage
    document.querySelector("article.location>b").innerHTML = participants - newValue;
    document.querySelector("article.location_ind>b").innerHTML = newValue;
  };

  const handleMealPlanChange = (value) => {
    setMealPlan(parseInt(value) || 0);
  };

  const handleCustomMealChange = (mealData) => {
    setCustomMealData(mealData);
  };
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

  const dateDiffDuAu = e => typeof du !== "undefined" ? dateDiff(new Date(du.value),new Date(au.value)) : 0
  
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
    e.preventDefault();
    setIsSubmitting(true);

    // Créer un timeout de 10 secondes
    const timeout = setTimeout(() => {
      setIsSubmitting(false);
    }, 10000);

    const fd = new FormData(e.target)
    , fd_ = {
      reservation: {
        type_reservation: fd.get('type_reservation')
      }
    }
    
    // Récupérer les informations de contact
    const contactInfo = {
      community: fd.get('community'),
      names: fd.get('names'),
      phone_number: fd.get('phone_number'),
      email: fd.get('email')
    }
    
    // Debug: Afficher tous les radios cochés
    console.log("Radios cochés:", Array.from(document.querySelectorAll('input[type="radio"]:checked')).map(el => ({
      name: el.name,
      value: el.value,
      id: el.id
    })));

    // Gestion des radios et checkboxes
    document.querySelectorAll('input[type="radio"]:checked').forEach(elt=>{
        if(elt.name === 'type_reservation') {
            fd_.reservation.type_reservation = elt.value;
        } else if(fd.has(elt.name)) {
            fd.set(elt.name, elt.id);
        } else {
            fd.append(elt.name, elt.id);
        }
    })
    
    // Debug: Vérifier la valeur de type_reservation dans le FormData
    console.log("type_reservation in FormData:", fd.get('type_reservation'));
    
    fd.set('sleep', (fd.get('sleep')=="on"?1:0))
    fd.delete('time-input')
    
    // Ajouter les dates de début et fin
    fd.set('from', du.value)
    fd.set('to', au.value)
    
    // Ajouter le tableau de contacts converti en JSON
    fd.append('contact', JSON.stringify([contactInfo]))

    // Calcul des montants
    const participants = parseInt(fd.get('participants') || '1');
    const individual_room_participants = parseInt(fd.get('individual_room_participants') || '0');
    const participantsCommune = participants - individual_room_participants;
    const nombreNuits = dateDiffDuAu()?.day || 0;
    
    const PRIX_NUIT_COMMUNE = 3000;
    const PRIX_NUIT_INDIVIDUELLE = 10000;
    
    const montantChambresCommunes = participantsCommune * PRIX_NUIT_COMMUNE * nombreNuits;
    const montantChambresIndividuelles = individual_room_participants * PRIX_NUIT_INDIVIDUELLE * nombreNuits;
    const montantTotal = montantChambresCommunes + montantChambresIndividuelles;
    const montantAvance = Math.ceil(montantTotal * 0.2);

    // Ajouter les montants au FormData
    fd_.reservation.montant_total = montantTotal;
    fd_.reservation.montant_avance = montantAvance;
    fd_.reservation.avance_payee = false;

    // Debug: Vérifier toutes les données avant l'envoi
    console.log("Final FormData entries:", Array.from(fd.entries()));
    console.log("Final fd_ object:", fd_);
    
    Array.from(fd).forEach(elt=>{fd_.reservation[elt[0]] = elt[1]})
    console.log("Données à envoyer:", fd_);
    console.log("Vérification des dates:", {
      from: fd_.reservation.from,
      to: fd_.reservation.to
    });

    try {
      const response = await fetch("/api/reservation", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(fd_),
      });
      const data = await response.json();
      
      clearTimeout(timeout); // Annuler le timeout si la réponse arrive avant
      setIsSubmitting(false);
      
      console.log("Réponse du serveur:", data);
      setReservationData({
          ...data,
          email: contactInfo.email,
          montant_total: fd_.reservation.montant_total,
          montant_avance: fd_.reservation.montant_avance
      });
      setIsFormValidated(true);
      // triggerConfetti();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      clearTimeout(timeout);
      setIsSubmitting(false);
      // Ici vous pourriez ajouter une gestion d'erreur plus détaillée
    }
  }

  return <>
    <Intro {...{sommaire,titreH3}} />

    {isSubmitting && (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    )}

    {!isFormValidated && <form 
      onSubmit={handleSubmit} 
      id="bolobiForm"
      className={isFormValidated ? 'form-validated' : ''}
    >
      <MobileChoices />

      <section
        className = { formNdrToggleImg && "on" }
      >

        <FieldsetDate {...{handleDateChange,toggleFormNdrImg,dateDiffDuAu}} />

        <FieldsetRadioStyled id="type" className="type">
          <FieldsetType {...{toggleFormNdrImg}} />
        </FieldsetRadioStyled>

        <FieldsetRadioStyled id="location" className="location">
          <FieldsetLocation 
            toggleFormNdrImg={toggleFormNdrImg}
            onParticipantsChange={handleParticipantsChange}
            onIndividualRoomChange={handleIndividualRoomChange}
            participants={participants}
            individualRoomParticipants={individualRoomParticipants}
          />
          
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
        
        <FieldsetMeal 
          SectionCheckboxStyled={SectionCheckboxStyled}
          toggleFormNdrImg={toggleFormNdrImg}
          onMealPlanChange={handleMealPlanChange}
          onCustomMealChange={handleCustomMealChange}
        />
        
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

      <FieldsetPayment 
        participants={participants}
        individual_room_participants={individualRoomParticipants}
        dateDiffDuAu={dateDiffDuAu}
        mealPlan={mealPlan}
      />

      <fieldset className="submit">
        <input type="submit" value="Réserver" />
      </fieldset>


      </form>}

    {isFormValidated && <section className={`validated ${isFormValidated ? 'show' : ''}`}>
      {isFormValidated && <ValidationSection reservationData={reservationData} />}
    </section>}

    <style jsx>{`
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9998;
      }

      .form-validate{
        height:0;
      }

      .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #2196f3;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      form {
        transition: height 0.3s ease-in-out;
        pointer-events: ${isSubmitting ? 'none' : 'auto'};
        opacity: ${isSubmitting ? 0.7 : 1};
      }
      
      form.validated {
        height: 0;
        overflow: hidden;
        padding: 0;
        margin: 0;
      }

      section.validated {
        height: auto;
        overflow: hidden;
        padding: 0;
        margin: 0;
        transition: all 0.5s ease-in-out;
        opacity: 0;
        transform: translateY(20px);
      }

      section.validated.show {
        opacity: 1;
        transform: translateY(0);
        padding: 2rem;
      }
    `}</style>
  </>
}
