const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Message = require("../models/message");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }
    const messages = await Message.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
    })
      .populate("sender")
      .populate("receiver")
      .sort({ timestamp: -1 });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      messages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const authController = {
  registerUser,
  loginUser,
};

export default authController;
