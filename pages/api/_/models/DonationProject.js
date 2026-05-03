const mongoose = require('mongoose')

const donationProjectSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  target_amount: { type: Number, default: 0 },
  current_amount: { type: Number, default: 0 },
  image: { type: String },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.DonationProject || mongoose.model('DonationProject', donationProjectSchema)
