const mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please add a Game name"] },
});

module.exports = mongoose.model("Game", gameSchema);
