import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Next.js serverless function timeout max duration if deployed on vercel pro/hobby (10-60s)

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'Aucun fichier fourni.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Preparation des donnees multimédia pour genAI
    // L'API attend soit du byte (base64) en inlineData, soit on pourrait utiliser fileManager 
    // Mais pour de petits fichiers (images, audio court), inlineData base64 marche bien.
    
    // TODO: Si on uploade des vidéos lourdes, il faut utiliser fileManager
    // File API is recommended for audio and video
    const contents = [];
    
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const nodeBuffer = Buffer.from(buffer);
      
      // Si c'est un très gros fichier, l'approche inlineData peut crash Vercel (limite ~4MB pour nextjs standard body max)
      // On utilisera fileManager pour tout via une méthode temporaire ou on le passe direct si c'est gérable
      const mimeType = file.type || 'application/octet-stream';
      
      const fileData = {
        inlineData: {
          data: nodeBuffer.toString('base64'),
          mimeType: mimeType
        }
      };
      contents.push(fileData);
    }
    
    const prompt = `Agis comme un rédacteur de blog pour le web. 
Tu vas recevoir des fichiers multimédias (texte, transcription vocale, image, ou vidéo).
Analyse-les attentivement et génère un article de blog structuré qui met en avant leur contenu de manière engageante.
Le contenu doit être au format Markdown.

Retourne UNIQUEMENT une chaîne JSON valide (sans backticks \`\`\`json) ayant obligatoirement la structure stricte suivante :
{
  "title": "Un titre accrocheur synthétisant le sujet",
  "excerpt": "Un résumé court (1 ou 2 phrases) pour accrocher le lecteur",
  "content": "Le contenu intégral du post ici, avec des titres (#, ##), du formatage gras, des listes si adéquates... Minimum 200 mots. En Markdown.",
  "category": "Une catégorie pertinente parmi : 'Événements', 'Enseignements', 'Témoignages', 'Actualités'. Si aucune ne correspond, propose un mot-clé pertinent."
}
`;

    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: contents,
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
