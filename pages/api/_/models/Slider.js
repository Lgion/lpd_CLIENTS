const mongoose = require('mongoose')
, sliderSchema = mongoose.Schema({
    identifiant_$_hidden: {default:"", type: String}
    , src_$_file: {default: "", type: String}
    , alt: {default: "", type: String}
    , title: {default: "", type: String}
    , figcaption: {default: "", type: String}
    , p: {default: "", type: String}
    , metas: {default: {}, type: Object}
})

let modelDiapo

if(!mongoose.models?.["Diapos_slider"]){
    modelDiapo = mongoose.model('Diapos_slider', sliderSchema)
}else{
    modelDiapo = mongoose.model("Diapos_slider")
}
module.exports = modelDiapo