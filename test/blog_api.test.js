const { test, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");
const helper = require("./test_helper");

const app = require("../app");

const api = supertest(app);

test("blogs are returned as json and there are 6 blogs", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.length, 6);
});

after(async () => {
  await mongoose.connection.close();
});

test("Identifier properties of blog posts are named 'id' ", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    assert.strictEqual(blog.id !== undefined, true);
  });
});

test("HTTP POST request works as expected", async () => {
  const newBlog = {
    title: "New Blog Post",
    author: "Author Name",
    url: "http://example.com",
    likes: 0,
  };
  const blogsBeforePost = await helper.blogsInDb();

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAfterPost = await helper.blogsInDb();

  assert.strictEqual(blogsBeforePost.length + 1, blogsAfterPost.length);

  const titles = blogsAfterPost.map((blog) => blog.title);
  assert.strictEqual(titles.includes(newBlog.title), true);
});

test("likes initial value will zero if 'likes' property is not in the post request", async () => {
  const newBlog = {
    title: "Dummy blog",
    author: "noone",
    url: "www.notexistingwebsite.xxx",
  };
  const response = await api.post("/api/blogs").send(newBlog);
  const newBlogfromDb = response.body;
  assert.strictEqual(newBlogfromDb.likes, 0);
});

test.only('requests without title or url are responded to with "400 bad request " by the server', async () => {
  const Dummyblog1 = {
    title: "title",
    author: "aa",
    likes: 10,
  };
  const Dummyblog2 = {
    author: "John",
    url: "www",
    likes: 2,
  };
  await api.post("/api/blogs").send(Dummyblog1).expect(400);
  await api.post("/api/blogs").send(Dummyblog2).expect(400);
});
