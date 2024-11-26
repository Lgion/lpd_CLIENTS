"use client"

import React, { useState, useEffect, useMemo } from "react"
import dynamic from 'next/dynamic'
// import ReactImageZoom from 'react-image-zoom';
// import ReactImageMagnify from 'react-image-magnify';
import 'leaflet/dist/leaflet.css'
// import watchImg300 from 


import Event from './Locate/Event.js'
import Magnifier from './Locate/Magnifier.js'
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
    const props = {width: 400, height: 250, zoomWidth: 500, img: "celluloid-shot0002.jpg", offset: {vertical: 0, horizontal: 10}}
    , [did,setDid] = useState(0)
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
    useEffect(()=>{
        // console.log(Event);
        console.log(did);
        setDid(1)
    }, [])
    useEffect(()=>{
        console.log("iiiiii");
        console.log(did);
        if(did){
            console.log("iooooo");
            let evt = new Event()
            , m = new Magnifier(evt)
            // let m = new Magnifier(ok)
            m.attach({
                thumb: '#thumb1',
                large: 'abidjan-adzope.png',
                largeWrapper: 'preview1',
                zoom: 3,
                zoomable: false
            })
        }
    },[did])
    return (
        <section>
            <h3 id="thirdH3" data-icon="3" data-sommaire={sommaire||titreH3}>{titreH3}</h3>
            <p>Le Sanctuaire ND Rosaire de Bolobi se situe à la périphérie d'Abidjan, juste après <a href="#" target="_blank">Azaguié</a>, un peu avant <a href="#" target="_blank">Yakasseme</a> (des panneaux indicateurs inscript "BOLOBI" pointent vers l'entrée du sanctuaire).</p>
            <div>
                <NdrToggle />
                <NdrImage />
                <div className="ndr_map">
                    <Gmap />
                    {/* <MapLeaflet /> */}
                </div>
            </div>

        </section>
    )
}




