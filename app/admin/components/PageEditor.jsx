"use client"
import React, { useState, useEffect } from 'react';

const PAGES = [
  { id: 'home', label: "🏠 Page d'Accueil Publique" },
  { id: 'sanctuaire', label: "⛪ Page Retraites Spirituelles" },
  { id: 'blog', label: "📰 Page Blog & Enseignements" },
  { id: 'ecommerce', label: "🛍️ Page Boutique Officielle" },
];

export default function PageEditor() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    pageId: 'home',
    titre: '',
    sousTitre: '',
    slogan: '',
    logo: '',
    heroImage: '',
    paragraphes: [],
    metaTitle: '',
    metaDescription: '',
    couleurPrincipale: '#c9a84c',
    couleurSecondaire: '#1a2332'
  });

  // Charger la configuration de la page sélectionnée
  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/page_config?pageId=${selectedPage}`);
        if (!res.ok) throw new Error('Erreur de chargement de la configuration');
        const data = await res.json();
        setFormData({
          pageId: data.pageId || selectedPage,
          titre: data.titre || '',
          sousTitre: data.sousTitre || '',
          slogan: data.slogan || '',
          logo: data.logo || '',
          heroImage: data.heroImage || '',
          paragraphes: data.paragraphes || [],
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          couleurPrincipale: data.couleurPrincipale || '#c9a84c',
          couleurSecondaire: data.couleurSecondaire || '#1a2332'
        });
      } catch (err) {
        console.error(err);
        setErrorMsg('Impossible de charger les données de la page.');
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, [selectedPage]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Gestion des paragraphes
  const handleParagraphChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.paragraphes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, paragraphes: updated };
    });
  };

  const handleAddParagraph = () => {
    setFormData(prev => ({
      ...prev,
      paragraphes: [
        ...prev.paragraphes,
        {
          ordre: prev.paragraphes.length + 1,
          titre: 'Nouveau Paragraphe',
          contenu: 'Entrez le texte de votre paragraphe ici...',
          image: ''
        }
      ]
    }));
  };

  const handleRemoveParagraph = (index) => {
    setFormData(prev => ({
      ...prev,
      paragraphes: prev.paragraphes.filter((_, i) => i !== index)
    }));
  };

  const handleMoveParagraph = (index, direction) => {
    setFormData(prev => {
      const updated = [...prev.paragraphes];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, paragraphes: updated };
    });
  };

  // Sauvegarde
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/page_config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Échec de la sauvegarde');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur lors de la sauvegarde de la page.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-editor-container">
      {/* HEADER SECTION */}
      <div className="editor-header">
        <div className="editor-title-wrap">
          <span className="editor-icon">🎨</span>
          <div>
            <h2 className="editor-title">CMS — Personnalisation des Pages Publiques</h2>
            <p className="editor-subtitle">
              Modifiez les titres, slogans, bannières et paragraphes sans toucher au code.
            </p>
          </div>
        </div>

        {/* SELECTEUR DE PAGE */}
        <div className="page-selector-box">
          <label htmlFor="page-select">Sélectionner la page à éditer :</label>
          <select
            id="page-select"
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="page-select-dropdown"
          >
            {PAGES.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="editor-loading">⏳ Chargement de la configuration...</div>
      ) : (
        <div className="editor-grid">
          {/* ÉDITEUR (COLONNE GAUCHE) */}
          <form className="editor-form-col" onSubmit={handleSubmit}>
            <div className="editor-section">
              <h3 className="section-title">📌 Informations Générales & Slogan</h3>
              <div className="form-group">
                <label>Titre de la page :</label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => handleChange('titre', e.target.value)}
                  placeholder="Ex: SANCTUAIRE NOTRE-DAME DU ROSAIRE"
                />
              </div>

              <div className="form-group">
                <label>Sous-titre / En-tête :</label>
                <input
                  type="text"
                  value={formData.sousTitre}
                  onChange={(e) => handleChange('sousTitre', e.target.value)}
                  placeholder="Ex: HAVRE DE PAIX ET DE PRIÈRE À ADZOPÉ"
                />
              </div>

              <div className="form-group">
                <label>Slogan ou Citation Biblique :</label>
                <textarea
                  rows={2}
                  value={formData.slogan}
                  onChange={(e) => handleChange('slogan', e.target.value)}
                  placeholder="Ex: « Venez à moi, vous tous qui meinez... »"
                />
              </div>
            </div>

            <div className="editor-section">
              <h3 className="section-title">🖼️ Visuels & Logos</h3>
              <div className="form-group">
                <label>URL du Logo :</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => handleChange('logo', e.target.value)}
                  placeholder="/images/logo-sanctuaire.png"
                />
              </div>

              <div className="form-group">
                <label>URL de l'Image Bannière (Hero Image) :</label>
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => handleChange('heroImage', e.target.value)}
                  placeholder="/images/hero-bolobi.jpg"
                />
              </div>
            </div>

            <div className="editor-section">
              <h3 className="section-title">📑 Paragraphes & Contenus Riches</h3>
              {formData.paragraphes.map((p, idx) => (
                <div key={idx} className="paragraph-card">
                  <div className="paragraph-card-header">
                    <span className="p-num">Paragraphe {idx + 1}</span>
                    <div className="p-actions">
                      <button
                        type="button"
                        onClick={() => handleMoveParagraph(idx, -1)}
                        disabled={idx === 0}
                        title="Monter"
                      >
                        ⬆️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveParagraph(idx, 1)}
                        disabled={idx === formData.paragraphes.length - 1}
                        title="Descendre"
                      >
                        ⬇️
                      </button>
                      <button
                        type="button"
                        className="btn-del"
                        onClick={() => handleRemoveParagraph(idx)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Titre du paragraphe :</label>
                    <input
                      type="text"
                      value={p.titre}
                      onChange={(e) => handleParagraphChange(idx, 'titre', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Contenu :</label>
                    <textarea
                      rows={3}
                      value={p.contenu}
                      onChange={(e) => handleParagraphChange(idx, 'contenu', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Image d'illustration (optionnelle) :</label>
                    <input
                      type="text"
                      value={p.image || ''}
                      onChange={(e) => handleParagraphChange(idx, 'image', e.target.value)}
                      placeholder="/images/sanctuaire-vue.jpg"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="add-paragraph-btn"
                onClick={handleAddParagraph}
              >
                ➕ Ajouter un paragraphe
              </button>
            </div>

            <div className="editor-section">
              <h3 className="section-title">🎨 Thème de Couleurs & Référencement (SEO)</h3>
              <div className="color-inputs-grid">
                <div className="form-group">
                  <label>Couleur Principale :</label>
                  <div className="color-picker-wrap">
                    <input
                      type="color"
                      value={formData.couleurPrincipale}
                      onChange={(e) => handleChange('couleurPrincipale', e.target.value)}
                    />
                    <span>{formData.couleurPrincipale}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Couleur Secondaire :</label>
                  <div className="color-picker-wrap">
                    <input
                      type="color"
                      value={formData.couleurSecondaire}
                      onChange={(e) => handleChange('couleurSecondaire', e.target.value)}
                    />
                    <span>{formData.couleurSecondaire}</span>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 12 }}>
                <label>Titre de balise SEO (Meta Title) :</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description SEO (Meta Description) :</label>
                <textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                />
              </div>
            </div>

            {errorMsg && <div className="editor-alert editor-alert--error">{errorMsg}</div>}
            {saveSuccess && <div className="editor-alert editor-alert--success">✅ Page sauvegardée avec succès !</div>}

            <div className="save-btn-bar">
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? '⏳ Enregistrement...' : '💾 Sauvegarder la Page'}
              </button>
            </div>
          </form>

          {/* APERÇU EN DIRECT (COLONNE DROITE) */}
          <div className="preview-col">
            <div className="preview-header">
              <span>👁️ Aperçu en direct du rendu</span>
            </div>

            <div className="preview-mockup" style={{ borderColor: formData.couleurPrincipale }}>
              <div className="mockup-banner" style={{ background: formData.couleurSecondaire }}>
                <div className="mockup-logo-area">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="mockup-logo-img" />
                  ) : (
                    <span className="mockup-logo-placeholder" style={{ color: formData.couleurPrincipale }}>
                      ⛪ [LOGO]
                    </span>
                  )}
                </div>
                <div className="mockup-hero-text">
                  <h4 style={{ color: formData.couleurPrincipale }}>{formData.sousTitre || "SOUS-TITRE"}</h4>
                  <h3>{formData.titre || "TITRE DE LA PAGE"}</h3>
                  <p className="mockup-slogan"><em>{formData.slogan || "Slogan de la page..."}</em></p>
                </div>
              </div>

              {formData.heroImage && (
                <div className="mockup-hero-img-wrap">
                  <img src={formData.heroImage} alt="Hero Banner" />
                </div>
              )}

              <div className="mockup-body">
                {formData.paragraphes.map((p, idx) => (
                  <div key={idx} className="mockup-paragraph">
                    <h5 style={{ color: formData.couleurPrincipale }}>{p.titre}</h5>
                    <p>{p.contenu}</p>
                    {p.image && <img src={p.image} alt="Illustration" className="mockup-p-img" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-editor-container {
          background: #ffffff;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
          border: 1px solid #e2e8f0;
          margin-top: 24px;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f1f5f9;
          margin-bottom: 24px;
        }

        .editor-title-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .editor-icon {
          font-size: 2rem;
        }

        .editor-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
        }

        .editor-subtitle {
          font-size: 0.88rem;
          color: #64748b;
          margin: 2px 0 0 0;
        }

        .page-selector-box {
          display: flex;
          align-items: center;
          gap: 10px;

          label {
            font-size: 0.85rem;
            font-weight: 700;
            color: #334155;
          }
        }

        .page-select-dropdown {
          background: #f8fafc;
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 0.95rem;
          font-weight: 800;
          color: #1e293b;
          cursor: pointer;

          &:focus {
            outline: none;
            border-color: #2563eb;
          }
        }

        .editor-loading {
          padding: 40px;
          text-align: center;
          font-weight: 700;
          color: #64748b;
        }

        .editor-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 24px;

          @media (max-width: 1024px) {
            grid-template-columns: 1fr;
          }
        }

        .editor-form-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .editor-section {
          background: #f8fafc;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 14px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;

          label {
            font-size: 0.82rem;
            font-weight: 800;
            color: #475569;
          }

          input[type="text"], textarea {
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 0.92rem;
            font-weight: 600;
            background: #ffffff;

            &:focus {
              outline: none;
              border-color: #2563eb;
            }
          }
        }

        .paragraph-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 14px;
          border: 1px solid #cbd5e1;
          margin-bottom: 12px;
        }

        .paragraph-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .p-num {
          font-size: 0.8rem;
          font-weight: 800;
          color: #2563eb;
          text-transform: uppercase;
        }

        .p-actions {
          display: flex;
          gap: 6px;

          button {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 4px 8px;
            cursor: pointer;

            &:disabled { opacity: 0.4; cursor: not-allowed; }
          }

          .btn-del {
            background: #fef2f2;
            border-color: #fecaca;
          }
        }

        .add-paragraph-btn {
          width: 100%;
          background: #ffffff;
          border: 2px dashed #94a3b8;
          color: #334155;
          padding: 10px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;

          &:hover {
            border-color: #2563eb;
            color: #2563eb;
          }
        }

        .color-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .color-picker-wrap {
          display: flex;
          align-items: center;
          gap: 10px;

          input[type="color"] {
            width: 42px;
            height: 42px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }

          span {
            font-size: 0.88rem;
            font-weight: 700;
            color: #334155;
          }
        }

        .editor-alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-weight: 700;

          &--error { background: #fef2f2; color: #b91c1c; }
          &--success { background: #f0fdf4; color: #15803d; }
        }

        .save-btn-bar {
          margin-top: 10px;
        }

        .save-btn {
          width: 100%;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 14px;
          font-size: 1.1rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
          }
        }

        /* APERÇU DROITE */
        .preview-col {
          position: sticky;
          top: 24px;
          height: fit-content;
        }

        .preview-header {
          font-size: 0.85rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .preview-mockup {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 3px solid #cbd5e1;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .mockup-banner {
          padding: 24px 18px;
          color: white;
          text-align: center;
        }

        .mockup-logo-img {
          height: 48px;
          margin-bottom: 8px;
        }

        .mockup-logo-placeholder {
          font-size: 1.2rem;
          font-weight: 900;
        }

        .mockup-hero-text {
          h4 { font-size: 0.75rem; letter-spacing: 1px; margin: 0 0 4px 0; }
          h3 { font-size: 1.1rem; font-weight: 900; margin: 0 0 6px 0; }
          .mockup-slogan { font-size: 0.8rem; opacity: 0.9; margin: 0; }
        }

        .mockup-hero-img-wrap {
          height: 140px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .mockup-body {
          padding: 16px;
        }

        .mockup-paragraph {
          margin-bottom: 14px;

          h5 { font-size: 0.9rem; font-weight: 800; margin: 0 0 4px 0; }
          p { font-size: 0.82rem; color: #475569; margin: 0 0 6px 0; line-height: 1.4; }
          .mockup-p-img { width: 100%; border-radius: 8px; height: 100px; object-fit: cover; }
        }
      `}</style>
    </div>
  );
}
