const fs = require('fs')
    , path = require('path')
    , multer = require('../middlewares/multer')
    , mongoose = require('mongoose')
    , https = require('https')

// Helper pour rapatrier une image externe
const repatriateImage = async (url) => {
    if (!url || !url.startsWith('http')) return url;
    
    const uploadDir = path.join(process.cwd(), 'public/img/blog');
    try {
        const testFile = path.join(uploadDir, '.write-test');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
    } catch (e) {
        return url;
    }

    return new Promise((resolve) => {
        const ext = path.extname(new URL(url).pathname) || '.webp';
        const filename = `repatriated-${Date.now()}${ext}`;
        const dest = path.join(uploadDir, filename);
        const file = fs.createWriteStream(dest);

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(dest);
                return resolve(url);
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(`/img/blog/${filename}`);
            });
        }).on('error', () => {
            file.close();
            if (fs.existsSync(dest)) fs.unlinkSync(dest);
            resolve(url);
        });
    });
};











exports.createEntry = async (req, res, next, Model) => {
    // let test = await connectToDatabase.connect();
    // console.log(test,"Pinged your deployment. You successfully connected to MongoDB!");
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // await connectToDatabase();
    console.log(req.body)
    console.log(typeof req.body)
    // console.log(typeof req.body[modelKey])

    delete req.body.modelKey
    delete req.body.timestamp
    console.log('oijiojiojoioijfdsoijfdoijfoijfdsoijfdsijfds')
    const entryObject = req.body
    console.log('2oijiojiojoioijfdsoijfdoijfoijfdsoijfdsijfds')
    // const entryObject = JSON.parse(req.body.entry)

    // console.log(model);

    // multer(req,res,next)



    console.log(entryObject);
    console.log(Model);
    console.log("lààà");





    // Rapatriement automatique si URL externe
    if (entryObject['src_$_file']) {
        entryObject['src_$_file'] = await repatriateImage(entryObject['src_$_file']);
    }

    mongoose.connect('mongodb+srv://archist:1&Bigcyri@cluster0.61na4.mongodb.net/?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
        .then(() => {
            console.log('Connexion à MongoDB réussie !')

            const entry = new Model({
                ...entryObject
                // , userId: req.auth.userId
                // , imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            })
            console.log(entry);
            console.log('3oijiojiojoioijfdsoijfdoijfoijfdsoijfdsijfds')
            entry.save()

                .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
                .catch(error => { res.status(400).json({ error, msg: "mon custome msg !!" }) })
            console.log('4oijiojiojoioijfdsoijfdoijfoijfdsoijfdsijfds')
        })
        .catch((e) => console.log(e, 'Connexion à MongoDB échouée !'))
}
exports.modifyEntry = async (req, res, next, Model) => {

    console.log(req.query._id);
    delete req.body.modelKey
    delete req.body.timestamp
    const entryObject = req.body

    // Rapatriement automatique si URL externe
    if (entryObject['src_$_file']) {
        entryObject['src_$_file'] = await repatriateImage(entryObject['src_$_file']);
    }

    mongoose.connect('mongodb+srv://archist:1&Bigcyri@cluster0.61na4.mongodb.net/?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    ).then(() => {
        Model.findOneAndUpdate({ _id: req.query._id },{ ...entryObject })
            .then((resp) => {
                console.log("ok del");
                res.status(201).json({ message: 'Objet modifié!' ,resp})
            })
            .catch((error) => {
                console.log("hmm.. err");
                res.status(400).json({ error })
            })
    }).catch(e => {
        console.log(e, 'Connexion à MongoDB échouée !');
        res.status(500).json({ error: 'Database connection failed' });
    });
}
exports.deleteEntry = async (req, res, next, Model) => {
    mongoose.connect('mongodb+srv://archist:1&Bigcyri@cluster0.61na4.mongodb.net/?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
        .then(() => {
            const relativePath = req.query.src;
            const fullPath = path.join(process.cwd(), "/public", relativePath);
            const archiveDir = path.join(process.cwd(), "/public/img/blog/archive");

            if (fs.existsSync(fullPath)) {
                if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
                const archivedName = `${Date.now()}-${path.basename(fullPath)}`;
                try {
                    fs.renameSync(fullPath, path.join(archiveDir, archivedName));
                } catch (e) { console.error("Archive error:", e); }
            }

            Model.deleteOne({ _id: req.query._id })
                    .then(() => {
                        console.log("eeeeeeeeeeeend ok");
                        res.status(200).json({ message: 'Objet supprimé !' })
                    })
                    .catch(error => {
                        console.log("eeeeeeeeeeeend not ok");
                        res.status(401).json({ error })
                    })
        })
}
