import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/img/blog'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB max
    });

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Erreur lors du téléchargement:', err);
          res.status(500).json({ error: 'Erreur lors du téléchargement' });
          return resolve();
        }

        const file = files.image?.[0]; // formidable v4 retourne un tableau
        if (!file) {
          res.status(400).json({ error: 'Aucun fichier fourni' });
          return resolve();
        }

        try {
          // Générer un nom de fichier unique
          const timestamp = Date.now();
          const ext = path.extname(file.originalFilename);
          const newFilename = `post-${timestamp}${ext}`;
          
          // Déplacer le fichier vers son emplacement final
          const finalPath = path.join(form.uploadDir, newFilename);
          fs.renameSync(file.filepath, finalPath);

          // Retourner le chemin relatif de l'image
          const relativePath = `/img/blog/${newFilename}`;
          res.status(200).json({ url: relativePath });
          resolve();
        } catch (error) {
          console.error('Erreur lors du traitement du fichier:', error);
          res.status(500).json({ error: 'Erreur lors du traitement du fichier' });
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors du traitement de la requête' });
  }
}