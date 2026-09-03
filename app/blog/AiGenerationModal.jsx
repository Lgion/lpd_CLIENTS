import { useState, useRef, useEffect } from 'react';

export default function AiGenerationModal({ onClose, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoChunksRef = useRef([]);
  const audioRecorderRef = useRef(null);
  const audioOnlyChunksRef = useRef([]);

  // --- LOGIQUE CAPTURE AUDIO (ÉTAPE 1) ---
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const file = new File([blob], `vocal_${Date.now()}.webm`, { type: 'audio/webm' });
          setFiles(prev => [...prev, file]);
          stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorder.start();
        setIsRecording(true);
      } catch (e) { alert("Microphone inaccessible."); }
    }
  };

  // --- LOGIQUE CAMÉRA (ÉTAPE 2) ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (e) { alert("Caméra inaccessible."); }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsCameraActive(false);
    setIsRecordingVideo(false);
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setFiles(prev => [...prev, file]);
        stopCamera();
      }, 'image/jpeg', 0.95);
    }
  };

  const startVideoRecording = () => {
    if (!streamRef.current) return;
    videoChunksRef.current = [];
    audioOnlyChunksRef.current = [];

    const videoRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = videoRecorder;
    videoRecorder.ondataavailable = (e) => { if (e.data.size > 0) videoChunksRef.current.push(e.data); };

    const audioStream = new MediaStream(streamRef.current.getAudioTracks());
    const audioRecorder = new MediaRecorder(audioStream);
    audioRecorderRef.current = audioRecorder;
    audioRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioOnlyChunksRef.current.push(e.data); };

    videoRecorder.onstop = () => {
      const vBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
      const vFile = new File([vBlob], `video_${Date.now()}.webm`, { type: 'video/webm' });
      const aBlob = new Blob(audioOnlyChunksRef.current, { type: 'audio/webm' });
      const aFile = new File([aBlob], `audio_video_${Date.now()}.webm`, { type: 'audio/webm' });
      setFiles(prev => [...prev, vFile, aFile]);
      stopCamera();
    };

    videoRecorder.start();
    audioRecorder.start();
    setIsRecordingVideo(true);
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (audioRecorderRef.current) audioRecorderRef.current.stop();
    setIsRecordingVideo(false);
  };

  // --- ACTIONS FICHIERS ---
  const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Enregistrez au moins un audio.");

    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('userPrompt', userPrompt);

    try {
      const res = await fetch('/api/generate-post', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.post) {
        onSuccess(data.post, files);
        onClose();
      } else { throw new Error(data.message || 'Erreur API'); }
    } catch (e) { alert('Erreur: ' + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="ai-overlay">
      <div className="ai-content">
        <header className="ai-modal-header">
          <h2>🪄 Studio de Capture IA</h2>
          <p className="ai-intro-text">
            Enregistrez votre voix et capturez des images pour que l'IA rédige votre article.
          </p>
        </header>

        <div className="ai-steps-container">
          {/* ÉTAPE 1 : AUDIO */}
          <section className="ai-step">
            <span className="ai-step-number">1</span>
            <div className="ai-step-content">
              <h3>Racontez votre histoire <b style={{ color: "red" }}>(requis)</b></h3>
              <button
                type="button"
                onClick={toggleRecording}
                className={`ai-btn ai-btn--mic ${isRecording ? 'ai-btn--recording' : ''}`}
              >
                {isRecording ? 'Terminer l\'écoute...' : 'Parler maintenant'}
              </button>
            </div>
          </section>

          <hr className="ai-step-divider" />

          {/* ÉTAPE 2 : CAMÉRA */}
          <section className="ai-step">
            <span className="ai-step-number">2</span>
            <div className="ai-step-content">
              <h3>Capturez le moment <b style={{ color: "orange" }}>(facultatif)</b></h3>
              {!isCameraActive ? (
                <button type="button" onClick={startCamera} className="ai-btn ai-btn--camera">
                  Ouvrir la Caméra
                </button>
              ) : (
                <div className="ai-camera-container">
                  <video ref={videoRef} autoPlay playsInline muted className="ai-video-feed" />
                  <div className="ai-camera-overlay-controls">
                    <button type="button" onClick={takePhoto} className="ai-control-btn ai-control-btn--photo">Photo</button>
                    {!isRecordingVideo ? (
                      <button type="button" onClick={startVideoRecording} className="ai-control-btn ai-control-btn--video-start">Vidéo</button>
                    ) : (
                      <button type="button" onClick={stopVideoRecording} className="ai-control-btn ai-control-btn--video-stop">STOP</button>
                    )}
                    {isRecordingVideo && <span className="ai-recording-tag">● REC</span>}
                  </div>
                  <button type="button" onClick={stopCamera} className="ai-camera-close">×</button>
                </div>
              )}
            </div>
          </section>

          <hr className="ai-step-divider" />

          {/* ÉTAPE 3 : PROMPT */}
          <section className="ai-step">
            <span className="ai-step-number">3</span>
            <div className="ai-step-content">
              <h3>Guidez la génération <b style={{ color: "orange" }}>(facultatif)</b></h3>
              <div className="ai-prompt-container">
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Ex: 'Écris cet article avec un ton militant et insiste sur l'importance de l'éducation des filles...'"
                  rows="3"
                  className="ai-textarea-prompt"
                />
              </div>
            </div>
          </section>
        </div>

        {/* LISTE DES CAPTURES */}
        {files.length > 0 && (
          <div className="ai-file-list">
            <h4>Captures effectuées ({files.length}) :</h4>
            <ul>
              {files.map((file, i) => {
                const isImage = file.type.startsWith('image/');
                const isVideo = file.type.startsWith('video/');
                const isAudio = file.type.startsWith('audio/');
                const url = URL.createObjectURL(file);
                return (
                  <li key={i} className="ai-file-item">
                    <div className="ai-file-preview-mini" onClick={() => (isImage || isVideo) && setPreviewFile({ url, type: file.type })}>
                      {isImage && <img src={url} alt="mini" />}
                      {isVideo && <video src={url} />}
                      {isAudio && <span className="ai-icon-audio">🎵</span>}
                    </div>
                    <span className="ai-file-name">{file.name}</span>
                    <button type="button" onClick={() => removeFile(i)} className="ai-remove-btn">❌</button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <footer className="ai-modal-footer">
          <button type="button" onClick={onClose} className="ai-btn-cancel" disabled={loading}>Annuler</button>
          <button
            type="button"
            onClick={handleSubmit}
            className="ai-btn-submit"
            disabled={loading || files.length === 0}
          >
            {loading ? 'Génération en cours...' : 'Générer l\'article ✨'}
          </button>
        </footer>

        {previewFile && (
          <div className="ai-preview-overlay" onClick={() => setPreviewFile(null)}>
            <div className="ai-preview-modal">
              {previewFile.type.startsWith('image/') ? (
                <img src={previewFile.url} alt="Large" />
              ) : (
                <video src={previewFile.url} controls autoPlay />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


