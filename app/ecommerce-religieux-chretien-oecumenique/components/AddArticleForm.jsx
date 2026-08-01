import { useState } from 'react';


const articles_img_table = {
  'livret P.D': "publication-puissance-divine",
  'bibles': "sainte-bible",
  'NEI': "sainte-bible",
  'texte&priere': "sainte-bible",
  'divers': "divers",
  'tableau/icone': "icone-religieuse",
  'croixp': "croix-jesus",
  'croixm': "croix-jesus",
  'croix': "croix-jesus",
  'encens': "encens-priere",
  'statue': "statue-religieuse",
  'grotte': "statue-religieuse",
  'chapelet': "chapelet-priere",
  'aLaUne': "aLaUne",
}
const articles_title_table = {
  'tableau/icone': "Icônes Religieuses",
  '_livret P.D': "Publication Puissance Divine",
  '_bibles': "Saintes Bibles",
  '_NEI': "NEI",
  '_texte&priere': "Textes & Prières",
  'croixp': "Croix Posées",
  'croixm': "Croix Murales",
  'croix': "Croix Jésus",
  'encens': "Encens",
  'statue': "Statue Religieuse",
  'grotte': "Grotte Religieuse",
  'chapelet': "Chapelet de Prière",
  'divers': "Divers",
  '_divers': "Divers",
}


import { useEffect } from 'react';

export default function AddArticleForm({ onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState({
    nom: '', prix: '', img: '', fr: '',
    auteur: '', taille: '', materiaux: '', autre: '', stock: 5, actif: '1',
    aLaUne: 0,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        nom: initialData.nom || '',
        prix: initialData.prix || '',
        img: initialData.img || '',
        fr: initialData.fr || '',
        auteur: initialData.auteur || '',
        taille: initialData.taille || '',
        materiaux: initialData.materiaux || '',
        autre: initialData.autre || '',
        stock: initialData.stock ?? 5,
        actif: initialData.actif !== undefined ? (initialData.actif ? '1' : '0') : '1',
        aLaUne: initialData.alaune || 0,
        fr1: initialData.fr1 || '',
        user_name: initialData.user_name || '',
      });
    }
  }, [initialData]);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    let next = { ...form, [name]: value };
    const oo = articles_title_table['_'+value] ? 'publication' : 'objet';
    if (name === 'nom') {
      // Déterminer automatiquement le type selon la clé
      next.user_name = articles_title_table['_'+value] ? 'publication' : 'objet';
    }
    setForm(next);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setForm(f => ({ ...f, img: file.name }));
    setUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadError('');
    let imgUrl = form.img;
    // Si imageFile existe, upload d'abord
    if (imageFile) {
      try {
        const folderLabel = articles_img_table[form.nom] || 'divers';
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('folder', folderLabel);
        formData.append('articleNom', form.nom);
        formData.append('originalName', imageFile.name);
        const res = await fetch('/api/upload_ecom', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.url) {
          imgUrl = data.url;
        } else {
          setUploadError(data.error || 'Erreur lors de l\'upload');
          setUploading(false);
          return;
        }
      } catch (err) {
        setUploadError('Erreur lors de l\'upload');
        setUploading(false);
        return;
      }
    }
    setUploading(false);
    // Correction : mappe aLaUne -> alaune pour l'API
    const { aLaUne, ...rest } = form;
    onSubmit({ ...rest, img: imgUrl, alaune: aLaUne });
  };

  return (
    <form className="ecommerce_form_add" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem',maxWidth:400}}>
      {/* {console.log(form)} */}
      <h2>Ajouter un article</h2>
      <input name="fr" placeholder="Titre de l'article" value={form.fr} onChange={handleChange} />
      <label>Catégorie :
        <select name="nom" value={form.nom} onChange={handleChange} required>
          <option value="">Sélectionner une catégorie</option>
          {Object.entries(articles_img_table).map(([key]) => (
            <option key={key} value={key}>
              {articles_title_table[key] || key}
            </option>
          ))}
        </select>
      </label>
      <label>Type d'article :
        <input name="user_name" value={form.user_name === 'publication' ? 'Publication chrétienne' : form.user_name === 'objet' ? 'Objet de piété' : ''} readOnly style={{background:'#f5f5f5',color:'#333',fontWeight:'bold'}} />
      </label>
      {/* Upload image */}
      <label>Image&nbsp;:
        {/* <input id="image_article_add" type="file" name="image" accept="image/*" onChange={handleImageChange} disabled={!form.nom || uploading} /> */}
        <input id="image_article_add" type="file" name="image" accept="image/*" capture="environment" onChange={handleImageChange} disabled={!form.nom || uploading} />

      </label>
      {uploading && <span style={{color:'#6c63ff'}}>Envoi en cours...</span>}
      {uploadError && <span style={{color:'red'}}>{uploadError}</span>}
      {/* Preview temporaire si imageFile */}
      {imageFile && !form.img && (
        <img
          src={URL.createObjectURL(imageFile)}
          alt="aperçu temporaire"
          style={{maxWidth:120,margin:'0 auto',borderRadius:8,opacity:0.7}}
        />
      )}
      {form.img && <img src={form.img} alt="aperçu" style={{maxWidth:120,margin:'0 auto',borderRadius:8}} />}
      {/* Champ texte img désactivé */}
      <input name="img" placeholder="Nom personnalisé de l'image (optionnel)" value={form.img} onChange={handleChange} disabled={uploading||!document.getElementById('image_article_add')?.value} />
      <input name="prix" placeholder="Prix" value={form.prix} onChange={handleChange} required />
      <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
      <input name="auteur" placeholder="Auteur" value={form.auteur} onChange={handleChange} />
      <textarea name="fr1" placeholder="Description détaillée" value={form.fr1||''} onChange={handleChange} />
      <input name="taille" placeholder="Taille" value={form.taille} onChange={handleChange} />
      <input name="materiaux" placeholder="Matériaux" value={form.materiaux} onChange={handleChange} />
      <input name="autre" placeholder="Autre" value={form.autre} onChange={handleChange} />
      <label style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:4}}>
        Date de fin "À la Une" :
        <input
          name="alaune"
          type="datetime-local"
          value={form.aLaUne ? new Date(form.aLaUne).toISOString().slice(0,16) : ''}
          onChange={e => {
            const val = e.target.value;
            setForm(f => ({
              ...f,
              aLaUne: val ? new Date(val).getTime() : 0
            }));
          }}
          style={{maxWidth:220}}
        />
        {form.aLaUne ? <span style={{fontSize:12}}>Fin à la une : {new Date(form.aLaUne).toLocaleString()}</span> : null}
      </label>
      <label>
        Actif :
        <select name="actif" value={form.actif} onChange={handleChange}>
          <option value="1">Oui</option>
          <option value="0">Non</option>
        </select>
      </label>
      <div style={{display:'flex',gap:'1rem'}}>
        <button type="submit">Ajouter</button>
        <button type="button" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}
