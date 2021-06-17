const {
  createwithfield,
  findById,
  findbyfield,
  updatewithfield,
  updatewithID,
  deletewithfield,
  deletewithID,
} = require("../Repository/gameRepo");

const addGame = async (fields) => {
  if (!fields.name || fields.name === "")
    return { message: "Please check the details carefully" };
  const existingGame = await findbyfield(fields);
  if (existingGame) {
    return { message: "Same game already exists." };
  }
  const newGame = await createwithfield(fields);
  return newGame;
};
const getGame = async (fields) => {
  if (!fields.name || fields.name === "")
    return { message: "Please check the details carefully" };
  const existingGame = await findbyfield(fields);
  if (!existingGame) {
    return { message: "Sorry, no game found with the same name" };
  }
  return existingGame;
};

const deleteGame = async (name) => {
  if (!fields.name || fields.name === "")
    return { message: "Please check the details carefully" };
  const deletedGame = await deletewithfield(fields);
  if (!deletedGame) {
    return { message: "Sorry, no game found with the same name" };
  }
  return deletedGame;
};

module.exports = {
  addGame,
  getGame,
  deleteGame,
};
