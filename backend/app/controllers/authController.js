const User = require("../models/User");
const { hash, compare } = require("bcryptjs");
const { generateToken } = require("../services/tokenService");

exports.register = async function(req, res) {
  try {
    const { name, email, password } = req.body; // ✅ Added name

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await hash(password, 10);

    const user = new User({
      name,          // ✅ Save name
      email,
      password_hash: hashed,
    });

    await user.save();

    const token = generateToken(user);

    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async function(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user);

    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};