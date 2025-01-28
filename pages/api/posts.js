import { getPostsBy, getAllPosts } from '../../app/_/Blog/_/lib/api'
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  const postsDirectory = path.join(process.cwd(), '_posts');

  if (req.method === 'GET') {
    try {
      const posts = await getAllPosts(['title', 'date', 'slug', 'author', 'coverImage', 'excerpt', 'category']);
      console.log("API: Retrieved posts:", posts);
      if (Array.isArray(posts) && posts.length > 0) {
        res.status(200).json(posts);
      } else {
        console.error('API: Les données récupérées ne sont pas un tableau valide');
        res.status(500).json([]);
      }
    } catch (error) {
      console.error('API: Erreur lors de la récupération des posts:', error);
      res.status(500).json([]);
    }
  } else if (req.method === 'POST') {
    try {
      const { title, excerpt, coverImage, content, author, date } = req.body;
      
      // Créer un slug à partir du titre
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Créer le contenu du fichier markdown
      const markdownContent = `---
title: '${title}'
excerpt: '${excerpt}'
coverImage: '${coverImage}'
date: '${date}'
author:
  name: ${author.name}
  picture: ${author.picture || ''}
---

${content}`;
      
      // Écrire le fichier
      fs.writeFileSync(
        path.join(postsDirectory, `${slug}.md`),
        markdownContent
      );

      res.status(200).json({ success: true, slug });
    } catch (error) {
      console.error('API: Erreur lors de la création du post:', error);
      res.status(500).json({ error: 'Erreur lors de la création du post' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { slug } = req.query;
      const filePath = path.join(postsDirectory, `${slug}.md`);
      
      // Vérifier si le fichier existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      // Supprimer le fichier
      fs.unlinkSync(filePath);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('API: Erreur lors de la suppression du post:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression du post' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { slug } = req.query;
      const { title, excerpt, coverImage, content, author, date } = req.body;
      const filePath = path.join(postsDirectory, `${slug}.md`);

      // Vérifier si le fichier existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      // Créer le nouveau contenu markdown
      const markdownContent = `---
title: '${title}'
excerpt: '${excerpt}'
coverImage: '${coverImage}'
date: '${date}'
author:
  name: ${author.name}
  picture: ${author.picture || ''}
---

${content}`;

      // Écrire le nouveau contenu
      fs.writeFileSync(filePath, markdownContent);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('API: Erreur lors de la modification du post:', error);
      res.status(500).json({ error: 'Erreur lors de la modification du post' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
