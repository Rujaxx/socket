const mongoose = require("mongoose");

var roomSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please add a Game name"] },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  roomType: { type: String, required: [true, "Please add a Room Type"] },
});

module.exports = mongoose.model("Room", roomSchema);
