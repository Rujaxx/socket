const mongoose = require("mongoose");

var gameStateSchema = new mongoose.Schema({
    gameState: [],  
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
});

module.exports = mongoose.model("gameState", gameStateSchema);
