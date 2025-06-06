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
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB max
      multiples: false,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
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
          // Récupérer les infos du formulaire
          const folderLabel = fields.folder?.[0] || 'divers';
          const articleNom = fields.articleNom?.[0] || 'article';
          const originalName = fields.originalName?.[0] || file.originalFilename;
          const imageName = path.parse(originalName).name;
          // Dossier cible
          const uploadDir = path.join(process.cwd(), 'public', 'img', 'vente-religieuse', folderLabel);
          const uploadDir_min = path.join(process.cwd(), 'public', 'img', 'vente-religieuse', "min", folderLabel);
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            fs.mkdirSync(uploadDir_min, { recursive: true });
          }
          // Nom final
          // const finalFilename = `${articleNom}_${imageName}.webp`;
          const finalFilename_ = `${imageName}.webp`;
          // const finalPath = path.join(uploadDir, finalFilename);
          const finalPath = path.join(uploadDir, finalFilename_);
          const finalPath_ = path.join(uploadDir_min, finalFilename_);

          // Convertir en webp si possible (sinon juste move)
          const sharp = require('sharp');
          // Convertir l'image en webp si possible (sinon erreur)
          await sharp(file.filepath).webp({ quality: 90 }).toFile(finalPath);
          await sharp(file.filepath).webp({ quality: 90 }).toFile(finalPath_);
          // Supprimer le fichier temporaire de téléchargement
          fs.unlinkSync(file.filepath);

          // Retourner le chemin relatif
          // const relativePath = `/img/vente-religieuse/${folderLabel}/${finalFilename}`;
          const relativePath_ = `${imageName}`;
          res.status(200).json({ url: relativePath_ });
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