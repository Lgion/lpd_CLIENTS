import dbConnect from '../lib/dbConnect'
import NatureSetting from '../_/models/NatureSetting'

export default async function handler(req, res) {
    await dbConnect()
    const { id } = req.query

    if (req.method === 'PUT') {
        try {
            const setting = await NatureSetting.findByIdAndUpdate(id, req.body, { new: true })
            if (!setting) return res.status(404).json({ error: 'Paramètre non trouvé' })
            return res.status(200).json({ message: 'Paramètre mis à jour', setting })
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    }

    if (req.method === 'DELETE') {
        try {
            const setting = await NatureSetting.findByIdAndDelete(id)
            if (!setting) return res.status(404).json({ error: 'Paramètre non trouvé' })
            return res.status(200).json({ message: 'Paramètre supprimé' })
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
