const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io"); 


const app = express();
const server = http.createServer(app);



// setup the port our backend app will run on
const PORT = process.env.PORT || 3030;

const io = socketIO(server, {
  cors: true,
  origins:["*"]
});

app.get('/',(req,res)=>{
  res.send("hello World")
})


// Chatroom

let numUsers = 0;

io.on('connection', (socket) => {
  let addedUser = false;
  console.log("user connected")

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    console.log(data);
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data,
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    console.log(`${username} added`)
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    console.log(" user is typing")
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    console.log(`${username} disconnected`)
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

  server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
  });