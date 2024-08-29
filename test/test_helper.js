const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Blogpost1",
    author: "Author1",
    url: "www.dummysite.com",
    likes: 10,
  },
  {
    title: "Blogpost2",
    author: "Author2",
    url: "www.dummysite2.com",
    likes: 20,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};
const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  blogsInDb,
  initialBlogs,
  usersInDb,
};
