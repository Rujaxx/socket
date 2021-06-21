const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const socketIO = require("socket.io");
const connectDB = require("./config/db");
const {
  addUser,
  getUser,
  getActiveUserForaRoom,
  getUserBySocketId,
  deleteUser,
  deleteUserBySocketId,
} = require("./controllers/user");
const { addGame, getGame } = require("./controllers/game");
const { addRoom, getRoom } = require("./controllers/room");
const { addMessage, getMessage } = require("./controllers/messages");
const { deletewithfield } = require("./Repository/userRepo");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//connect to db
connectDB();

const app = express();
app.use(express.json());
const server = http.createServer(app);

// setup the port
const PORT = process.env.PORT || 3030;

const io = socketIO(server, {
  cors: true,
  origins: ["*"],
});

app.get("/addGame", async (req, res) => {
  let resp = await addGame(req.body);
  res.send(resp);
  // res.send("This is sanity checking");
});
app.get("/addRoom", async (req, res) => {
  let resp = await addRoom(req.body);
  res.send(resp);
  // res.send("This is sanity checking");
});
app.get("/addUser", async (req, res) => {
  let resp = await addUser(req.body);
  res.send(resp);
  // res.send("This is sanity checking");
});
app.get("/", async (req, res) => {
  let resp = await getActiveUserForaRoom(req.body);
  res.send(resp);
  // res.send("This is sanity checking");
});

// app.get("/messages", (req, res) => {
//   Message.find({}, (err, messages) => {
//     res.send(messages);
//   });
// });

app.get("/messages",async (req, res) => {
   let resp = await addMessage(req.body);
   res.send(resp);
})

// Chatroom

let numUsers = 0;

io.on("connection", (socket) => {
  console.log(`${socket.id} is connected`);
  //user Try to join a room
  socket.on("join room", async (data) => {
    //checking if user is already active
    let checkUser = await getUser({ name: data.name, id: socket.id });
    //If user found, return error to client
    if (checkUser._id) {
      return socket.emit("new room member", {
        status: 400,
        message: "You are already in a room",
      });
    }
    //checking if game is available or not
    let checkGame = await getGame({ name: data.game });
    //If game not found, return error to client
    if (!checkGame._id) {
      return socket.emit("new room member", {
        status: 400,
        message: checkGame.message,
      });
    }
    //checking if room is active or not
    let checkRoom = await getRoom({ name: data.room, gameId: checkGame._id });
    if (data?.type === "createRoom") {
      //already room is created, return error to client
      if (checkRoom._id) {
        return socket.emit("new room member", {
          status: 400,
          message:
            "Same room already created,Kindly join or create another room",
        });
      } else {
        let newRoom = await addRoom({
          name: data.room,
          gameId: checkGame._id,
        });
        const newUserData = {
          name: data?.name,
          id: socket.id,
          roomId: newRoom._id,
          gameId: checkGame._id,
        };
        let newUser = await addUser(newUserData);
        socket.join(newUser.roomId._id);
        let availableUsers = await getActiveUserForaRoom({
          roomId: newUser.roomId._id,
        });
        io.to(newUser.roomId._id).emit("new room member", {
          status: 200,
          data: availableUsers,
        });
      }
    } else if (data?.type === "joinFriends") {
      if (!checkRoom._id) {
        return socket.emit("new room member", {
          status: 400,
          message:
            "There is no room with the same name, Please create or join another Room",
        });
      } else {
        const newUserData = {
          name: data?.name,
          id: socket.id,
          roomId: checkRoom._id,
          gameId: checkGame._id,
        };
        let newUser = await addUser(newUserData);
        socket.join(newUser.roomId._id);
        let availableUsers = await getActiveUserForaRoom({
          roomId: newUser.roomId._id,
        });
        io.to(newUser.roomId._id).emit("new room member", {
          status: 200,
          data: availableUsers,
        });
      }
    }
    //this section for random user
    //Still Need to finalize the algorith for random user
    else {
      // let randomRoomName = Math.random().toString(36).substring(7);
      // let newRoom = await addRoom({
      //   name: randomRoomName,
      //   gameId: checkGame._id,
      // });
      // const newUserData = {
      //   name: data?.name,
      //   id: socket.id,
      //   roomId: newRoom._id,
      //   gameId: checkGame._id,
      // };
      // socket.join(newUser.roomId._id);
      // let availableUsers = await getActiveUserForaRoom({
      //   roomId: newUser.roomId._id,
      // });
      // io.to(newUser.roomId._id).emit("new room member", {
      //   status: 200,
      //   data: availableUsers,
      // });
    }
  });

  // when the client emits 'new message', this listens and executes
  socket.on("new message", async(data) => {
    console.log(data);
    // we tell the client to execute 'new message'
    const newMessage = await addMessage({
      message: data.message,
      user: data.user,
    });
    socket.emit("new message", {
      status: 200,
      data: newMessage,
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on("add user", (username) => {
    console.log(`${username} added`);
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit("login", {
      numUsers: numUsers,
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit("user joined", {
      username: socket.username,
      numUsers: numUsers,
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on("typing", () => {
    console.log(" user is typing");
    socket.broadcast.emit("typing", {
      username: socket.username,
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing", {
      username: socket.username,
    });
  });

  // // when the user disconnects.. perform this
  socket.on("disconnect", () => {
    console.log(`${socket.id} is disconnected`);
    // echo globally that this client has left
    socket.broadcast.emit("user left", {
      username: socket.username,
      numUsers: numUsers,
    });
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
