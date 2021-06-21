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
    //data = { name: "temp1", game: "60c96505129d49372686d610" }
    if (!data || !data.message || !data.user)
      return { message: "Please check the details carefully" };
    return newMessage = await createwithfield(data);
  };
  const getMessage = async (data) => {
    if (!data || !data.name)
      return { message: "Please check the details carefully" };
    const existingRoom = await findbyfield(data);
    if (!existingRoom) {
      return { message: "Sorry, no room found with the same name" };
    }
    return existingRoom;
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
  };
  