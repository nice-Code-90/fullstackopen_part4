const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;
  if (password === undefined) {
    return res.status(400).json({ error: "password is required" });
  } else if (password.length < 3) {
    return res
      .status(400)
      .json({ error: "password has to be at least  three caracters long" });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({ username, name, passwordHash });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});
module.exports = usersRouter;
