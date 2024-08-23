const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});

  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const body = req.body;
  if (body.url && body.title) {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } else {
    res.status(400).end();
  }
});
module.exports = blogsRouter;
