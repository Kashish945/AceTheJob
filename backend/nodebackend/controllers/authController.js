const { signupUser, loginUser } = require("../services/authService");

const User = require("../models/User");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error("username, email and password are required");
    }

    const data = await signupUser({ username, email, password });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("email and password are required");
    }

    const data = await loginUser({ email, password });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res) => {
  try {

    const users = await User.find();

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser: loginUserController,
  getUsers
};