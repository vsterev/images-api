const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  inputDate: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model("Image", imageSchema);
