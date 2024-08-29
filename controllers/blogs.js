const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const body = req.body;
  const user = await User.findOne();

  if (body.url && body.title) {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0,
      user: user._id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    res.status(201).json(savedBlog);
  } else {
    res.status(400).end();
  }
});

blogsRouter.put("/:id", async (req, res) => {
  const likes = req.body.likes;
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes: likes },
    {
      new: true,
    }
  );
  res.json(updatedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = blogsRouter;
