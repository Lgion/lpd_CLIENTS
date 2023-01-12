import Image from 'next/image'
import {createClient} from 'contentful'
import {documentToReactComponents} from "@contentful/rich-text-react-renderer"


console.log(process.env); //APPAREMENT, LES VARIABLES D'ENVIRONNEMENTS NE SONT ACCESSIBLES QUE SUR LE SERVEUR, ET NON SUR LE NAVIGATEUR CLIENT


export const getStaticPaths = async () => {
  const client = createClient({
    accessToken: process.env.CONTENFUL_ACCESS_KEY,
    space: process.env.CONTENFUL_SPACE_ID,
  })
  console.log("\n\n\n");
  console.log(process.env);
  console.log(client);
  console.log("okokok");

  const res = await client.getEntries({
    content_type: 'recipes'
  })
  const paths = res.items.map(elt=>({params:{slug: elt.fields.slug}}))
  
  return {paths,fallback:true}
}
export async function getStaticProps({params}){
  const client = createClient({
    accessToken: process.env.CONTENFUL_ACCESS_KEY,
    space: process.env.CONTENFUL_SPACE_ID,
  })

  const {items} = await client.getEntries({
    content_type: 'recipes',
    'fields.slug': params.slug
  })
  console.log(items);

  return {
    props:{recipe: items[0]},
    revalidate: 1
  }
}

export default function RecipeDetails({recipe}) {
  if(!recipe)return <div>Loading...</div>
  // if(!recipe)return <Skeleton />
  console.log(recipe);
  const {featureImage, title, cookingTime, ingredients, methode} = recipe.fields
  console.log("https:"+featureImage.fields.file.url);
  
  return (
    <div>
      <h3>Recipe Details:</h3>
      {/* {JSON.stringify(recipe)} */}
      <div className="banner">
        <Image
          src={"https:"+featureImage.fields.file.url}
          width={featureImage.fields.file.details.image.width}
          height={featureImage.fields.file.details.image.height}
        />
        <h2>{title}</h2>
      </div>
      <div className="infos">
        <p>Takes approx {cookingTime} minutes to make</p>
        <h3>Ingrdients;</h3>
        {ingredients.map(ing=><span key={ing}>{ing}</span>)}
      </div>
      <div className="methode">
        {documentToReactComponents(methode)}
      </div>

      <style jsx>{`
        border:5px double purple  ;
        .banner{background:black;color:white;font-weight:bolder;}
      `}</style>
    </div>
  )
}