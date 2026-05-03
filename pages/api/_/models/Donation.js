const mongoose = require('mongoose')




const donationSchema = mongoose.Schema({
  user_id: { type: String, required: true }, // Clerk or custom user ID
  donation_type: { type: String, enum: ["argent", "nature", "scolarity", "projects"], default: "argent" },
  firstname: { type: String, required: true },
  lastname: { type: String },
  communauty: { type: String },
  reason: { type: String },
  phone_number: { type: String, required: true },
  email: { type: String },
  montant: { type: Number, default: 0 },
  
  // Nature specifics
  nature: { type: String }, // General description
  nature_items: [{
    setting_id: { type: mongoose.Schema.Types.ObjectId, ref: 'NatureSetting' },
    label: { type: String },
    unit: { type: String },
    quantity: { type: Number }
  }],
  
  // Projects specifics
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationProject' },
  
  // Scolarity specifics (admin assigns student later)
  scolarity_student_assigned: { type: Boolean, default: false },
  scolarity_student: {
    sexe: { type: String },
    nom: { type: String },
    prenoms: { type: String },
    age: { type: Number },
    classe: { type: String },
    description: { type: String },
    photo: { type: String }
  },
  
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Donation_PDA || mongoose.model('Donation_PDA', donationSchema)