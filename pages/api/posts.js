import dbConnect from './lib/dbConnect';
import Post from './_/models/Post';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

async function seedInitialPostsIfNeeded() {
  try {
    const count = await Post.countDocuments();
    if (count === 0) {
      const postsDirectory = path.join(process.cwd(), '_posts');
      if (fs.existsSync(postsDirectory)) {
        const filenames = fs.readdirSync(postsDirectory);
        for (const filename of filenames) {
          if (filename.endsWith('.md') || filename.endsWith('.mdx')) {
            const filePath = path.join(postsDirectory, filename);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContents);

            const slug = filename.replace(/\.mdx?$/, '');
            await Post.create({
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
            console.log(`[Blog Seed] Article "${slug}" importé dans MongoDB avec succès.`);
          }
        }
      }
    }
  } catch (error) {
    console.error('[Blog Seed] Erreur lors de l\'ensemencement initial:', error);
  }
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      await seedInitialPostsIfNeeded();

      const { category } = req.query;
      const filter = {};
      if (category && category !== 'all') {
        filter.category = category;
      }

      const posts = await Post.find(filter).sort({ date: -1 }).lean();
      return res.status(200).json(posts);
    } catch (error) {
      console.error('API: Erreur lors de la récupération des posts:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des posts' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, excerpt, coverImage, content, author, category, youtubeLinks, date } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Le titre et le contenu sont obligatoires' });
      }

      let slug = req.body.slug;
      if (!slug) {
        slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      // S'assurer de l'unicité du slug
      let uniqueSlug = slug;
      let counter = 1;
      while (await Post.exists({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }

      const newPost = await Post.create({
        slug: uniqueSlug,
        title,
        excerpt: excerpt || '',
        coverImage: coverImage || '',
        content,
        category: category || 'Général',
        date: date || new Date().toISOString(),
        author: {
          name: author?.name || 'LPD',
          picture: author?.picture || ''
        },
        youtubeLinks: youtubeLinks || [],
        published: true
      });

      return res.status(201).json({ success: true, slug: newPost.slug, post: newPost });
    } catch (error) {
      console.error('API: Erreur lors de la création du post:', error);
      return res.status(500).json({ error: 'Erreur lors de la création du post' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { slug } = req.query;
      if (!slug) {
        return res.status(400).json({ error: 'Slug manquant' });
      }

      const { title, excerpt, coverImage, content, author, category, youtubeLinks, date } = req.body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (coverImage !== undefined) updateData.coverImage = coverImage;
      if (content !== undefined) updateData.content = content;
      if (category !== undefined) updateData.category = category;
      if (youtubeLinks !== undefined) updateData.youtubeLinks = youtubeLinks;
      if (date !== undefined) updateData.date = date;
      if (author !== undefined) {
        updateData.author = {
          name: author.name || 'LPD',
          picture: author.picture || ''
        };
      }

      const updatedPost = await Post.findOneAndUpdate(
        { slug },
        { $set: updateData },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      return res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
      console.error('API: Erreur lors de la modification du post:', error);
      return res.status(500).json({ error: 'Erreur lors de la modification du post' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { slug } = req.query;
      if (!slug) {
        return res.status(400).json({ error: 'Slug manquant' });
      }

      const deletedPost = await Post.findOneAndDelete({ slug });
      if (!deletedPost) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('API: Erreur lors de la suppression du post:', error);
      return res.status(500).json({ error: 'Erreur lors de la suppression du post' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
}
