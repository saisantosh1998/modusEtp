const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const csv = require("csv-parser");
const csvtojson = require("csvtojson");
const fs = require("fs");
const CSV_FILE_PATH = "data/db.csv";


const isFileEmpty = async () => {
  if(fs.existsSync(CSV_FILE_PATH)){
    const fileContent = await fs.promises.readFile(CSV_FILE_PATH, "utf-8");
    return fileContent.trim() === "";
  }else{
    fs.writeFileSync(CSV_FILE_PATH,"");
    return true;
  }
};

const getAllUsers = async () =>{
  try{
    const jsonArray = await csvtojson().fromFile(CSV_FILE_PATH);
    return jsonArray;
  }catch(err){
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
  
}
const getUserByEmail = async (email) => {
  let currentUser = {};
  const jsonArray = await csvtojson().fromFile(CSV_FILE_PATH);
  jsonArray.forEach((user) => {
    if (user.email === email) {
      currentUser = { ...currentUser, ...user };
      return currentUser;
    }
  });
  return currentUser;
};

const addUser = async (user) => {
  const { email } = user;
  try {
    const isEmpty = await isFileEmpty();
    const userExists = await getUserByEmail(email);
    if (userExists.hasOwnProperty("email")) {
      return;
    }
    if (isEmpty) {
      await fs.promises.writeFile(
        CSV_FILE_PATH,
        `${Object.keys(user).join(",")}\n`
      );
    }

    await fs.promises.appendFile(
      CSV_FILE_PATH,
      `${Object.values(user).join(",")}\n`
    );
    return user;
  } catch (err) {
    console.error(err)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

const updateUser = async (email, updatedData) => {
  try {
    let isUpdated = false;
    const tempFile = `${CSV_FILE_PATH}_UPDATE.csv`;
    const jsonArray = await csvtojson().fromFile(CSV_FILE_PATH);
    await fs.promises.writeFile(
      tempFile,
      `${Object.keys(jsonArray[0]).join(",")}\n`
    );
    jsonArray.forEach((row) => {
      if (row.email === email) {
        row = { ...row, ...updatedData };
        isUpdated = true;
      }
      fs.appendFileSync(tempFile, `${Object.values(row).join(",")}\n`);
    });
    fs.renameSync(tempFile, CSV_FILE_PATH);
    return isUpdated;
  } catch (err) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

const deleteUser = async (email) => {
  try {
    let isDeleted = false;
    const tempFile = `${CSV_FILE_PATH}_DEL.csv`;
    const jsonArray = await csvtojson().fromFile(CSV_FILE_PATH);
    const userExists = await getUserByEmail(email);
    if(!userExists.hasOwnProperty('email')){
      return isDeleted;
    }
    if (jsonArray.length > 1) {
      await fs.promises.writeFile(
        tempFile,
        `${Object.keys(jsonArray[0]).join(",")}\n`
      );
    } else {
      await fs.promises.writeFile(tempFile, "");
    }
    jsonArray.forEach((row) => {
      if (row.email === email) {
        isDeleted = true;
      } else {
        fs.appendFileSync(tempFile, `${Object.values(row).join(",")}\n`);
      }
    });
    fs.renameSync(tempFile, CSV_FILE_PATH);
    return isDeleted;
  } catch (err) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

module.exports = {
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
  getAllUsers
};
