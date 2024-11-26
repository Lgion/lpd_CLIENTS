import EditMongoForm from '../EditMongoForm'
import MembersList from './MembersList'

export default () => {
    const {renderClasse,showTeachers,showStudents} = useContext(AdminContext)

    
    return <>
        
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
    </>
}