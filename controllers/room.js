const {
  createwithfield,
  findById,
  findbyfield,
  findAll,
  updatewithfield,
  updatewithID,
  deletewithfield,
  deletewithID,
} = require("../Repository/roomRepo");

const addRoom = async (data) => {
  //data = { name: "temp1", game: "60c96505129d49372686d610" }
  if (!data || !data.name || !data.gameId)
    return { message: "Please check the details carefully" };
  const existingRoom = await findbyfield(data);
  if (existingRoom) {
    return { message: "Same room already exists." };
  }
  const newRoom = await createwithfield(data);
  return newRoom;
};
const getRoom = async (data) => {
  if (!data || !data.name || !data.gameId)
    return { message: "Please check the details carefully" };
  const existingRoom = await findbyfield(data);
  if (!existingRoom) {
    return { message: "Sorry, no room found with the same name" };
  }
  return existingRoom;
};
const getRoomById = async (id) => {
  const existingRoom = await findById(id);
  if (!existingRoom) {
    return { message: "Sorry, no room found with the same name" };
  }
  return existingRoom;
};
const allRoom = async () => {
  const allRoom = await findAll();
  return allRoom;
};
const deleteRoom = async (id) => {
  if (!id) return { message: "Please check the details carefully" };
  const deletedRoom = await deletewithID(id);
  if (!deletedRoom) {
    return { message: "Sorry, no room found with the same name" };
  }
  return deletedRoom;
};

module.exports = {
  addRoom,
  getRoom,
  getRoomById,
  allRoom,
  deleteRoom,
};
