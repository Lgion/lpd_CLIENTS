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
  const [isActive, setIsActive] = useState("infos")

  const [participants, setParticipants] = useState(0);
  const [individualRoomParticipants, setIndividualRoomParticipants] = useState(0);
  const [mealPlan, setMealPlan] = useState(0);
  const [customMealData, setCustomMealData] = useState(null);

  // State pour suivre la validation des fieldsets
  const [fieldsetsValidation, setFieldsetsValidation] = useState({
    infos: false,
    type: false,
    dates: false,
    location: false,
    meal: false,
  });

  // Fonction pour mettre à jour la validation d'un fieldset

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
  , titreH3 = "RÉSERVER UN SÉJOUR SUR LE CALENDRIER DU SANCTUAIRE (avance sur paiement demandé): "
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
    document.querySelector('fieldset.recap>article.dates>div').removeAttribute('style')
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
    document.querySelector('article.dates>b').innerHTML = dateDiffDuAu().day +" nuits"
  }
  , handleDateChange = (is_SingleDateInputChoice) => {
    if(is_SingleDateInputChoice){
      document.querySelector('article.dates>b').innerHTML = "0 nuits"
    }else if(du.value!="" && au.value!=""){
      onChange([new Date(du.value),new Date(au.value)])
    }
  }
  , handleFieldsetValidation = (fieldsetName) => {

    // location.href = "/sanctuaire-rosaire-bolobi-adzope#bolobiForm_choices_ul"
    bolobiForm_choices_ul.scrollIntoView({ behavior: "smooth", block: "start" })
    
    setFieldsetsValidation(prev => {
      console.log(prev);
      console.log(Object.keys(prev));
      
      const currentIndex = Object.keys(prev).findIndex(elt=>elt===fieldsetName)
      , nextFieldsetName = Object.keys(prev)[currentIndex+1]
      , nextFieldsetEventLikeObject = {target: document.querySelector(`.bolobiForm_choices .${nextFieldsetName}`)}
      console.log(currentIndex);
      console.log(Object.keys(prev)[currentIndex+1]);
      console.log(nextFieldsetEventLikeObject);
      
      
      // Si on est en mode mobile, ".bolobiForm_choices" existera et nextFieldsetEventLikeObject.target aussi
      if(nextFieldsetEventLikeObject.target)onClickMobileChoices(nextFieldsetEventLikeObject)
        
        
        
// JE PENSE QU'IL Y A UN PROBLÈME ICI
// ENTRE VERSION MOBILE ET DESKTOP
      else{
        // Si tous les fieldsets sont validés, on va au récapitulatif
        if(Object.values(fieldsetsValidation).filter(el=>!!!el).length==0)
          recapitulatif.scrollIntoView({ behavior: "smooth", block: "start" })
        else{
          const tmpNextFieldsetIndex = Object.values(fieldsetsValidation).findIndex(el=>!!!el)
          , tmpNextFieldsetName = Object.keys(fieldsetsValidation)[tmpNextFieldsetIndex]
          , tmpNextFieldsetEventLikeObject = {target: document.querySelector(`.bolobiForm_choices .${tmpNextFieldsetName}`)}

          if(tmpNextFieldsetEventLikeObject.target)onClickMobileChoices(tmpNextFieldsetEventLikeObject)

          bolobiForm_choices_ul.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
// END
// END
      
      
      
      return {
        ...prev,
        [fieldsetName]: true
      }
    });
    
  }
  , onClickMobileChoices = e => {
    // console.log(item.textContent==e.target.textContent)
    // console.log(item.textContent)
    // console.log(e.target.textContent)

    // if (e.target.nodeName == "LI" || e.target.nodeName == "A") {
        // console.log(e);

        // POUR ACTIVER LE LI CORRESPONDANT
        // let lis = Array.from(e.target.closest('ul').querySelectorAll('li'))
        let lis = Array.from(bolobiForm_choices_ul.querySelectorAll('li'))
        , f = Array.from(bolobiForm.querySelectorAll('fieldset'))
        , li = e.target.closest('li')
        , li_item_related_to_li_clicked = lis.find((item, i) => {
          console.log(item.className, " yyy ", li.className);
          console.log(item.textContent, " xxx ", li.textContent);
          
          return item.textContent == li.textContent
        })
        console.log(li)
        console.log(lis)
        lis.forEach((item, i) => {
          console.log("li: ", item.className);
          item.classList.remove('active')
          console.log("li bis: ", item.className);
        })
        console.log(li);
        console.log(li.className)
        console.log(lis)
        li.classList.add('active')
        console.log(li);
        console.log(li.className)
        f.forEach((item, i) => {item.classList.remove('active')})

        


        // POUR ACTIVER LE FIELDSET CORRESPONDANT
        const fieldsetClassName = li?.className.split(' ')[0]
        console.log(fieldsetClassName)
        document.querySelector("fieldset.active")?.classList.remove("active")
        document.querySelector("fieldset." + fieldsetClassName).className = "active " + document.querySelector("fieldset." + fieldsetClassName).className

    // }

    setFieldsetsValidation(prev => {
      // alert(li)
      // alert(e.target)
      // alert(e.target.className)
      // e.target.classList.add("active")
      return {...prev, [li.className.split(" ")[0]]: false}
    })
    
    const isActiveValue = e.target.closest('li').className.split(" ")[0]
    setIsActive(isActiveValue)
    
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
  async function handleEmptyInputsChecking(e){
    console.log(document.querySelectorAll('section.on fieldset'));
    document.querySelectorAll('section.on fieldset').forEach(fs => fs.classList.add('active'));

      // Récupérer tous les champs requis
      const requiredFields = Array.from(document.querySelectorAll('[required]'));

      // Filtrer les champs vides et créer un rapport détaillé
      const invalidFields = requiredFields.filter(field => !field.value.trim()).map(field => ({
        id: field.id,
        name: field.name,
        type: field.type,
        fieldset: field.closest('fieldset')?.className.split(' ')[0] || 'unknown'
      }));
  }
  async function handleSubmit(e){

    e.preventDefault();
    setIsSubmitting(true);
    // Créer un timeout de 10 secondes
    const timeout = setTimeout(() => {
      setIsSubmitting(false);
    }, 10000);



    // alert('ok')
    // Si tous les fieldsets sont validés, on va au récapitulatif
    if(Object.values(fieldsetsValidation).filter(el=>!!!el).length!==0){
      alert("Le formulaire n'est pas complet...")
      clearTimeout(timeout); // Annuler le timeout si la réponse arrive avant
      setIsSubmitting(false);
      bolobiForm_choices_ul.scrollIntoView({ behavior: "smooth", block: "start" })
      return;
    }
    
    ////// GÉRER LES CHAMPS VIDES
    // handleEmptyInputsChecking()
    


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
            fd.set(elt.name, elt.value);
        } else {
            fd.append(elt.name, elt.value);
        }
    })
    
    // Debug: Vérifier la valeur de type_reservation dans le FormData
    console.log("type_reservation in FormData:", fd.get('type_reservation'));
    
    fd.set('sleep', (fd.get('sleep')=="on"?1:0))
    fd.delete('time-input')
    
    // Ajouter les dates de début et fin
    fd.set('from', zero_night.checked? le.value : du.value)
    fd.set('to', zero_night.checked? le.value : au.value)
    
    // Ajouter le tableau de contacts converti en JSON
    fd.append('contact', JSON.stringify([contactInfo]))

    // Calcul des montants
    const participants = parseInt(fd.get('participants') || '1');
    const individual_room_participants = parseInt(fd.get('individual_room_participants') || '0');
    const participantsCommune = participants - individual_room_participants;
    const nombreNuits = dateDiffDuAu()?.day || 0;
    
    const PRIX_NUIT_COMMUNE = 3000;
    const PRIX_NUIT_INDIVIDUELLE = 10000;
    const PRIX_REPAS_COMPLET = 3000; // 2 repas + petit déjeuner
    const PRIX_REPAS_UNIQUE = 2000;  // 1 repas + petit déjeuner
    
    const montantChambresCommunes = participantsCommune * PRIX_NUIT_COMMUNE * nombreNuits;
    const montantChambresIndividuelles = individual_room_participants * PRIX_NUIT_INDIVIDUELLE * nombreNuits;
    
    // Calcul du montant des repas
    const mealIncluded = fd.get('meal_included') === 'on';
    let montantRepas = 0;
    if (mealIncluded) {
        // Récupérer les repas sélectionnés
        const customMeal = {
            breakfast: fd.get('breakfast') || '',
            lunch: fd.get('lunch') || '',
            dinner: fd.get('dinner') || ''
        };
        
        // Ajouter les repas à la réservation
        console.log(fd_.reservation.meal_included);
        fd_.reservation.meal_included = true;
        console.log(fd_.reservation.meal_included,0);
        fd_.reservation.meal_plan = parseInt(fd.get('meal_plan') || '1', 10);
        fd_.reservation.meals = customMeal;  // Directement comme un objet, pas en JSON
        
        // Calcul du montant des repas
        if (fd_.reservation.meal_plan === 1) {
            montantRepas = participants * PRIX_REPAS_UNIQUE * nombreNuits;
        }
        if (fd_.reservation.meal_plan === 2) {
            montantRepas = participants * PRIX_REPAS_COMPLET * nombreNuits;
        }
        console.log(fd_.reservation.meal_included);
    } else {
        // Si pas de repas, initialiser avec les valeurs par défaut
        fd_.reservation.meal_included = false;
        fd_.reservation.meal_plan = 0;
        fd_.reservation.meals = {
            breakfast: '',
            lunch: '',
            dinner: ''
        };
    }
    console.log(fd_.reservation.meal_included,2);
    
    const montantTotal = montantChambresCommunes + montantChambresIndividuelles + montantRepas;
    const montantAvance = Math.ceil(montantTotal * 0.2);

    // Ajouter les montants au FormData
    fd_.reservation.montant_total = montantTotal;
    fd_.reservation.montant_avance = montantAvance;
    fd_.reservation.avance_payee = false;

    // Debug: Vérifier toutes les données avant l'envoi
    console.log("Final FormData entries:", Array.from(fd.entries()));
    console.log("Final fd_ object:", fd_);
    
    // Copier les données du FormData dans fd_.reservation
    Array.from(fd).forEach(([key, value]) => {
        // Ne pas écraser les montants déjà calculés
        if (key !== 'montant_total' && key !== 'montant_avance' && key !== 'meal_included') {
            fd_.reservation[key] = value;
        }
    });
    
    console.log("Données à envoyer:", fd_);
    console.log("Vérification des dates:", {
      from: fd_.reservation.from,
      to: fd_.reservation.to
    });

    console.log(fd_.reservation.meal_included,3);
    console.log(fd_);
    
    // if(true)return false
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
      noValidate
      className={isFormValidated ? 'form-validated' : ''}
    >
      <MobileChoices {...{onClickMobileChoices,isActive,fieldsetsValidation}} />

      <section
        className = { formNdrToggleImg && "on" }
      >
        
        <FieldsetInfos 
          toggleFormNdrImg={toggleFormNdrImg}
          handleFieldsetValidation={handleFieldsetValidation}
        />

        <FieldsetRadioStyled id="type" className="type">
          <FieldsetType 
            toggleFormNdrImg={toggleFormNdrImg}
            handleFieldsetValidation={handleFieldsetValidation}
          />
        </FieldsetRadioStyled>

        <FieldsetDate 
          handleDateChange={handleDateChange}
          toggleFormNdrImg={toggleFormNdrImg}
          dateDiffDuAu={dateDiffDuAu}
          handleFieldsetValidation={handleFieldsetValidation}
        />

        <FieldsetRadioStyled id="location" className="location">
          <FieldsetLocation
            toggleFormNdrImg={toggleFormNdrImg}
            onParticipantsChange={handleParticipantsChange}
            onIndividualRoomChange={handleIndividualRoomChange}
            participants={participants}
            individualRoomParticipants={individualRoomParticipants}
            handleFieldsetValidation={handleFieldsetValidation}
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
          handleFieldsetValidation={handleFieldsetValidation}
        />

        <fieldset>
          <h4>Si vous souhaitez passer un message pour cette réservation, nous y tiendrons compte lorsque nous vous rapellons pour confirmer votre réservation: </h4>
          <textarea name="message" cols="30" rows="10"></textarea>
        </fieldset>

      </section>

      <div 
        id="show_image" 
      />


      {/* https://github.com/Hacker0x01/react-datepicker/ */}
      <Resume {...{dateRange,setDateRange,onChange}} />


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
