const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure path is correct
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
};

// Middleware to check authentication
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded; // sets req.user.userId
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Middleware to check if user is admin
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Authorization failed' });
  }
};

// ---------------------------
// Optional: helper functions
// ---------------------------

// Register user
const registerUser = async (name, email, password) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already exists');

  const user = new User({ name, email, password });
  await user.save();

  const token = generateToken(user._id);
  return { user, token };
};

// Login user
const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = generateToken(user._id);
  return { user: user.toJSON(), token };
};

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  adminMiddleware,
  registerUser,
  loginUser
};
