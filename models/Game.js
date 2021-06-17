const mongoose = require("mongoose");

var gameSchema = mongoose.Schema({
  name: { type: String, required: [true, "Please add a Game name"] },
});

module.exports = mongoose.model("Game", gameSchema);
