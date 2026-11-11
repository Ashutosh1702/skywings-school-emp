const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecret_skywings_erp_key',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (or Admin only depending on setup)
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'admin',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
    }

    const defaultPersonas = {
      'admin@skywings.com': { name: 'Dr. Rajesh Sharma (Principal)', role: 'admin', pass: 'Admin@123' },
      'teacher@skywings.com': { name: 'Priya Mukherjee', role: 'teacher', pass: 'Teacher@123' },
      'parent@skywings.com': { name: 'Vikramaditya Roy', role: 'parent', pass: 'Parent@123' },
    };

    const cleanEmail = email.trim().toLowerCase();
    const matchedPersona = defaultPersonas[cleanEmail];

    let user = null;
    const isMongoConnected = require('mongoose').connection.readyState === 1;

    if (isMongoConnected) {
      try {
        user = await User.findOne({ email: cleanEmail }).select('+password');

        // If user not in MongoDB yet and matches default demo credentials, auto-provision
        if (!user && matchedPersona && password === matchedPersona.pass) {
          user = await User.create({
            name: matchedPersona.name,
            email: cleanEmail,
            password: matchedPersona.pass,
            role: matchedPersona.role,
          });

          // Trigger initial seeder in background
          try {
            const { autoSeedIfNeeded } = require('../utils/seeder');
            autoSeedIfNeeded().catch((e) => console.warn('Seeder background notice:', e.message));
          } catch (e) {}
        }
      } catch (dbErr) {
        console.warn('MongoDB query notice in login:', dbErr.message);
      }
    }

    let isMatch = false;
    if (user && user.password) {
      try {
        isMatch = await user.matchPassword(password);
      } catch (pErr) {
        isMatch = false;
      }
    }

    // Resilient fallback for demo accounts even if database was wiped or password mismatch
    if (!isMatch && matchedPersona && password === matchedPersona.pass) {
      isMatch = true;
      if (!user) {
        user = {
          _id: 'usr_' + matchedPersona.role + '_default',
          name: matchedPersona.name,
          email: cleanEmail,
          role: matchedPersona.role,
        };
      }
    }

    if (!isMatch || !user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials. Demo credentials: admin@skywings.com (Admin@123)' });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

