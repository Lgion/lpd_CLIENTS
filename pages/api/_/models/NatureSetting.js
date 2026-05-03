const mongoose = require('mongoose')

const natureSettingSchema = mongoose.Schema({
  label: { type: String, required: true }, // e.g., "Riz", "Huile", "Vêtements"
  unit: { type: String, required: true },  // e.g., "kg", "litre", "sac", "unité"
  icon: { type: String, required: true },  // e.g., "🌾", "🛢️", "👕"
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.NatureSetting || mongoose.model('NatureSetting', natureSettingSchema)
