import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  path: '/',
};

const createTokens = (user) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  });
  return { accessToken, refreshToken };
};

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    }

    const { name, email, password, phone } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'Email is already registered' });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPw = await bcrypt.hash(password, salt);

      const userDoc = await User.create({
        name,
        email,
        password: hashedPw,
        phone: phone || '',
        role: 'user',
      });

      const { accessToken, refreshToken } = createTokens(userDoc);

      res.cookie('accessToken', accessToken, {
        ...cookieConfig,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refreshToken', refreshToken, {
        ...cookieConfig,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        user: {
          id: userDoc._id,
          name: userDoc.name,
          email: userDoc.email,
          phone: userDoc.phone,
          role: userDoc.role,
        },
        token: accessToken,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const userDoc = await User.findOne({ email }).select('+password');
      if (!userDoc) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, userDoc.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const { accessToken, refreshToken } = createTokens(userDoc);

      res.cookie('accessToken', accessToken, {
        ...cookieConfig,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refreshToken', refreshToken, {
        ...cookieConfig,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        user: {
          id: userDoc._id,
          name: userDoc.name,
          email: userDoc.email,
          phone: userDoc.phone,
          role: userDoc.role,
        },
        token: accessToken,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.post('/refresh', async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const userDoc = await User.findById(decoded.id);
    if (!userDoc) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { accessToken, refreshToken } = createTokens(userDoc);

    res.cookie('accessToken', accessToken, {
      ...cookieConfig,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      ...cookieConfig,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ token: accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken', cookieConfig);
  res.clearCookie('refreshToken', cookieConfig);
  return res.json({ message: 'Logged out successfully' });
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const userDoc = await User.findById(req.user.id);
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      user: {
        id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone,
        role: userDoc.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

export default router;
