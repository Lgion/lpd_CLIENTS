"use client"

import { useContext, memo, useMemo } from 'react'
import AuthContext from "../../stores/authContext.js"
import Article from "./_/Article.jsx"
import Carousel from '../_/Carousel'
import LocateBolobi from "./_/LocateBolobi.jsx"
import ReserveForm from "./_/ReserveForm/index.jsx"
import BlogCategory from '../_/Blog/BlogCategory'

const SanctuaireContent = memo(({ diapos, categoryPosts, headings }) => (
    <main className="sanctuaire_ndr">
        <Article />
        <Carousel diapos={diapos} titre={"TEST - EXEMPLE: "} icon="2" sommaire="AUTRE TITRE SOMMAIRE" />
        <LocateBolobi />
        <ReserveForm />
        <BlogCategory {...{ categoryPosts, headings, className: "sndr" }} />
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
