export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { orderId, amount, customerEmail, customerPhone } = req.body;

    // 1. Clés d'API et configuration depuis les variables d'environnement
    const VICTORIS_API_URL = 'https://api.victories.com/v1/charge';
    const PUBLIC_KEY = process.env.VICTORIS_PUBLIC_KEY;
    const PRIVATE_KEY = process.env.VICTORIS_PRIVATE_KEY;
    const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://votre-site.com';

    // 2. Préparation des données requises par Victoris
    const payload = {
      amount,
      currency: 'XOF',
      reference: orderId,
      description: `Commande #${orderId}`,
      customer: {
        email: customerEmail,
        phone: customerPhone,
      },
      success_url: `${APP_BASE_URL}/confirmation?status=success&orderId=${orderId}`,
      error_url: `${APP_BASE_URL}/checkout?status=failed`,
      webhook_url: `${APP_BASE_URL}/api/webhooks/victories`,
    };

    // 3. Envoi de la requête POST (fetch est natif)
    const response = await fetch(VICTORIS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-public-key': PUBLIC_KEY,
        'x-private-key': PRIVATE_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la création de la charge');
    }

    // 4. Renvoi de l'URL de paiement au frontend
    return res.status(200).json({ paymentUrl: data.payment_url });

  } catch (error) {
    console.error('Erreur Checkout Victoris:', error);
    return res.status(500).json({ error: "Impossible d'initialiser le paiement" });
  }
}
