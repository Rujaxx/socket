const {
  createwithfield,
  findById,
  findbyfield,
  updatewithfield,
  updatewithID,
  deletewithfield,
  deletewithID,
} = require("../Repository/messageRepo");

const addMessage = async (data) => {
  if (!data || !data.message || !data.user)
    return { message: "Please check the details carefully" };
  return (newMessage = await createwithfield(data));
};
const getMessage = async (data) => {
  if (!data || !data.user)
    return { message: "Please check the details carefully" };
  const allMessages = await findbyfield(data);
  if (!allMessages) {
    return { message: "Sorry, no message found with the same name" };
  }
  return allMessages;
};
const getAllMessages = async (data) => {
  const allMessages = await findbyfield(data);
  return allMessages;
};

const deleteRoom = async (data) => {
  if (!data || !data.name)
    return { message: "Please check the details carefully" };
  const deletedRoom = await deletewithfield(data);
  if (!deletedRoom) {
    return { message: "Sorry, no room found with the same name" };
  }
  return deletedRoom;
};

module.exports = {
  addMessage,
  getMessage,
  deleteRoom,
  getAllMessages,
};
