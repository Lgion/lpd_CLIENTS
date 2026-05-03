import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const archiveDir = path.join(process.cwd(), 'public/img/blog/archive');
  
  // Vérifier si le dossier existe
  if (!fs.existsSync(archiveDir)) {
    try { fs.mkdirSync(archiveDir, { recursive: true }); } catch (e) {}
  }

  // Vérifier l'écriture
  let isWritable = false;
  try {
    const testFile = path.join(archiveDir, '.write-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    isWritable = true;
  } catch (e) {
    isWritable = false;
  }

  if (req.method === 'GET') {
    try {
      const files = fs.readdirSync(archiveDir)
        .filter(file => !file.startsWith('.')) // Ignorer les fichiers cachés
        .map(file => ({
          name: file,
          url: `/img/blog/archive/${file}`,
          size: fs.statSync(path.join(archiveDir, file)).size,
          mtime: fs.statSync(path.join(archiveDir, file)).mtime,
        }))
        .sort((a, b) => b.mtime - a.mtime); // Plus récents d'abord

      res.status(200).json({ files, isWritable });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list archives' });
    }
  } else if (req.method === 'DELETE') {
    if (!isWritable) return res.status(403).json({ error: 'Server is read-only' });

    try {
      const { filename } = req.query;
      const filePath = path.join(archiveDir, filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete file' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
