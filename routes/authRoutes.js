const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// POST /api/auth/register — local signup
// Requires: username, password, email, phoneNumber, emergencyContactName,
// emergencyContactPhone, height, weight (all mandatory, not optional)
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      phoneNumber,
      emergencyContactName,
      emergencyContactPhone,
      height,
      weight,
    } = req.body;

    if (
      !username || !password || !email || !phoneNumber ||
      !emergencyContactName || !emergencyContactPhone || !height || !weight
    ) {
      return res.status(400).json({
        error: 'All fields are required, including emergency contact details',
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      username,
      password,
      email,
      phoneNumber,
      emergencyContactName,
      emergencyContactPhone,
      height,
      weight,
      authProvider: 'local',
    });

    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login — local login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/google — kicks off Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// GET /api/auth/google/callback — Google redirects here after login
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login-failed' }),
  (req, res) => {
    const token = signToken(req.user._id);
    // Redirect back to the React app with the token; frontend stores it and,
    // if profileComplete is false, routes the user to a "finish your profile"
    // form to collect phone + emergency contact + height + weight
    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${token}&profileComplete=${req.user.profileComplete}`
    );
  }
);

// PATCH /api/auth/complete-profile — fills in the fields Google doesn't provide
router.patch('/complete-profile', protect, async (req, res) => {
  try {
    const {
      phoneNumber,
      emergencyContactName,
      emergencyContactPhone,
      height,
      weight,
    } = req.body;

    if (!phoneNumber || !emergencyContactName || !emergencyContactPhone || !height || !weight) {
      return res.status(400).json({
        error: 'All fields are required, including emergency contact details',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        phoneNumber,
        emergencyContactName,
        emergencyContactPhone,
        height,
        weight,
        profileComplete: true,
      },
      { new: true }
    );

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me — get the logged-in user's profile
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

module.exports = router;
