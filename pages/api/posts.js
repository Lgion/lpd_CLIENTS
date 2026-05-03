import { getAllPosts } from '../../app/_/Blog/_/lib/api'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import https from 'https'
import mongoose from 'mongoose'

// Helper pour rapatrier une image externe
const repatriateImage = async (url) => {
  if (!url || !url.startsWith('http')) return url;
  
  const uploadDir = path.join(process.cwd(), 'public/img/blog');
  try {
    const testFile = path.join(uploadDir, '.write-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
  } catch (e) {
    return url;
  }

  return new Promise((resolve) => {
    const ext = path.extname(new URL(url).pathname) || '.webp';
    const filename = `repatriated-${Date.now()}${ext}`;
    const dest = path.join(uploadDir, filename);
    const file = fs.createWriteStream(dest);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return resolve(url);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(`/img/blog/${filename}`);
      });
    }).on('error', () => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(url);
    });
  });
};

export default async function handler(req, res) {
  const postsDirectory = path.join(process.cwd(), '_posts');

  if (req.method === 'GET') {
    try {
      const posts = await getAllPosts(['title', 'date', 'slug', 'author', 'coverImage', 'excerpt', 'category']);
      res.status(200).json(Array.isArray(posts) ? posts : []);
    } catch (error) {
      res.status(500).json([]);
    }
  } else if (req.method === 'POST') {
    try {
      let { title, excerpt, coverImage, content, author, date, category, youtubeLinks } = req.body;
      coverImage = await repatriateImage(coverImage);

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const markdownContent = `---
title: '${title}'
excerpt: '${excerpt}'
coverImage: '${coverImage}'
date: '${date}'
category: '${category || 'all'}'
youtubeLinks: ${JSON.stringify(youtubeLinks || [])}
author:
  name: ${author.name}
  picture: ${author.picture || ''}
---

${content}`;
      
      fs.writeFileSync(path.join(postsDirectory, `${slug}.md`), markdownContent);
      res.status(200).json({ success: true, slug });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création du post' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { slug } = req.query;
      let { title, excerpt, coverImage, content, author, date, category, youtubeLinks } = req.body;
      const filePath = path.join(postsDirectory, `${slug}.md`);

      if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Article non trouvé' });

      coverImage = await repatriateImage(coverImage);

      const markdownContent = `---
title: '${title}'
excerpt: '${excerpt}'
coverImage: '${coverImage}'
date: '${date}'
category: '${category || 'all'}'
youtubeLinks: ${JSON.stringify(youtubeLinks || [])}
author:
  name: ${author.name}
  picture: ${author.picture || ''}
---

${content}`;

      fs.writeFileSync(filePath, markdownContent);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la modification' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { slug, deleteMedia } = req.query;
      const shouldDeleteMedia = deleteMedia === 'true';
      const filePath = path.join(postsDirectory, `${slug}.md`);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      const coverImage = data.coverImage;

      // 1. Gérer l'image de couverture
      if (coverImage && coverImage.startsWith('/img/blog/')) {
        const fullImagePath = path.join(process.cwd(), 'public', coverImage);
        if (fs.existsSync(fullImagePath)) {
          if (shouldDeleteMedia) {
            fs.unlinkSync(fullImagePath); // Suppression définitive
          } else {
            // Archivage par défaut
            const archiveDir = path.join(process.cwd(), 'public/img/blog/archive');
            if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
            const archivedName = `${Date.now()}-${path.basename(fullImagePath)}`;
            try { fs.renameSync(fullImagePath, path.join(archiveDir, archivedName)); } catch (e) {}
          }
        }
      }

      // 2. Gérer la galerie (MongoDB)
      const Slider = require('./_/models/Slider');
      if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGODB_URI);
      
      const diapos = await Slider.find({ identifiant_$_hidden: new RegExp(`^blog_${slug}`) });
      
      for (const diapo of diapos) {
        if (diapo.src_$_file && diapo.src_$_file.startsWith('/img/blog/')) {
          const fullPath = path.join(process.cwd(), 'public', diapo.src_$_file);
          if (fs.existsSync(fullPath)) {
            if (shouldDeleteMedia) {
              fs.unlinkSync(fullPath); // Suppression définitive
            } else {
              // Archivage par défaut
              const archiveDir = path.join(process.cwd(), 'public/img/blog/archive');
              if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
              const archivedName = `${Date.now()}-${path.basename(fullPath)}`;
              try { fs.renameSync(fullPath, path.join(archiveDir, archivedName)); } catch (e) {}
            }
          }
        }
        await Slider.deleteOne({ _id: diapo._id });
      }

      fs.unlinkSync(filePath);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
