const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const socketIO = require("socket.io");
const connectDB = require("./config/db");
const contactus = require("./models/ContactUs");
const { addGame, getGame, deleteGame } = require("./controllers/game");
const {
  addRoom,
  getRoom,
  getRoomById,
  allRoom,
  deleteRoom,
} = require("./controllers/room");
const {
  addUser,
  getUser,
  getUserBySocketId,
  getActiveUserForaRoom,
  deleteUser,
  deleteUserBySocketId,
} = require("./controllers/user");
const {
  addMessage,
  getMessage,
  getAllMessages,
  deleteRoomMessage,
} = require("./controllers/messages");

const {
  addGameState,
  getGameState,
  getAllGameStates,
  deleteRoomGameState,
} = require("./controllers/gameStates");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//connect to db
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);

// setup the port
const PORT = process.env.PORT || 3030;

const io = socketIO(server, {
  cors: true,
  origins: ["*"],
});

app.get("/", (req, res) => {
  res.send("Sanity Check");
});
app.post("/contactUs", async (req, res) => {
  let formData = req.body;
  await contactus
    .create(formData)
    .then((data) => {
      res
        .status(200)
        .send({ message: "Your query has been submitted successfully." });
    })
    .catch((e) => {
      console.log("error", e);
      return res
        .status(400)
        .send({ message: "Something went wrong, Please try again" });
    });
});
//*****************************************************************Socket Section************************************************************************************/
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
          roomType: "private",
        });
        const newUserData = {
          name: data?.name,
          id: socket.id,
          roomId: newRoom._id,
          gameId: checkGame._id,
        };
        let newUser = await addUser(newUserData);
        socket.join(String(newUser.roomId._id));
        let availableUsers = await getActiveUserForaRoom({
          roomId: newUser.roomId._id,
        });
        socket.emit("current user", {
          status: 200,
          currentuser: newUser,
        });
        io.to(String(newUser.roomId._id)).emit("new room member", {
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
        socket.join(String(newUser.roomId._id));
        let availableUsers = await getActiveUserForaRoom({
          roomId: newUser.roomId._id,
        });
        socket.emit("current user", {
          status: 200,
          currentuser: newUser,
        });
        io.to(String(newUser.roomId._id)).emit("new room member", {
          status: 200,
          data: availableUsers,
        });
      }
    }
    //this section for random user
    //Still Need to finalize the algorith for random user
    else {
      const allAvailableRoom = await allRoom();
      const filteringRoom = (arr) => {
        let temp = arr.filter((x) => x.roomType === "random");
        return temp;
      };
      const onlyRandomRoom = filteringRoom(allAvailableRoom);
      var joinableRoomId = "";
      for (let index = 0; index < onlyRandomRoom.length; index++) {
        let availableUsers = await getActiveUserForaRoom({
          roomId: onlyRandomRoom[index]._id,
        });
        if (!availableUsers.message && availableUsers.length < 10) {
          joinableRoomId = String(onlyRandomRoom[index]._id);
          break;
        }
      }
      if (joinableRoomId) {
        let checkingRoom = await getRoomById(joinableRoomId);
        const newUserData = {
          name: data?.name,
          id: socket.id,
          roomId: checkingRoom._id,
          gameId: checkGame._id,
        };
        let newUser = await addUser(newUserData);
        socket.join(String(newUser.roomId._id));
        let availableUsers = await getActiveUserForaRoom({
          roomId: newUser.roomId._id,
        });
        socket.emit("current user", {
          status: 200,
          currentuser: newUser,
        });
        io.to(String(newUser.roomId._id)).emit("new room member", {
          status: 200,
          data: availableUsers,
        });
      } else {
        let randomRoomName = Math.random().toString(36).substring(7);
        let newRoom = await addRoom({
          name: randomRoomName,
          gameId: checkGame._id,
          roomType: "random",
        });
        const newUserData = {
          name: data?.name,
          id: socket.id,
          roomId: newRoom._id,
          gameId: checkGame._id,
        };
        let newUser = await addUser(newUserData);
        socket.join(String(newUser.roomId._id));
        let availableUsers = await getActiveUserForaRoom({
          roomId: newUser.roomId._id,
        });
        socket.emit("current user", {
          status: 200,
          currentuser: newUser,
        });
        io.to(String(newUser.roomId._id)).emit("new room member", {
          status: 200,
          data: availableUsers,
        });
      }
    }
  });
  // when the client emits 'new message', this listens and executes
  socket.on("send message", async (data) => {
    let checkUser = await getUserBySocketId(socket.id);
    if (checkUser.message) {
      return socket.emit("new message", {
        status: 400,
        message: checkUser.message,
      });
    } else {
      const newMessage = await addMessage({
        message: data.message,
        user: checkUser._id,
        userName: checkUser.name,
        roomId: checkUser.roomId._id,
      });
      const allMsgData = await getAllMessages({ roomId: checkUser.roomId._id });
      io.to(String(checkUser.roomId._id)).emit("new message", {
        status: 200,
        data: allMsgData,
      });
    }
  });
  socket.on("receive message", async (data) => {
    const allMsgData = await getAllMessages({ roomId: data });
    io.to(String(data)).emit("new message", {
      status: 200,
      data: allMsgData,
    });
  });
  socket.on("send gameData", async (data) => {
    let checkUser = await getUserBySocketId(socket.id);
    if (checkUser.message) {
      return socket.emit("received gameData", {
        status: 400,
        message: checkUser.message,
      });
    } else {
      const checkansalreadyexsists = await getGameState({
        answer: data.answer,
        roomId: checkUser.roomId._id,
      });
      if (checkansalreadyexsists.message) {
        return socket.emit("received gameData", {
          status: 400,
          message: checkansalreadyexsists.message,
        });
      } else {
        const newGameState = await addGameState({
          answer: data.answer,
          userId: checkUser._id,
          roomId: checkUser.roomId._id,
        });
        const allGameStates = await getAllGameStates({
          roomId: checkUser.roomId._id,
        });
        io.to(String(checkUser.roomId._id)).emit("received gameData", {
          status: 200,
          data: allGameStates,
        });
      }
    }
  });
  socket.on("receive gameData", async (data) => {
    const allMsgData = await getAllGameStates({ roomId: data });
    io.to(String(data)).emit("received gameData", {
      status: 200,
      data: allMsgData,
    });
  });
  // // when the client emits 'add user', this listens and executes
  // socket.on("add user", (username) => {
  //   console.log(`${username} added`);
  //   if (addedUser) return;

  //   // we store the username in the socket session for this client
  //   socket.username = username;
  //   ++numUsers;
  //   addedUser = true;
  //   socket.emit("login", {
  //     numUsers: numUsers,
  //   });
  //   // echo globally (all clients) that a person has connected
  //   socket.broadcast.emit("user joined", {
  //     username: socket.username,
  //     numUsers: numUsers,
  //   });
  // });

  // // when the client emits 'typing', we broadcast it to others
  // socket.on("typing", () => {
  //   console.log(" user is typing");
  //   socket.broadcast.emit("typing", {
  //     username: socket.username,
  //   });
  // });

  // // when the client emits 'stop typing', we broadcast it to others
  // socket.on("stop typing", () => {
  //   socket.broadcast.emit("stop typing", {
  //     username: socket.username,
  //   });
  // });

  // // when the user disconnects.. perform this
  socket.on("disconnect", async () => {
    console.log(`${socket.id} is disconnected`);
    let checkUser = await getUserBySocketId(socket.id);
    if (!checkUser.message) {
      await deleteUserBySocketId(socket.id);
      let availableUsers = await getActiveUserForaRoom({
        roomId: checkUser.roomId._id,
      });
      const clients = io.sockets.adapter.rooms.get(
        String(checkUser.roomId._id)
      );
      if (clients === undefined) {
        await deleteRoom(checkUser.roomId._id);
        await deleteRoomMessage(checkUser.roomId._id);
        await deleteRoomGameState(checkUser.roomId._id);
      } else {
        io.to(String(checkUser.roomId._id)).emit("new room member", {
          status: 200,
          data: availableUsers,
        });
      }
    }
  });
});
//*****************************************************************End Socket Section*********************************************************************************/

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
