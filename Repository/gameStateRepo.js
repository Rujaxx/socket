const gameState = require("../models/GameState");
//Create
const createwithfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await gameState.create(fields);
};
//Read
const findById = async (mongoId) => {
  return await gameState.findById(mongoId).select("-__v");
};
const findbyfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await gameState.find(fields).select("-__v");
};
//Update
const updatewithfield = async (fields, updateddata) => {
  //fields = {fieldname : fieldvalue}
  return await gameState.findOneAndUpdate(fields, updateddata);
};
const updatewithID = async (id, updateddata) => {
  //fields = {fieldname : fieldvalue}
  return await gameState.findByIdAndUpdate(id, updateddata);

  // .catch((e) => console.log(e));
};
//Delete
const deletewithfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await gameState.deleteMany(fields);
};
const deletewithID = async (id) => {
  return await gameState.findByIdAndDelete(id);
};

module.exports = {
  createwithfield,
  findById,
  findbyfield,
  updatewithfield,
  updatewithID,
  deletewithfield,
  deletewithID,
};
