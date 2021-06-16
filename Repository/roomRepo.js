const room = require("../models/Room");
//Create
const createwithfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await room.create(fields);
};
//Read
const findById = async (mongoId) => {
  return await room.findById(mongoId);
};
const findbyfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await room.findOne(fields).select("-__v");
};
//Update
const updatewithfield = async (fields, updateddata) => {
  //fields = {fieldname : fieldvalue}
  return await room.findOneAndUpdate(fields, updateddata).select("-__v");
};
const updatewithID = async (id, updateddata) => {
  //fields = {fieldname : fieldvalue}
  return await room.findByIdAndUpdate(id, updateddata).select("-__v");

  // .catch((e) => console.log(e));
};
//Delete
const deletewithfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  if (fields.name === null || fields.name === "" || fields.name === undefined)
    return { message: "Please enter proper room name" };

  if (fields.game === null || fields.game === "" || fields.game === undefined)
    return { message: "Please enter proper game name" };
  return await room.findOneAndDelete(fields).select("-__v");
};
const deletewithID = async (id) => {
  return await room.findByIdAndDelete(id);
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
