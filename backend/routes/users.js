const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name: name || user.name,
        bio: bio || user.bio,
        avatar: avatar || user.avatar,
        updatedAt: new Date()
      },
      { new: true }
    );
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings
router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const { theme, notifications, fontSize, emailNotifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        settings: {
          theme,
          notifications,
          fontSize,
          emailNotifications
        },
        updatedAt: new Date()
      },
      { new: true }
    );
    res.json({
      message: 'Settings updated',
      settings: user.settings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    const user = await User.findById(req.user.userId).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
