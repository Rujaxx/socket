const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
});

module.exports = mongoose.model("games", GameSchema);
