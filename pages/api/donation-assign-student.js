import dbConnect from './lib/dbConnect'
import Donation from './_/models/Donation'

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === 'POST') {
        try {
            const { donationId, studentData } = req.body;
            const donation = await Donation.findByIdAndUpdate(
                donationId, 
                { 
                    scolarity_student_assigned: true,
                    scolarity_student: studentData
                },
                { new: true }
            );
            return res.status(200).json({ message: 'Elève assigné avec succès', donation })
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    }

    res.status(405).end(`Method ${req.method} Not Allowed`)
}
