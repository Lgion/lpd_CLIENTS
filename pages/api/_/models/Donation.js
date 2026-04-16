const mongoose = require('mongoose')




const donationSchema = mongoose.Schema({
  donation_type: { type: String, enum: ["argent", "nature", "both"], default: "argent" },
  firstname: { type: String, required: true },
  lastname: { type: String },
  communauty: { type: String },
  reason: { type: String },
  phone_number: { type: String, required: true },
  email: { type: String },
  montant: { type: Number, default: 0 },
  nature: { type: String },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Donation_PDA || mongoose.model('Donation_PDA', donationSchema)