import {createClient} from 'contentful'
import RecipeCard from "../components/RecipeCard"

export async function getStaticProps(){

  const client = createClient({
    space: process.env.CONTENFUL_SPACE_ID,
    accessToken: process.env.CONTENFUL_ACCESS_KEY
  })

  const res = await client.getEntries({content_type:"recipes"})
  console.log("\n\n\n\n\n\n\n\nje suis lààààààà");
  console.log(res);
  console.log("fin...");
  
  return{
    props:{recipes:res.items},
    revalidate: 1
  }
  
}



export default function Recipes({recipes}) {
  console.log(recipes);
  return (<>
    <h3>Recipe List:</h3>
    <div className="recipe-list">
      {recipes.map(elt=><RecipeCard key={elt.sys.id} recipe={elt} />)}

      <style jsx>
        {`
          .recipe-list{
            display:grid;grid-template-columns: 1fr 1fr;
            grid-gap: 20px 60px;
            text-align:center;
          }
        `}
      </style>
    </div>
  </>)
}