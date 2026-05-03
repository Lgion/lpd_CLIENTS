import dbConnect from '../lib/dbConnect'
import DonationProject from '../_/models/DonationProject'

export default async function handler(req, res) {
    await dbConnect()
    const { id } = req.query

    if (req.method === 'PUT') {
        try {
            const project = await DonationProject.findByIdAndUpdate(id, req.body, { new: true })
            if (!project) return res.status(404).json({ error: 'Projet non trouvé' })
            return res.status(200).json({ message: 'Projet mis à jour', project })
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    }

    if (req.method === 'DELETE') {
        try {
            const project = await DonationProject.findByIdAndDelete(id)
            if (!project) return res.status(404).json({ error: 'Projet non trouvé' })
            return res.status(200).json({ message: 'Projet supprimé' })
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
