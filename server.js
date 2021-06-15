const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv")
const socketIO = require("socket.io"); 
const connectDB = require('./config/db');
const Message = require('./models/messages')


//Load env vars
dotenv.config ({path:'./config/config.env'});

//connect to db
connectDB();

const app = express();
const server = http.createServer(app);

// setup the port 
const PORT = process.env.PORT || 3030;


const io = socketIO(server, {
  cors: true,
  origins:["*"]
});

app.get('/',(req,res)=>{
  res.send("hello World")
})

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})

// Chatroom
io.on('connection', (socket) => {
  socket.on('login', ({ name, room }, callback) => {
      const { user, error } = addUser(socket.id, name, room)
      if (error) return callback(error)
      socket.join(user.room)
      socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
      io.in(room).emit('users', getUsers(room))
      callback()
  })

  socket.on('sendMessage', message => {
      const user = getUser(socket.id)
      io.in(user.room).emit('message', { user: user.name, text: message });
  })

  socket.on("disconnect", () => {
      console.log("User disconnected");
      const user = deleteUser(socket.id)
      if (user) {
          io.in(user.room).emits('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
          io.in(user.room).emit('users', getUsers(user.room))
      }
  })
})



  server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
  });