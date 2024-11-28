import { ecole_profs } from '../../../../../assets/classes'

export default function TeacherPage({ params }) {
  const teacher = ecole_profs.find(prof => prof.id === params.id)

  if (!teacher) {
    return <div className="alert alert-danger">Professeur non trouvé</div>
  }

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h1 className="h3 mb-0">Profil du Professeur</h1>
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
              {teacher.photo_$_file && (
                <img 
                  src={teacher.photo_$_file} 
                  alt={`${teacher.nom} ${teacher.prenoms.join(' ')}`}
                  className="img-fluid rounded mb-3"
                />
              )}
            </div>
            <div className="col-md-8">
              <h2 className="h4 mb-3">{teacher.nom} {teacher.prenoms.join(' ')}</h2>
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
                  {Object.entries(teacher.current_classes_$_ref_µ_classes).map(([key, value], index) => (
                    <li key={index} className="badge bg-primary me-2">{key}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
