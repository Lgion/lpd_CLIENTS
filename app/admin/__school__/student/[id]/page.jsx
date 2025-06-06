import { ecole_eleves } from '../../../../../assets/classes'

export default function StudentPage({ params }) {
  const student = ecole_eleves.find(eleve => eleve.id === params.id)

  if (!student) {
    return <div className="alert alert-danger">Élève non trouvé</div>
  }

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h1 className="h3 mb-0">Profil de l'Élève</h1>
          <button 
            className="btn btn-primary"
            onClick={() => window.history.back()}
          >
            Retour
          </button>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              {student.photo_$_file && (
                <img 
                  src={student.photo_$_file} 
                  alt={`${student.nom} ${student.prenoms.join(' ')}`}
                  className="img-fluid rounded mb-3"
                />
              )}
            </div>
            <div className="col-md-8">
              <h2 className="h4 mb-3">{student.nom} {student.prenoms.join(' ')}</h2>
              
              <div className="mb-3">
                <strong>Date de naissance:</strong> {student.naissance_$_date}
              </div>
              <div className="mb-3">
                <strong>Adresse:</strong> {student.adresse}
              </div>
              <div className="mb-3">
                <strong>Classe actuelle:</strong> {student.current_classe_$_ref_µ_classes}
              </div>

              <div className="card mb-3">
                <div className="card-header">
                  <h3 className="h5 mb-0">Parents</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h4 className="h6">Père</h4>
                      <p>{student.parents.pere}</p>
                    </div>
                    <div className="col-md-6">
                      <h4 className="h6">Mère</h4>
                      <p>{student.parents.mere}</p>
                    </div>
                    <div className="col-12">
                      <strong>Téléphone:</strong> {student.parents.phone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mb-3">
                <div className="card-header">
                  <h3 className="h5 mb-0">Scolarité</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>Frais de scolarité:</strong>
                    <ul className="list-unstyled">
                      {Object.entries(student.scolarity_fees_$_checkbox).map(([annee, statut], index) => (
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
                      {Object.entries(student.bolobi_class_history_$_ref_µ_classes).map(([annee, classe], index) => (
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
    </div>
  )
}
