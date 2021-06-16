const game = require("../models/Game");
//Create
const createwithfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await game.create(fields);
};
//Read
const findById = async (mongoId) => {
  return await game.findById(mongoId, "name");
};
const findbyfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await game.findOne(fields, "name");
};
//Update
const updatewithfield = async (fields, updateddata) => {
  //fields = {fieldname : fieldvalue}
  return await game.findOneAndUpdate(fields, updateddata);
};
const updatewithID = async (id, updateddata) => {
  //fields = {fieldname : fieldvalue}
  return await game.findByIdAndUpdate(id, updateddata);

  // .catch((e) => console.log(e));
};
//Delete
const deletewithfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await game.findOneAndDelete(fields);
};
const deletewithID = async (id) => {
  return await game.findByIdAndDelete(id);
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
