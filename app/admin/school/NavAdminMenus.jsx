"use client"

import { useEffect,useContext } from 'react'
import AdminContext from "../../../stores/adminContext.js"
// import { ecole_classes } from "../../../assets/classes.js"
import TableClasse from './_/TableClasse.jsx'
import TeachersStudentsView from './_/TeachersStudentsView.jsx'

export default () => {
    const {ecole_classes,isWhichHash,year,MembersMenu,YearsList,ClassesList,renderClasse,showTeachers,showStudents} = useContext(AdminContext)

    useEffect(()=>{
        isWhichHash()
        console.log(ecole_classes);
        
        // alert("hash changed in navadminmenus")
    }, [location.hash])
    
    return <>
        <nav id="adminMenus">
            <h1>METTRE À JOUR, LES PROFS, LES ÉLÈVES, OU LES CLASSES: </h1>
            <MembersMenu />
            <YearsList />
            <ClassesList data={ecole_classes?.filter(elt => elt.annee == year)||[]} />
        
        </nav>
        <section id="adminContent">
            <TableClasse renderClasse={renderClasse} />
            <TeachersStudentsView $={{renderClasse,showTeachers,showStudents}} />
        </section>
    </>
}