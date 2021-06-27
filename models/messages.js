const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    Message: {
      type: String,
      required: [true, 'Please add a name']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
      }
})

module.exports = mongoose.model("message", MessageSchema)



