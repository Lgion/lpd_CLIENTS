import dbConnect from './lib/dbConnect'
import User_lpd from './_/models/User_lpd'

async function handlePost(req, res) {
  console.log(88);
  console.log(req.body);
  const { email, fullName, tel, options, communaute } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email requis' });
  }
  console.log(8);

  // On cherche l'utilisateur par email
  let user = await User_lpd.findOne({ email });
  const { commande } = req.body;

  if (user) {
    // Mettre à jour les infos client
    user.fullName = fullName || user.fullName;
    user.tel = tel || user.tel;
    user.communaute = communaute || user.communaute;
    user.options = { ...user.options, ...options };
    
    // Ajouter la commande à l'historique si présente
    if (commande) {
      if (!user.commandes) user.commandes = { ecom: [], sanctuaire: [] };
      if (!user.commandes.ecom) user.commandes.ecom = [];
      user.commandes.ecom.push(commande);
    }

    await user.save();
  } else {
    // Création du user
    user = new User_lpd({
      email,
      fullName,
      tel,
      communaute,
      options,
      commandes: {
        sanctuaire: [],
        ecom: commande ? [commande] : []
      }
    });
    await user.save();
  }

  return res.status(200).json({ success: true, user });
}

export default async function handler(req, res) {
  await dbConnect();
  console.log("\n\n\n\n\ndfijdojsdfijsdf");
  console.log(1);
  
  
  if (req.method === 'GET') {
    console.log(2);
    const { email } = req.query;
    console.log(3);
    if (!email) return res.status(400).json({ error: 'Email requis' });
    console.log(4);
    const user = await User_lpd.findOne({ email });
    console.log(5);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    console.log(6);
    return res.status(200).json({ user });
  }

  if (req.method === 'POST') {
    console.log(7);
    
    return handlePost(req, res);
  }

  return res.status(405).end();
}