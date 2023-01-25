const User = require("../models/User");
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })

  const user = await newUser.save();

  if (user) 
    return res.status(StatusCodes.CREATED).json({ user });
};

module.exports = { register };
