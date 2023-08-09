import { useState, useEffect, useContext } from "react";
import Image from "next/image"
import AuthContext from "../../../stores/authContext.js"
import FormContext from "../../../stores/formContext.js"
import {loadRadios} from '../../_/swappy_radio'


export default function Donation() {

  const {myLoader} = useContext(AuthContext)
  , {FieldsetRadioStyled, SectionCheckboxStyled} = useContext(FormContext)
  , [giftType, setGiftType] = useState("")
  , handleBtn = (e) => {
    if(form_donation.classList.contains('on')){
      form_donation.classList.remove('on')
      e.target.innerHTML = "FAIRE UN DON"
    }else{
      form_donation.classList.add('on')
      e.target.innerHTML = "Fermer"
    }
  }
  , nature_gifts = {
    riz: "Riz (25kg)"
    , manuel_scolaire: "Manuels scolaires (10 élèves)"
    , tenu_scolaire: "Tenus scolaire (10 élèves)"
    // , habits: "Vêtements (chaussures, t-shirts, shorts, etc...)"
  }
  let a,nature_arr=[]

  for(a in nature_gifts)nature_arr.push(<fieldset key={a} className="nature_predefined">
    <label htmlFor={a}>
      <input id={a} name={a} type="number" defaultValue="0" />
      <span>{nature_gifts[a]}</span>
    </label>
  </fieldset>)
  
  async function handleSubmit(e){
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

  useEffect(()=>{
    loadRadios()
  }, [FieldsetRadioStyled])

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
      <h2><u>BOLOBI:</u> Un sanctuaire chrétien, son activité caritative, et de leur financement économique.</h2>
      <Image
          key={"ecole_bolobi_eleves_pose"}
          loader={myLoader}
          src={"/img/_/ecole-primaire-bolobi/photo-classe-ecole-bolobi.jpg"}
          alt={"Les élèves de l'école de bolobi posent pour la mamie Mme ACHI"}
          width={200} height={400}
      />
      <section>
        <h3>L'Oeuvre caritative du sanctuaire: l'école Saint Martin de Porrèz</h3>
        <p>L'école Saint Martin de Porrèz est une école primaire gratuite basé à Bolobi. Cette école est en premier lieu à l'endroit des enfants des travailleurs agricoles des alentours de bolobi (proche yakasseme).</p>
        <p>
          Le sanctuaire Notre Dame de Bolobi a ouvert l'école Saint Martin de Porrez en septembre 2020 avec une classe, le CP1.
          L'objectif du sanctuaire est d'ouvrir toutes les classes du primaire à raison d'une nouvelle classe supplémentaire chaque année. Selon cette objectif nous devrions être reconnu par l'Etat pour l'année scolaire 2025-2026.
        </p>
        <p>
          Un internat et une cantine sont à la disposition des élèves de l'école, actifs depuis septembre 2021.
          <br/>Pour l'internat nous demandons un financement à auteur de 5000F mensuel aux parents d'élèves
          <br/>Pour la cantine scolaire, nous nourrissons gratuitement tous les élèves de l'école Saint Martin de Porrèz. Les internes ont en plus le petit-déjeuner.
        </p>
      </section>

      <button id="do_donation_btn" className="btn3DSimple02" onClick={handleBtn}>FAIRE UN DON</button>
    </article>
    <form id="form_donation" onSubmit={handleSubmit}>
      <FieldsetRadioStyled>
        <h2>Forme du don ?</h2>
        <section>
          <label htmlFor="donatioType1" className="radioLabel">
            <input onChange={()=>{setGiftType(0)}} type="radio" id="donatioType1" name="donation_type" defaultValue="argent" />
            <span className="radio"></span>
            <span>Argent</span>
          </label>
          <label htmlFor="donatioType2" className="radioLabel">
            <input onChange={()=>{setGiftType(1)}}  type="radio" id="donatioType2" name="donation_type" defaultValue="nature" />
            <span className="radio"></span>
            <span>Nature</span>
          </label>
        </section>
      </FieldsetRadioStyled>
      <fieldset>
        <label htmlFor="nom">Nom</label>
        <input type="text" id="nom" name="firstname" />
        <label htmlFor="prenom">Prénom</label>
        <input type="text" id="prenom" name="lastname" />
        <label htmlFor="phone">N° Téléphone</label>
        <input type="text" id="phone" name="phone_number" />
        <label htmlFor="email">E-mail</label>
        <input type="text" id="email" name="email" />
      </fieldset>
      <fieldset className="money_or_nature">
        <label className={giftType==0 ? "on" : ""} htmlFor="montant">Montant</label>
        <input className={giftType==0 ? "on" : ""} type="text" id="montant" name="montant" />
        <label className={giftType==1 ? "on" : ""} htmlFor="nature">Nature</label>
        <textarea className={giftType==1 ? "on" : ""} id="nature" name="nature"></textarea>
        <section className={giftType==1 ? "on" : ""}>
          <input type="hidden" id="nature_predefined" name="nature_predefined" defaultValue="" />
          {nature_arr}
        </section>
      </fieldset>
      <fieldset>
        <input type="submit" />
      </fieldset>
    </form>
  </section>
}
