const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  id: {
    type: String,
    required: [true, "Please add a name"],
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "rooms",
    required: true,
  },
});

module.exports = mongoose.model("users", UserSchema);
