import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Next.js serverless function timeout max duration if deployed on vercel pro/hobby (10-60s)

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files');
    const userPrompt = formData.get('userPrompt') || "";

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'Aucun média fourni.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const parts = [];
    const mediaNames = [];

    for (const file of files) {
      const mimeType = (file.type || '').toLowerCase();
      const fileName = file.name || 'capture';

      try {
        const buffer = await file.arrayBuffer();
        const nodeBuffer = Buffer.from(buffer);

        // On garde une trace du nom pour le texte
        mediaNames.push(fileName);

        // CAS 1 : AUDIO & VIDÉO (Analyse Binaire)
        if (mimeType.startsWith('audio/') || mimeType.startsWith('video/') || mimeType.startsWith('image/')) {
          // Sécurité contre les fichiers vides qui font planter l'IA
          if (nodeBuffer.length > 1000) {
            parts.push({
              inlineData: {
                data: nodeBuffer.toString('base64'),
                mimeType: mimeType.split(';')[0],
              }
            });
          }
        } 
      } catch (err) {
        console.warn(`Fichier "${fileName}" ignoré par l'IA.`, err);
      }
    }

    const prompt = `Agis comme un rédacteur de blog expert et narrateur. 
Tu vas recevoir des fichiers multimédias (audio, photos, vidéos). 

DIRECTIVES PRIORITAIRES DE L'UTILISATEUR :
"${userPrompt}"

CONSIGNES DE RÉDACTION :
1. ANALYSE : Utilise l'audio pour le fond du récit et les images/vidéos pour enrichir tes descriptions et ton inspiration.
2. DISCRÉTION : Ne cite JAMAIS les noms des fichiers (ex: [capture.jpg]) dans le texte final. L'article doit paraître naturel et fluide.
3. TON : Adapte-toi au ton demandé dans les directives utilisateur.

Format : Markdown élégant.

Retourne UNIQUEMENT une chaîne JSON valide :
{
  "title": "Titre percutant",
  "excerpt": "Résumé court",
  "content": "Contenu détaillé (min 300 mots) avec ## Titres.",
  "category": "Choisir : 'Événements', 'Enseignements', 'Témoignages' ou 'Actualités'",
  "youtubeLinks": [] 
}
`;

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [{ role: 'user', parts }],
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;

    let postData;
    try {
      postData = JSON.parse(responseText);
    } catch (e) {
      // Nettoyage potentiel
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      postData = JSON.parse(cleaned);
    }

    return NextResponse.json({
      success: true,
      post: postData
    });

  } catch (error) {
    console.error('Erreur API Gemini:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
