import multer from "multer"
import modelSlider from './_/models/Slider'
const { createEntry, deleteEntry, modifyEntry } = require('./_/controllers/entryController')
, upload = multer()

let { schema: schemaDiapo } = modelSlider


const handler = async (req,res,next) => {


    if(req.method == "GET"){
        console.log("GET")
        console.log(schemaDiapo);
        
        res.status(200).json({schemaDiapo})
    }
    if(req.method == "POST"){
        await createEntry(req, res, next, modelSlider)
    }
    if(req.method == "PATCH"){
        await modifyEntry(req,res,next,modelSlider)
    }
    if(req.method == "DELETE"){
        await deleteEntry(req,res,next,modelSlider)
    }
}


export default handler


