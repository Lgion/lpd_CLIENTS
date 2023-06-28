const mongoose = require('mongoose')
const teacherSchema = require("./Teacher")
const studentSchema = require("./Eleve")




const classeSchema = mongoose.Schema({
    professeur: { default: "", type: [teacherSchema], required },
    eleves: { default: [], type: [studentSchema], required },
    annee: { default: "", type: String, required },
    niveau: { default: "", type: String, required },
    alias: { default: "", type: String, required },
    photo: { default: "", type: String, required },
    // photo: {
    //   data: Buffer,
    //   contentType: String,
    // },
    homework: { default: {}, type: Object, required },
    // absences: { default: {}, type: Object, required },
    compositions: { default: [], type: Object, required },
    moyenne_trimetriel: {
        default: ["", "", ""], type: [String],
        validate: {
            validator: function (eleves) {
                return eleves.length === 3;
            },
            message: 'Le champ "eleves" doit contenir exactement 3 valeurs.',
        },
    },
    commentaires: { default: [], type: [Object], required },

})

module.exports = mongoose.model('Ecole_St_Martin', classeSchema)