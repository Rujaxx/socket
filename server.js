const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io"); 


const app = express();
const server = http.createServer(app);



// setup the port our backend app will run on
const PORT = process.env.PORT || 3030;
const NEW_MESSAGE_EVENT = "new-message-event";

const io = socketIO(server, {
  cors: true,
  origins:["*"]
});

app.get('/',(req,res)=>{
  res.send("hello World")
})


const room = "general"

io.on("connection", (socket) => {
    socket.join(room);
    
    socket.on(NEW_MESSAGE_EVENT, (data) => {
      io.in(room).emit(NEW_MESSAGE_EVENT, data);
    });
  
    socket.on("disconnect", () => {
      socket.leave(room);
    });
  });

  server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
  });