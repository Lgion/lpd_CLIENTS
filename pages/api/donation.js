import dbConnect from './lib/dbConnect'
import Donation from './_/models/Donation'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER_CYR,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function sendAdminNotification(donation) {
    try {
        const emailContent = `
            <h2>Nouveau Don Reçu - École Saint Martin</h2>
            <p>Un nouveau don a été enregistré sur le site.</p>
            <ul>
                <li><strong>Donateur :</strong> ${donation.firstname} ${donation.lastname || ''}</li>
                <li><strong>Type :</strong> ${donation.donation_type}</li>
                <li><strong>Montant :</strong> ${donation.montant || 0} FCFA</li>
                <li><strong>Email :</strong> ${donation.email || 'Non fourni'}</li>
                <li><strong>Téléphone :</strong> ${donation.phone_number}</li>
                <li><strong>Message/Raison :</strong> ${donation.reason || 'Aucun'}</li>
            </ul>
            ${donation.donation_type === 'nature' ? `<p><strong>Détails Nature :</strong> ${donation.nature || 'Voir items détaillés'}</p>` : ''}
            <p>Connectez-vous à l'administration pour plus de détails.</p>
        `;

        await transporter.sendMail({
            from: {
                name: 'Bolobi - École Saint Martin',
                address: process.env.EMAIL_USER_CYR
            },
            to: process.env.NEXT_PUBLIC_EMAIL_ADMIN,
            subject: `Nouveau don - ${donation.donation_type} - ${donation.firstname}`,
            html: emailContent
        });
        return true;
    } catch (error) {
        console.error('Erreur envoi email admin:', error);
        return false;
    }
}

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === 'POST') {
        try {
            const donationData = req.body.donation || req.body
            const donation = new Donation(donationData)
            await donation.save()
            
            // Envoyer notification email à l'admin
            await sendAdminNotification(donation)

            return res.status(201).json({ message: 'Don enregistré avec succès !', donation })
        } catch (error) {
            console.error('Erreur POST donation:', error)
            return res.status(400).json({ error: error.message })
        }
    }

    if (req.method === 'GET') {
        try {
            const query = {}
            if (req.query.user_id) {
                query.user_id = req.query.user_id
            }
            const donations = await Donation.find(query)
                .populate('project_id')
                .sort({ createdAt: -1 })
            return res.status(200).json(donations)
        } catch (error) {
            console.error('Erreur GET donation:', error)
            return res.status(500).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}