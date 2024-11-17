// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const mongoose = require('mongoose')
const {createReservation} = require("./_/controllers/reservation")

export default function handler(req, res, next) {
  // console.log("\n\n\n\n!!!!!!!!!!!!!!");
  // console.log(req);
  console.log("\n\n\n\n_________")
  console.log(req.method)
  console.log("\n\n\n\n-----------")
  console.log(req.body)
  console.log("\n\n\n\n??????????")
  if (req.method === 'POST') {
    console.log('......dans reservation POST......')
    mongoose.connect('mongodb+srv://archist:1&Bigcyri@cluster0.61na4.mongodb.net/?retryWrites=true&w=majority',
      { useNewUrlParser: true,
        useUnifiedTopology: true 
      }
    )
      .then(() => {
        console.log('Connexion à MongoDB réussie !')
        createReservation(req,res,next)
      })
      .catch((e) => console.log(e,'Connexion à MongoDB échouée !'))
  }
}
