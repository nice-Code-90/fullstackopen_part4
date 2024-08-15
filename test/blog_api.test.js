const { test, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");

const app = require("../app");

const api = supertest(app);

test("blogs are returned as json and there are 4 blogs", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.length, 4);
});

after(async () => {
  await mongoose.connection.close();
});
