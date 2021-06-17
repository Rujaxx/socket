const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  Message: {
    type: String,
    required: [true, "Please add a name"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
