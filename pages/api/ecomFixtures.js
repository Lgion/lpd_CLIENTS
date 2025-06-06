import dbConnect from './lib/dbConnect';
import Articles from './_/models/Articles';
import ArticlesOptions from './_/models/ArticlesOptions';
import { articles } from '../../assets/datas/articles.js';
import articles_options from '../../assets/datas/articles_options.js';

export default async function handler(req, res) {
    
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  const { target } = req.query;
  if (!target || !['articles', 'options'].includes(target)) {
    return res.status(400).json({ error: 'Paramètre target manquant ou invalide (articles|options)' });
  }
  try {
    await dbConnect();
    if (target === 'articles') {
      await Articles.deleteMany({});
      await Articles.insertMany(articles.data);
      return res.status(200).json({ success: true, message: 'Import des articles terminé', count: articles.data.length });
    //   return res.status(200).send(`<p>Import des articles terminé (${articles.data.length})</p>`);
    }
    if (target === 'options') {
        
      await ArticlesOptions.deleteMany({});
      await ArticlesOptions.insertMany(articles_options.data);
    //   return res.status(200).send(`<p>Import des articles terminé (${articles.data.length})</p>`);
      return res.status(200).json({ success: true, message: 'Import des options terminé', count: articles_options.data.length });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
