const mongoose = require('mongoose')




const reservationSchema = mongoose.Schema({
  community: { default:"0", type: String },
  names: { default:"John smith", type: String, required: true },
  phone_number: { default:"+2250102030405", type: String, required: true },
  email: { default:"a@b.c", type: String, required: true },
  from: { default:1686007599860, type: Date, required: true },
  to: { default:1686007699860, type: Date, required: true },
  sleep: { default:0, type: Number, required: true },
  // type_reservation: { default:0, type: Number, required: true },
  participants: { default:1, type: Number, required: true },
  message: { default:"", type: String },
})


let modelReservation = !mongoose.modelNames().includes("Reservation_PDA")
  ? mongoose.model('Reservation_PDA', reservationSchema)
  : mongoose.model("Reservation_PDA")


module.exports = modelReservation

  
  