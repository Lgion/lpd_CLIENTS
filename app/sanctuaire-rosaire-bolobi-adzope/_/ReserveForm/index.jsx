"use client"

import React, { useRef, useState, useEffect, useMemo, useContext } from "react"
// import dynamic from 'next/dynamic'
// import { subDays, addDays, setHours, setMinutes, addMonths } from 'date-fns';
// import {loadRadios} from '../../../_/swappy_radio'
// import styles from "./swappy_radio.module.scss"
// import FormContext from "../../../../stores/formContext.js"
// import Resume from "./Resume"
import Intro from "./Intro"
// import MobileChoices from "./MobileChoices"
// import FieldsetDate from "./FieldsetDate"
// import FieldsetType from "./FieldsetType"
// import FieldsetLocation from "./FieldsetLocation"
// import FieldsetInfos from "./FieldsetInfos"
// import FieldsetMeal from "./FieldsetMeal"
// import FieldsetPayment from "./FieldsetPayment"
// import ValidationSection from "./ValidationSection"
// import confetti from 'canvas-confetti'

// const triggerConfetti = () => {
//   // Créer un canvas dédié pour les confettis
//   const canvas = document.createElement('canvas');
//   canvas.style.position = 'fixed';
//   canvas.style.top = '0';
//   canvas.style.left = '0';
//   canvas.style.width = '100%';
//   canvas.style.height = '100%';
//   canvas.style.pointerEvents = 'none';
//   canvas.style.zIndex = '10000';
//   // canvas.style.background = 'transparent';
//   document.body.appendChild(canvas);

//   // Rendre le contexte transparent
//   const ctx = canvas.getContext('2d');
//   ctx.globalAlpha = 1;

//   const myConfetti = confetti.create(canvas, {
//     resize: true,
//     useWorker: true,
//     disableForReducedMotion: true
//   });

//   // Configuration des confettis
//   const duration = 3000;
//   const end = Date.now() + duration;
//   const colors = ['#00b894', '#00cec9', '#0984e3', '#6c5ce7', '#fd79a8'];

//   (function frame() {
//     myConfetti({
//       particleCount: 7,
//       angle: 60,
//       spread: 55,
//       origin: { x: 0, y: 0.6 },
//       colors: colors,
//       shapes: ['square', 'circle'],
//       scalar: 1.2,
//       ticks: 200,
//       gravity: 1.2,
//       drift: 0,
//       flat: false,
//       opacity: 1
//     });

//     myConfetti({
//       particleCount: 7,
//       angle: 120,
//       spread: 55,
//       origin: { x: 1, y: 0.6 },
//       colors: colors,
//       shapes: ['square', 'circle'],
//       scalar: 1.2,
//       ticks: 200,
//       gravity: 1.2,
//       drift: 0,
//       flat: false,
//       opacity: 1
//     });

//     if (Date.now() < end) {
//       requestAnimationFrame(frame);
//     } else {
//       // Nettoyer le canvas après l'animation
//       setTimeout(() => {
//         canvas.remove();
//       }, 1000);
//     }
//   }());
// };

export default function ReserveForm() {


  return <>
    <Intro {...{sommaire,titreH3}} />


  </>
}
