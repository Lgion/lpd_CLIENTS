import { useContext, useState, useRef, useEffect } from 'react';
import { AiAdminContext } from '../../../../stores/ai_adminContext';
import Gmap from '../../../_/Gmap_plus';


// type: 'eleve' | 'enseignant' | 'classe'
export default function EntityModal({ type, entity, onClose, classes = [] }) {
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
            <label>Notes (JSON)
              <textarea name="notes" value={form.notes ? JSON.stringify(form.notes) : ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value ? JSON.parse(e.target.value) : {} }))} />
            </label>
            <label>Compositions (JSON)
              <textarea name="compositions" value={form.compositions ? JSON.stringify(form.compositions) : ''} onChange={e => setForm(f => ({ ...f, compositions: e.target.value ? JSON.parse(e.target.value) : {} }))} />
            </label>
            <label>Moyenne trimetriel (JSON)
              <textarea name="moyenne_trimetriel" value={form.moyenne_trimetriel ? JSON.stringify(form.moyenne_trimetriel) : ''} onChange={e => setForm(f => ({ ...f, moyenne_trimetriel: e.target.value ? JSON.parse(e.target.value) : {} }))} />
            </label>
            <label>Scolarity fees (JSON)
              <textarea name="scolarity_fees_$_checkbox" value={form.scolarity_fees_$_checkbox ? JSON.stringify(form.scolarity_fees_$_checkbox) : ''} onChange={e => setForm(f => ({ ...f, scolarity_fees_$_checkbox: e.target.value ? JSON.parse(e.target.value) : {} }))} />
            </label>
            <label>Bolobi class history (JSON)
              <textarea name="bolobi_class_history_$_ref_µ_classes" value={form.bolobi_class_history_$_ref_µ_classes ? JSON.stringify(form.bolobi_class_history_$_ref_µ_classes) : ''} onChange={e => setForm(f => ({ ...f, bolobi_class_history_$_ref_µ_classes: e.target.value ? JSON.parse(e.target.value) : {} }))} />
            </label>
            <label>School history (JSON)
              <textarea name="school_history" value={form.school_history ? JSON.stringify(form.school_history) : ''} onChange={e => setForm(f => ({ ...f, school_history: e.target.value ? JSON.parse(e.target.value) : {} }))} />
            </label>
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
