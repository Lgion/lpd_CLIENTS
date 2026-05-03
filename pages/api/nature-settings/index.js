import dbConnect from '../lib/dbConnect'
import NatureSetting from '../_/models/NatureSetting'

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === 'GET') {
        try {
            const settings = await NatureSetting.find().sort({ createdAt: -1 })
            return res.status(200).json(settings)
        } catch (error) {
            console.error('Erreur GET nature-settings:', error)
            return res.status(500).json({ error: error.message })
        }
    }

    if (req.method === 'POST') {
        try {
            const setting = new NatureSetting(req.body)
            await setting.save()
            return res.status(201).json({ message: 'Paramètre Nature créé', setting })
        } catch (error) {
            console.error('Erreur POST nature-setting:', error)
            return res.status(400).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
