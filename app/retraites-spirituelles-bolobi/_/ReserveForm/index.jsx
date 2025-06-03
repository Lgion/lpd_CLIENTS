"use client"

import React, { useRef, useState, useEffect, useMemo, useContext } from "react"
import dynamic from 'next/dynamic'
import { subDays, addDays, setHours, setMinutes, addMonths } from 'date-fns';
import {loadRadios} from '../../../_/swappy_radio'
import FlashMessage from '../components/FlashMessage'
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
  const [flashMessage, setFlashMessage] = useState(null);

  const showFlash = (message, type = 'info') => {
    // Remplace directement le message existant
    setFlashMessage({ message, type });
  };

  const clearFlash = () => {
    setFlashMessage(null);
  };

  const [participants, setParticipants] = useState(1);
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
  const titreH3 = "RÉSERVER UN SÉJOUR SUR LE CALENDRIER DU SANCTUAIRE (avance sur paiement demandé): "
  , sommaire = "RÉSERVER DATE"
  , {toggleFormNdrImg,formNdrToggleImg} = useContext(FormContext)

  

  
  async function handleSubmit(e){

    e.preventDefault();
    setIsSubmitting(true);
    // Créer un timeout de 10 secondes
    const timeout = setTimeout(() => {
      setIsSubmitting(false);
    }, 100000);



    const names = document.querySelector('#names')?.value?.trim();
    const phone = document.querySelector('#phone_number')?.value?.trim();
    const email = document.querySelector('#email')?.value?.trim();
    const community = document.querySelector('#community')?.value?.trim();
    
    // Vérifier si le nom est rempli
    if (!names) {
      alert('Veuillez entrer votre nom');
      return;
    }
    // Vérifier si le nom de la community est rempli
    if (!community) {
      alert('Veuillez entrer le nom de votre communauté');
      return;
    }
    
    // Vérifier si le numéro de téléphone est valide
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phone || !phoneRegex.test(phone)) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return;
    }



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
    
    // Ajouter le tableau de contacts converti en JSON
    fd.append('contact', JSON.stringify([contactInfo]))
    
    const PRIX_NUIT_COMMUNE = 3000;
    const PRIX_NUIT_INDIVIDUELLE = 10000;
    const PRIX_REPAS_COMPLET = 3000; // 2 repas + petit déjeuner
    const PRIX_REPAS_UNIQUE = 2000;  // 1 repas + petit déjeuner
    

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
    
    
    // if(true)return false
    try {
      // const response = await fetch("/api/reservation", {
      const response = await fetch("/api/reservation_simple", {
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
      setIsFormValidated(true);
      // triggerConfetti();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      clearTimeout(timeout);
      // setIsSubmitting(false);
      // Ici vous pourriez ajouter une gestion d'erreur plus détaillée
    }
  }
  

  return (
    <form id="bolobiForm" onSubmit={handleSubmit}>
      {flashMessage && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={clearFlash}
        />
      )}
      <Intro {...{sommaire,titreH3}} />

      {isSubmitting && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* {!isFormValidated && ( */}
        <>


          <section
            className = { formNdrToggleImg && "on" }>
            
            <FieldsetInfos 
              toggleFormNdrImg={toggleFormNdrImg}
              // handleFieldsetValidation={handleFieldsetValidation}
            />


            <fieldset className="form_message">
              <h4>Si vous souhaitez passer un message pour cette réservation, nous y tiendrons compte lorsque nous vous rapellons pour confirmer votre réservation: </h4>
              <textarea name="message" cols="30" rows="10"></textarea>
            </fieldset>

          </section>



          <fieldset className="submit">
            <input id="submit_reservation" type="submit" value="Réserver" />
          </fieldset>




        </>
      {/* )} */}

      {/* {isFormValidated && (
        <section className={`validated ${isFormValidated ? 'show' : ''}`}>
          {isFormValidated && <ValidationSection reservationData={reservationData} />}
        </section>
      )} */}

    </form>
  );
}
