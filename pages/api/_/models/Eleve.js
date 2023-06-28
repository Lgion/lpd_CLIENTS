const mongoose = require('mongoose')




const studentSchema = mongoose.Schema({
    current_classe: { default: "", type: String, required },
    nom: { default: "", type: String, required },
    prenoms: { default: [], type: [String], required },
    naissance: { default: "", type: String, required },
    adresse: { default: "", type: String, required },
    parents: { default: {mere: "", pere: "", phone: ""}, type: Object, required },
    photo: { default: "", type: String, required },
    // photo: {
    //   data: Buffer,
    //   contentType: String,
    // },
    scolarity_fees: { default: {}, type: Object, required }, // => {YYYY: {}}
    bolobi_class_history: { default: {}, type: Object, required },
    school_history: { default: {}, type: Object, required },
    absences: { default: {}, type: [String], required },
    notes: { default: {}, type: Object, required },
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
    bonus: { default: [], type: [Object], required },
    manus: { default: [], type: [Object], required },
    isInterne: { default: false, type: Boolean, required },
    commentaires: { default: [], type: [Object], required },
    documents: { default: [], type: [String], required },

})

module.exports = mongoose.model('Eleves_Ecole_St_Martin', studentSchema)