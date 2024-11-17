// import multer from "multer"
import modelSlider from './_/models/Slider'
const { createEntry, deleteEntry, modifyEntry } = require('./_/controllers/entryController')
// , upload = multer()

const handler = async (req,res,next) => {


    if(req.method == "GET"){
        console.log("GET")
        // console.log(modelSlider.schema);
        res.status(200).json({schemaDiapo: modelSlider.schema})
    }
    if(req.method == "POST"){

        console.log(req.body);
        // console.log(Object.keys(req.body));
        // upload.array(req)
        // console.log(req.body);
        console.log(typeof req.body);

        console.log("JES UI LAAAAAA");
        
        // res.status(201).json({message: "okok"})
        createEntry(req, res, next, modelSlider)
    }
    if(req.method == "PATCH"){
        console.log("ouiiiiiiiiii");
        console.log(req.body);
        modifyEntry(req,res,next,modelSlider)
    }
    if(req.method == "DELETE"){
        console.log("DANS DELETE");
        console.log(req.body);
        console.log(req.query);
        deleteEntry(req,res,next,modelSlider)
    }
}


export default handler


