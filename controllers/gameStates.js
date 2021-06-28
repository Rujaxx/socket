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
    if (!data || !data.gameState || !data.roomId)
      return { message: "Please check the details carefully" };
    return (newGameState = await createwithfield(data));
  };
  const getGameState = async (data) => {
    if (!data || !data.gameState || !data.roomId)
      return { message: "Please check the details carefully" };
    const allGameStates = await findbyfield(data);
    if (!allGameStates) {
      return { message: "Sorry, no message found with the same name" };
    }
    return allGameStates;
  };
  const getAllGameStates = async (data) => {
    const allGameStates = await findbyfield(data);
    return allGameStates;
  };
  
  const deleteRoomGameState = async (roomId) => {
    if (!roomId) return { message: "Please check the details carefully" };
    const deletedGameState = await deletewithfield({ roomId });
    if (deletedRoomGameState.deletedCount === 0) {
      return { message: "Sorry, no messages found to delete" };
    }
    return { GameState_deleted: deletedRoomGameState.deletedCount === 0 };
  };
  
  module.exports = {
    addGameState,
    getGameState,
    getAllGameStates,
    deleteRoomGameState,
  };
  