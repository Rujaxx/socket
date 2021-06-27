const messages = require("../models/messages");
//Create
const createwithfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await messages.create(fields);
};
//Read
const findById = async (mongoId) => {
  return await messages.findById(mongoId).select("-__v").populate("user");
};
const findbyfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await messages.find(fields).select("-__v").populate("user");
};
//Update
const updatewithfield = async (fields, updateddata) => {
  //fields = {fieldname : fieldvalue}
  return await messages.findOneAndUpdate(fields, updateddata);
};
const updatewithID = async (id, updateddata) => {
  //fields = {fieldname : fieldvalue}
  return await messages.findByIdAndUpdate(id, updateddata);

  // .catch((e) => console.log(e));
};
//Delete
const deletewithfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await messages.deleteMany(fields);
};
const deletewithID = async (id) => {
  return await messages.findByIdAndDelete(id);
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
