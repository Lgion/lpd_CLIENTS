"use client"
import { useState, useEffect, useRef } from 'react';
import { Modal, Button, message, Spin } from 'antd';
import { AudioOutlined, AudioMutedOutlined, CheckOutlined, RobotOutlined, ReloadOutlined } from '@ant-design/icons';

export default function VoiceDictationModal({ open, onCancel, onParsed, mode = 'inventaire' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'fr-FR';

        rec.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        rec.onerror = (err) => {
          console.error('Speech recognition error:', err);
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const handleStartRecording = () => {
    if (!recognitionRef.current) {
      message.error('La reconnaissance vocale n\'est pas supportée sur ce navigateur');
      return;
    }
    setTranscript('');
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAnalyzeVoice = async () => {
    if (!transcript.trim()) {
      message.warning('Veuillez dicter du texte avant l\'analyse IA');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai_voice_parser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, mode })
      });

      const data = await res.json();
      if (data.success && data.parsed) {
        message.success('Dictée vocale analysée avec succès par l\'IA !');
        onParsed(data.parsed);
        onCancel();
      } else {
        message.error('Impossible d\'analyser la dictée');
      }
    } catch (err) {
      console.error(err);
      message.error('Erreur lors du traitement LLM');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        handleStopRecording();
        onCancel();
      }}
      footer={null}
      width={520}
      className="spec05-voice-modal"
      destroyOnClose
    >
      <div style={{ textAlign: 'center', padding: '16px 10px' }}>
        <div style={{ fontSize: '2rem', marginBottom: 6 }}>
          <RobotOutlined style={{ color: '#3b82f6' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
          Assistant IA Vocale — {mode === 'inventaire' ? 'Ajout Matériel' : 'Nouveau Chantier'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 20 }}>
          Dictez librement votre texte en français. L'IA extrait automatiquement la désignation, quantité, état, devis et responsables.
        </p>

        {/* Animation Ondes Sonores */}
        <div className="voice-mic-container" style={{ margin: '20px 0' }}>
          <button
            className={`voice-mic-btn ${isRecording ? 'voice-mic-btn--recording' : ''}`}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
          >
            {isRecording ? <AudioOutlined style={{ fontSize: '2.5rem', color: '#fff' }} /> : <AudioMutedOutlined style={{ fontSize: '2.5rem', color: '#64748b' }} />}
          </button>

          <div style={{ marginTop: 12, fontWeight: 700, fontSize: '0.9rem', color: isRecording ? '#ef4444' : '#64748b' }}>
            {isRecording ? '🔴 Enregistrement vocal en cours... Cliquez pour stopper' : 'Cliquez sur le micro pour commencer à parler'}
          </div>
        </div>

        {/* Zone de retranscription textuelle */}
        <div className="voice-transcript-box">
          <span className="box-label">Transcription en direct :</span>
          <p className="box-text">
            {transcript || (
              <em style={{ color: '#94a3b8' }}>
                Ex: "{mode === 'inventaire' ? 'Ajouter 15 nouvelles chaises dans la grande salle d\'accueil à 12000 FCFA chacune' : 'Nouveau devis urgent pour réparer la fuite de toiture du dortoir B par SODEBAT pour 250000 FCFA'}"
              </em>
            )}
          </p>
        </div>

        {/* Boutons d'action */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
          {transcript && (
            <Button icon={<ReloadOutlined />} onClick={() => setTranscript('')} disabled={analyzing}>
              Effacer
            </Button>
          )}

          <Button
            type="primary"
            size="large"
            icon={<CheckOutlined />}
            loading={analyzing}
            onClick={handleAnalyzeVoice}
            disabled={!transcript.trim()}
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              borderRadius: 12,
              fontWeight: 700,
              padding: '0 28px'
            }}
          >
            Analyser & Pré-remplir par l'IA
          </Button>
        </div>
      </div>
    </Modal>
  );
}
