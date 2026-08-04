"use client"

import React, { useState, useEffect, useMemo } from "react"
import dynamic from 'next/dynamic'
// import ReactImageZoom from 'react-image-zoom';
// import ReactImageMagnify from 'react-image-magnify';
import 'leaflet/dist/leaflet.css'
// import watchImg300 from 


import Event from './Locate/Event.js'
// import Magnifier from './Locate/Magnifier.js'
import NdrToggle from './Locate/NdrToggle.jsx'
import NdrImage from './Locate/NdrImage.jsx'
import Gmap from '../../_/Gmap.jsx'
{/*
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'



function MapLeaflet() {
    const position = [51.505, -0.09]
        
    return(
      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    )
}
*/}

export default function LocateBolobi() {
  // const Map = React.useMemo(() => dynamic(
  //     () => import('./../../../components/_/MapLeaflet'), // replace '@components/map' with your component's location
  //     { ssr: false } // This line is important. It's what prevents server-side render
  // ), [])
  // const props = {width: 400, height: 250, zoomWidth: 2500, img: "/abidjan-adzope.png"}
  const props = { width: 400, height: 250, zoomWidth: 500, img: "celluloid-shot0002.jpg", offset: { vertical: 0, horizontal: 10 } }
    , [did, setDid] = useState(0)
    , titreH3 = "OÙ SE SITUE LE SANCTUAIRE ND ROSAIRE DE BOLOBI"
    , sommaire = "GÉOLOCALISER BOLOBI"

  {/*}
    const Magnifier = React.useMemo(() => dynamic(

        () => import("./Magnifier.js"), // replace '@components/map' with your component's location
        { ssr: false } // This line is important. It's what prevents server-side render
      ), [])
    , Event = React.useMemo(() => dynamic(

        () => import("./Event.js"), // replace '@components/map' with your component's location
        { ssr: false } // This line is important. It's what prevents server-side render
      ), [])
    */}




  // useEffect(()=>{
  //     // console.log(Event);
  //     console.log(did);
  //     setDid(1)
  // }, [])
  // useEffect(()=>{
  //     console.log("iiiiii");
  //     console.log(did);
  //     if(did){
  //         console.log("iooooo");
  //         let evt = new Event()
  //         , m = new Magnifier(evt)
  //         // let m = new Magnifier(ok)
  //         m.attach({
  //             thumb: '#thumb1',
  //             large: 'abidjan-adzope.png',
  //             largeWrapper: 'preview1',
  //             zoom: 3,
  //             zoomable: false
  //         })
  //     }
  // },[did])
  return <>
    <h3 id="thirdH3" data-icon="3" data-sommaire={sommaire || titreH3}>{titreH3}</h3>
    <section className="locate_bolobi">
      <p>Le Sanctuaire ND Rosaire de Bolobi se situe à la périphérie d'Abidjan, juste après <a href="#" target="_blank">Azaguié</a> (12km), un peu avant <a href="#" target="_blank">Yakasseme</a>, des panneaux indicateurs inscrits "BOLOBI" pointent vers l'entrée du sanctuaire (à 200 mètres du goudron, ~7 minutes à pas légers).</p>

      {/* Barre de repères kilométriques */}
      <div className="route_milestones_bar">
        <div className="milestone_step">
          <span className="milestone_city">Abidjan</span>
        </div>
        <div className="milestone_arrow">
          <span className="dist_label">35 km</span>
          <span className="arrow_line">➔</span>
        </div>
        <div className="milestone_step">
          <span className="milestone_city">Azaguié</span>
        </div>
        <div className="milestone_arrow">
          <span className="dist_label">12 km</span>
          <span className="arrow_line">➔</span>
        </div>
        <div className="milestone_step highlight">
          <span className="milestone_city">📍 BOLOBI</span>
          <span className="milestone_sub">Sanctuaire ND du Rosaire</span>
        </div>
        <div className="milestone_arrow">
          <span className="dist_label">40 km</span>
          <span className="arrow_line">➔</span>
        </div>
        <div className="milestone_step">
          <span className="milestone_city">Adzopé</span>
        </div>
      </div>

      <div>
        {/* <NdrToggle />
                <NdrImage /> */}
        <div className="ndr_map">
          <Gmap />
          {/* <MapLeaflet /> */}
        </div>
      </div>

      {/* Encadré d'informations pratiques de transport */}
      <div className="locate_transport_box">
        <h5>🚌 Guide Pratique & Transports en Commun (Abidjan ↔ Bolobi)</h5>

        <div className="transport_grid">
          <div className="transport_card">
            <h5>🚍 Compagnies de Cars Interurbains</h5>
            <ul>
              <li>
                <strong>Ocean Côte d'Ivoire Transport</strong>
                <span className="details">Départs : Adjamé, Abobo, Treichville</span>
                <span className="contact">📞 <a href="tel:+2250799242366">+225 07 99 24 23 66</a> | 🌐 <a href="https://www.oceancotedivoire.com" target="_blank" rel="noopener noreferrer">oceancotedivoire.com</a></span>
              </li>
              <li>
                <strong>SBTA Transport</strong>
                <span className="details">Départs : Gare d'Adjamé & Yopougon BAE</span>
                <span className="contact">📞 <a href="tel:+2250576207777">+225 05 76 20 77 77</a> | 🌐 <a href="https://www.sbta-transport.com" target="_blank" rel="noopener noreferrer">sbta-transport.com</a></span>
              </li>
              <li>
                <strong>TTM / STIT Transport</strong>
                <span className="details">Départs : Gare Adjamé Mirador</span>
                <span className="contact">📞 <a href="tel:+2250777779688">+225 07 77 77 96 88</a></span>
              </li>
            </ul>
          </div>

          <div className="transport_card">
            <h5>🚐 Minibuses "Massa" & Taxis de Brousse</h5>
            <ul>
              <li>
                <strong>Gare d'Adjamé Texaco & Mirador</strong>
                <span className="details">Départs en continu toutes les 15–20 min vers Azaguié / Bolobi.</span>
              </li>
              <li>
                <strong>Gare d'Abobo Anador</strong>
                <span className="details">Départs réguliers sur l'axe Abidjan – Adzopé.</span>
              </li>
            </ul>

            <div className="tarifs_pill">
              💰 <strong>Tarifs indicatifs :</strong> Abidjan ↔ Bolobi : <strong>1 000 à 1 500 FCFA</strong> | Azaguié ↔ Bolobi : <strong>300 à 500 FCFA</strong>
            </div>
          </div>
        </div>

        <div className="transport_tip">
          💡 <strong>Conseil aux voyageurs :</strong> Demandez au chauffeur de vous déposer à l'arrêt <em>"Carrefour BOLOBI / Sanctuaire"</em>. La piste piétonne vers l'entrée du sanctuaire se trouve à 200m de la route bitumée (~7 min de marche).
        </div>
      </div>

    </section>
  </>
}




