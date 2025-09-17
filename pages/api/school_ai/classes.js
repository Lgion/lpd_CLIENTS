// API RESTful pour les classes
import dbConnect from '../lib/dbConnect';
import Classe from '../_/models/ai/Classe';

export default async function handler(req, res) {
  await dbConnect();
  switch (req.method) {
    case 'GET':
      const classes = await Classe.find();
      res.status(200).json(classes);
      break;
    case 'POST':
      const created = await Classe.create(req.body);
      res.status(201).json(created);
      break;
    case 'PUT':
      const updated = await Classe.findByIdAndUpdate(req.body._id, req.body, { new: true });
      res.status(200).json(updated);
      break;
    case 'DELETE':
      await Classe.findByIdAndDelete(req.body._id);
      res.status(204).end();
      break;
    default:
      res.status(405).end();
  }
}
