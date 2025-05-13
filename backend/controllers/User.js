const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserModel = require("../models/UserModel");
require("dotenv").config();

exports.addUser = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, "sec_key");
    res.json({ token, userID: user._id, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.verifyToken = (req, res, next) => {
  const authHeader = req.body.headers.Authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  jwt.verify(authHeader, "sec_key", (err) => {
    if (err) {
      return res.sendStatus(403);
    }
    // return next();
    res.sendStatus(200);
  });
};

// module.exports = verifyToken;
