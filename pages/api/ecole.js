// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const mongoose = require('mongoose')
const {getModels,createSchool} = require("./_/controllers/ecole")


export default function handler(req, res, next) {
    // console.log("\n\n\n\n_________je suis dans members.js")
    // console.log(req.method)
    // console.log("\n\n\n\n-----------")
    // console.log(req.body)
    // console.log("\n\n\n\n??????????")

    if(req.method == "GET")
        getModels(req,res,next)
    if(req.method == "POST"){
        console.log("i am in POST of ecole api");
        createSchool(req,res,next)
        // res.status(201).json({message: "okok"})
    }



//   if (req.method === 'POST') {
//     console.log('......dans donation POST......')
//     mongoose.connect('mongodb+srv://archist:1&Bigcyri@cluster0.61na4.mongodb.net/?retryWrites=true&w=majority',
//       { useNewUrlParser: true,
//         useUnifiedTopology: true 
//       }
//     )
//       .then(() => {
//         console.log('Connexion à MongoDB réussie !')
//         createDonation(req,res,next)
//       })
//       .catch((e) => console.log(e,'Connexion à MongoDB échouée !'))
//   }

}