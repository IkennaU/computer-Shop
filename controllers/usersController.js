const User = require("../models/User");
const Note = require("../models/Note");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all Users
// @route GET /Users
// @access Private Route

const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No User Found" });
  }
  res.json(users);
});

// @desc create New Users
// @route POST /Users
// @access Private Route

const createNewUser = expressAsyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  //   confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }
  //   check for duplicates
  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate UserName" });
  }
  //   Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);
  const userObject = { username, password: hashedPassword, roles };
  // create and store new user
  const user = await User.create(userObject);
  if (user) {
    res.status(201).json({ message: `New User ${username} Created` });
  } else {
    res.status(400).json({ message: "Invalid User Data" });
  }
});

// @desc Update A User
// @route PUT /Users
// @access Private Route

const updateUser = expressAsyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;
  // confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  // check for duplicates
  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Username" });
  }
  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete A User
// @route DELETE /User
// @access Private Route

const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User Required" });
  }
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const result = await user.deleteOne();
  const reply = `Username ${result.username} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
