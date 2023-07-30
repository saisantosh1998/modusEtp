const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

const getAllUsers = catchAsync(async (req, res) => {
  let users = await userService.getAllUsers();
  res.status(httpStatus.OK).json({ users });
});

const getUser = catchAsync(async (req, res) => {
  const email = req.params.email;
  let user = await userService.getUserByEmail(email);
  if (user.hasOwnProperty("email")) {
    res.status(httpStatus.OK).json(user);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
});

const addUser = catchAsync(async (req, res) => {
  const added = await userService.addUser(req.body);
  if (added) {
    res.status(httpStatus.CREATED).json(added);
  } else {
    throw new ApiError(
      httpStatus.CONFLICT,
      "User with email already exists"
    );
  }
});
const updateUser = catchAsync(async (req, res) => {
  const email = req.params.email;
  let updated = await userService.updateUser(email, req.body);
  if (updated) {
    res.status(httpStatus.NO_CONTENT).json();
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
});
const deleteUser = catchAsync(async (req, res) => {
  const email = req.params.email;
  let deleted = await userService.deleteUser(email);
  if (deleted) {
    res
      .status(httpStatus.OK)
      .json({ message: "User got successfully deleted" });
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
});
module.exports = {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getAllUsers
};
