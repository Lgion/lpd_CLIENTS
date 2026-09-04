"use client"
import React, { useState, useEffect, useRef } from 'react';

const QUESTIONS = [
  {
    id: 'names',
    question: "Bonjour et bienvenue au Sanctuaire Notre-Dame de Bolobi ! Notez que cette réservation vocale est une estimation préalable. La facture finale sera confirmée ultérieurement par notre équipe. Pour commencer, quel est votre prénom et votre nom ?",
    label: "👤 Nom complet",
    placeholder: "Ex: Houphouët Boigny Alexandre",
    suggestions: ["Houphouët Boigny Alexandre", "Jean-Baptiste Kouassi", "Marie-Claire Diallo"],
    getConfirmation: (val) => `Enchanté ${val} !`
  },
  {
    id: 'purpose',
    question: "Quel est l'objet de votre réservation ? Choisissez parmi les 6 options : Retraite de groupe, Retraite ponctuelle, Retraite de prière individuelle, Célébration, Séjour/Repos/Vacances, ou Autre motif ?",
    label: "🙏 Objet du séjour (6 types)",
    placeholder: "Ex: Retraite de groupe",
    suggestions: [
      "Retraite de groupe",
      "Retraite ponctuelle",
      "Retraite de prière individuelle",
      "Célébration",
      "Séjour / Repos / Vacances",
      "Autre motif"
    ],
    getConfirmation: (val) => `C'est noté pour ${val}.`
  },
  {
    id: 'community',
    question: "De quelle communauté, paroisse ou groupe faites-vous partie ?",
    label: "⛪ Communauté / Paroisse",
    placeholder: "Ex: Communauté Divin Amour",
    suggestions: ["Communauté Divin Amour", "Paroisse Saint-Jean", "Renouveau Charismatique", "Individuel / Famille"],
    getConfirmation: (val) => `C'est bien noté pour la communauté ${val}.`
  },
  {
    id: 'phone',
    question: "Quel est votre numéro de téléphone pour vous recontacter ?",
    label: "📞 Numéro de téléphone",
    placeholder: "Ex: 07 09 36 06 72",
    suggestions: ["07 09 36 06 72", "01 02 03 04 05", "05 06 07 08 09"],
    getConfirmation: (val) => `Numéro de téléphone bien enregistré.`
  },
  {
    id: 'participants',
    question: "Donnez-nous une estimation du nombre de pèlerins pour ce séjour ? Pour rappel, nous disposons d'une capacité d'accueil allant de 220 à 250 places d'hébergement.",
    label: "👥 Estimation pèlerins (capacité : 220 à 250 places)",
    placeholder: "Ex: Environ 35 pèlerins",
    suggestions: ["1 pèlerin (Seul)", "15 pèlerins", "35 pèlerins", "100 pèlerins", "200 pèlerins"],
    getConfirmation: (val) => `Très bien, estimation retenue : ${val}.`
  },
  {
    id: 'individualRooms',
    question: "Combien de chambres individuelles souhaitez-vous réserver ? Pour information, le tarif est de 10 000 FCFA par nuit pour une chambre individuelle, contre 3 000 FCFA par nuit en dortoir. Notez que les pèlerins doivent obligatoirement venir avec leurs propres draps, oreillers et effets personnels.",
    label: "🛏️ Chambres individuelles (10 000 F / nuit | Draps à apporter)",
    placeholder: "Ex: 5 chambres individuelles",
    suggestions: ["0 chambre (Dortoir 3 000 F)", "2 chambres individuelles", "5 chambres individuelles", "10 chambres individuelles"],
    getConfirmation: (val) => `Compris pour ${val}.`
  },
  {
    id: 'dates',
    question: "Quelles sont vos dates souhaitées d'arrivée et de départ ?",
    label: "📅 Dates du séjour",
    placeholder: "Ex: Du 2 au 5 mai 2026",
    suggestions: ["Ce weekend (Vendredi au Dimanche)", "Du 2 au 5 Mai 2026", "Du 10 au 15 Septembre 2026"],
    getConfirmation: (val) => `C'est bien compris pour le séjour ${val}.`
  },
  {
    id: 'mealPlan',
    question: "Enfin, quel forfait repas désirez-vous ? Pour information, le tarif est de 3 000 FCFA pour 2 repas avec petit déjeuner, ou 1 500 FCFA pour 1 repas par jour, ou vous pouvez choisir sans repas.",
    label: "🍽️ Forfait Repas (3 000 F les 2 repas + petit déj / 1 500 F le repas)",
    placeholder: "Ex: Forfait 2 repas par jour (3000 F)",
    suggestions: ["Forfait 2 repas + petit déj (3 000 F)", "Forfait 1 repas (1 500 F)", "Sans repas"],
    getConfirmation: (val) => `Forfait ${val} retenu.`
  }
];

export default function VoiceReservationSection({ onVoiceSuccess }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [conversationFeed, setConversationFeed] = useState([]);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);

  const [formData, setFormData] = useState({
    names: '',
    purpose: '',
    community: '',
    phone: '',
    participants: '',
    individualRooms: '',
    dates: '',
    mealPlan: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const longSilenceTimerRef = useRef(null);
  const currentStepRef = useRef(0);
  const userAnswerRef = useRef('');
  const conversationFeedRef = useRef([]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    userAnswerRef.current = userAnswer;
  }, [userAnswer]);

  useEffect(() => {
    conversationFeedRef.current = conversationFeed;
  }, [conversationFeed]);

  useEffect(() => {
    return () => {
      clearSilenceTimers();
    };
  }, []);

  const clearSilenceTimers = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (longSilenceTimerRef.current) clearTimeout(longSilenceTimerRef.current);
  };

  // Initialisation SpeechRecognition (STT)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'fr-FR';

        rec.onresult = (event) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript + ' ';
          }
          let cleanText = fullTranscript.trim();

          const aiPhrasesToStrip = [
            /avez-vous (terminé|fini) de répondre \??/gi,
            /bonjour et bienvenue au sanctuaire/gi,
            /sachez que cette réservation vocale/gi,
            /la facture finale sera confirmée/gi,
            /quel est votre prénom et votre nom \??/gi,
            /quel est l'objet de votre séjour/gi,
            /est-ce pour une retraite/gi,
            /de quelle communauté, paroisse/gi,
            /quel est votre numéro de téléphone/gi,
            /combien de pèlerins/gi,
            /combien de chambres individuelles/gi,
            /quelles sont vos dates/gi,
            /quel forfait repas/gi,
            /enchanté/gi,
            /c'est bien noté/gi,
            /numéro de téléphone bien enregistré/gi,
            /très bien/gi,
            /compris pour/gi,
            /forfait .* retenu/gi,
            /aucun effet de literie/gi,
            /draps, oreillers/gi,
            /effets personnels/gi
          ];

          aiPhrasesToStrip.forEach(pattern => {
            cleanText = cleanText.replace(pattern, '');
          });
          cleanText = cleanText.replace(/\s+/g, ' ').trim();

          setUserAnswer(cleanText);
          clearSilenceTimers();

          if (cleanText.length > 0) {
            silenceTimerRef.current = setTimeout(() => {
              handleAutoAdvance(cleanText);
            }, 2500);
          }
        };

        rec.onerror = (err) => {
          console.error('Erreur STT:', err);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Fonction TTS
  const speakText = (text, callback) => {
    clearSilenceTimers();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsAiSpeaking(false);
        if (callback) callback();
      };

      utterance.onerror = (err) => {
        console.error('Erreur TTS:', err);
        setIsAiSpeaking(false);
        if (callback) callback();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      if (callback) callback();
    }
  };

  // Démarrage écoute
  const startListening = () => {
    if (recognitionRef.current) {
      setUserAnswer('');
      clearSilenceTimers();

      try {
        recognitionRef.current.start();
        setIsListening(true);

        longSilenceTimerRef.current = setTimeout(() => {
          if (!userAnswerRef.current.trim() && currentStepRef.current < QUESTIONS.length) {
            speakText("Avez-vous terminé de répondre ?", () => {
              startListening();
            });
          }
        }, 7000);

      } catch (err) {
        console.error('Erreur ouverture micro:', err);
      }
    }
  };

  const stopListening = () => {
    clearSilenceTimers();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }
  };

  const handleAutoAdvance = (capturedAnswer) => {
    stopListening();
    const stepIdx = currentStepRef.current;
    if (stepIdx >= QUESTIONS.length) return;

    const currentQ = QUESTIONS[stepIdx];
    const finalAnswer = (capturedAnswer || userAnswerRef.current).trim() || 'Non précisé';

    setFormData(prev => ({ ...prev, [currentQ.id]: finalAnswer }));

    const newFeed = [
      ...conversationFeedRef.current,
      { sender: 'user', text: finalAnswer, fieldId: currentQ.id }
    ];

    const nextIndex = stepIdx + 1;
    const confirmationSpeech = currentQ.getConfirmation(finalAnswer);

    if (nextIndex < QUESTIONS.length) {
      const nextQ = QUESTIONS[nextIndex];
      setCurrentStep(nextIndex);
      setUserAnswer('');

      const fullSpeech = `${confirmationSpeech} ${nextQ.question}`;
      
      const updatedFeed = [
        ...newFeed,
        { sender: 'ai', text: nextQ.question, label: nextQ.label, confirmation: confirmationSpeech }
      ];
      setConversationFeed(updatedFeed);

      speakText(fullSpeech, () => {
        startListening();
      });
    } else {
      setCurrentStep(QUESTIONS.length);
      setConversationFeed(newFeed);
      setIsQuestionnaireCompleted(true);

      const concludingMessage = `${confirmationSpeech} Parfait ! J'ai synthétisé l'ensemble de vos informations ci-dessous. Vous pouvez ajuster vos données au clavier si besoin, puis cliquer sur le bouton 'Envoyer ma réservation' pour valider.`;
      
      speakText(concludingMessage);
    }
  };

  const handleStartQuestionnaire = () => {
    setIsActive(true);
    setCurrentStep(0);
    setConversationFeed([]);
    setIsQuestionnaireCompleted(false);
    setSuccessMsg(null);
    setErrorMsg(null);

    const firstQ = QUESTIONS[0];
    setConversationFeed([{ sender: 'ai', text: firstQ.question, label: firstQ.label }]);

    speakText(firstQ.question, () => {
      startListening();
    });
  };

  const handleManualNext = () => {
    handleAutoAdvance(userAnswer);
  };

  const handleFieldChange = (fieldId, newValue) => {
    setFormData(prev => ({ ...prev, [fieldId]: newValue }));
  };

  // Envoi final exclusivement sur clic utilisateur
  const handleUserSubmitReservation = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const summaryText = `
[RÉSUMÉ RECTIFIÉ & SYNTHÉTISÉ PAR L'IA (ESTIMATION PRÉALABLE)]
- Nom du pèlerin : ${formData.names || 'Non précisé'}
- Objet du séjour : ${formData.purpose || 'Non précisé'}
- Communauté / Paroisse : ${formData.community || 'Non précisée'}
- Numéro de téléphone : ${formData.phone || 'Non précisé'}
- Estimation du nombre de pèlerins : ${formData.participants || '1'} (Capacité totale 220-250)
- Chambres individuelles (10 000 F/nuit - Draps à apporter) : ${formData.individualRooms || '0'}
- Dates du séjour : ${formData.dates || 'Non précisées'}
- Forfait Repas choisi : ${formData.mealPlan || 'Non précisé'}

[TRANSCRIPTION COMPLÈTE DU DIALOGUE VOCAL]
${conversationFeed.map(item => `${item.sender === 'ai' ? '🤖 IA' : '👤 Pèlerin'} : ${item.text}`).join('\n')}
    `.trim();

    try {
      const res = await fetch('/api/voice_reservation_email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: summaryText })
      });

      const resData = await res.json();
      if (resData.success) {
        setSuccessMsg(resData.message || "Votre estimation de réservation a été transmise avec succès aux administrateurs !");
        if (onVoiceSuccess) onVoiceSuccess(resData.reservation);
      } else {
        setErrorMsg(resData.message || "Une erreur est survenue lors de l'envoi.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erreur réseau lors de la soumission de la réservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    stopListening();
    setIsActive(false);
    setIsAiSpeaking(false);
    setIsQuestionnaireCompleted(false);
    setCurrentStep(0);
    setConversationFeed([]);
    setUserAnswer('');
  };

  return (
    <div className="voice-reservation-container">
      {/* HEADER SECTION */}
      <div className="voice-header-card">
        <div className="voice-badge">🤖 ASSISTANT VOCAL IA INTEL</div>
        <h3 className="voice-title">🎙️ Questionnaire Vocal Interactif (Estimation)</h3>
        <p className="voice-desc">
          L'IA vous guide à voix haute (motif du séjour parmi les 6 options, tarifs repas 3 000 F / 1 500 F, chambres 10 000 F, draps à apporter, effectif). La facture finale sera confirmée ultérieurement par l'équipe administrative.
        </p>
      </div>

      {/* BOUTON PRINCIPAL D'ACTION */}
      <div className="main-action-bar">
        {!isActive ? (
          <button
            type="button"
            className="start-quest-btn"
            onClick={handleStartQuestionnaire}
          >
            <span className="btn-icon">🎙️</span>
            <span className="btn-text">Commencer le questionnaire vocal</span>
          </button>
        ) : (
          <div className="status-controls">
            <button
              type="button"
              className="stop-quest-btn"
              onClick={handleReset}
            >
              ⏹️ Arrêter / Recommencer
            </button>
          </div>
        )}
      </div>

      {/* MANGA CARDS */}
      {!isActive && (
        <div className="manga-section">
          <h4 className="manga-section-title">🗯️ Exemples de réponses :</h4>
          <div className="manga-grid">
            <div className="manga-card manga-card--blue">
              <div className="manga-avatar">👨🏽‍💼</div>
              <div className="manga-bubble">
                <span className="bubble-quote">“</span>
                Je m'appelle <strong>Houphouët Boigny Alexandre</strong>, pour une <strong>Retraite de groupe</strong>.
              </div>
            </div>
            <div className="manga-card manga-card--purple">
              <div className="manga-avatar">👨‍👩‍👧‍👦</div>
              <div className="manga-bubble">
                <span className="bubble-quote">“</span>
                Nous estimons être <strong>35 pèlerins</strong> pour cette retraite.
              </div>
            </div>
            <div className="manga-card manga-card--emerald">
              <div className="manga-avatar">🛏️</div>
              <div className="manga-bubble">
                <span className="bubble-quote">“</span>
                Nous voulons <strong>5 chambres individuelles</strong> (10 000 F/nuit, draps apportés).
              </div>
            </div>
            <div className="manga-card manga-card--amber">
              <div className="manga-avatar">🍽️</div>
              <div className="manga-bubble">
                <span className="bubble-quote">“</span>
                Pour 2 repas par jour à <strong>3 000 FCFA</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZONE INTERACTIVE CHAT & RÉSUMÉ CONDENSÉ */}
      {isActive && (
        <div className="interactive-chat-zone">
          {/* BARRE D'ÉTAT */}
          <div className="agent-status-card">
            {isAiSpeaking && (
              <div className="status-indicator status-indicator--speaking">
                🔊 <strong>L'Assistant IA vous parle... Écoutez la question !</strong>
              </div>
            )}

            {isListening && (
              <div className="status-indicator status-indicator--listening">
                🔴 <strong>À vous ! Parlez ou modifiez n'importe quelle réponse au clavier...</strong>
              </div>
            )}

            {!isAiSpeaking && !isListening && currentStep < QUESTIONS.length && (
              <div className="status-indicator status-indicator--ready">
                ⚙️ Enregistrement de votre réponse...
              </div>
            )}

            {isQuestionnaireCompleted && (
              <div className="status-indicator status-indicator--completed">
                ✅ <strong>Questionnaire Terminé ! Résumé condensé prêt ci-dessous.</strong>
              </div>
            )}
          </div>

          {/* CHAT FEED AVEC ÉDITION RETROACTIVE AU CLAVIER */}
          <div className="chat-feed">
            {conversationFeed.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble-row ${msg.sender === 'ai' ? 'chat-bubble-row--ai' : 'chat-bubble-row--user'}`}
              >
                <div className="chat-avatar">{msg.sender === 'ai' ? '🤖' : '👤'}</div>
                <div className="chat-content">
                  {msg.confirmation && (
                    <div className="chat-confirmation-badge">
                      ✨ {msg.confirmation}
                    </div>
                  )}
                  {msg.label && <div className="chat-label">{msg.label}</div>}

                  {msg.sender === 'user' ? (
                    <div className="chat-bubble-user-editable">
                      <div className="editable-subtext">✏️ Modifiable au clavier à tout moment :</div>
                      <input
                        type="text"
                        className="chat-editable-input"
                        value={msg.fieldId && formData[msg.fieldId] !== undefined ? formData[msg.fieldId] : msg.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (msg.fieldId) {
                            handleFieldChange(msg.fieldId, val);
                          }
                          const updatedFeed = [...conversationFeed];
                          updatedFeed[index].text = val;
                          setConversationFeed(updatedFeed);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="chat-text">{msg.text}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* TRANSCRIPTION EN DIRECT & PUCES DE SUGGESTIONS PAR QUESTION */}
          {currentStep < QUESTIONS.length && (
            <div className="current-step-box">
              <div className="step-label">
                Étape {currentStep + 1} / {QUESTIONS.length} : {QUESTIONS[currentStep].label}
              </div>

              <div className="live-accumulated-block">
                <span className="live-icon">🗣️</span>
                <span className="live-text">
                  {userAnswer ? `"${userAnswer}"` : "En attente de votre réponse orale ou sélection..."}
                </span>
              </div>

              {/* PUCES / CHIPS DE SUGGESTIONS RAPIDES */}
              {QUESTIONS[currentStep].suggestions && (
                <div className="suggestions-zone">
                  <div className="suggestions-title">💡 Propositions de réponses rapides pour cette question :</div>
                  <div className="suggestions-chips">
                    {QUESTIONS[currentStep].suggestions.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        className="suggestion-chip-btn"
                        onClick={() => {
                          setUserAnswer(suggestion);
                          handleAutoAdvance(suggestion);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="answer-input-group" style={{ marginTop: 14 }}>
                <input
                  type="text"
                  className="step-answer-input"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={QUESTIONS[currentStep].placeholder}
                />
                <button
                  type="button"
                  className="next-step-btn"
                  onClick={handleManualNext}
                >
                  Valider ➡️
                </button>
              </div>
            </div>
          )}

          {/* RÉSUMÉ CONDENSÉ ET RECTIFIÉ PAR L'IA + ÉDITION CLAVIER */}
          {isQuestionnaireCompleted && (
            <div className="recap-card">
              <div className="recap-header">
                <span className="recap-icon">📋</span>
                <h4 className="recap-title">Résumé Condensé (Estimation Préalable)</h4>
              </div>
              <p className="recap-subtext">
                Vous pouvez modifier n'importe quelle valeur au clavier avant d'envoyer la demande d'estimation :
              </p>

              <div className="recap-form-grid">
                <div className="recap-field">
                  <label>👤 Nom complet :</label>
                  <input
                    type="text"
                    value={formData.names}
                    onChange={(e) => handleFieldChange('names', e.target.value)}
                  />
                </div>

                <div className="recap-field">
                  <label>🙏 Objet du séjour (6 types) :</label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) => handleFieldChange('purpose', e.target.value)}
                  />
                </div>

                <div className="recap-field">
                  <label>⛪ Communauté / Paroisse :</label>
                  <input
                    type="text"
                    value={formData.community}
                    onChange={(e) => handleFieldChange('community', e.target.value)}
                  />
                </div>

                <div className="recap-field">
                  <label>📞 Téléphone :</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                  />
                </div>

                <div className="recap-field">
                  <label>👥 Estimation nombre pèlerins (max 220-250) :</label>
                  <input
                    type="text"
                    value={formData.participants}
                    onChange={(e) => handleFieldChange('participants', e.target.value)}
                  />
                </div>

                <div className="recap-field">
                  <label>🛏️ Chambres individuelles (10 000 F / nuit | Draps à prévoir) :</label>
                  <input
                    type="text"
                    value={formData.individualRooms}
                    onChange={(e) => handleFieldChange('individualRooms', e.target.value)}
                  />
                </div>

                <div className="recap-field">
                  <label>📅 Dates du séjour :</label>
                  <input
                    type="text"
                    value={formData.dates}
                    onChange={(e) => handleFieldChange('dates', e.target.value)}
                  />
                </div>

                <div className="recap-field recap-field--full">
                  <label>🍽️ Forfait Repas choisi :</label>
                  <input
                    type="text"
                    value={formData.mealPlan}
                    onChange={(e) => handleFieldChange('mealPlan', e.target.value)}
                  />
                </div>
              </div>

              {/* BOUTON EXCLUSIF DE VALIDATION */}
              <div className="final-submit-zone">
                <button
                  type="button"
                  className="final-submit-btn"
                  disabled={isSubmitting}
                  onClick={handleUserSubmitReservation}
                >
                  {isSubmitting ? '⏳ Transmission de l\'estimation...' : '🚀 Envoyer ma réservation par Voix'}
                </button>
              </div>
            </div>
          )}

          {errorMsg && <div className="voice-alert voice-alert--error">{errorMsg}</div>}
          {successMsg && <div className="voice-alert voice-alert--success">✅ {successMsg}</div>}

        </div>
      )}

      <style jsx>{`
        .voice-reservation-container {
          background: #ffffff;
          border-radius: 28px;
          padding: 32px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
          border: 2px solid #e2e8f0;
          margin: 24px 0;
          animation: fadeIn 0.4s ease-out;
        }

        .voice-header-card {
          text-align: center;
          margin-bottom: 24px;
        }

        .voice-badge {
          display: inline-block;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 6px 16px;
          border-radius: 20px;
          letter-spacing: 0.8px;
          margin-bottom: 10px;
        }

        .voice-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: #0f172a;
          margin: 4px 0 8px 0;
        }

        .voice-desc {
          font-size: 0.95rem;
          color: #64748b;
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .main-action-bar {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }

        .start-quest-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 18px 40px;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.35);

          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 32px rgba(37, 99, 235, 0.45);
          }
        }

        .btn-icon {
          font-size: 1.6rem;
        }

        .stop-quest-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          font-weight: 700;
          cursor: pointer;
        }

        .manga-section {
          background: #f8fafc;
          border: 2px dashed #94a3b8;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 28px;
        }

        .manga-section-title {
          font-size: 1rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 18px 0;
          text-transform: uppercase;
        }

        .manga-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .manga-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          padding: 14px;
          border-radius: 16px;
          border: 2px solid #e2e8f0;

          &--blue { border-color: #93c5fd; }
          &--purple { border-color: #c084fc; }
          &--emerald { border-color: #6ee7b7; }
          &--amber { border-color: #fde047; }
        }

        .manga-avatar {
          font-size: 1.8rem;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .manga-bubble {
          font-size: 0.88rem;
          color: #1e293b;
          line-height: 1.4;

          strong {
            color: #2563eb;
          }
        }

        .interactive-chat-zone {
          background: #f8fafc;
          border-radius: 24px;
          padding: 24px;
          border: 2px solid #e2e8f0;
        }

        .agent-status-card {
          text-align: center;
          margin-bottom: 20px;
        }

        .status-indicator {
          display: inline-block;
          padding: 10px 24px;
          border-radius: 30px;
          font-size: 0.95rem;

          &--speaking {
            background: #dbeafe;
            color: #1e40af;
            border: 2px solid #93c5fd;
            animation: pulse 1.5s infinite;
          }

          &--listening {
            background: #fef2f2;
            color: #b91c1c;
            border: 2px solid #fecaca;
            animation: pulse 1.2s infinite;
          }

          &--ready {
            background: #f1f5f9;
            color: #475569;
          }

          &--completed {
            background: #dcfce7;
            color: #15803d;
            border: 2px solid #86efac;
          }
        }

        .chat-feed {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
          max-height: 420px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .chat-bubble-row {
          display: flex;
          gap: 14px;
          align-items: flex-start;

          &--ai {
            justify-content: flex-start;

            .chat-content {
              background: #ffffff;
              border: 2px solid #3b82f6;
              color: #0f172a;
              border-radius: 18px 18px 18px 4px;
            }
          }

          &--user {
            flex-direction: row-reverse;

            .chat-content {
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: #ffffff;
              border-radius: 18px 18px 4px 18px;
            }
          }
        }

        .chat-avatar {
          font-size: 1.5rem;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chat-content {
          padding: 14px 18px;
          max-width: 85%;
          box-shadow: 0 4px 14px rgba(0,0,0,0.05);
        }

        .chat-confirmation-badge {
          background: #dcfce7;
          color: #15803d;
          font-size: 0.82rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
          margin-bottom: 6px;
          display: inline-block;
        }

        .chat-label {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .chat-text {
          font-size: 1rem;
          line-height: 1.5;
          font-weight: 600;
        }

        .chat-bubble-user-editable {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .editable-subtext {
          font-size: 0.7rem;
          color: #dbeafe;
          font-weight: 700;
        }

        .chat-editable-input {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #ffffff;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 0.95rem;
          font-weight: 700;

          &:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.3);
            border-color: #ffffff;
          }
        }

        .current-step-box {
          background: #ffffff;
          border-radius: 18px;
          padding: 20px;
          border: 2px solid #cbd5e1;
          box-shadow: 0 6px 18px rgba(0,0,0,0.05);
        }

        .step-label {
          font-size: 0.9rem;
          font-weight: 800;
          color: #2563eb;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .live-accumulated-block {
          background: #1e293b;
          color: #f8fafc;
          padding: 14px 18px;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 600;
          font-style: italic;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .live-icon {
          font-size: 1.3rem;
        }

        .suggestions-zone {
          background: #f1f5f9;
          border-radius: 14px;
          padding: 12px 14px;
          margin-bottom: 12px;
        }

        .suggestions-title {
          font-size: 0.8rem;
          font-weight: 800;
          color: #475569;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .suggestions-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .suggestion-chip-btn {
          background: #ffffff;
          color: #2563eb;
          border: 1.5px solid #93c5fd;
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: #2563eb;
            color: #ffffff;
            border-color: #2563eb;
            transform: translateY(-1px);
          }
        }

        .answer-input-group {
          display: flex;
          gap: 12px;
        }

        .step-answer-input {
          flex: 1;
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 0.95rem;
          font-weight: 600;

          &:focus {
            outline: none;
            border-color: #2563eb;
          }
        }

        .next-step-btn {
          background: #64748b;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;

          &:hover {
            background: #475569;
          }
        }

        .recap-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          border: 2px solid #10b981;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
          margin-top: 20px;
        }

        .recap-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .recap-icon {
          font-size: 1.6rem;
        }

        .recap-title {
          font-size: 1.25rem;
          font-weight: 900;
          color: #065f46;
          margin: 0;
        }

        .recap-subtext {
          font-size: 0.88rem;
          color: #047857;
          margin: 0 0 18px 0;
        }

        .recap-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }

        .recap-field {
          display: flex;
          flex-direction: column;
          gap: 6px;

          &--full {
            grid-column: 1 / -1;
          }

          label {
            font-size: 0.82rem;
            font-weight: 800;
            color: #334155;
          }

          input {
            border: 2px solid #cbd5e1;
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 0.95rem;
            font-weight: 600;

            &:focus {
              outline: none;
              border-color: #10b981;
            }
          }
        }

        .final-submit-zone {
          text-align: center;
          margin-top: 10px;
        }

        .final-submit-btn {
          width: 100%;
          max-width: 440px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 18px;
          border-radius: 16px;
          font-size: 1.2rem;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(16, 185, 129, 0.45);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }

        .voice-alert {
          margin-top: 16px;
          padding: 14px 18px;
          border-radius: 12px;
          font-weight: 700;

          &--error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
          &--success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
