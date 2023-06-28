const mongoose = require('mongoose')
const classeSchema = require("./Classe")

const teacherSchema = mongoose.Schema({
    current_classes: { default: "", type: [classeSchema], required },
    nom: { default: "", type: String, required },
    prenoms: { default: [], type: [String], required },
    naissance: { default: "", type: String, required },
    adresse: { default: "", type: String, required },
    photo: { default: "", type: String, required },
    phone: { default: "", type: String, required },
    email: { default: "", type: String, required },
})


module.exports = mongoose.model('Profs_Ecole_St_Martin', teacherSchema)