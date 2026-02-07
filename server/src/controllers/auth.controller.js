const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ... existing code ...

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
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
    user.token = token;
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
        isPlacementEnabled: user.isPlacementEnabled,
        isOnboardingComplete: user.isOnboardingComplete
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
    user.token = token;
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
        isPlacementEnabled: user.isPlacementEnabled,
        isOnboardingComplete: user.isOnboardingComplete,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({
      $or: [{ googleId }, { email }]
    });

    if (user) {
      // Update existing user with googleId if missing
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        isOnboardingComplete: false, // Will need to complete onboarding
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10) // Random password
      });
    }

    // Generate JWT token
    const jwtToken = generateToken(user._id);
    user.token = jwtToken;
    await user.save();

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        educationLevel: user.educationLevel,
        course: user.course,
        isPlacementEnabled: user.isPlacementEnabled,
        isOnboardingComplete: user.isOnboardingComplete,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Google login failed" });
  }
};

// GET CURRENT USER PROFILE
exports.getMe = async (req, res) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
