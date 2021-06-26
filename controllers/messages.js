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

const deleteRoomMessage = async (roomId) => {
  if (!roomId) return { message: "Please check the details carefully" };
  const deletedRoomMessage = await deletewithfield({ roomId });
  if (deletedRoomMessage.deletedCount === 0) {
    return { message: "Sorry, no messages found to delete" };
  }
  return { Message_deleted: deletedRoomMessage.deletedCount };
};

module.exports = {
  addMessage,
  getMessage,
  getAllMessages,
  deleteRoomMessage,
};
