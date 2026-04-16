import dbConnect from './lib/dbConnect'
import Donation from './_/models/Donation'

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === 'POST') {
        try {
            const donationData = req.body.donation || req.body
            const donation = new Donation(donationData)
            await donation.save()
            return res.status(201).json({ message: 'Don enregistré avec succès !', donation })
        } catch (error) {
            console.error('Erreur POST donation:', error)
            return res.status(400).json({ error: error.message })
        }
    }

    if (req.method === 'GET') {
        try {
            const donations = await Donation.find().sort({ createdAt: -1 })
            return res.status(200).json(donations)
        } catch (error) {
            console.error('Erreur GET donation:', error)
            return res.status(500).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}