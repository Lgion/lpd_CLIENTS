import mongoose from 'mongoose'

export default async function handler(req, res) {
  const { identifiant } = req.query

  if (!identifiant) {
    return res.status(400).json({ error: 'Identifiant is required' })
  }

  try {
    await mongoose.connect('mongodb+srv://archist:1&Bigcyri@cluster0.61na4.mongodb.net/?retryWrites=true&w=majority')

    const Diapos = mongoose.models.Diapos_slider || mongoose.model('Diapos_slider', new mongoose.Schema({}))
    // const diapos = await Diapos.find({ "identifiant_$_hidden": identifiant })
    const diapos = await Diapos.find()

    if (Array.isArray(diapos)) {
      res.status(200).json(diapos)
    } else {
      throw new Error('Les données récupérées ne sont pas un tableau')
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des diapos:', error)
    res.status(500).json([])  // Renvoie un tableau vide en cas d'erreur
  } finally {
    await mongoose.disconnect()
  }
}
