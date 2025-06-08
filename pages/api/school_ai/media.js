import { log } from 'console';
import {IncomingForm} from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const BASE_PATH = '/home/nihongo/Bureau/lpd/public/school';
const CLASSES_PATH = '/home/nihongo/Bureau/lpd/public/school/classes';

import sharp from 'sharp';

const getTargetDir = (type, payload) => {
    console.log(type);
    console.log(type[0]);
    
  if (type[0] === 'classe') {
    // On attend payload.annee, payload.niveau, payload.alias
    const annee = String(payload.annee || '').replace(/[^a-zA-Z0-9-]/g, '');
    const niveau = String(payload.niveau || '').replace(/[^a-zA-Z0-9-]/g, '');
    const alias = String(payload.alias || '').replace(/[^a-zA-Z0-9-]/g, '');
    const folderName = `${annee}-${niveau}-${alias}`.toLowerCase();
    return path.join(CLASSES_PATH, folderName);
  }
  let safeName = ""
  if (type === 'student') return path.join(BASE_PATH, 'students', safeName);
  if (type === 'teacher') return path.join(BASE_PATH, 'teachers', safeName);
  // default: school root
  return BASE_PATH;
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Erreur lors de l\'upload' });
      let { type, payload, entityType } = fields;
      console.log("\n\n\n\njiuio");
      console.log(fields);      
      console.log(payload);
      console.log("jiuio");
      
      payload = JSON.parse(payload?.[0] || '{}')
      console.log(payload);
      
      if (!type || !files.file) {
        return res.status(400).json({ error: 'Champs requis manquants (type, name, file)' });
      }
      const targetDir = getTargetDir(type, (payload || fields) );
      await fs.promises.mkdir(targetDir, { recursive: true });
      let file = files.file;
      if (Array.isArray(file)) file = file[0];
      // DEBUG: log file object
      console.log('DEBUG formidable file:', file);
      if (!file || !file.filepath) {
        return res.status(400).json({ error: 'Fichier uploadé invalide', file });
      }
      
      
      
      if (entityType[0] === 'classe') {
        // Conversion webp obligatoire
        const destPath = path.join(targetDir, 'photo.webp');
        console.log('DEBUG FIELDS', fields);
        console.log('DEBUG targetDir', targetDir);
        await sharp(file.filepath).webp().toFile(destPath);
        await fs.promises.unlink(file.filepath);
        let publicPath = destPath.replace('/home/nihongo/Bureau/lpd/public', '');
        return res.status(200).json({ path: publicPath });
      } else if (entityType[0] === 'eleve') {
        // --- Cas élève ---
        // Dossier: /public/school/students/[nom]-[prenoms]-[timestamp naissance_$_date]
        const {prenoms, nom, naissance_$_date} = payload;
        const eleveFolder = `${nom}-${prenoms}-${naissance_$_date}`.replace(/--+/g, '-');
        const destDir = path.join(BASE_PATH, 'students', eleveFolder);
        await fs.promises.mkdir(destDir, { recursive: true });

        let fileList = files.file;
        if (!Array.isArray(fileList)) fileList = [fileList];
        let paths = [];
        // Récupère la meta des noms personnalisés (documentsMeta)
        let customNames = [];
        try {
          customNames = JSON.parse(fields.documentsMeta?.[0] || fields.documentsMeta || '[]');
        } catch (e) { customNames = []; }
        let docIdx = 0;
        for (let file of fileList) {
          if (!file || !file.filepath) continue;
          const isImage = (file.mimetype || file.type || '').startsWith('image/');
          let isPhoto = false;
          if (isImage && !paths.some(p => p.endsWith('photo.webp'))) isPhoto = true;
          if (isPhoto) {
            // Conversion webp obligatoire pour la photo
            const destPath = path.join(destDir, 'photo.webp');
            await sharp(file.filepath).webp().toFile(destPath);
            await fs.promises.unlink(file.filepath);
            let publicPath = destPath.replace('/home/nihongo/Bureau/lpd/public', '');
            paths.push(publicPath);
          } else {
            // Document : on prend le nom personnalisé si dispo
            const ext = path.extname(file.originalFilename || file.name || '');
            let destName = customNames[docIdx] ? customNames[docIdx] : (file.originalFilename || file.name || ('document'+Date.now()+ext));
            // Ajoute l'extension si elle manque
            if (!destName.endsWith(ext)) destName += ext;
            const destPath = path.join(destDir, destName);
            await fs.promises.rename(file.filepath, destPath);
            let publicPath = destPath.replace('/home/nihongo/Bureau/lpd/public', '');
            paths.push(publicPath);
            docIdx++;
          }
        }
        return res.status(200).json({ paths });
      } else if (entityType[0] === 'enseignant') {
        // --- Cas enseignant ---
        // Dossier: /public/school/teachers/[nom]-[prenoms]
        const nom = String(fields.nom || fields.name || '').toLowerCase().replace(/[^a-z0-9\-]/g, '-');
        const prenoms = String(fields.prenoms || '').toLowerCase().replace(/[^a-z0-9\-]/g, '-');
        const enseignantFolder = `${nom}-${prenoms}`.replace(/--+/g, '-');
        const destDir = path.join(BASE_PATH, 'teachers', enseignantFolder);
        await fs.promises.mkdir(destDir, { recursive: true });
        const ext = path.extname(file.originalFilename || file.name || '');
        const destPath = path.join(destDir, 'photo' + ext);
        await fs.promises.rename(file.filepath, destPath);
        let publicPath = destPath.replace('/home/nihongo/Bureau/lpd/public', '');
        return res.status(200).json({ path: publicPath });
      } else {
        const ext = path.extname(file.originalFilename || file.name || '');
        const destPath = path.join(targetDir, 'photo' + ext);
        await fs.promises.rename(file.filepath, destPath);
        let publicPath = destPath.replace('/home/nihongo/Bureau/lpd/public', '');
        return res.status(200).json({ path: publicPath });
      }
    });
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
};

export default handler;
