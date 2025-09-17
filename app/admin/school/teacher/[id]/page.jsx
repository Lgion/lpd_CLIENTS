"use client"

import { useContext } from 'react'
import Link from "next/link";
// import { ecole_classes } from '../../../../../assets/classes'
import AdminContext from "../../../../../stores/adminContext.js"
import BackButton from "../../_/BackButton.jsx"

export default function TeacherPage({ params }) {
  const {ecole_profs,ecole_classes} = useContext(AdminContext)
  const teacher = ecole_profs?.find(prof => prof._id === params.id)
  console.log(teacher);
  console.log(teacher);

  

  if (!teacher) {
    return <div className="alert alert-danger">Professeur non trouvé</div>
  }

  return (
    <main className="container py-4 profilContainer">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h1 className="h3 mb-0">Profil du Professeur</h1>
          <BackButton />
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              {teacher.photo_$_file && (
                <img 
                  src={"/school/teachers/"+teacher.nom.toLowerCase() + "_" + teacher?.prenoms?.join("-").toLocaleLowerCase() +"_"+ teacher["photo_$_file"].substring(teacher["photo_$_file"].indexOf('.'))} 
                  alt={`${teacher.nom} ${teacher.prenoms?.join(' ')}`}
                  className="img-fluid rounded mb-3"
                />
              )}
            </div>
            <div className="col-md-8">
              <h2 className="h4 mb-3">{teacher.nom} {teacher.prenoms?.join(' ')}</h2>
              <div className="mb-3">
                <strong>Email:</strong> {teacher.email_$_email}
              </div>
              <div className="mb-3">
                <strong>Téléphone:</strong> {teacher.phone_$_tel}
              </div>
              <div className="mb-3">
                <strong>Adresse:</strong> {teacher.adresse}
              </div>
              <div className="mb-3">
                <strong>Classes actuelles:</strong>
                <ul className="list-unstyled">
                  {/* {Object.entries(teacher.current_classes_$_ref_µ_classes).map(([key, value], index) => ( */}
                  {teacher.current_classes_$_ref_µ_classes&&Object.entries([teacher.current_classes_$_ref_µ_classes]).map(([key, value], index) => {
                    const classe = ecole_classes.find(classe => classe._id === value)
                    console.log(value);
                    console.log(classe);
                    
                    return <li key={index} className="badge bg-primary me-2">
                      <Link className="class_from_teacherPage" href={`/admin/school#${classe.annee}___${classe.niveau+"-"+classe.alias}`}>{classe.niveau}-{classe.alias}</Link>
                    </li>
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
