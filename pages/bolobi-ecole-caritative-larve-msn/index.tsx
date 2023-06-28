import Head from 'next/head'
import Donation from './_/Donation'
import BlogCategory from '../../components/_/Blog/BlogCategory'
import SliderInArticle from '../../components/_/SliderInArticle'
import Post from '../../components/_/Blog/_/interfaces/post'
import { getPostsBy } from '../../components/_/Blog/_/lib/api'
import {carouselBolobi_} from "../../assets/carousels"

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
        <SliderInArticle carousel={carouselBolobi_} carouselName="carouselBolobi_" />
        <BlogCategory {...{categoryPosts,headings}} />
      </main>
      
    </>
  )
}



export const getStaticProps = async () => {
  console.log("uuuuu");
  const categoryPosts = getPostsBy(
    "category"
    , "ecole"
  )

  return {
      props: { categoryPosts },
  }
}