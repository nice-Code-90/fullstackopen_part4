const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const mongoUrl = MONGODB_URI;

mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.get("/api/blogs", (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
});

app.post("/api/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog.save().then((result) => {
    res.status(201).json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
