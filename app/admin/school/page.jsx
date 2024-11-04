import { useContext } from 'react'
import {createPortal} from "react-dom"
// import { usePathname } from 'next/navigation'
import Link from "next/link";
import { ecole_classes, ecole_profs, ecole_eleves } from "../../../assets/classes"
import EditMongoForm from "./EditMongoForm"
// import { getModels } from "../../api/lib/ecole"
import AdminContext from "../../../stores/adminContext.js"
import MembersList from "./_/MembersList.jsx";
import NavAdminMenus from "./_/NavAdminMenus.jsx";
import TableClasse from "./_/TableClasse.jsx";
import TeachersStudentsView from "./_/TeachersStudentsView.jsx";


export default async function School({theModels = JSON.parse("{\"void\":\"oui\"}")
  // theModels: JSON.parse("oui")
  // theModels: JSON.parse(getModels())
}) {

  // const {schemaEleve,schemaTeacher,schemaClasse} = theModels
  const {schemaEleve} = theModels
  // const {
  //    year,classe,renderClasse,showTeachers,showStudents,setAdminMenuActive,setYear,setClasse,setRenderClasse,setShowTeachers,setShowStudents,setModels 
  // } = useContext(AdminContext)

  // console.log(ecole_classes)
  // console.log()
  let a
    // , pathname = usePathname()
    , years = Array.from(new Set(ecole_classes.map(elt => elt.annee)))
    , tmpDate = new Date()
  console.log(years)
  // console.log(models);


  // const handleYears = (e) => 
  // console.log(renderClasse);
  console.log(schemaEleve);

  return (<main id="admin" className="school">
    {/* {JSON.stringify(showStudents)} */}
    {/* <NavAdminMenus /> */}

    {/* {JSON.stringify(ecole_profs)} */}
    {/* <section id="adminContent">
      <TableClasse />
      {showStudents}
      <TeachersStudentsView />
    </section> */}

  </main>)
}






