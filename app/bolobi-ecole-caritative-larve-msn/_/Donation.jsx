"use client";
import { useState, useEffect, useContext } from "react";
import Image from "next/image"
import AuthContext from "../../../stores/authContext.js"
import FormContext from "../../../stores/formContext.js"
import {loadRadios} from '../../_/swappy_radio'
import MoneyGift from "./MoneyGift"
import NatureGift from "./NatureGift"


export default function Donation() {
  // const {FieldsetRadioStyled, SectionCheckboxStyled} = useContext(FormContext)
  // , {myLoader} = useContext(AuthContext)
  const [giftType, setGiftType] = useState("")
  , handleBtn = (e) => {
    if(form_donation.classList.contains('on')){
      form_donation.classList.remove('on')
      e.target.innerHTML = "FAIRE UN <span>DON</span>"
    }else{
      form_donation.classList.add('on')
      e.target.innerHTML = "Fermer"
    }
  }
  , handleSubmit = async function(e){
    e.preventDefault()

    let fieldset_nature_predefined = Array.from(e.target.querySelectorAll('fieldset.nature_predefined'))
    nature_predefined.value = fieldset_nature_predefined.map(elt=>{
      let input = elt.querySelector('input')
      if(input.value>0)
        return input.value+input.id+";;;"
    })

    const fd = new FormData(e.target)
    , fd_ = {donation: {}}

    document.querySelectorAll('input[type="radio"]:checked').forEach(elt=>{
        if(fd.has(elt.name))fd.set(elt.name,elt.value)
        else fd.append(elt.name,elt.id)
    })
    Array.from(fd).forEach(elt=>{fd_.donation[elt[0]] = elt[1]})
    console.log(fd_);
    fetch("/api/donation", {
        method: "POST"
        , headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fd_),
        //   body: JSON.stringify({oui:"n,on"}),
        //   body: new FormData(e.target),
    })

  }

  console.log("ok")

  // useEffect(()=>{
  //   loadRadios()
  //   donationType1.click()
  // }, [FieldsetRadioStyled])

  return <section>
    <article>
      {/*
      <h1>ÉCOLE SAINT MARTIN DE PORÈZ DE BOLOBI</h1>
      <p>Voici une description attractive de l&acute;école</p>
      <Image
          key={"ecole_bolobi_eleves_pose"}
          loader={myLoader}
          src={"/img/_/ecole-primaire-bolobi/photo-classe-ecole-bolobi.jpg"}
          alt={"Les élèves de l'école de bolobi posent pour la mamie Mme ACHI"}
          width={200} height={400}
      />
      */}
      <h3><u>BOLOBI:</u> Un sanctuaire chrétien, son activité caritative, et de leur financement économique.</h3>
      <Image
          key={"ecole_bolobi_eleves_pose"}
          // loader={myLoader}
          // src={"/img/_/ecole-primaire-bolobi/photo-classe-ecole-bolobi.jpg"}
          src={"/img/_/bolobi/croix-bolobi.jpg"}
          alt={"Les élèves de l'école de bolobi posent pour la mamie Mme ACHI"}
          width={200} height={400}
      />
      <section>
        <h4>L'<strong>Oeuvre caritative</strong> du sanctuaire: l'<strong>école Saint Martin de Porrèz</strong></h4>
        <p>L'<a href="#" target="blink">école Saint Martin de Porrèz</a> est une école primaire gratuite basé à <strong>Bolobi</strong>. Cette école est en premier lieu à l'endroit des enfants des travailleurs agricoles des alentours de bolobi (proche yakasseme).</p>
        <p>
          Le sanctuaire Notre Dame de Bolobi a ouvert l'<strong>école Saint Martin</strong> de Porrez en septembre 2020 avec une classe, le CP1.
          L'objectif du sanctuaire est d'ouvrir toutes les classes du primaire à raison d'une nouvelle classe supplémentaire chaque année. Selon cette objectif nous devrions être reconnu par l'Etat pour l'année scolaire 2025-2026.
        </p>
        <p>
          Un internat et une cantine sont à la disposition des élèves de l'école, actifs depuis septembre 2021.
          <br/><u>Pour l'internat</u>, nous demandons un financement à auteur de <b>5000F mensuel</b> aux parents d'élèves
          <br/><u>Pour la cantine scolaire</u>, nous nourrissons gratuitement tous les élèves de l'école Saint Martin de Porrèz. <i>Les internes ont en plus le petit-déjeuner.</i>
        </p>
      </section>
      <div>
        <button id="do_donation_btn" className="safe" onClick={handleBtn}>FAIRE UN <span>DON</span></button>
      </div>
      <h3>AUX <span>ÉCOLES ST MARTIN DE PORREZ</span>: </h3>
    </article>
    <form id="form_donation" onSubmit={handleSubmit}>
      <fieldset className="safe">
        <h2>Coordonnées de contact: </h2>
        <label htmlFor="nom">Nom</label>
        <input type="text" id="nom" name="firstname" />
        <label htmlFor="prenom">Prénom</label>
        <input type="text" id="prenom" name="lastname" />
        <label htmlFor="phone">N° Téléphone</label>
        <input type="text" id="phone" name="phone_number" />
        <label htmlFor="email">E-mail</label>
        <input type="text" id="email" name="email" />
      </fieldset>
      {/* <FieldsetRadioStyled>
        <h2>Définir la forme de votre don ?</h2>
        <section>
          <label htmlFor="donationType1" className="radioLabel">
            <input onChange={()=>{setGiftType(0)}} type="radio" id="donationType1" name="donation_type" defaultValue="argent" />
            <span className="radio"></span>
            <span>Argent</span>
          </label>
          <label htmlFor="donationType2" className="radioLabel">
            <input onChange={()=>{setGiftType(1)}}  type="radio" id="donationType2" name="donation_type" defaultValue="nature" />
            <span className="radio"></span>
            <span>Nature</span>
          </label>
        </section>
        <section className={"money_or_nature " + (giftType==0 ? "money" : "nature")}>
          <MoneyGift />
          <NatureGift />
          <input type="hidden" id="nature_predefined" name="nature_predefined" defaultValue="" />
        </section>
      </FieldsetRadioStyled> */}
      {/* <fieldset className="money_or_nature">
      </fieldset> */}
      <fieldset>
        <input type="submit" />
      </fieldset>
    </form>
  </section>
}
