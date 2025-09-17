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
  console.log(9);

  if (user) {
    console.log(10);
    // Optionnel: mettre à jour les infos client si besoin
    user.fullName = user.fullName || fullName;
    user.tel = user.tel || tel;
    user.communaute = user.communaute || communaute;
    user.options = { ...options, ...user.options };
    console.log(11);
    await user.save();
  } else {
    console.log("10b");
    console.log("10b");
    // Création du user
    user = new User_lpd({
      email,
      fullName,
      tel,
      communaute,
      options,
      commandes: {
        sanctuaire: [],
        ecom: []
      }
    });
    console.log("11b");
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