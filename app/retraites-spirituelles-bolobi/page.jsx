"use client"

import { useContext, memo, useMemo } from 'react'
import AuthContext from "../../stores/authContext.js"
import Article from "./_/Article.jsx"
import Carousel from '../_/Carousel'
import LocateBolobi from "./_/LocateBolobi.jsx"
// import ReserveForm from "./_/ReserveForm/index.jsx"
import ReserveForm_ from "./_/ReserveForm_copy/index.jsx"
import BlogCategory from '../_/Blog/BlogCategory'


const BtnCTA = ()=>{
    return <div className="form_cta_fixed_btns">
        <a href="https://wa.me/22665555555" target="_blank" title="Contactez nous sur whatsapp pour plus d'informations"></a>
        <a href="#form_reservation" title="Remplir le formulaire de réservation pour votre séjour au sanctuaire de Bolobi"></a>
    </div>
}


const SanctuaireContent = memo(({ diapos, categoryPosts, headings }) => (
    <main className="sanctuaire_ndr">
        <Article />
        <Carousel page="sanctuaire" diapos={diapos} titre={"LE SANCTUAIRE DE BOLOBI EN IMAGES"} icon="2" sommaire="La grotte Mariale de notre dame du Rosaire de Bolobi" />
        <LocateBolobi />
        {/* <ReserveForm /> */}
        <ReserveForm_ />
        <BtnCTA />
        {/* <BlogCategory {...{ categoryPosts, headings, className: "sndr" }} /> */}
    </main>
));

export default function LieuxActivites() {
    const { data } = useContext(AuthContext)
    const { categoryPosts, diapos } = data

    const headings = useMemo(() => ({
      h3: "CATÉGORIE: \"SANCTUAIRE NOTRE DAME DU ROSAIRE DE BOLOBI\""
    }), []);

    return useMemo(() => (
        <SanctuaireContent 
            diapos={diapos} 
            categoryPosts={categoryPosts} 
            headings={headings} 
        />
    ), [diapos, categoryPosts, headings]);
}
