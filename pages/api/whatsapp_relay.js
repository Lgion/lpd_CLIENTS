import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER_CYR || process.env.EMAIL_USER_MAM,
    pass: process.env.EMAIL_PASS
  }
});

function parseStaffContacts() {
  const raw = process.env.OTHERS_STAFF_WHATSAPP || '';
  const list = [];
  raw.split(',').forEach(entry => {
    const parts = entry.split(':');
    if (parts.length >= 2) {
      list.push({ name: parts[0].trim(), phone: parts[1].trim() });
    }
  });
  return list;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const { message, sender } = req.body || {};
  const staffContacts = parseStaffContacts();
  const adminEmails = (process.env.NEXT_PUBLIC_EMAIL_ADMIN || '').split(' ').filter(Boolean);

  const alertHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h3 style="color: #25D366; margin-top: 0;">💬 Message WhatsApp initié depuis le site</h3>
      <p style="color: #4a5568;"><strong>Expéditeur :</strong> ${sender || 'Visiteur du site'}</p>
      <p style="color: #4a5568;"><strong>Contenu du message :</strong></p>
      <blockquote style="border-left: 4px solid #25D366; padding-left: 12px; margin: 12px 0; color: #2d3748; font-style: italic; background: #f0fff4; padding: 10px;">
        ${message || 'Aucun message spécifié'}
      </blockquote>
      <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 16px 0;">
      <p style="font-size: 12px; color: #a0aec0; margin: 0;">
        Ce notification a été envoyée automatiquement à l'équipe du Sanctuaire (Gaston, Cyrille, Maman, P. Gilbert).
      </p>
    </div>
  `;

  const recipientEmail = process.env.EMAIL_USER_CYR || adminEmails[0] || 'hi.cyril@gmail.com';

  try {
    await transporter.sendMail({
      from: {
        name: 'Sanctuaire WhatsApp Relay',
        address: process.env.EMAIL_USER_CYR || process.env.EMAIL_USER_MAM
      },
      to: recipientEmail,
      bcc: adminEmails,
      subject: `💬 Copie du message WhatsApp envoyé au Père Gilbert`,
      html: alertHTML
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur WhatsApp relay:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
