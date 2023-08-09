import {useState, useEffect, useContext} from 'react'
import Head from "next/head"
import Image from "next/image"
import mongoose from 'mongoose'
import AuthContext from "../stores/authContext.js"
import Carousel from "../components/_/Carousel"
import BestSellers from "../components/_/BestSellers"
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
        <title>Create Next Appppp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>




      <main className="home">
        {/* {ok} */}
        {/* <Nav /> */}
        <article>
          
          <p>Bienvenue sur le site web du sanctuaire Notre Dame du Rosaire de Bolobi</p>
          <p>Nous sommes là pour éveiller votre fois chrétienne sur tous les plans grâce aux divers services que nous vous proposons.</p>
          <p>En effet, le Sanctuaire Notre Dame du Rosaire de Bolobi est oecuménique et permet à ses fidèles chrétiens de se recueillir individuellement ou en groupe sur le lieu de <a href="" target="_blank">Bolobi</a> et d'y séjourner plusieurs jours grâce à ses solutions d'hébergement et de restauration pour 100 à 150 pélerins. 
          {/* Nous offrons gracieusement une recollections mensuelle  */}
          </p>
          <p>Le sanctuaire entretien en son lieu une activité caritative en l'école Saint Martin de Porrèz. Celle-ci a démarré en septembre 2020 avec une classe de CP1, et a vocation à terme d'être reconnu par l'institut de l'éducation de Côte d'Ivoire.</p>
          <p>Afin de financer le fonctionnement du sanctuaire et de ses activités caritatives, certaines activités économique ont lieu sur le lieu de Bolobi, comme l'agriculture, l'élevage, l'accueil des retraitants, et les dons d'institutions philantropes ou de fidèles chrétiens.</p>
          
          <ul>
            <li></li>
            <li></li>
          </ul>
						{/* <p>La <strong>librairie puissance divine</strong>, 2plateaux rue des jardins <strong>cocody</strong> <strong>d&apos;abidjan  côte d&apos;ivoire</strong>, est une <strong>librairie religieuse chrétienne catholique</strong> à but apostolique.</p>
						<p>En effet, l&apos;objectif premier de la <strong>puissance divine d&apos;abidjan</strong> et d&apos;affermir la foi des <strong>fidèles chrétiens</strong> et les amener à <strong>prier l&apos;esprit-saint</strong>.</p>
						<p>La <strong>puissance divine</strong> oragnise des <strong>retraites spirituelles</strong>, des <strong>enseignements spirituels</strong> ainsi que la <strong>vente en ligne</strong> d&apos;<strong>articles religieux et spirituels</strong>.</p> */}
				</article>
        <Carousel diapos={diapos} titre={"LES DIFFERENTES ACTIVITÉS DU SANCTUAIRE EN IMAGES: "} />
        <BestSellers />
        <CTA />
        {/* {console.log(rand)}
        {console.log(allPosts)}
        {console.log(allPosts[rand])} */}
        {/* {rand > -1 && <BlogPostEnAvant post={allPosts[rand]}/>} */}
        {<BlogPostEnAvant post={onePosts}/>}
      </main>




    </>
  );
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts()
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

