const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");

const router = express.Router();

router.get(`/all`,userController.getAllUsers);
router.get(`/:email`,validate(userValidation.getUser),userController.getUser);
router.post(`/addUser`,validate(userValidation.addUser),userController.addUser);
router.patch(`/:email`,validate(userValidation.updateUser),userController.updateUser);
router.delete(`/:email`,validate(userValidation.deleteUser),userController.deleteUser);

module.exports = router;
