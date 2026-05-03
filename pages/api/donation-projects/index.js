import dbConnect from '../lib/dbConnect'
import DonationProject from '../_/models/DonationProject'

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === 'GET') {
        try {
            const projects = await DonationProject.find().sort({ createdAt: -1 })
            return res.status(200).json(projects)
        } catch (error) {
            console.error('Erreur GET projects:', error)
            return res.status(500).json({ error: error.message })
        }
    }

    if (req.method === 'POST') {
        try {
            const project = new DonationProject(req.body)
            await project.save()
            return res.status(201).json({ message: 'Projet créé', project })
        } catch (error) {
            console.error('Erreur POST project:', error)
            return res.status(400).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
