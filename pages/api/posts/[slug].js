import dbConnect from '../lib/dbConnect';
import Post from '../_/models/Post';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }

  try {
    await dbConnect();

    let post = await Post.findOne({ slug }).lean();

    // En cas de non-trouvé dans la BDD, tenter la récupération depuis _posts/ et seeding à la volée
    if (!post) {
      const postsDirectory = path.join(process.cwd(), '_posts');
      const fullPath = path.join(postsDirectory, `${slug}.md`);

      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        post = await Post.create({
          slug,
          title: data.title || slug,
          excerpt: data.excerpt || '',
          coverImage: data.coverImage || '',
          content: content || '',
          category: data.category || 'Général',
          date: data.date || new Date().toISOString(),
          author: {
            name: data.author?.name || 'LPD',
            picture: data.author?.picture || ''
          },
          youtubeLinks: data.youtubeLinks || [],
          published: true
        });
      }
    }

    if (!post) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('API [slug]: Erreur lors de la récupération de l\'article:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
  }
}
