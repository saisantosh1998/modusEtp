const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const csvtojson = require("csvtojson");

const { expect } = chai;
chai.use(chaiHttp);

const app = require("./app");

const CSV_FILE_PATH = "data/db.csv";

describe("CRUD API Tests", () => {
  beforeEach(() => {
    // Create an empty data file before each test
    fs.writeFileSync(CSV_FILE_PATH, "");
  });

  afterEach(() => {
    // Delete the data file after each test
    fs.unlinkSync(CSV_FILE_PATH);
  });

  it("should create a new user", async () => {
    const newUser = {
      email: "test_user@gmail.com",
      first_name: "test",
      last_name: "user",
      address: "some address",
      phone: "12344567788",
    };

    const res = await chai.request(app).post("/v1/user/addUser").send(newUser);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("email").to.equal(newUser.email);

    const fileContent = fs.readFileSync(CSV_FILE_PATH, "utf-8");
    expect(fileContent).to.contain(newUser.email);
  });

  it("should return 409 when user already exists", async () => {
    const existingUser = {
      email: "test_user@gmail.com",
      first_name: "test",
      last_name: "user",
      address: "some address",
      phone: "12344567788",
    };

    // Add an existing user to the data file before the test
    fs.writeFileSync(
      CSV_FILE_PATH,
      `${Object.keys(existingUser).join(",")}\n${Object.values(
        existingUser
      ).join(",")}\n`
    );

    const res = await chai
      .request(app)
      .post("/v1/user/addUser")
      .send(existingUser);

    expect(res).to.have.status(409);
    expect(res.body)
      .to.have.property("message")
      .to.equal("User with email already exists");
  });

  it("should throw validation error when email is not there in request body for creating new user", async () => {
    const newUser = {
        first_name: "test",
        last_name: "user",
        address: "some address",
        phone: "12344567788",
      };
  
      const res = await chai.request(app).post("/v1/user/addUser").send(newUser);
  
      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message").to.equal('\"email\" is required');
  });

  it("should get all existing users data", async () => {
    const existingUser = {
      email: "test_user@gmail.com",
      first_name: "test",
      last_name: "user",
      address: "some address",
      phone: "12344567788",
    };

    // Add an existing user to the data file before the test
    fs.writeFileSync(
      CSV_FILE_PATH,
      `${Object.keys(existingUser).join(",")}\n${Object.values(
        existingUser
      ).join(",")}\n`
    );

    const res = await chai.request(app).get("/v1/user/all").send();

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("users");
    expect(res.body.users.length).to.equal(1);
  });

  it("should get user data of provided email", async () => {
    const existingUser = {
      email: "test_user@gmail.com",
      first_name: "test",
      last_name: "user",
      address: "some address",
      phone: "12344567788",
    };

    // Add an existing user to the data file before the test
    fs.writeFileSync(
      CSV_FILE_PATH,
      `${Object.keys(existingUser).join(",")}\n${Object.values(
        existingUser
      ).join(",")}\n`
    );

    const res = await chai
      .request(app)
      .get("/v1/user/test_user@gmail.com")
      .send();

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("email").to.equal(existingUser.email);
  });

  it("should return 404 with when getting non existing user data", async () => {
    const existingUser = {
      email: "test_user@gmail.com",
      first_name: "test",
      last_name: "user",
      address: "some address",
      phone: "12344567788",
    };

    // Add an existing user to the data file before the test
    fs.writeFileSync(
      CSV_FILE_PATH,
      `${Object.keys(existingUser).join(",")}\n${Object.values(
        existingUser
      ).join(",")}\n`
    );

    const res = await chai
      .request(app)
      .get("/v1/user/test_user2@gmail.com")
      .send();

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message").to.equal("User not found");
  });

  it("should update user data with provided email", async () => {
    const existingUser = {
      email: "test_user@gmail.com",
      first_name: "test",
      last_name: "user",
      address: "some address",
      phone: "12344567788",
    };
    const updateDetails = {
      first_name: "test2",
    };

    // Add an existing user to the data file before the test
    fs.writeFileSync(
      CSV_FILE_PATH,
      `${Object.keys(existingUser).join(",")}\n${Object.values(
        existingUser
      ).join(",")}\n`
    );

    const res = await chai
      .request(app)
      .patch("/v1/user/test_user@gmail.com")
      .send(updateDetails);

    expect(res).to.have.status(204);

    const jsonArray = await csvtojson().fromFile(CSV_FILE_PATH);
    const user = jsonArray.find((row) => row.email === "test_user@gmail.com");
    expect(user).to.have.property("first_name").to.equal("test2");
  });

  it("should return 404 with when updating non existing user data", async () => {
    const existingUser = {
      email: "test_user@gmail.com",
      first_name: "test",
      last_name: "user",
      address: "some address",
      phone: "12344567788",
    };
    const updateDetails = {
      first_name: "test2",
    };

    // Add an existing user to the data file before the test
    fs.writeFileSync(
      CSV_FILE_PATH,
      `${Object.keys(existingUser).join(",")}\n${Object.values(
        existingUser
      ).join(",")}\n`
    );

    const res = await chai
      .request(app)
      .patch("/v1/user/test_user2@gmail.com")
      .send(updateDetails);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message").to.equal("User not found");
  });

  it("should delete user data with provided email", async () => {
    const existingUser = {
      email: "test_user@gmail.com",
      first_name: "test",
      last_name: "user",
      address: "some address",
      phone: "12344567788",
    };

    const existingUser2 = {
      email: "test_user2@gmail.com",
      first_name: "test",
      last_name: "user",
      address: "some address",
      phone: "12344567788",
    };

    // Add an existing user to the data file before the test
    fs.writeFileSync(
      CSV_FILE_PATH,
      `${Object.keys(existingUser).join(",")}\n${Object.values(
        existingUser
      ).join(",")}\n`
    );

    // Add an existing user2 to the data file before the test
    fs.appendFileSync(
      CSV_FILE_PATH,
      `${Object.keys(existingUser2).join(",")}\n${Object.values(
        existingUser2
      ).join(",")}\n`
    );

    const res = await chai
      .request(app)
      .delete("/v1/user/test_user@gmail.com")
      .send();

    expect(res).to.have.status(200);
    expect(res.body)
      .to.have.property("message")
      .to.equal("User got successfully deleted");

    const jsonArray = await csvtojson().fromFile(CSV_FILE_PATH);
    if (jsonArray.length !== 0) {
      const user = jsonArray.find((row) => row.email === "test_user@gmail.com");
      expect(user).to.be.undefined;
    }
  });

  it("should return 404 with when deleting non existing user data", async () => {
    const existingUser = {
      email: "test_user@gmail.com",
      first_name: "test",
      last_name: "user",
      address: "some address",
      phone: "12344567788",
    };

    // Add an existing user to the data file before the test
    fs.writeFileSync(
      CSV_FILE_PATH,
      `${Object.keys(existingUser).join(",")}\n${Object.values(
        existingUser
      ).join(",")}\n`
    );

    const res = await chai
      .request(app)
      .delete("/v1/user/test_user2@gmail.com")
      .send();

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message").to.equal("User not found");
  });
});
