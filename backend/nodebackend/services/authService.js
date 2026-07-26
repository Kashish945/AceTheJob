const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

const signupUser = async ({ username, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already registered");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create({ username, email, password });

  const token = generateToken(user._id);

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.statusCode = 400;
    throw err;
  }

  const token = generateToken(user._id);

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    token,
  };
};

module.exports = { signupUser, loginUser };
