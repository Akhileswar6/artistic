const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  instagramLink: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  displayLocations: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model("Gallery", gallerySchema);
