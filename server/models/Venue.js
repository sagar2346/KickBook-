const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  photos: {
    type: [String],
    default: []
  },
  openTime: {
    type: String,
    required: true // Format "HH:MM", e.g., "08:00"
  },
  closeTime: {
    type: String,
    required: true // Format "HH:MM", e.g., "22:00"
  },
  slotDuration: {
    type: Number,
    default: 60 // Minutes
  },
  amenities: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Venue', VenueSchema);
