import dbConnect from './lib/dbConnect';
import Articles from './_/models/Articles';
import ArticlesOptions from './_/models/ArticlesOptions';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    try {
      const articles = await Articles.find({});
      const options = await ArticlesOptions.find({});
      return res.status(200).json({ articles, options });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { nom, prix, img, fr, fr1, user_name, auteur, taille, materiaux, autre, stock, alaune, actif } = req.body;
      if (!nom || !prix) {
        return res.status(400).json({ error: 'Champs requis manquants (nom, prix)' });
      }
      const newArticle = await Articles.create({
        nom, prix, img, fr, fr1, user_name, auteur, taille, materiaux, autre, stock, alaune, actif,
        id_produits: Date.now().toString(), // simple id unique
      });
      console.log(req.body);
      console.log(newArticle);
      console.log(alaune);
      
      return res.status(201).json({ article: newArticle });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { _id, ...updates } = req.body;
      if (!_id) return res.status(400).json({ error: 'ID requis pour la mise à jour' });
      const updatedArticle = await Articles.findByIdAndUpdate(_id, updates, { new: true });
      if (!updatedArticle) return res.status(404).json({ error: 'Article introuvable' });
      return res.status(200).json({ article: updatedArticle });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const path = require('path');
      const id = req.query.id || req.body.id;
      const src = req.query.src || req.body.src;
      const src_ = path.join(process.cwd(), "public", src)
      const src_min = src_.replace("/min","")
      if (!id||!src) return res.status(400).json({ error: 'ID requis; ou src requis' });
      const article = await Articles.findByIdAndDelete(id);
      if (!article) return res.status(404).json({ error: 'Article introuvable' });
      // Suppression des fichiers images
      const fs = require('fs');
      let errors = [];
      if (article.img) {
        console.log("lllllllllllllllll");
        console.log(src_);
        console.log(src_min);
        
        // img est du type /img/vente-religieuse/[folder]/[file.webp]
        // const imgPath = path.join(process.cwd(), 'public', 'img', 'vente-religieuse', path.basename(article.img+".webp"));
        try { if (fs.existsSync(src_)) fs.unlinkSync(src_); } catch(e){ errors.push(e.message); }
        // console.log(imgPath);
        // min path
        // const minPath = path.join(process.cwd(), 'public', 'img', 'vente-religieuse', 'min', path.basename(article.img+".webp"));
        // console.log(minPath);
        try { if (fs.existsSync(src_min)) fs.unlinkSync(src_min); } catch(e){ errors.push(e.message); }
      }
      return res.status(200).json({ success: true, errors });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    console.log("req.method");
    console.log(req.method);
    
    return res.status(405).json({ error: 'Méthode non autorisée: '+req.method });
  }
}