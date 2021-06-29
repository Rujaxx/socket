const {
  createwithfield,
  findById,
  findbyfield,
  updatewithfield,
  updatewithID,
  deletewithfield,
  deletewithID,
} = require("../Repository/gameStateRepo");

const addGameState = async (data) => {
  if (!data || !data.answer || !data.userId || !data.roomId)
    return { message: "Please check the details carefully" };
  return (newGameState = await createwithfield(data));
};
const getGameState = async (data) => {
  if (!data || !data.roomId || !data.answer)
    return { message: "Please check the details carefully" };
  const allGameStates = await findbyfield(data);
  if (allGameStates.length !== 0) {
    return { message: "Sorry, Someone already answerd!" };
  }
  return allGameStates;
};
const getAllGameStates = async (data) => {
  const allGameStates = await findbyfield(data);
  return allGameStates;
};

const deleteRoomGameState = async (roomId) => {
  if (!roomId) return { message: "Please check the details carefully" };
  const deletedRoomGameState = await deletewithfield({ roomId });
  if (deletedRoomGameState.deletedCount === 0) {
    return { message: "Sorry, no game data found to delete" };
  }
  return { GameState_deleted: deletedRoomGameState.deletedCount };
};

module.exports = {
  addGameState,
  getGameState,
  getAllGameStates,
  deleteRoomGameState,
};
