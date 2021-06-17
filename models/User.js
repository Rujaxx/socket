const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please add a User name"] },
  id: { type: String, required: [true, "Please add a id"] },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
