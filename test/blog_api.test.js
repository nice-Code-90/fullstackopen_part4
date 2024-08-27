const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");
const helper = require("./test_helper");

const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

describe("when there is initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test("blogs are returned as json and there are 2 blogs", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.length, 2);
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

  test('requests without title or url are responded to with "400 bad request " by the server', async () => {
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
  test("HTTP PUT request works as expected", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedLikes = blogToUpdate.likes + 3;

    const updatedBlog = {
      likes: updatedLikes,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlogFromDb = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id
    );

    assert.strictEqual(updatedBlogFromDb.likes, updatedLikes);
  });
  describe("deletion of a note", () => {
    test("succeed with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
      const titles = blogsAtEnd.map((r) => r.title);
      assert(!titles.includes(blogToDelete.title));
    });
  });
});
after(async () => {
  await mongoose.connection.close();
});
