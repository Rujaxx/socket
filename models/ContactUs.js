const mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: [true, "Please check Email Address"] },
  message: { type: String },
});

module.exports = mongoose.model("ContactUs", contactSchema);
