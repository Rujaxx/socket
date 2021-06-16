const {
  createwithfield,
  findById,
  findbyfield,
  updatewithfield,
  updatewithID,
  deletewithfield,
  deletewithID,
} = require("../Repository/gameRepo");

const addGame = async (name) => {
  if (!name || name === "")
    return { message: "Please check the details carefully" };
  const existingGame = await findbyfield({ name });
  if (existingGame) {
    return { message: "Same game already exists." };
  }
  const newGame = await createwithfield({ name });
  return newGame;
};
const getGame = async (name) => {
  if (!name || name === "")
    return { message: "Please check the details carefully" };
  const existingGame = await findbyfield({ name });
  if (!existingGame) {
    return { message: "Sorry, no game found with the same name" };
  }
  return existingGame;
};

const deleteGame = async (name) => {
  if (!name || name === "")
    return { message: "Please check the details carefully" };
  const deletedGame = await deletewithfield({ name });
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
