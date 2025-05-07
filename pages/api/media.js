
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
        options.uploadDir = path.join(process.cwd(), "/public/school/"+req.query.type)
        options.filename = (name,ext,path,form) => {
            console.log(name);
            console.log(path);
            // console.log("\n\n\nfdfdsfdsfdsfds\n\n\n");
            // console.log(form);
            console.log(form.fields.timestamp[0]);
            console.log(name);
            console.log(ext);
            console.log(name + "_" + form.fields.timestamp[0] + "." + path.originalFilename.split(".").at(-1));
            return req.query.createdFilename + "_" + form.fields.timestamp[0] + "." + path.originalFilename.split(".").at(-1)
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
            if(err){
                console.log("ok errorrr ohh");
                console.log(err);
            }        
        })
    }
    if(req.method == "POST" || req.method == "PATCH"){

        console.log("\n\n\n\nBEING WRITING IMAGES .............");
        console.log(req.url);
        console.log(req.query);
        console.log(req.query.type);
        
        
        
        
        try{
            await fs.readdir(path.join(process.cwd()+"/public","/school/"+req.query.type))
        }catch(err){
            console.log("ok errorrr");
            await fs.mkdir(path.join(process.cwd(), "/public/school/students"), { recursive: true });
            await fs.mkdir(path.join(process.cwd(), "/public/school/teachers"), { recursive: true });
            await fs.mkdir(path.join(process.cwd(), "/public/school/classes"), { recursive: true });
        }
        await readFile(req,true)
        console.log("ok done");

        res.json({done: "fichier écrit ;)"})
    }
}


export default handler


