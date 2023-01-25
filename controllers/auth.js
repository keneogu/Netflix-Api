const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const UnauthenticatedError = require('../errors/Unathenticated');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  const user = await newUser.save();

  if (user) return res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) throw new UnauthenticatedError('Invalid credentials');

  const passwordMatch = await user.comparePassword(password)

  if (!passwordMatch)
    throw new UnauthenticatedError('Incorrect password');

  return res.status(200).json({ user });

};

module.exports = { register, login };
