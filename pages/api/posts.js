import { getPostsBy, getAllPosts } from '../../app/_/Blog/_/lib/api'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Utilisons getAllPosts au lieu de getPostsBy
      const posts = await getAllPosts(['title', 'date', 'slug', 'author', 'coverImage', 'excerpt', 'category']);
      console.log("API: Retrieved posts:", posts); // Débogage
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
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
