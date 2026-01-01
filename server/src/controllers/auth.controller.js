const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn:  "7d"
  });
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, educationLevel, course, stream } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      educationLevel,
      course,
      stream,
      isPlacementEnabled: educationLevel === "college" && course === "btech"
    });

    const token = generateToken(user._id);
    user.token=token;
    await user.save();
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        educationLevel: user.educationLevel,
        course: user.course,
        isPlacementEnabled: user.isPlacementEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    user.token=token;
    await user.save();
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        educationLevel: user.educationLevel,
        course: user.course,
        isPlacementEnabled: user.isPlacementEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
