// API RESTful pour les enseignants
import dbConnect from '../lib/dbConnect';
import Teacher from '../_/models/ai/Teacher';

export default async function handler(req, res) {
  await dbConnect();
  switch (req.method) {
    case 'GET':
      const enseignants = await Teacher.find();
      res.status(200).json(enseignants);
      break;
    case 'POST':
      const created = await Teacher.create(req.body);
      res.status(201).json(created);
      break;
    case 'PUT':
      const updated = await Teacher.findByIdAndUpdate(req.body._id, req.body, { new: true });
      res.status(200).json(updated);
      break;
    case 'DELETE':
      await Teacher.findByIdAndDelete(req.body._id);
      res.status(204).end();
      break;
    default:
      res.status(405).end();
  }
}
