const {
  createwithfield,
  findById,
  findbyfield,
  findallbyfield,
  updatewithfield,
  updatewithID,
  deletewithfield,
  deletewithID,
} = require("../Repository/userRepo");

const addUser = async (data) => {
  //data = { name: "tempUser1", roomId: "60c967ad4822f33ea1f82bcd",gameId: "60c967ad4822f33ea1f82bcd",id: "12345678" }
  if (!data || !data.name || !data.roomId || !data.id || !data.gameId)
    return { message: "Please check the details carefully" };
  const existingUser = await findbyfield(data);
  if (existingUser) {
    return { message: "Same user already exists." };
  }
  const newUser = await createwithfield(data);
  return newUser;
};

const getUser = async (data) => {
  if (!data || !data.name || !data.id)
    return { message: "Please check the details carefully" };
  const existingUser = await findbyfield(data);
  if (!existingUser) {
    return { message: "Sorry, no user found with the same details" };
  }
  return existingUser;
};
const getUserBySocketId = async (id) => {
  //id = socket.id
  if (!id || id === "")
    return { message: "Please check the details carefully" };
  const existingUser = await findbyfield({ id });
  if (!existingUser) {
    return { message: "Sorry, no user found with the same details" };
  }
  return existingUser;
};
const getActiveUserForaRoom = async (fields) => {
  const allActiveUser = await findallbyfield(fields);
  if (allActiveUser.length === 0) {
    return { message: "Sorry, no user found for the room" };
  }
  return allActiveUser;
};

const deleteUser = async (data) => {
  if (!data || !data.name || !data.room || !data.id)
    return { message: "Please check the details carefully" };
  const deletedUser = await deletewithfield(data);
  if (!deletedUser) {
    return { message: "Sorry, no user found with the same details" };
  }
  return deletedUser;
};
const deleteUserBySocketId = async (id) => {
  //id = socket.id
  if (!id || id === "")
    return { message: "Please check the details carefully" };
  const deletedUser = await deletewithfield({ id });
  if (!deletedUser) {
    return { message: "Sorry, no user found with the same details" };
  }
  return deletedUser;
};

module.exports = {
  addUser,
  getUser,
  getUserBySocketId,
  getActiveUserForaRoom,
  deleteUser,
  deleteUserBySocketId,
};
