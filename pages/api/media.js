
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
    if (saveLocally) {
        console.log("TRING TO WRITE IMAGE !!!!");

        options.uploadDir = path.join(process.cwd(), "/public/images/" + (req.query.pathRel || ""))
        options.filename = (name, ext, pathElt, form) => {
            const timestamp = form.fields.timestamp[0];
            const originalExt = pathElt.originalFilename.split(".").at(-1);

            // Si createdFilename est fourni (ex: le nom de base calculé par le front)
            if (req.query.createdFilename) {
                return `${req.query.createdFilename}_${timestamp}.${originalExt}`;
            }

            return `${name}_${timestamp}.${originalExt}`;
        }
    }

    const form = formidable(options)
    return new Promise((res, rej) => {
        form.parse(req, (err, fields, files) => {
            if (err) rej(err)
            res({ fields, files })
        })
    })
}


const handler = async (req, res, next) => {
    console.log(req.query);
    if (req.query.src) {
        fs.unlink(path.join(process.cwd(), "/public", req.query.src), (err) => {
            if (err) {
                console.log("ok errorrr ohh");
                console.log(err);
            }
        })
    }
    if (req.method == "POST" || req.method == "PATCH") {

        console.log("\n\n\n\nBEING WRITING IMAGES .............");
        console.log(req.url);
        console.log(req.query);
        console.log(req.query.type);




        const uploadPath = path.join(process.cwd(), "public/images", req.query.pathRel || "");
        try {
            await fs.access(uploadPath);
        } catch (err) {
            console.log("Creating directory:", uploadPath);
            await fs.mkdir(uploadPath, { recursive: true });
        }
        await readFile(req, true)
        console.log("ok done");

        res.json({ done: "fichier écrit ;)" })
    }
}


export default handler


