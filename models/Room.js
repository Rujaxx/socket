const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "games",
    required: true,
  },
});

module.exports = mongoose.model("rooms", RoomSchema);
