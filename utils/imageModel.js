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
    type: Number
  },
  longitude: {
    type: Number,
  },
  inputDate: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model("Image", imageSchema);
