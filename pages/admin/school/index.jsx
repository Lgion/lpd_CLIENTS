import { useState, useEffect, useContext } from 'react'
import {createPortal} from "react-dom"
// import { usePathname } from 'next/navigation'
import Link from "next/link";
import { ecole_classes, ecole_profs, ecole_eleves } from "../../../assets/classes"
import EditMongoForm from "./EditMongoForm"
// import { getModels } from "../../api/lib/ecole"


const MembersList = ({ data, type }) => <ul id="school_members">{data.map((elt, i) => <li
  key={(type == "teachers" ? "prof" : "eleve") + "_" + i}
  onClick={e => {
    alert('okaddmember')
  }}
>
  <figure>
    <img src={"/school/" + type + "/" + elt.nom.toLowerCase() + "-" + elt.prenoms.join("-").toLocaleLowerCase() + "/photo.png"} alt={"eleve saint martin de porèz en classe de \"" + elt.current_classe + "\""} />
    <figcaption>{elt.nom} - {elt.prenoms.join(', ')}</figcaption>
  </figure>
  {type == "students" && <>
    <span className={"isInterne" + (elt.isInterne ? " active" : "")}></span>
    <span
      className={"doFeesPaid" + (elt.scolarity_fees ? " euuuuh,c'est très compliqué, il faut que tous les frais soient payé (et donc vérifiés) pour le rendre actif!!!" : "")}
      onClick={e => {
        if (!e.target.classList.contains('active')) {
          alert('ouafouafouafouaaaaf!!!! LES FRAIS NE SONT PAS TOUS PAAAAAYÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉS!!!!!')
        }
      }}
    ></span>
  </>}
  <section>
    <div className="birth">{elt.naissance}</div>
    <div className="address">{elt.adresse}</div>
    {type == "teachers" && <>
      <div className="phone"><a href={"tel:" + elt.phone}>{elt.phone}</a></div>
      <div className="email"><a href={"mail:" + elt.email}>{elt.email}</a></div>
    </>}
    {type == "students" && <div className="parents">{JSON.stringify(elt.parents)}</div>
    }
  </section>
</li>)}</ul>

export default function School({theModels}) {

  // const {schemaEleve,schemaTeacher,schemaClasse} = theModels
  const {schemaEleve} = theModels
  // console.log(ecole_classes)
  // console.log()
  let a
    // , pathname = usePathname()
    , years = Array.from(new Set(ecole_classes.map(elt => elt.annee)))
    , tmpDate = new Date()
    // , [year, setYear] = useState((tmpDate.getMonth()+1)<9 ? (tmpDate.getFullYear()-1)+"-"+tmpDate.getFullYear() : tmpDate.getFullYear()+"-"+(tmpDate.getFullYear()+1))
    , [year, setYear] = useState("")
    , [classe, setClasse] = useState({})
    , [renderClasse, setRenderClasse] = useState([])
    , [showTeachers, setShowTeachers] = useState(false)
    , [showStudents, setShowStudents] = useState(false)
    // , [showModal, setShowModal] = useState(false)
    , [models, setModels] = useState({})
    , MembersMenu = () => <ul id="membersMenu">
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
  console.log(years)
  console.log(models);

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

  // const handleYears = (e) => 
  console.log(renderClasse);
  console.log(schemaEleve);

  return (<main id="admin" className="school">
    {/* {JSON.stringify(showStudents)} */}
    <nav id="adminMenus">
      <MembersMenu />
      <YearsList />
      <ClassesList data={ecole_classes.filter(elt => elt.annee == year)} />
    </nav>
    {/* {JSON.stringify(ecole_profs)} */}
    <section id="adminContent">
      {renderClasse.length !== 0 && <table>
        <thead>
          <tr>
            <th>LABEL</th>
            <th>VALUE</th>
          </tr>
        </thead>
        <tbody>
          {/* {JSON.stringify(classe)}
           - 
          {JSON.stringify(renderClasse)} */}
          {renderClasse}
        </tbody>
      </table>}
      {showStudents}
      {(!renderClasse.length && (showTeachers || showStudents)) && <>
        <form onSubmit={e=>{e.preventDefault()}}>
          <input
            placeholder={"rechercher un " + (showTeachers ? "professeur" : "élève")}
            onKeyUp={e => {
              let notIn = showTeachers ? ecole_profs : ecole_eleves
              notIn = notIn.filter(member => {
                let nom = member.nom.indexOf(e.target.value)
                  , prenoms = member.prenoms.join(', ').indexOf(e.target.value)
                if ((nom && prenoms) == -1) return member
              })
              console.log(notIn);
              let tmp = school_members.querySelectorAll('li>figure>figcaption')
              tmp.forEach(elt => {
                console.log(elt.innerText);
                elt.closest('li').classList.remove('off')
                notIn.forEach(elt_ => {
                  let fullname = elt_.nom + " - " + elt_.prenoms.join(', ')
                  console.log(fullname);
                  if (elt.innerText == fullname) {
                    elt.closest('li').classList.add('off')
                  }
                })
              })
              console.log(notIn);
            }}
          />
          <button 
            title={"Ajouter un " + (showTeachers ? "nouveau professeur" : "nouvel élève")}
            onClick={e=>{
              // alert('ok')
              // modal.style.display="block"
              modal.classList.add('active')
              // setShowModal(true)
              console.log('#modal .modal___main>form.'+(showTeachers?"teacher":"student"));
              document.querySelector('#modal .modal___main>form').classList.remove('classe')
              document.querySelector('#modal .modal___main>form.'+(showTeachers?"teacher":"student")).classList.add('active')
            }}
          >+</button>
          {
            createPortal(
              <EditMongoForm 
                endpoint="ecole"
                modelKey={showTeachers?"teacher":"student"} 
                model={showTeachers ? models?.schemaTeacher?.paths || {} : models?.schemaEleve?.paths || {}} 
                joinedDatasProps={{classes: ecole_classes}} 
              />
              , document.querySelector('#modal .modal___main')
            )
          }
        </form>
        {showTeachers && <MembersList data={ecole_profs} type={"teachers"} />}
        {showStudents && <MembersList data={ecole_eleves} type={"students"} />}
      </>}
    </section>
  </main>)
}







export const getStaticProps = async () => {
  
  // console.log(getModels());

  return {
    props: {
      theModels: JSON.parse("{\"void\":\"oui\"}")
      // theModels: JSON.parse("oui")
      // theModels: JSON.parse(getModels())
    },
  }
}
