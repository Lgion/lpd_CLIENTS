import {useState, useEffect, useContext} from 'react'
import Head from "next/head"
import Image from "next/image"
import mongoose from 'mongoose'
import AuthContext from "../stores/authContext.js"
import Carousel from "../components/_/Carousel"
import BestSellers from "../components/_/BestSellers"
import ESMP from "../components/_/ESMP.jsx"
import CTA from "../components/_/CTA"
import { getAllPosts } from '../components/_/Blog/_/lib/api'
// import { getPostsBy } from '../components/_/Blog/_/lib/_/api'
import BlogPostEnAvant from './_/BlogPostEnAvant'
import Slider from "./api/_/models/Slider"

import Nav from "../components/Nav"
// import styles from '../styles/Home.module.css'

export default function Home({onePosts,diapos}) {
  console.log(diapos);
// export default function Home({no,ok}) {
  // const {ok} = useContext(AuthContext)

  /*
  const [rand, setRand] = useState(-1)
  console.log(rand);
  console.log(rand > -1);
  useEffect(()=>{
    setRand(Math.ceil(Math.random()*allPosts.length))
  }, [])
  */
  // console.log(new studentSchema().schema.paths);
  // console.log(new mongoose.model("Eleves_Ecole_St_Martin").schema);
  
  return (
    <>
      <Head>
        <title>Bolobi Sanctuaire ND, ecommerce religieux, et oeuvres caritative st martin de porrez</title>
        <meta name="description" content="blablabla..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>



      <main className="home">
        {/* {ok} */}
        {/* <Nav /> */}
        <article className='HomeIntro'>
          
          <h3>Bienvenue sur le site web du <a href="#">Sanctuaire Notre Dame du Rosaire</a> de Bolobi</h3>
          <h4>Le sanctuaire est là pour réveiller votre foi sur le plan chrétien: </h4>
          <p>Au travers de nos 3 activités: <u><a href="#"><strong>retraites spirituelles</strong></a></u>, <u><a href="#"><strong>caritas</strong></a></u>, <u><a href="#"><strong>librairie chrétienne</strong></a></u>.</p>
          <p>{/* &emsp;Quant à voir faim, */}&emsp;Le <strong>Sanctuaire Notre Dame du Rosaire de Bolobi</strong> est oecuménique, a des solutions d'hébergement et de restauration pour 150 à 200 pélerins. Il permet aux fidèles chrétiens de se recueillir individuellement ou en groupe {/* en son lieu de <a href="#" target="_blank">Bolobi</a> */}. {/* et d'y séjourner plusieurs jours grâce */}{/* , qui assouviront leur faim en l'<strong>Esprit-Saint</strong> */}</p>
          <p>&emsp;L' <strong>École (Saint) Martin de Porrez</strong> est une merveilleuse oeuvre caritative. Venez découvrir à <a href="#">Bolobi</a> (périphérie d'abidjan) le bel avenir qu'offre le sanctuaire à ces enfants venus des campements alentours, pour les éloigner de la misère matérielle mais surtout spirituelle. <u>Participer à cette oeuvre charitative est la nourriture spirituelle qus nous vous offrons</u>.</p>
          <p>&emsp;La <strong>Puissance Divine d'Amour</strong> est une librairie chrétienne ayant pignon sur la rue des jardins (à Cocody, 2Plateaux), elle étanchera votre soif de savoir sur le mystère chrétien.</p>
          {/* Nous offrons gracieusement une recollections mensuelle  */}
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
            {/* <li>la production de <b>produits faits maison (à base de cacao, poivre, palme, citron)</b></li> */}
            <li>et les <b>dons</b> d'institutions philantropes ou de fidèles chrétiens.</li>
            <li>etc...</li>
          </ul>
          
						{/* <p>La <strong>librairie puissance divine</strong>, 2plateaux rue des jardins <strong>cocody</strong> <strong>d&apos;abidjan  côte d&apos;ivoire</strong>, est une <strong>librairie religieuse chrétienne catholique</strong> à but apostolique.</p>
						<p>En effet, l&apos;objectif premier de la <strong>puissance divine d&apos;abidjan</strong> et d&apos;affermir la foi des <strong>fidèles chrétiens</strong> et les amener à <strong>prier l&apos;esprit-saint</strong>.</p>
						<p>La <strong>puissance divine</strong> oragnise des <strong>retraites spirituelles</strong>, des <strong>enseignements spirituels</strong> ainsi que la <strong>vente en ligne</strong> d&apos;<strong>articles religieux et spirituels</strong>.</p> */}
				</article>
        <Carousel diapos={diapos} titre={"LES DIFFERENTES ACTIVITÉS DU SANCTUAIRE EN IMAGES: "} />
        
        
        
        
        {/* <section>
          <h3>Nos services: </h3>
          <BestSellers />
          <ESMP />
          <CTA />
        </section> */}



        
        {/* {console.log(rand)}
        {console.log(allPosts)}
        {console.log(allPosts[rand])} */}
        {/* {rand > -1 && <BlogPostEnAvant post={allPosts[rand]}/>} */}

        
        
        
        
        {/* {<BlogPostEnAvant post={onePosts}/>} */}





      </main>




    </>
  );
}

export const getStaticProps = async () => {
  const allPosts = await getAllPosts()
  , onePosts = allPosts[Math.ceil(Math.random()*allPosts.length)]
  console.log("ooo");
  console.log(onePosts);
  console.log(allPosts);

  const db = await mongoose.connect('mongodb+srv://archist:1&Bigcyri@cluster0.61na4.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))
  // console.log(Object.keys(db));
  // console.log(db.modelNames());
  // console.log(mongoose.modelNames());
  // console.log(mongoose.models);
  // console.log(db);
  let diapos = await mongoose?.model("Diapos_slider")
    ?.find({"identifiant_$_hidden": "home_0"})
    ?.then(r=>{
      console.log("HELOOOOOOOOOOOOOOOOOOO");
      console.log(r)
      return r
    }) || []
  diapos = JSON.parse(JSON.stringify(diapos))

  
  // const response = await fetch('/api/ecole');
  // const data = await response.json();
  console.log('lkpokpk');
  console.log(diapos);
  console.log('222lkpokpk');
  // console.log(data);

  return {
      props: { 
        onePosts
        , diapos
      },
  }
}

