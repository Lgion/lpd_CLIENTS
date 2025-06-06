import dbConnect from './lib/dbConnect'
import User_lpd from './_/models/User_lpd'

async function handlePost(req, res) {
  const { email, fullName, tel, options, commande } = req.body;

  if (!email || !commande) {
    return res.status(400).json({ error: 'Email et commande requis' });
  }

  // On cherche l'utilisateur par email
  let user = await User_lpd.findOne({ email });

  if (user) {
    // Ajout à l'historique ecom
    user.commandes.ecom.push(commande);
    // Optionnel: mettre à jour les infos client si besoin
    user.fullName = user.fullName || fullName;
    user.tel = user.tel || tel;
    user.options = { ...options, ...user.options };
    await user.save();
  } else {
    // Création du user avec la commande ecom dans l'historique
    user = new User_lpd({
      email,
      fullName,
      tel,
      options,
      commandes: {
        sanctuaire: [],
        ecom: [commande]
      }
    });
    await user.save();
  }

  return res.status(200).json({ success: true, user });
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email requis' });
    const user = await User_lpd.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    return res.status(200).json({ user });
  }

  if (req.method === 'POST') {
    return handlePost(req, res);
  }

  return res.status(405).end();
}