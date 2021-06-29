const mongoose = require("mongoose");

var gameStateSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
});

module.exports = mongoose.model("gameState", gameStateSchema);
