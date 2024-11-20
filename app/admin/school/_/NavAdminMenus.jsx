"use client"

import { useContext } from 'react'
import AdminContext from "../../../../stores/adminContext.js"
import { ecole_classes } from "../../../../assets/classes.js"
import TableClasse from './TableClasse.jsx'

export default () => {
    const {year,MembersMenu,YearsList,ClassesList,renderClasse,showTeachers,showStudents} = useContext(AdminContext)

    
    return <>
        <nav id="adminMenus">
            <MembersMenu />
            <YearsList />
            <ClassesList data={ecole_classes.filter(elt => elt.annee == year)} />
        
        </nav>
        <section id="adminContent">
            <TableClasse renderClasse={renderClasse} />
            <showStudents $={{renderClasse,showTeachers,showStudents}} />
        </section>
    </>
}