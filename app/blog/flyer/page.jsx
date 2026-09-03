"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FLYER_TEMPLATES } from './FlyerTemplates';

export default function FlyerGeneratorPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState('retraite_weekend');
  const [format, setFormat] = useState('story'); // 'story', 'square', 'a4'
  
  const [flyerData, setFlyerData] = useState({
    headerTag: 'SANCTUAIRE NOTRE-DAME DU ROSAIRE DE BOLOBI',
    mainTitle: 'GRANDE RETRAITE SPIRITUELLE',
    subtitle: 'Du Vendredi 15 au Dimanche 17 Septembre 2026',
    description: 'Venez vous ressourcer au cœur de la nature. Temps de prière, confessions, adorations et enseignements spirituels.',
    pricing: 'Formule Repas & Hébergement dès 3 000 FCFA / jour',
    contact: '📞 Infoline & Réservations : 07 09 36 06 72 / 07 79 28 82 93',
    primaryColor: '#c9a84c',
    secondaryColor: '#0f172a',
    bgImageUrl: ''
  });

  const canvasRef = useRef(null);

  // Charger le template sélectionné
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    const tmpl = FLYER_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setFormat(tmpl.format);
      setFlyerData({
        headerTag: tmpl.headerTag,
        mainTitle: tmpl.mainTitle,
        subtitle: tmpl.subtitle,
        description: tmpl.description,
        pricing: tmpl.pricing,
        contact: tmpl.contact,
        primaryColor: tmpl.primaryColor,
        secondaryColor: tmpl.secondaryColor,
        bgImageUrl: tmpl.bgImageUrl || ''
      });
    }
  };

  // Dimensions selon le format
  const getDimensions = () => {
    switch (format) {
      case 'square':
        return { width: 1080, height: 1080 };
      case 'a4':
        return { width: 1240, height: 1754 };
      case 'story':
      default:
        return { width: 1080, height: 1920 };
    }
  };

  // Rendu Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = getDimensions();

    canvas.width = width;
    canvas.height = height;

    // 1. FOND DE CARTE / DÉGRADÉ
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, flyerData.secondaryColor || '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. BORDURES ET MOTIFS DÉCORATIFS
    ctx.strokeStyle = flyerData.primaryColor || '#c9a84c';
    ctx.lineWidth = Math.round(width * 0.015);
    ctx.strokeRect(
      width * 0.04,
      height * 0.025,
      width * 0.92,
      height * 0.95
    );

    // Petit cadre intérieur doré
    ctx.lineWidth = 2;
    ctx.strokeRect(
      width * 0.05,
      height * 0.03,
      width * 0.9,
      height * 0.94
    );

    // 3. SYMBOLE CROIX CHRÉTIENNE OU DÉCORATION EN-TÊTE
    ctx.fillStyle = flyerData.primaryColor;
    const crossX = width / 2;
    const crossY = height * 0.08;
    ctx.fillRect(crossX - 6, crossY - 24, 12, 48); // Vertical
    ctx.fillRect(crossX - 20, crossY - 10, 40, 12); // Horizontal

    // 4. HEADER TAG (SOUSTITRE EN-TÊTE)
    ctx.font = `bold ${Math.round(width * 0.026)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = flyerData.primaryColor;
    ctx.fillText(
      (flyerData.headerTag || '').toUpperCase(),
      width / 2,
      height * 0.14
    );

    // Ligne dorée séparatrice
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.16);
    ctx.lineTo(width * 0.8, height * 0.16);
    ctx.stroke();

    // 5. TITRE PRINCIPAL (AVEC WRAPPING AUTOMATIQUE)
    ctx.font = `900 ${Math.round(width * 0.055)}px Inter, sans-serif`;
    ctx.fillStyle = '#ffffff';
    
    const words = (flyerData.mainTitle || '').split(' ');
    let line = '';
    let currentY = height * 0.23;
    const maxWidth = width * 0.82;
    const lineHeight = width * 0.07;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), width / 2, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), width / 2, currentY);

    // 6. SOUS-TITRE / DATES
    currentY += height * 0.05;
    ctx.font = `bold ${Math.round(width * 0.035)}px Inter, sans-serif`;
    ctx.fillStyle = flyerData.primaryColor;
    ctx.fillText(flyerData.subtitle || '', width / 2, currentY);

    // 7. BLOC DESCRIPTION (CARD CENTRALE)
    currentY += height * 0.05;
    const descCardY = currentY;
    const descCardHeight = height * 0.28;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = flyerData.primaryColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(width * 0.08, descCardY, width * 0.84, descCardHeight, 20);
    ctx.fill();
    ctx.stroke();

    // Texte de description dans le bloc
    ctx.font = `${Math.round(width * 0.03)}px Inter, sans-serif`;
    ctx.fillStyle = '#f8fafc';
    
    const descWords = (flyerData.description || '').split(' ');
    let descLine = '';
    let descY = descCardY + height * 0.06;
    const descMaxWidth = width * 0.76;

    for (let i = 0; i < descWords.length; i++) {
      const testDesc = descLine + descWords[i] + ' ';
      const metrics = ctx.measureText(testDesc);
      if (metrics.width > descMaxWidth && i > 0) {
        ctx.fillText(descLine.trim(), width / 2, descY);
        descLine = descWords[i] + ' ';
        descY += width * 0.045;
      } else {
        descLine = testDesc;
      }
    }
    ctx.fillText(descLine.trim(), width / 2, descY);

    // 8. TARIFICATION / BADGE
    currentY = descCardY + descCardHeight + height * 0.06;
    ctx.fillStyle = flyerData.primaryColor;
    ctx.beginPath();
    ctx.roundRect(width * 0.12, currentY, width * 0.76, height * 0.08, 40);
    ctx.fill();

    ctx.font = `bold ${Math.round(width * 0.032)}px Inter, sans-serif`;
    ctx.fillStyle = '#0f172a';
    ctx.fillText(flyerData.pricing || '', width / 2, currentY + height * 0.05);

    // 9. FOOTER CONTACT
    const footerY = height * 0.91;
    ctx.font = `bold ${Math.round(width * 0.026)}px Inter, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(flyerData.contact || '', width / 2, footerY);

  }, [flyerData, format]);

  // Exporter en PNG HD
  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `Flyer_Sanctuaire_${selectedTemplateId}_${format}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  // Imprimer / PDF
  const handlePrintPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const windowContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Impression Flyer Sanctuaire</title></head>
        <body style="margin:0; display:flex; justify-content:center; align-items:center; background:#f1f5f9; height:100vh;">
          <img src="${dataUrl}" style="max-width:100%; max-height:100vh; object-fit:contain;" />
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(windowContent);
    printWindow.document.close();
  };

  return (
    <div className="flyer-editor-container">
      {/* HEADER SECTION */}
      <div className="flyer-header">
        <div>
          <Link href="/blog" className="back-link">⬅️ Retour au Blog</Link>
          <h1 className="flyer-page-title">🎨 Générateur de Flyers Marketing</h1>
          <p className="flyer-page-subtitle">
            Créez des visuels professionnels pour les retraites, la boutique et les événements en HD.
          </p>
        </div>

        <div className="download-actions">
          <button type="button" className="btn-action btn-action--png" onClick={handleDownloadPNG}>
            📥 Télécharger en PNG HD
          </button>
          <button type="button" className="btn-action btn-action--pdf" onClick={handlePrintPDF}>
            🖨️ Exporter en PDF / Imprimer
          </button>
        </div>
      </div>

      <div className="flyer-main-grid">
        {/* PANNEAU OUTILS (GAUCHE) */}
        <div className="tools-panel">
          <div className="tool-group">
            <label className="tool-label">📋 Choisir un Template Prédéfini :</label>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleSelectTemplate(e.target.value)}
              className="tool-select"
            >
              {FLYER_TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="tool-group">
            <label className="tool-label">📐 Format de Visuel :</label>
            <div className="format-buttons">
              <button
                type="button"
                className={`format-btn ${format === 'story' ? 'active' : ''}`}
                onClick={() => setFormat('story')}
              >
                📱 Story WhatsApp (1080x1920)
              </button>
              <button
                type="button"
                className={`format-btn ${format === 'square' ? 'active' : ''}`}
                onClick={() => setFormat('square')}
              >
                🖼️ Carré Instagram (1080x1080)
              </button>
              <button
                type="button"
                className={`format-btn ${format === 'a4' ? 'active' : ''}`}
                onClick={() => setFormat('a4')}
              >
                📄 Document A4 (1240x1754)
              </button>
            </div>
          </div>

          <hr className="divider" />

          {/* FORMULAIRE DE PERSONNALISATION */}
          <div className="tool-group">
            <label className="tool-label">🏷️ En-tête (Badge haut) :</label>
            <input
              type="text"
              value={flyerData.headerTag}
              onChange={(e) => setFlyerData({ ...flyerData, headerTag: e.target.value })}
              className="tool-input"
            />
          </div>

          <div className="tool-group">
            <label className="tool-label">📌 Titre Principal :</label>
            <input
              type="text"
              value={flyerData.mainTitle}
              onChange={(e) => setFlyerData({ ...flyerData, mainTitle: e.target.value })}
              className="tool-input"
            />
          </div>

          <div className="tool-group">
            <label className="tool-label">📅 Sous-titre / Dates :</label>
            <input
              type="text"
              value={flyerData.subtitle}
              onChange={(e) => setFlyerData({ ...flyerData, subtitle: e.target.value })}
              className="tool-input"
            />
          </div>

          <div className="tool-group">
            <label className="tool-label">📝 Description / Détails :</label>
            <textarea
              rows={3}
              value={flyerData.description}
              onChange={(e) => setFlyerData({ ...flyerData, description: e.target.value })}
              className="tool-textarea"
            />
          </div>

          <div className="tool-group">
            <label className="tool-label">💳 Tarif / Offre Spéciale :</label>
            <input
              type="text"
              value={flyerData.pricing}
              onChange={(e) => setFlyerData({ ...flyerData, pricing: e.target.value })}
              className="tool-input"
            />
          </div>

          <div className="tool-group">
            <label className="tool-label">📞 Infoline & Contact :</label>
            <input
              type="text"
              value={flyerData.contact}
              onChange={(e) => setFlyerData({ ...flyerData, contact: e.target.value })}
              className="tool-input"
            />
          </div>

          <div className="tool-group colors-row">
            <div>
              <label className="tool-label">Couleur Dorée / Accent :</label>
              <input
                type="color"
                value={flyerData.primaryColor}
                onChange={(e) => setFlyerData({ ...flyerData, primaryColor: e.target.value })}
                className="color-picker"
              />
            </div>
            <div>
              <label className="tool-label">Couleur de Fond :</label>
              <input
                type="color"
                value={flyerData.secondaryColor}
                onChange={(e) => setFlyerData({ ...flyerData, secondaryColor: e.target.value })}
                className="color-picker"
              />
            </div>
          </div>
        </div>

        {/* CANVA PREVIEW (DROITE) */}
        <div className="preview-panel">
          <div className="canvas-wrapper">
            <canvas ref={canvasRef} className="flyer-canvas" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .flyer-editor-container {
          max-width: 1320px;
          margin: 30px auto;
          padding: 0 24px;
        }

        .back-link {
          font-size: 0.9rem;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;

          &:hover { text-decoration: underline; }
        }

        .flyer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
          background: #ffffff;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.06);
        }

        .flyer-page-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: #0f172a;
          margin: 6px 0 4px 0;
        }

        .flyer-page-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0;
        }

        .download-actions {
          display: flex;
          gap: 12px;
        }

        .btn-action {
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;

          &--png {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);

            &:hover { transform: translateY(-2px); }
          }

          &--pdf {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);

            &:hover { transform: translateY(-2px); }
          }
        }

        .flyer-main-grid {
          display: grid;
          grid-template-columns: 460px 1fr;
          gap: 30px;

          @media (max-width: 1024px) {
            grid-template-columns: 1fr;
          }
        }

        .tools-panel {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tool-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tool-label {
          font-size: 0.85rem;
          font-weight: 800;
          color: #334155;
        }

        .tool-select, .tool-input, .tool-textarea {
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 0.92rem;
          font-weight: 600;

          &:focus {
            outline: none;
            border-color: #2563eb;
          }
        }

        .format-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .format-btn {
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          padding: 10px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          text-align: left;

          &.active {
            background: #e0e7ff;
            border-color: #4338ca;
            color: #4338ca;
          }
        }

        .divider {
          border: none;
          border-top: 1px solid #f1f5f9;
          margin: 8px 0;
        }

        .colors-row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .color-picker {
          width: 50px;
          height: 40px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .preview-panel {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: #0f172a;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 36px rgba(0,0,0,0.15);
        }

        .canvas-wrapper {
          max-width: 100%;
          max-height: 800px;
          display: flex;
          justify-content: center;
        }

        .flyer-canvas {
          max-width: 100%;
          max-height: 750px;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
