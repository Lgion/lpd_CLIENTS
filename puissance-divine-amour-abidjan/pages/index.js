import {useContext} from 'react'
import Head from "next/head";
import Image from "next/image";
import AuthContext from "../stores/authContext.js"
import Carousel from "../components/_/Carousel"
import Nav from "../components/Nav"
// import styles from '../styles/Home.module.css'

export default function Home() {
  const {ok} = useContext(AuthContext)


  
  return (
    <>
      <Head>
        <title>Create Next Appppp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>




      <main className="">
        {/* {ok} */}
        <Nav />
        <Carousel />
        <article>
						<p>La <strong>librairie puissance divine</strong>, 2plateaux rue des jardins <strong>cocody</strong> <strong>d'abidjan  côte d'ivoire</strong>, est une <strong>librairie religieuse chrétienne catholique</strong> à but apostolique.</p>
						<p>En effet, l'objectif premier de la <strong>puissance divine d'abidjan</strong> et d'affermir la foi des <strong>fidèles chrétiens</strong> et les amener à <strong>prier l'esprit-saint</strong>.</p>
						<p>La <strong>puissance divine</strong> oragnise des <strong>retraites spirituelles</strong>, des <strong>enseignements spirituels</strong> ainsi que la <strong>vente en ligne</strong> d'<strong>articles religieux et spirituels</strong>.</p>
				</article>
        
      </main>




    </>
  );
}
