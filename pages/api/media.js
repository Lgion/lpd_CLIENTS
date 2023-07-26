
import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'


export const config = {
    api: {
        bodyParser: false
    }
}



const readFile = (req, saveLocally) => {
    console.log('reeeeeeead');
    // console.log(req);
    console.log(Object.keys(req));
    const options = {}
    if(saveLocally){
        options.uploadDir = path.join(process.cwd(), "/public/images")
        options.filename = (name,ext,path,form) => {
            console.log(name);
            console.log(path);
            // console.log("\n\n\nfdfdsfdsfdsfds\n\n\n");
            // console.log(form);
            console.log(form.fields.timestamp[0]);
            console.log(name);
            console.log(ext);
            console.log(name + "_" + form.fields.timestamp[0] + "." + path.originalFilename.split(".").at(-1));
            return name + "_" + form.fields.timestamp[0] + "." + path.originalFilename.split(".").at(-1)
        }
    }
    
    const form = formidable(options)
    return new Promise((res,rej) => {
        form.parse(req, (err,fields,files)=>{
            if(err)rej(err)
            res({fields,files})
        })
    })
}


const handler = async (req,res,next) => {
    console.log(req.query);
    if(req.query.src){
        fs.unlink(path.join(process.cwd(), "/public", req.query.src), (err) => {
            if(err)
                console.log(err);
        })
    }
    if(req.method == "POST" || req.method == "PATCH"){

        try{
            await fs.readdir(path.join(process.cwd()+"/public","/images"))
        }catch(err){
            await fs.mkdir(path.join(process.cwd()+"/public","/images"))
        }
        await readFile(req,true)
        res.json({done: "fichier écrit ;)"})
    }
}


export default handler


