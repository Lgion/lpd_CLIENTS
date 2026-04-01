import { useState, useRef } from 'react';

export default function AiGenerationModal({ onClose, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const generalFilesRef = useRef(null);
  const cameraRef = useRef(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const mimeType = mediaRecorder.mimeType || 'audio/webm';
          const extension = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const audioFile = new File([audioBlob], `vocal_${Date.now()}.${extension}`, { type: mimeType });
          
          setFiles(prev => [...prev, audioFile]);
          
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Erreur d'accès au microphone:", error);
        alert("Impossible d'accéder au microphone. Veuillez vérifier les permissions de votre navigateur.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Veuillez sélectionner au moins un fichier multimédia pour l'analyse.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération. Le quota API est peut-être dépassé ou le format est invalide.');
      }

      const data = await response.json();

      if (data.success && data.post) {
        onSuccess(data.post);
        onClose();
      } else {
        throw new Error(data.message || 'Erreur lors de la génération.');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-overlay">
      <div className="ai-content">
        <h2>🪄 Générer un Article avec l'IA</h2>
        <p>Fournissez des fichiers textes, images, audios ou vidéos. L'IA les analysera pour rédiger un article structuré.</p>

        <div className="ai-capture-buttons">
          <button type="button" onClick={() => generalFilesRef.current?.click()} className="ai-btn ai-btn--base">
            ➕ Ajouter un Fichier (PDF, TXT, Média...)
          </button>
          <hr />
          <input
            type="file"
            multiple
            ref={generalFilesRef}
            onChange={handleFileChange}
            className="ai-hidden-input"
          />

          <div className="ai-mobile-options">
            <button type="button" onClick={() => cameraRef.current?.click()} className="ai-btn ai-btn--camera">
              📷 Prendre une Photo / Vidéo
            </button>
            <input
              type="file"
              accept="image/*,video/*"
              capture="environment"
              ref={cameraRef}
              onChange={handleFileChange}
              className="ai-hidden-input"
            />

            <button 
              type="button" 
              onClick={toggleRecording} 
              className={`ai-btn ai-btn--mic ${isRecording ? 'ai-btn--recording' : ''}`}
              style={isRecording ? { backgroundColor: '#ffebee', color: '#d32f2f', borderColor: '#d32f2f' } : {}}
            >
              {isRecording ? "⏹️ Arrêter l'enregistrement..." : "🎤 Enregistrer un Audio"}
            </button>
          </div>

          <button type="button" onClick={() => setShowTextInput(!showTextInput)} className="ai-btn ai-btn--text">
            📝 Ajouter du Texte / Notes
          </button>

          {showTextInput && (
            <div className="ai-text-container">
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Collez ou tapez votre texte ici..."
                rows="4"
              />
              <button
                type="button"
                onClick={() => {
                  if (textValue.trim()) {
                    const textFile = new File([textValue], "note_texte.txt", { type: "text/plain" });
                    setFiles(prev => [...prev, textFile]);
                    setTextValue("");
                    setShowTextInput(false);
                  }
                }}
                className="ai-add-text-btn"
              >
                Ajouter aux fichiers
              </button>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="ai-file-list">
            <h4>Fichiers sélectionnés ({files.length}) :</h4>
            <ul>
              {files.map((f, i) => (
                <li key={i}>
                  {f.name} <button type="button" onClick={() => removeFile(i)} className="ai-remove-btn">❌</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="ai-actions">
          <button type="button" onClick={onClose} className="ai-cancel-btn" disabled={loading}>Annuler</button>
          <button type="button" onClick={handleSubmit} className="ai-submit-btn" disabled={loading || files.length === 0}>
            {loading ? 'Analyse en cours...' : 'Valider & Générer'}
          </button>
        </div>
      </div>
    </div>
  );
}


