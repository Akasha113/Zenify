const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');

// Send test email
router.post('/test', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await sendEmail(email, 'loginConfirmation', {
      name: name || 'User',
      email
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send welcome email
router.post('/welcome', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);

    const result = await sendEmail(user.email, 'welcomeEmail', {
      name: user.name
    });

    res.json({
      success: result.success,
      message: result.success ? 'Welcome email sent' : result.error
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
