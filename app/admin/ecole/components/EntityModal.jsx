import { useContext, useState, useRef, useEffect } from 'react';
import '../index.scss';
import { AiAdminContext } from '../../../../stores/ai_adminContext';
import Gmap from '../../../_/Gmap_plus';

// type: 'eleve' | 'enseignant' | 'classe'
// --- Composant pour ajouter une note ---
function AddNoteForm({ onAdd, notes }) {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState('');
  const [matiere, setMatiere] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');

  const handleValidate = () => {
    if (!date || !matiere || !note) {
      setErr('Tous les champs sont requis');
      return;
    }
    const timestamp = new Date(date).getTime();
    if (!timestamp || isNaN(timestamp)) {
      setErr('Date invalide');
      return;
    }
    onAdd({ [timestamp]: [matiere, note] });
    setDate(''); setMatiere(''); setNote(''); setErr('');
    setShowForm(false);
  };

  const handleCancel = () => {
    setDate(''); setMatiere(''); setNote(''); setErr('');
    setShowForm(false);
  };

  return (
    <div className="add-note-form">
      {/* Affichage des notes existantes */}
      <div className="notes-list">
        {notes && Object.keys(notes).length == 0 && (
          <div className="no-notes">Aucune note pour l'instant</div>
        )}
      </div>

      {!showForm ? (
        <button type="button" className="add-note-btn" onClick={() => setShowForm(true)}>Ajouter une note</button>
      ) : (
        <>
          <input type="date" className="add-note-date" value={date} onChange={e => setDate(e.target.value)} />
          <select className="add-note-matiere" value={matiere} onChange={e => setMatiere(e.target.value)}>
            <option value="">Choisir une matière</option>
            <option value="Mathématiques">Mathématiques</option>
            <option value="Français">Français</option>
            <option value="Histoire-Géo">Histoire-Géo</option>
            <option value="Anglais">Anglais</option>
            <option value="SVT">SVT</option>
            <option value="Physique-Chimie">Physique-Chimie</option>
            <option value="EPS">EPS</option>
            <option value="Arts">Arts</option>
            <option value="Technologie">Technologie</option>
            <option value="Autre">Autre</option>
          </select>
          <input type="number" min="0" max="20" className="add-note-note" placeholder="Note" value={note} onChange={e => setNote(e.target.value)} />
          <button type="button" className="add-note-btn" onClick={handleValidate}>Valider</button>
          <button type="button" className="add-note-btn" style={{ background: '#ccc', color: '#222' }} onClick={handleCancel}>Annuler</button>
          {err && <span className="add-note-error">{err}</span>}
        </>
      )}
    </div>
  );
}


export default function EntityModal({ type, entity, onClose, classes = [] }) {
  // --- Gestion de l'année scolaire sélectionnée pour les compositions ---
  const getDefaultSchoolYear = (compositions) => {
    const keys = Object.keys(compositions || {});
    if (keys.length > 0) return keys[0];
    const now = new Date();
    return (now.getMonth()+1)<7 ? (now.getFullYear()-1)+"-"+now.getFullYear() : now.getFullYear()+"-"+(now.getFullYear()+1);
  };
  const [schoolYear, setSchoolYear] = useState(getDefaultSchoolYear(entity?.compositions || {}));
  // Absences
  const [showAbsencePicker, setShowAbsencePicker] = useState(false);
  const [newAbsenceDate, setNewAbsenceDate] = useState('');
  // Bonus
  const [showBonusPicker, setShowBonusPicker] = useState(false);
  const [newBonusDate, setNewBonusDate] = useState('');
  const [newBonusReason, setNewBonusReason] = useState('');
  // Manus
  const [showManusPicker, setShowManusPicker] = useState(false);
  const [newManusDate, setNewManusDate] = useState('');
  const [newManusReason, setNewManusReason] = useState('');
  const ctx = useContext(AiAdminContext);
  const fileInput = useRef();
  const [form, setForm] = useState(entity || {});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showMap, setShowMap] = useState(false);

  // Pré-remplissage par défaut selon l'entité
  useEffect(() => {
    if (!entity) {
      if (type === 'eleve') setForm({ nom: '', prenoms: [''], naissance_$_date: '', adresse_$_map: '', parents: { mere: '', pere: '', phone: '' }, photo_$_file: '', current_classe: '', documents: [], ...form });
      if (type === 'enseignant') setForm({ nom: '', prenoms: [''], naissance_$_date: '', adresse_$_map: '', photo_$_file: '', phone_$_tel: '', email_$_email: '', current_classes: '', ...form });
      if (type === 'classe') setForm({ annee: '', niveau: '', alias: '', photo: '', professeur: [], eleves: [], ...form });
    }
    // Chargement des données fictives
    if (!entity) {
      if (type === 'eleve') {
        setForm({
          nom: 'Doe',
          prenoms: ['John'],
          naissance_$_date: '2006-01-01',
          adresse_$_map: { lat: 5.333333, lng: 3.866667 },
          parents: { mere: 'Jane', pere: 'Jean', phone: '01 23 45 67 89' },
          isInterne: true,

        });
      }
      if (type === 'enseignant') {
        setForm({
          nom: 'Dupont',
          prenoms: ['Jean'],
          naissance_$_date: '1970-01-01',
          adresse_$_map: "5.333333, 3.866667",
          photo_$_file: 'https://picsum.photos/200/300',
          phone_$_tel: '01 23 45 67 89',
          email_$_email: 'jdupont@ecole.com',
          current_classes: ['6e', '5e'],
        });
      }
      if (type === 'classe') {
        setForm({
          annee: '2023-2024',
          niveau: '6e',
          alias: '6eA',
          photo: 'https://picsum.photos/200/300',
          professeur: [{ nom: 'Dupont', prenoms: ['Jean'] }],
          eleves: [{ nom: 'Doe', prenoms: ['John'] }],
        });
      }
    }
  }, [type, entity])
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDocumentChange = (index, customName) => {
    setSelectedDocuments(docs => docs.map((doc, i) => i === index ? { ...doc, customName } : doc));
  };

  const handleDocumentSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedDocuments(files.map(file => ({ file, customName: file.name })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newForm = { ...form };
    // Si un fichier a été sélectionné, on l'upload maintenant
    if (selectedFile || (selectedDocuments && selectedDocuments.length > 0)) {
      setUploading(true);
      // Pour une classe, on envoie annee, niveau, alias pour le backend
      let uploadPayload = { file: selectedFile, type };
      uploadPayload.entityType = type; // Toujours transmettre le type en props comme entityType
      if (selectedDocuments && selectedDocuments.length > 0) {
        // On transmet documents: [{file, customName}]
        uploadPayload.documents = selectedDocuments;
      }
      if (type === 'eleve') {
        console.log(form['naissance_$_date']);
        console.log(+form['naissance_$_date']);
        console.log(form['naissance_$_date']+"");
        console.log(+new Date(form['naissance_$_date']+""));
        
        
        uploadPayload.nom = form.nom;
        // Prend le premier prénom si tableau, sinon la string
        uploadPayload.prenoms = Array.isArray(form.prenoms) ? form.prenoms[0] : form.prenoms;
        uploadPayload['naissance_$_date'] = +new Date(form['naissance_$_date']+"");
        console.log("rrrrrrrrrrrrrrrrrrrrrr");
        console.log(uploadPayload);
        console.log("rrrrrrrrrrrrrrrrrrrrrr");
        
      }
      if (type === 'classe') {
        uploadPayload.annee = form.annee;
        uploadPayload.niveau = form.niveau;
        uploadPayload.alias = form.alias;
      }
      const uploadRes = await ctx.uploadFile(uploadPayload);
      console.log('UPLOAD RESULT', uploadRes);
      const { paths, error } = uploadRes;
      setUploading(false);
      if (error || !paths) {
        setError("Erreur lors de l'upload du fichier : " + (error || 'aucun chemin de fichier retourné'));
        return;
      }
      if (type === 'eleve' || type === 'enseignant'){
        newForm.photo_$_file = paths.find(p => p.endsWith('photo.webp'));
        newForm.documents = paths.filter(p => p.endsWith('photo.webp'));
      }
      if (type === 'classe') newForm.photo = paths.find(p => !p.endsWith('photo.webp'));
    }
    if (type === 'eleve') {
      if (!newForm.current_classe || !newForm.photo_$_file) return setError('Classe et photo obligatoires.');
      // Nettoyage du form pour Mongoose :
      if (newForm.current_classe === "") delete newForm.current_classe;
      // absences : toujours tableau d'objets
      if (typeof newForm.absences === 'string') {
        try {
          newForm.absences = JSON.parse(newForm.absences);
        } catch (e) {
          newForm.absences = [];
        }
      }
      if (!Array.isArray(newForm.absences)) newForm.absences = [];
      // adresse_$_map : toujours string "lat,lng"
      if (typeof newForm['adresse_$_map'] === 'object' && newForm['adresse_$_map'] !== null) {
        if ('lat' in newForm['adresse_$_map'] && 'lng' in newForm['adresse_$_map']) {
          newForm['adresse_$_map'] = `${newForm['adresse_$_map'].lat},${newForm['adresse_$_map'].lng}`;
        }
      }
      setError('');
      console.log(newForm);
      
      await ctx.saveEleve(newForm);
    } else if (type === 'enseignant') {
      if (!newForm.nom || !newForm.photo_$_file) return setError('Nom et photo obligatoires.');
      setError('');
      await ctx.saveEnseignant(newForm);
    } else if (type === 'classe') {
      alert('kkk ')
      console.log(newForm);
      
      if (!newForm.niveau || !newForm.alias || !newForm.photo) return setError('Niveau, alias et photo obligatoires.');
      setError('');
      console.log('DEBUG SUBMIT CLASSE', newForm);
      await ctx.saveClasse(newForm);
    }
    onClose();
  };
  const handleMapClick = (coords) => {
    const lat = coords.lat.toFixed(6);
    const lng = coords.lng.toFixed(6);
    setForm(f => ({ ...f, adresse_$_map: `${lat},${lng}` }));
    // setShowMap(false);
  };

  // Rendu dynamique selon le type
  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Fermer</button>
        <form onSubmit={handleSubmit}>
          {type === 'eleve' && <>
            <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" required />
            <input name="prenoms" value={Array.isArray(form.prenoms) ? form.prenoms.join(',') : form.prenoms || ''} onChange={e => setForm(f => ({ ...f, prenoms: e.target.value.split(',') }))} placeholder="Prénoms (séparés par des virgules)" required />
            <input type="date" name="naissance_$_date" value={form.naissance_$_date} onChange={handleChange} required />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                name="adresse_$_map"
                value={form.adresse_$_map}
                onChange={handleChange}
                placeholder="Adresse"
                required
                style={{ flex: 1 }}
              />
              <button type="button" onClick={() => setShowMap(true)} style={{ marginLeft: 8 }}>
                📍
              </button>
            </div>
            {showMap && (
              <div style={{ margin: '10px 0' }}>
                  <Gmap 
                      // Pass initial center based on current state (which might be from datas)
                      // initialCenter={{ lat: parseFloat(latitude) || 5.36, lng: parseFloat(longitude) || -4.00 }}
                      onCoordinatesClick={handleMapClick} // Pass the callback function
                  />
                <button type="button" onClick={() => setShowMap(false)}>Fermer la carte</button>
              </div>
            )}
            <div className="parents-block">
              <div className="parent-card">
                <img src="/mom.webp" alt="Mère" className="parent-img" />
                <div className="parent-title">Mère</div>
                <input name="parents.mere" value={form.parents?.mere || ''} onChange={e => setForm(f => ({ ...f, parents: { ...f.parents, mere: e.target.value } }))} placeholder="Nom de la mère" />
                <input name="parents.phone" value={form.parents?.phone || ''} onChange={e => setForm(f => ({ ...f, parents: { ...f.parents, phone: e.target.value } }))} placeholder="Téléphone parent" />
              </div>
              <div className="parent-card">
                <img src="/pa.webp" alt="Père" className="parent-img" />
                <div className="parent-title">Père</div>
                <input name="parents.pere" value={form.parents?.pere || ''} onChange={e => setForm(f => ({ ...f, parents: { ...f.parents, pere: e.target.value } }))} placeholder="Nom du père" />
              </div>
            </div>
            {console.log(ctx.classes)}
            <select name="current_classe" value={form.current_classe || ''} onChange={handleChange} required>
              <option value="">Sélectionnez une classe</option>
              {ctx.classes && ctx.classes.map(classe => (
                <option key={classe._id} value={classe._id}>{classe.alias} ({classe.niveau})</option>
              ))}
            </select>
            <input type="file" ref={fileInput} accept="image/*" required={!form.photo_$_file} onChange={handleFile} />
            {(previewUrl || form.photo_$_file) && <img src={previewUrl || form.photo_$_file} alt="photo" className="previewImageAddForm" />}
            <div className="isinterne-card">
              <img src="/dortoir.png" alt="Dortoir" className="isinterne-img" />
              <label className="isinterne-label">
                <input type="checkbox" name="isInterne" checked={!!form.isInterne} onChange={e => setForm(f => ({ ...f, isInterne: e.target.checked }))} />
                <span>Interne</span>
              </label>
            </div>
            <div className="absences-block">
              <input type="hidden" name="absences" value={Array.isArray(form.absences) ? form.absences.join(',') : ''} />
              <div className="absences-header">
                <span>Absences : <b>{Array.isArray(form.absences) ? form.absences.length : 0}</b></span>
                <button type="button" className="add-absence-btn" onClick={() => setShowAbsencePicker(true)}>Ajouter</button>
              </div>
              {/* Liste des absences groupées par mois */}
              {Array.isArray(form.absences) && form.absences.length > 0 && (
                <div className="absences-list">
                  {Object.entries(form.absences.reduce((acc, ts) => {
                    const d = new Date(Number(ts));
                    const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}`;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(ts);
                    return acc;
                  }, {})).sort((a,b) => b[0].localeCompare(a[0])).map(([month, dates]) => (
                    <div key={month} className="absence-month">
                      <div className="month-title">{new Date(dates[0]*1).toLocaleString('fr-FR', {month:'long', year:'numeric'})}</div>
                      <div className="month-dates">
                        {dates.sort((a,b)=>a-b).map(ts => (
                          <div className="absence-date" key={ts} style={{position:'relative', display:'inline-block', margin:'0 6px 6px 0'}}>
                            <span>{new Date(Number(ts)).toLocaleDateString('fr-FR')}</span>
                            <button type="button" className="remove-absence-btn" title="Supprimer" onClick={() => {
                              if(window.confirm('Supprimer cette absence ?')) setForm(f => ({...f, absences: f.absences.filter(x => x !== ts)}));
                            }} style={{position:'absolute',top:0,right:0,background:'none',border:'none',color:'#b00',fontWeight:'bold',cursor:'pointer',fontSize:'1.1em',lineHeight:'1em'}}>&times;</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Picker d'ajout d'absence */}
              {showAbsencePicker && (
                <div className="absence-picker-modal">
                  <input type="date" onChange={e => setNewAbsenceDate(e.target.value)} />
                  <button type="button" onClick={() => {
                    if (newAbsenceDate) {
                      const ts = new Date(newAbsenceDate).setHours(0,0,0,0);
                      const absencesArr = Array.isArray(form.absences) ? form.absences : [];
                      if (!absencesArr.includes(ts)) setForm(f => ({...f, absences: [...absencesArr, ts]}));
                      setShowAbsencePicker(false);
                      setNewAbsenceDate('');
                    }
                  }}>Valider</button>
                  <button type="button" onClick={() => setShowAbsencePicker(false)} style={{marginLeft:8}}>Annuler</button>
                </div>
              )}
            </div>
            <div className="bonus-block">
              <input type="hidden" name="bonus" value={form.bonus ? JSON.stringify(form.bonus) : '{}'} />
              <div className="bonus-header">
                <span>Bonus : <b>{form.bonus && typeof form.bonus === 'object' ? Object.keys(form.bonus).length : 0}</b></span>
                <button type="button" className="add-bonus-btn" onClick={() => setShowBonusPicker(true)}>Ajouter</button>
              </div>
              {/* Liste des bonus groupés par mois */}
              {form.bonus && typeof form.bonus === 'object' && Object.keys(form.bonus).length > 0 && (
                <div className="bonus-list">
                  {Object.entries(Object.entries(form.bonus).reduce((acc, [ts, txt]) => {
                    const d = new Date(Number(ts));
                    const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}`;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push([ts, txt]);
                    return acc;
                  }, {})).sort((a,b) => b[0].localeCompare(a[0])).map(([month, entries]) => (
                    <div key={month} className="bonus-month">
                      <div className="month-title">{new Date(entries[0][0]*1).toLocaleString('fr-FR', {month:'long', year:'numeric'})}</div>
                      <div className="month-bonus">
                        {entries.sort((a,b)=>a[0]-b[0]).map(([ts, txt]) => (
                          <div className="bonus-entry" key={ts} style={{position:'relative', display:'inline-block', margin:'0 6px 6px 0'}}>
                            <span>{new Date(Number(ts)).toLocaleDateString('fr-FR')}</span>
                            <span className="bonus-txt">{txt}</span>
                            <button type="button" className="remove-bonus-btn" title="Supprimer" onClick={() => {
                              if(window.confirm('Supprimer ce bonus ?')) setForm(f => { const o = {...f.bonus}; delete o[ts]; return {...f, bonus: o}; });
                            }} style={{position:'absolute',top:0,right:0,background:'none',border:'none',color:'#b00',fontWeight:'bold',cursor:'pointer',fontSize:'1.1em',lineHeight:'1em'}}>&times;</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Picker d'ajout de bonus */}
              {showBonusPicker && (
                <div className="bonus-picker-modal">
                  <input type="date" onChange={e => setNewBonusDate(e.target.value)} />
                  <input type="text" placeholder="Raison du bonus" value={newBonusReason} onChange={e => setNewBonusReason(e.target.value)} />
                  <button type="button" onClick={() => {
                    if (newBonusDate && newBonusReason) {
                      const ts = new Date(newBonusDate).setHours(0,0,0,0);
                      setForm(f => ({...f, bonus: {...(typeof f.bonus==='object' && f.bonus ? f.bonus : {}), [ts]: newBonusReason}}));
                      setShowBonusPicker(false);
                      setNewBonusDate('');
                      setNewBonusReason('');
                    }
                  }}>Valider</button>
                  <button type="button" onClick={() => { setShowBonusPicker(false); setNewBonusDate(''); setNewBonusReason(''); }} style={{marginLeft:8}}>Annuler</button>
                </div>
              )}
            </div>
            <div className="manus-block">
              <input type="hidden" name="manus" value={form.manus ? JSON.stringify(form.manus) : '{}'} />
              <div className="manus-header">
                <span>Manus : <b>{form.manus && typeof form.manus === 'object' ? Object.keys(form.manus).length : 0}</b></span>
                <button type="button" className="add-manus-btn" onClick={() => setShowManusPicker(true)}>Ajouter</button>
              </div>
              {/* Liste des manus groupés par mois */}
              {form.manus && typeof form.manus === 'object' && Object.keys(form.manus).length > 0 && (
                <div className="manus-list">
                  {Object.entries(Object.entries(form.manus).reduce((acc, [ts, txt]) => {
                    const d = new Date(Number(ts));
                    const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}`;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push([ts, txt]);
                    return acc;
                  }, {})).sort((a,b) => b[0].localeCompare(a[0])).map(([month, entries]) => (
                    <div key={month} className="manus-month">
                      <div className="month-title">{new Date(entries[0][0]*1).toLocaleString('fr-FR', {month:'long', year:'numeric'})}</div>
                      <div className="month-manus">
                        {entries.sort((a,b)=>a[0]-b[0]).map(([ts, txt]) => (
                          <div className="manus-entry" key={ts} style={{position:'relative', display:'inline-block', margin:'0 6px 6px 0'}}>
                            <span>{new Date(Number(ts)).toLocaleDateString('fr-FR')}</span>
                            <span className="manus-txt">{txt}</span>
                            <button type="button" className="remove-manus-btn" title="Supprimer" onClick={() => {
                              if(window.confirm('Supprimer ce manus ?')) setForm(f => { const o = {...f.manus}; delete o[ts]; return {...f, manus: o}; });
                            }} style={{position:'absolute',top:0,right:0,background:'none',border:'none',color:'#b00',fontWeight:'bold',cursor:'pointer',fontSize:'1.1em',lineHeight:'1em'}}>&times;</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Picker d'ajout de manus */}
              {showManusPicker && (
                <div className="manus-picker-modal">
                  <input type="date" onChange={e => setNewManusDate(e.target.value)} />
                  <input type="text" placeholder="Raison du manus" value={newManusReason} onChange={e => setNewManusReason(e.target.value)} />
                  <button type="button" onClick={() => {
                    if (newManusDate && newManusReason) {
                      const ts = new Date(newManusDate).setHours(0,0,0,0);
                      setForm(f => ({...f, manus: {...(typeof f.manus==='object' && f.manus ? f.manus : {}), [ts]: newManusReason}}));
                      setShowManusPicker(false);
                      setNewManusDate('');
                      setNewManusReason('');
                    }
                  }}>Valider</button>
                  <button type="button" onClick={() => { setShowManusPicker(false); setNewManusDate(''); setNewManusReason(''); }} style={{marginLeft:8}}>Annuler</button>
                </div>
              )}
            </div>
            <label>Commentaires (JSON ou liste)
              <textarea name="commentaires" value={Array.isArray(form.commentaires) ? JSON.stringify(form.commentaires) : form.commentaires || ''} onChange={e => setForm(f => ({ ...f, commentaires: e.target.value ? JSON.parse(e.target.value) : [] }))} />
            </label>
            <div className="documents-block">
              <label>Documents</label>
              <input
                type="file"
                accept=".pdf,image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={e => {
                  const files = Array.from(e.target.files);
                  if (!files.length) return;
                  setSelectedDocuments(prev => ([
                  ...prev,
                  ...Array.from(files).map(file => ({ file, customName: file.name }))
                ])); // Accumule dans le hook dédié
                  e.target.value = '';
                }}
              />
              {'-'}
              {JSON.stringify(form.documents)}
              {console.log(form.documents?.[0])}
              
              {'-'}
              {Array.isArray(selectedDocuments) && selectedDocuments.length > 0 && (
                <div className="documents-list">
                  {selectedDocuments.map((doc, i) => (
                    <div className="document-item" key={doc.file.name + '-' + i}
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {doc.file.type === "application/pdf"
                        ? <span className="doc-icon" title="PDF">📄</span>
                        : <span className="doc-icon" title="Image">🖼️</span>}
                      <span>{doc.file.name}</span>
                      <input
                        type="text"
                        value={doc.customName}
                        onChange={e => {
                          const newDocs = [...selectedDocuments];
                          newDocs[i].customName = e.target.value;
                          setSelectedDocuments(newDocs);
                        }}
                        placeholder="Nom final du fichier"
                        style={{ marginLeft: 8, flex: 1 }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label>Notes</label>
            <div className="notes-container" style={{ border: '1px solid #ccc', borderRadius: 6, padding: 8, marginBottom: 16 }}>
              {/* Affichage des notes triées par date croissante */}
              {Object.entries(form.notes || {})
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([timestamp, [matiere, note]], idx) => (
                  <div key={timestamp} style={{ display: 'flex', alignItems: 'center', background: '#f9f9f9', borderRadius: 4, marginBottom: 4, padding: 4, position: 'relative' }}>
                    <span style={{ minWidth: 100, fontWeight: 500 }}>{new Date(Number(timestamp)).toLocaleDateString()}</span>
                    <span style={{ margin: '0 12px' }}>{matiere}</span>
                    <span style={{ margin: '0 12px', fontWeight: 600 }}>{note}</span>
                    <button type="button" onClick={() => {
                      const newNotes = { ...form.notes };
                      delete newNotes[timestamp];
                      setForm(f => ({ ...f, notes: newNotes }));
                    }} style={{ position: 'absolute', right: 6, top: 4, border: 'none', background: 'transparent', color: '#d00', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }} title="Supprimer">×</button>
                  </div>
                ))}
              {/* Formulaire d'ajout de note */}
              <AddNoteForm
                onAdd={noteObj => {
                  setForm(f => ({ ...f, notes: { ...f.notes, ...noteObj } }));
                }}
                notes={form.notes || {}}
              />
              {/* Champ caché pour la soumission */}
              <input type="hidden" name="notes" value={form.notes ? JSON.stringify(form.notes) : ''} />
            </div>

            <label>Compositions (JSON)</label>
            {/* Bloc de gestion des compositions par trimestre */}
            <CompositionsBlock
              compositions={form.compositions || {}}
              schoolYear={schoolYear}
              onChange={newCompo => setForm(f => ({ ...f, compositions: newCompo }))}
              onChangeYear={setSchoolYear}
            />
            <textarea readOnly name="compositions" value={form.compositions ? JSON.stringify(form.compositions) : ''} 
              // onChange={e => setForm(f => ({ ...f, compositions: e.target.value ? JSON.parse(e.target.value) : {} }))} 
            />
            <label>Moyenne trimetriel (JSON)
              <textarea name="moyenne_trimetriel" value={form.moyenne_trimetriel ? JSON.stringify(form.moyenne_trimetriel) : ''} onChange={e => setForm(f => ({ ...f, moyenne_trimetriel: e.target.value ? JSON.parse(e.target.value) : {} }))} />
            </label>
            <label>Scolarity fees (JSON)</label>
            <ScolarityFeesBlock
              fees={form.scolarity_fees_$_checkbox?.[schoolYear] || {}}
              onChange={newFees => setForm(f => ({
                ...f,
                scolarity_fees_$_checkbox: {
                  ...f.scolarity_fees_$_checkbox,
                  [schoolYear]: newFees
                }
              }))}
              schoolYear={schoolYear}
            />
            <textarea readOnly name="scolarity_fees_$_checkbox_" value={form.scolarity_fees_$_checkbox ? JSON.stringify(form.scolarity_fees_$_checkbox) : ''} 
              // onChange={e => setForm(f => ({ ...f, scolarity_fees_$_checkbox: e.target.value ? JSON.parse(e.target.value) : {} }))} 
            />
            <label>Bolobi class history (JSON)
            </label>
            <SchoolHistoryBlock
              schoolHistory={(() => {
                const now = new Date();
                const currentYearStart = (now.getMonth() + 1) < 7 ? now.getFullYear() - 1 : now.getFullYear();
                const currentYearStr = `${currentYearStart}-${currentYearStart + 1}`;
                return {
                  [currentYearStr]: "Martin de Porrès de Bolobi",
                  ...(form.school_history || {})
                };
              })()}
              onChange={newHistory => setForm(f => ({ ...f, school_history: newHistory }))}
            />
            <textarea readOnly name="school_history_" value={form.school_history ? JSON.stringify(form.school_history) : ''} 
              // onChange={e => setForm(f => ({ ...f, bolobi_class_history_$_ref_µ_classes: e.target.value ? JSON.parse(e.target.value) : {} }))} 
            />
          </>}
          {type === 'enseignant' && <>
            <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" required />
            <input name="prenoms" value={form.prenoms} onChange={e => setForm(f => ({ ...f, prenoms: e.target.value.split(',') }))} placeholder="Prénoms (séparés par des virgules)" required />
            <input name="naissance_$_date" value={form.naissance_$_date} onChange={handleChange} placeholder="Date de naissance" required />
            <input name="adresse_$_map" value={form.adresse_$_map} onChange={handleChange} placeholder="Adresse" required />
            <input name="phone_$_tel" value={form.phone_$_tel} onChange={handleChange} placeholder="Téléphone" required />
            <input name="email_$_email" value={form.email_$_email} onChange={handleChange} placeholder="Email" required />
            <input type="file" ref={fileInput} accept="image/*" onChange={handleFile} required={!form.photo_$_file && !previewUrl} />
            {(previewUrl || form.photo_$_file) && <img src={previewUrl || form.photo_$_file} alt="photo" className="previewImageAddForm" />}
            <input name="current_classes" value={form.current_classes} onChange={handleChange} placeholder="Classe actuelle (ID)" required />
          </>}
          {type === 'classe' && <>
            <input name="annee" value={form.annee} onChange={handleChange} placeholder="Année" required />
            <select name="niveau" value={form.niveau} onChange={handleChange} required>
              <option value="">Sélectionnez le niveau</option>
              {["CP", "CE1", "CE2", "CM1", "CM2", "6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <input name="alias" value={form.alias} onChange={handleChange} placeholder="Alias (ex: 4B)" required />
            <input type="file" ref={fileInput} accept="image/*" onChange={handleFile} required={!form.photo && !previewUrl} />
            {(previewUrl || form.photo) && <img src={previewUrl || form.photo} alt="photo" className="previewImageAddForm" />}
            <label>Professeurs</label>
            <select multiple name="professeur" value={form.professeur} onChange={e => {
              const options = e.target.options;
              const values = [];
              for (let i = 0; i < options.length; i++) {
                if (options[i].selected) values.push(options[i].value);
              }
              setForm(f => ({ ...f, professeur: values }));
            }}>
              {ctx.enseignants && ctx.enseignants.map(ens => (
                <option key={ens._id} value={ens._id}>{ens.nom} {Array.isArray(ens.prenoms) ? ens.prenoms.join(' ') : ens.prenoms}</option>
              ))}
            </select>
            <label>Élèves</label>
            <select multiple name="eleves" value={form.eleves} onChange={e => {
              const options = e.target.options;
              const values = [];
              for (let i = 0; i < options.length; i++) {
                if (options[i].selected) values.push(options[i].value);
              }
              setForm(f => ({ ...f, eleves: values }));
            }}>
              {ctx.eleves && ctx.eleves.map(eleve => (
                <option key={eleve._id} value={eleve._id}>{eleve.nom} {Array.isArray(eleve.prenoms) ? eleve.prenoms.join(' ') : eleve.prenoms}</option>
              ))}
            </select>
            
          </>}
          {error && <div style={{color:'red'}}>{error}</div>}
          <button type="submit">Enregistrer</button>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          {entity && entity._id && <button type="button" onClick={() => {
            if (type === 'eleve') ctx.deleteEleve(entity._id);
            if (type === 'enseignant') ctx.deleteEnseignant(entity._id);
            if (type === 'classe') ctx.deleteClasse(entity._id);
            onClose();
          }}>Supprimer</button>}
        </form>
      </div>
    </div>
  );
}










// --- Bloc d'historique des écoles fréquentées ---
function SchoolHistoryBlock({ schoolHistory, onChange }) {
  // Récupérer l'année scolaire courante
  const now = new Date();
  const currentYearStart = (now.getMonth() + 1) < 7 ? now.getFullYear() - 1 : now.getFullYear();
  const currentYearStr = `${currentYearStart}-${currentYearStart + 1}`;
  // Générer les 10 années précédentes (hors année courante)
  const years = Array.from({length: 10}, (_, i) => {
    const start = currentYearStart - i - 1;
    return `${start}-${start + 1}`;
  });
  // Années déjà renseignées
  const usedYears = Object.keys(schoolHistory || {});
  // Années disponibles pour ajout
  const availableYears = years.filter(y => !usedYears.includes(y));
  // Formulaire d'ajout
  const [selectedYear, setSelectedYear] = useState(availableYears[0] || '');
  const [ecole, setEcole] = useState('');

  const handleAdd = () => {
    if (!selectedYear || !ecole.trim()) return;
    onChange({ ...schoolHistory, [selectedYear]: ecole.trim() });
    setEcole('');
    // Mettre à jour l'année sélectionnée après ajout
    const nextAvailable = availableYears.filter(y => y !== selectedYear)[0] || '';
    setSelectedYear(nextAvailable);
  };
  const handleRemove = (year) => {
    const newHist = { ...schoolHistory };
    delete newHist[year];
    onChange(newHist);
  };
  return (
    <div className="school-history-block">
      <div className="school-history-block__header">Historique des écoles fréquentées</div>
      <div className="school-history-block__list">
        {usedYears.length === 0 && <span className="school-history-block__empty">Aucune école enregistrée</span>}
        {usedYears.sort((a, b) => b.localeCompare(a)).map(y => (
          <div className="school-history-block__entry" key={y}>
            <span className="school-history-block__entry-year">{y}</span>
            <span className="school-history-block__entry-ecole">{schoolHistory[y]}</span>
            <button type="button" className="school-history-block__remove-btn" title="Supprimer" onClick={() => handleRemove(y)}>×</button>
          </div>
        ))}
      </div>
      <div className="school-history-block__add-form">
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
          {availableYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <input
          type="text"
          value={ecole}
          onChange={e => setEcole(e.target.value)}
          placeholder="Nom de l'école"
        />
        <button type="button" onClick={handleAdd} disabled={!selectedYear || !ecole.trim()}>Ajouter</button>
      </div>
      <input type="hidden" name="school_history" value={(() => {
        const now = new Date();
        const currentYearStart = (now.getMonth() + 1) < 7 ? now.getFullYear() - 1 : now.getFullYear();
        const currentYearStr = `${currentYearStart}-${currentYearStart + 1}`;
        return JSON.stringify({
          [currentYearStr]: "Martin de Porrès de Bolobi",
          ...(schoolHistory || {})
        });
      })()} />
    </div>
  );
}

// --- Bloc de gestion des frais de scolarité par année ---
function ScolarityFeesBlock({ fees, onChange, schoolYear }) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('argent');
  const [val, setVal] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });
  // Liste des dépôts : tableau [{timestamp, argent, riz}]
  const entries = Object.entries(fees || {}).map(([ts, v]) => ({ ts, ...v }));
  const totalArgent = entries.reduce((sum, e) => sum + (e.argent ? Number(e.argent) : 0), 0);
  const totalRiz = entries.reduce((sum, e) => sum + (e.riz ? Number(e.riz) : 0), 0);
  const complete = totalArgent >= 20000 && totalRiz >= 50;

  const handleAdd = () => {
    if (!val || isNaN(Number(val)) || Number(val) <= 0) return;
    // Utiliser la date choisie, à minuit locale
    const d = new Date(date);
    d.setHours(0,0,0,0);
    const ts = d.getTime();
    const newEntry = type === 'argent'
      ? { argent: Number(val) }
      : { riz: Number(val) };
    onChange({ ...fees, [ts]: newEntry });
    setShowForm(false); setType('argent'); setVal(''); setDate(new Date().toISOString().slice(0,10));
  };
  const handleRemove = (ts) => {
    const newFees = { ...fees };
    delete newFees[ts];
    onChange(newFees);
  };
  return (
    <div className={`scolarity-fees-block ${complete ? 'scolarity-fees-block--complete' : 'scolarity-fees-block--incomplete'}`}>
      <div className="scolarity-fees-block__header">
        Frais de scolarité – {schoolYear}
      </div>
      <div className="scolarity-fees-block__totals">
        <span>Argent : <b>{totalArgent} F</b> / 20000 F</span>
        <span>Riz : <b>{totalRiz} kg</b> / 50 kg</span>
      </div>
      <div className="scolarity-fees-block__list">
        {entries.length === 0 && <span className="scolarity-fees-block__empty">Aucun dépôt enregistré</span>}
        {entries.sort((a,b)=>a.ts-b.ts).map(e => (
          <div className="scolarity-fees-block__entry" key={e.ts}>
            <span className="scolarity-fees-block__entry-date">{new Date(Number(e.ts)).toLocaleDateString()}</span>
            {e.argent && <span className="scolarity-fees-block__entry-argent">{e.argent} F</span>}
            {e.riz && <span className="scolarity-fees-block__entry-riz">{e.riz} kg</span>}
            <button type="button" className="scolarity-fees-block__remove-btn" title="Supprimer" onClick={() => handleRemove(e.ts)}>×</button>
          </div>
        ))}
      </div>
      {showForm ? (
        <div className="scolarity-fees-block__add-form">
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="argent">Argent (F)</option>
            <option value="riz">Riz (kg)</option>
          </select>
          <input
            type="number"
            min="1"
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder={type === 'argent' ? 'Montant en F' : 'Poids en kg'}
            autoFocus
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="scolarity-fees-block__add-date"
          />
          <button type="button" onClick={handleAdd}>Valider</button>
          <button type="button" onClick={() => { setShowForm(false); setVal(''); setDate(new Date().toISOString().slice(0,10)); }} className="scolarity-fees-block__add-cancel">Annuler</button>
        </div>
      ) : (
        <button type="button" className="scolarity-fees-block__add-btn" onClick={() => setShowForm(true)}>Ajouter un dépôt</button>
      )}
      <input type="hidden" name="scolarity_fees_$_checkbox" value={JSON.stringify(fees)} />
    </div>
  );
}

// --- Bloc de gestion des compositions par trimestre ---
function CompositionsBlock({ compositions, schoolYear, onChange, onChangeYear }) {
  // Format attendu : {"2025-2026": [[11, 12], [14], [8,15,11]]}
  const [adding, setAdding] = useState(null); // trimestre en cours d'ajout
  const [newNote, setNewNote] = useState('');
  const trimestres = ["1er trimestre", "2e trimestre", "3e trimestre"];
  // Génère la liste des années disponibles (de N-10 à N+10, + toutes années trouvées dans les données)
  const now = new Date();
  const currentYearStart = (now.getMonth()+1)<7 ? now.getFullYear()-1 : now.getFullYear();
  const yearRange = Array.from({length: 21}, (_, i) => {
    const start = currentYearStart - 10 + i;
    return `${start}-${start+1}`;
  });
  const yearsSet = new Set([...yearRange, ...Object.keys(compositions||{})]);
  const years = Array.from(yearsSet).sort((a,b)=>b.localeCompare(a));
  // On récupère le tableau pour l'année courante
  const compoArr = compositions[schoolYear] || [[], [], []];

  const handleAdd = idx => {
    if (newNote === '' || isNaN(Number(newNote))) return;
    const noteNum = Number(newNote);
    const newArr = compoArr.map((arr, i) => i === idx ? [...arr, noteNum] : arr);
    onChange({ ...compositions, [schoolYear]: newArr });
    setAdding(null); setNewNote('');
  };
  const handleRemove = (idx, nidx) => {
    const newArr = compoArr.map((arr, i) => i === idx ? arr.filter((_, j) => j !== nidx) : arr);
    onChange({ ...compositions, [schoolYear]: newArr });
  };

  return (
    <div className="compositions-block">
      <div className="compositions-block__header">Compositions</div>
      <select
        className="compositions-block__year-select"
        value={schoolYear}
        onChange={e => onChangeYear(e.target.value)}
      >
        {years.map(y => {
          const start = parseInt(y.split('-')[0], 10);
          let color = '';
          if (start === currentYearStart) color = 'green';
          else if (start < currentYearStart) color = 'red';
          else color = 'blue';
          return <option key={y} value={y} className={"option_"+color }>{y}</option>;
        })}
      </select>
      
      {trimestres.map((tri, idx) => (
        <div key={tri} className="compositions-block__trimestre">
          <div className="compositions-block__trimestre-header">
            <span className="compositions-block__trimestre-title">{tri}</span>
            <button
              type="button"
              className="compositions-block__add-btn"
              onClick={() => { setAdding(idx); setNewNote(''); }}
            >Ajouter</button>
          </div>
          <div className="compositions-block__notes">
            {Array.isArray(compoArr[idx]) && compoArr[idx].length > 0 ? (
              compoArr[idx].map((note, nidx) => (
                <div key={nidx} className="compositions-block__note">
                  {note}
                  <button
                    type="button"
                    title="Supprimer"
                    onClick={() => handleRemove(idx, nidx)}
                  >×</button>
                </div>
              ))
            ) : (
              <span className="compositions-block__no-compo">Aucune composition</span>
            )}
            {adding === idx && (
              <span className="compositions-block__add-form">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Note"
                  autoFocus
                />
                <button
                  type="button"
                  className="compositions-block__add-btn"
                  onClick={() => handleAdd(idx)}
                >Valider</button>
                <button
                  type="button"
                  className="compositions-block__add-btn compositions-block__add-btn--cancel"
                  onClick={() => { setAdding(null); setNewNote(''); }}
                >Annuler</button>
              </span>
            )}
          </div>
        </div>
      ))}
      {/* Champ caché pour la soumission */}
      <input type="hidden" name="compositions" value={JSON.stringify({ [schoolYear]: compoArr })} />
    </div>
  );
}