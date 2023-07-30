const Joi = require("joi");

const getUser = {
  params: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
const updateUser = {
  params: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
const deleteUser = {
  params: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
const addUser = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    // role:Joi.string().valid('admin', 'user').required(),
  }),
};

module.exports = {
  getUser,
  addUser,
  updateUser,
  deleteUser,
};
