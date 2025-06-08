// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const mongoose = require('mongoose')
const {getStudents,getTeachers} = require("./_/controllers/members")
const EleveModel = require('./_/models/old/Eleve')
const ProfModel = require('./_/models/old/Teacher')
const ClasseModel = require('./_/models/old/Classe')


export default async function handler(req, res, next) {
    // console.log("\n\n\n\n_________je suis dans members.js")
    // console.log(req.method)
    // console.log("\n\n\n\n-----------")
    // console.log(req.body)
    // console.log("\n\n\n\n??????????")

    // Connexion à MongoDB si nécessaire
    if (mongoose.connection.readyState !== 1) {
        console.log('API - Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('API - Connecté à MongoDB');
    }



    if(req.method == "GET"){

        const eleves = await EleveModel.find()
        const profs = await ProfModel.find()
        const school = await ClasseModel.find()
        res.status(200).json({eleves,profs,school})
        // .then((eleves) => {
        //     res.status(200).json(eleves)
        // }).catch((error) => {
        //     res.status(400).json({error: error})
        // })
        
    }
        
    if(req.method == "POST"){
        console.log("i am in POST of eleves api");
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