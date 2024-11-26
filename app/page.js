"use client"

import { useContext, useMemo, memo } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import AuthContext from "../stores/authContext.js"
import Carousel from "./_/Carousel"

const HomeContent = memo(({ diapos }) => (
  <main className="home">
    <article className='HomeIntro'>
      <h3 data-id="firstH3" data-icon="1" data-sommaire="BIENVENUE AU SANCUTAIRE ND ROSAIRE BOLOBI">Bienvenue sur le site web du <a href="#">Sanctuaire Notre Dame du Rosaire</a> de Bolobi</h3>
      <h4>Le sanctuaire est là pour réveiller votre foi sur le plan chrétien: </h4>
      <p>Au travers de nos 3 activités: <u><a href="#"><strong>retraites spirituelles</strong></a></u>, <u><a href="#"><strong>caritas</strong></a></u>, <u><a href="#"><strong>librairie chrétienne</strong></a></u>.</p>
      <p>&emsp;Le <strong>Sanctuaire Notre Dame du Rosaire de Bolobi</strong> est oecuménique, a des solutions d'hébergement et de restauration pour 150 à 200 pélerins. Il permet aux fidèles chrétiens de se recueillir individuellement ou en groupe.</p>
      <p>&emsp;L' <strong>École (Saint) Martin de Porrez</strong> est une merveilleuse oeuvre caritative. Venez découvrir à <a href="#">Bolobi</a> (périphérie d'abidjan) le bel avenir qu'offre le sanctuaire à ces enfants venus des campements alentours, pour les éloigner de la misère matérielle mais surtout spirituelle. <u>Participer à cette oeuvre charitative est la nourriture spirituelle qus nous vous offrons</u>.</p>
      <p>&emsp;La <strong>Puissance Divine d'Amour</strong> est une librairie chrétienne ayant pignon sur la rue des jardins (à Cocody, 2Plateaux), elle étanchera votre soif de savoir sur le mystère chrétien.</p>
      <h4>Le sanctuaire et son fonctionnement: </h4> 
      <p>Celle-ci a démarré en septembre 2020 avec une classe de CP1, et a vocation à terme d'être reconnu par l'État de Côte d'Ivoire.
      <br/>
      Les frais liés sont lourds
      </p>
      <p>Afin de <a href="#">financer le fonctionnement du sanctuaire et de ses activités caritatives</a>, plusieurs activités économiques sont progressivement mis en place à Bolobi, comme: </p>
      <ul className='safe'>
        <li><strong>retraitants</strong>, </li>
        <li>l'<b>agriculture maréchaire</b> (fruits&légumes, cacao, poivre, palme), </li>
        <li>l'<b>élevage</b> (poulets chair&ponte, porc, escargots),</li>
        <li>et les <b>dons</b> d'institutions philantropes ou de fidèles chrétiens.</li>
        <li>etc...</li>
      </ul>
    </article>
    <Carousel diapos={diapos} icon="2" titre={"LES DIFFERENTES ACTIVITÉS DU SANCTUAIRE EN IMAGES: "} />
  </main>
));

export default function Home() {
  const { data } = useContext(AuthContext)
  const { diapos } = data

  return useMemo(() => <HomeContent diapos={diapos} />, [diapos]);
}
