"use client"

import { useContext, memo, useMemo } from 'react'
import ReserveForm_ from "./_/ReserveForm_copy/index.jsx"


const BtnCTA = ()=>{
    return <div className="form_cta_fixed_btns">
        <a href="https://wa.me/22665555555" target="_blank"></a>
        <a href="#form_reservation"></a>
    </div>
}



export default function LieuxActivites() {

    return     <main className="sanctuaire_ndr">
        <ReserveForm_ />
        {/* <ReserveForm /> */}
        <BtnCTA />
        {/* <BlogCategory {...{ categoryPosts, headings, className: "sndr" }} /> */}
    </main>
}
