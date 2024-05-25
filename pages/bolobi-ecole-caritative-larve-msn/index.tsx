import Head from 'next/head'
import Donation from './_/Donation'
import BlogCategory from '../../components/_/Blog/BlogCategory'
import SliderInArticle from '../../components/_/SliderInArticle'
import Post from '../../components/_/Blog/_/interfaces/post'
import { getPostsBy } from '../../components/_/Blog/_/lib/api'
import {carouselBolobi_} from "../../assets/carousels"
import Features from "./../../components/fromWorkout/features"
type Props = {
  categoryPosts: Post[]
}

export default function Index({ categoryPosts }: Props) {
  // console.log(allPosts);
  // const heroPost = allPosts[0]
  console.log("uuuuu1");
  
  // console.log(categoryPosts);

  const headings = {
    h3:"CATÉGORIE: \"ÉCOLE SAINT MARTIN DE PORÈZ\""
  }


  return (
    <>
      <Head>
        <title>Bolobi: un lieu aux multiples facettes</title>
      </Head>
      <main className="bolobi">
        <Donation/>
        <hr />
        {/* 
        <article>
          <h2>Les activités économique qui financent BOLOBI: </h2>
          <p>
            Le sanctuaire Notre Dame de Bolobi et son activité caritative, l'école Saint Martin de Porrèz, sont financés via 4 biais principaux: 
          </p>
          <ul>
            <li><b><u>Agriculture</u></b> (potagers, champs de poivre et de cacao, palmeraie, et maïs entre autres)</li>
            <li><b><u>Elevage</u></b> (de poulet de chair et de ponte)</li>
            <li><b><u>Hébergement et service de restauration</u></b> pour les retraitants</li>
            <li><b><u>Dons</u></b> (nature, et espèces)</li>
          </ul>
          <p>Ci-dessous une vidéo et des diaporamas qui récapitulent et illustrent les activités du <strong>sanctuaire NDR de Bolobi</strong>: </p>
          <video src=""></video>
        </article>
        */}
        <Features />
        {/* <SliderInArticle carousel={carouselBolobi_} carouselName="carouselBolobi_fields" />
        <SliderInArticle carousel={carouselBolobi_} carouselName="carouselBolobi_feeds" />
        <SliderInArticle carousel={carouselBolobi_} carouselName="carouselBolobi_locations" /> */}
        <BlogCategory {...{categoryPosts,headings}} />
      </main>
      
    </>
  )
}



export const getStaticProps = async () => {
  console.log("uuuuu");
  const categoryPosts = await getPostsBy(
    "category"
    , "ecole"
  )

  return {
      props: { categoryPosts },
  }
}