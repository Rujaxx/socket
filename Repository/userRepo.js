const user = require("../models/user");
//Create
const createwithfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await user.create(fields);
};
//Read
const findById = async (mongoId) => {
  return await user
    .findById(mongoId)
    .select("-__v")
    .populate("gameId roomId")
    .exec();
};
const findbyfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await user
    .findOne(fields)
    .select("-__v")
    .populate("gameId roomId")
    .exec();
};
const findallbyfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await user
    .find(fields)
    .select("-__v")
    .populate("gameId roomId")
    .exec();
};
//Update
const updatewithfield = async (fields, updateddata) => {
  //fields = {fieldname : fieldvalue}
  return await user.findOneAndUpdate(fields, updateddata).select("-__v");
};
const updatewithID = async (id, updateddata) => {
  //fields = {fieldname : fieldvalue}
  return await user.findByIdAndUpdate(id, updateddata).select("-__v");

  // .catch((e) => console.log(e));
};
//Delete
const deletewithfield = async (fields) => {
  //fields = {fieldname : fieldvalue}
  return await user.findOneAndDelete(fields).select("-__v");
};
const deletewithID = async (id) => {
  return await user.findByIdAndDelete(id).select("-__v");
};

module.exports = {
  createwithfield,
  findById,
  findbyfield,
  findallbyfield,
  updatewithfield,
  updatewithID,
  deletewithfield,
  deletewithID,
};
