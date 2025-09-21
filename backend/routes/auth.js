const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// TODO: Replace with your actual database models
// const User = require('../models/User');

// Mock user data for development
const mockUsers = [];

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    { expiresIn: '7d' }
  );
};

// Validation middleware
const validateSignup = [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// POST /api/auth/signup
router.post('/signup', validateSignup, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // TODO: Check if user already exists in database
    // const existingUser = await User.findOne({ email });
    const existingUser = mockUsers.find(user => user.email === email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // TODO: Save user to database
    // const user = new User({
    //   name,
    //   email,
    //   password: hashedPassword,
    //   createdAt: new Date()
    // });
    // await user.save();

    // Mock user creation for development
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      avatar: null
    };
    mockUsers.push(user);

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data (excluding password) and token
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// POST /api/auth/login
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // TODO: Find user in database
    // const user = await User.findOne({ email });
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // TODO: Update last login timestamp
    // await User.findByIdAndUpdate(user.id, { lastLogin: new Date() });

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data (excluding password) and token
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    // Verify the existing token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // TODO: Find user in database
    // const user = await User.findById(decoded.userId);
    const user = mockUsers.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new token
    const newToken = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;