"use client"


import {createContext, useEffect, useState, useMemo} from 'react'
// import styled,{createGlobalStyle} from 'styled-components'
import EditMongoForm from "../app/admin/school/EditMongoForm"

const AdminContext = createContext({
    // ok: null,
    // cartBox: null,
    // setCartBox: null,
})
export default AdminContext

export const AdminContextProvider = ({children}) => {
    
    
    const [adminMenuActive, setAdminMenuActive] = useState("")
    // , [year, setYear] = useState((tmpDate.getMonth()+1)<9 ? (tmpDate.getFullYear()-1)+"-"+tmpDate.getFullYear() : tmpDate.getFullYear()+"-"+(tmpDate.getFullYear()+1))
    , [year, setYear] = useState("")
    , [classe, setClasse] = useState({})
    , [renderClasse, setRenderClasse] = useState([])
    , [showTeachers, setShowTeachers] = useState(false)
    , [showStudents, setShowStudents] = useState(false)
    // , [showModal, setShowModal] = useState(false)
    , [models, setModels] = useState({})
    
    
    const MembersMenu = () => <ul id="membersMenu">
      <li className={showTeachers ? "active" : ""}>
        <Link
          href="school#teachers"
          onClick={e => {
            setShowTeachers(true)
            setShowStudents(false)
            setClasse({})
          }}
        >Professeurs</Link>
      </li>
      <li className={showStudents ? "active" : ""}>
        <Link
          href="school#students"
          onClick={e => {
            setShowTeachers(false)
            setShowStudents(true)
            setClasse({})
            setYear("")
          }}
        >Élèves</Link>
      </li>
    </ul>
    , YearsList = () => <ul id="yearsMenu">
      <li
        className="addClasse"
        onClick={e => {
              modal.classList.add('active')
              // setShowModal(true)
              document.querySelector('#modal .modal___main>form').classList.remove('student')
              document.querySelector('#modal .modal___main>form').classList.remove('teacher')
              document.querySelector('#modal .modal___main>form.classe').classList.add('active')
        }}
      >
        <button>+</button>
        {
          createPortal(
            <EditMongoForm 
              endpoint="ecole"
              modelKey="classe" 
              model={models?.schemaClasse?.paths || {}} 
              joinedDatasProps={{eleves: ecole_eleves, teachers: ecole_profs}} 
            />
            , document.querySelector('#modal .modal___main')
          )
        }
      </li>
      {years.map((elt, i) => <li
        key={"years_" + i}
        onClick={(e) => {
          setYear(e.target.innerText)
          setShowTeachers(false)
          setShowStudents(false)
        }}
        className={elt == year ? "active" : ""}
      // className={elt==year&&!showTeachers&&!showStudents?"active":""}
      >
        <Link href={"school#" + elt}>{elt}</Link>
      </li>)}
    </ul>
    , ClassesList = ({ data }) => {
      console.log(data);

      const toRender = <ul id="classesMenu">
        {data.map((elt, i) => <li
          key={elt.annee + "_" + elt.niveau + "_" + elt.alias + "_" + i}
          onClick={e => { setClasse(elt) }}
          className={(classe?.niveau + "-" + classe?.alias) == (elt.niveau + "-" + elt.alias) ? "active" : ""}
        >
          <Link href={"school#" + elt.annee + "___" + elt.niveau + "-" + elt.alias}>{elt.niveau}-{elt.alias}
            <span
              onClick={e => {
                // e.stopPropagation()
                alert("modifier classe")
              }}
              title="Éditer classe"
            ></span>
          </Link>
        </li>)}
      </ul>

      return toRender
    }


    
    useEffect(() => { 
    }, [])
    
    useEffect(() => {
        // /*
        let ok = async () => {
            const ok = await fetch("/api/ecole")
            , data = await ok.json()
            setModels(data)
        }
        ok()
        
        // ok().then(r=>{
            //   console.log(r);
        // })
        // console.log(oo);
        // console.log(ok());
        // */
        
        
        
        
        
        
        // let a = pathname.split('#')
        let loc = location.hash.substring(1)
        , isTeachersUrl = loc.indexOf('teachers') != -1
        , isStudentsUrl = loc.indexOf('students') != -1
        , isClassesUrl = loc.length > 0 && !isTeachersUrl && !isStudentsUrl
        if (isStudentsUrl) {
            setShowStudents(true)
        }
        if (isTeachersUrl) {
            setShowTeachers(true)
        }
        if (isClassesUrl) {
            let annee = loc.split('___')
            console.log(annee)
            setYear(annee[0])
            setClasse(annee?.[1] ? ecole_classes.find(elt => elt.annee == annee[0] && (elt.niveau + "-" + elt.alias) == annee[1]) : [])
        }
    }, [])
    useEffect(() => {
        console.log("ookokokk");
        let tmp = Object.keys(classe).map(elt => {
            console.log(elt);
            switch (elt) {
                case "professeur":
                return <tr>
                <td>{elt}: </td>
                <td>
                {ecole_profs.filter(elt_ => classe.professeur.indexOf(elt_.id) != -1)
                    .map((elt_, i) => <a key={"classe_profs_" + i} href="#">{elt_.nom} - {elt_.prenoms.join(', ')}</a>)
                }
                </td>
                </tr>
                break;
                case "eleves":
                return <tr>
                <td>{elt}: </td>
                <td>
                {ecole_eleves.filter(elt_ => classe.eleves.indexOf(elt_.id) != -1)
                    .map((elt_, i) => <a key={"classe_eleves_" + i} href="#">{elt_.nom} - {elt_.prenoms.join(', ')}</a>)
                }
                </td>
                </tr>
                break;
                case "niveau":
                // case"alias":
                return <tr>
                <td>Classe: </td>
                <td>{classe["niveau"] + "-" + classe["alias"]}</td>
                </tr>
                break;
                case "photo":
                return <tr>
                <td>{elt}: </td>
                <td><img src={classe.photo} alt={"photo de classe: " + classe["niveau"] + "-" + classe["alias"] + " " + classe["annee"]} /></td>
                </tr>
                break;
                case "annee":
                case "homework":
                case "compositions":
                case "moyenne_trimetriel":
                case "commentaires":
                return <tr>
                <td>{elt}: </td>
                <td>{JSON.stringify(classe[elt])}</td>
                </tr>
                break;
                default: break;
            }
        })
        tmp.shift()
        console.log(tmp);
        { setRenderClasse(tmp) }
    }, [classe])
    
    


    const context = {adminMenuActive, setAdminMenuActive,
        year,classe,renderClasse,showTeachers,showStudents,setAdminMenuActive,setYear,setYear,setClasse,setRenderClasse,setShowTeachers,setShowStudents,setModels
        // ,setShowModal
        ,MembersMenu,YearsList,ClassesList
    }
    
    
    return (
        <AdminContext.Provider value={context}>
        {children}
        </AdminContext.Provider>
    )
}


