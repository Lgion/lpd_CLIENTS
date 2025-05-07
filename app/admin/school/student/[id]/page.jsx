"use client"

import { useContext } from 'react'
// import { ecole_eleves } from '../../../../../assets/classes'
import AdminContext from "../../../../../stores/adminContext.js"
import BackButton from "../../_/BackButton.jsx"

export default function StudentPage({ params }) {
  const {ecole_eleves} = useContext(AdminContext)
  const student = ecole_eleves.find(eleve => eleve._id === params.id)
  console.log(student);
  console.log(ecole_eleves);
  console.log(student?.scolarity_fees);
  

  if (!student) {
    return <div className="alert alert-danger">Élève non trouvé</div>
  }

  return (
    <main className="container py-4 profilContainer">
      <div className="card safe">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h1 className="h3 mb-0">Profil de l'Élève</h1>
          <BackButton />
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              {student?.photo_$_file && (
                <img 
                  src={student?.photo_$_file} 
                  alt={`${student?.nom} ${student?.prenoms?.join(' ')}`}
                  className="img-fluid rounded mb-3"
                />
              )}
            </div>
            <div className="col-md-8">
              <h2 className="h4 mb-3">{student?.nom} {student?.prenoms?.join(' ')}</h2>
              
              <div className="mb-3">
                <strong>Date de naissance:</strong> {student?.naissance_$_date}
              </div>
              <div className="mb-3">
                <strong>Adresse:</strong> {student?.adresse}
              </div>
              <div className="mb-3">
                <strong>Classe actuelle:</strong> {student?.current_classe_$_ref_µ_classes}
              </div>

              <div className="card safe mb-3">
                <div className="card-header">
                  <h3 className="h5 mb-0">Parents</h3>
                </div>
                <section className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h4 className="h6">Père</h4>
                      <p>{student?.parents?.pere}</p>
                    </div>
                    <div className="col-md-6">
                      <h4 className="h6">Mère</h4>
                      <p>{student?.parents?.mere}</p>
                    </div>
                    <div className="col-12">
                      <strong>Téléphone:</strong> <a href={"tel:"+student?.parents?.phone}>{student?.parents?.phone}</a>
                    </div>
                  </div>
                </section>
              </div>

              <div className="card mb-3">
                <div className="card-header">
                  <h3 className="h5 mb-0">Scolarité</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>Frais de scolarité:</strong>
                    <ul className="list-unstyled">
                      {/* {Object.entries(student?.scolarity_fees_$_checkbox).map(([annee, statut], index) => ( */}
                      {student?.scolarity_fees&&Object.entries(student?.scolarity_fees).map(([annee, statut], index) => (
                        <li key={index}>
                          {annee}: <span className={`badge ${statut === 'checked' ? 'bg-success' : 'bg-danger'}`}>
                            {statut === 'checked' ? 'Payé' : 'Non payé'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Historique des classes:</strong>
                    <ul className="list-unstyled">
                      {/* {Object.entries(student?.bolobi_class_history_$_ref_µ_classes).map(([annee, classe], index) => ( */}
                      {student?.bolobi_class_history&&Object.entries(student?.bolobi_class_history).map(([annee, classe], index) => (
                        <li key={index}>{annee}: {classe || 'Non renseigné'}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
