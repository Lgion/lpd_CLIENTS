// API RESTful pour les élèves
import dbConnect from '../lib/dbConnect';
import Eleve from '../_/models/ai/Eleve';

export default async function handler(req, res) {
  await dbConnect();
  switch (req.method) {
    case 'GET':
      const eleves = await Eleve.find();
      res.status(200).json(eleves);
      break;
    case 'POST':
      console.log('REQ.BODY ELEVE:', req.body);
      const created = await Eleve.create(req.body);
      res.status(201).json(created);
      break;
    case 'PUT':
      const updated = await Eleve.findByIdAndUpdate(req.body._id, req.body, { new: true });
      res.status(200).json(updated);
      break;
    case 'DELETE':
      await Eleve.findByIdAndDelete(req.body._id);
      res.status(204).end();
      break;
    default:
      res.status(405).end();
  }
}
