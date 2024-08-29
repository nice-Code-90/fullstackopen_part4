const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");

const helper = require("./test_helper");

const User = require("../models/user");
const Blog = require("../models/blog");

describe("Invalid user isn't created", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  test("when username is less than three characters long", async () => {
    const wrongUser = {
      name: "Jane",
      username: "Ja",
      password: "tryToFindThisPassword",
    };
    await api
      .post("/api/users")
      .send(wrongUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const users = await api.get("/api/users");
    assert.strictEqual(users.length, undefined);
  });

  test("when password is less than three charachers long", async () => {
    const wrongUser = {
      name: "Jane",
      username: "Jane",
      password: "pp",
    };
    await api
      .post("/api/users")
      .send(wrongUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    const users = await api.get("/api/users");
    assert.strictEqual(users.length, undefined);
  });

  test("when desired username already exist", async () => {
    const dummy = {
      name: "John",
      username: "John",
      password: "noteasytofinditout",
    };
    await api.post("/api/users").send(dummy);

    await api
      .post("/api/users")
      .send({
        name: "ClarkKent",
        username: "John",
        password: "notsogoodpwd",
      })
      .expect(400)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/users");
    const users = response.body;
    assert.strictEqual(users.length, 1);
  });
});
after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
