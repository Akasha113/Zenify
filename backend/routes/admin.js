const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const FlaggedContent = require('../models/FlaggedContent');
const Conversation = require('../models/Conversation');
const JournalEntry = require('../models/JournalEntry');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

// Get all flagged content (Admin only)
router.get('/flagged', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status = 'all', riskLevel = 'all', page = 1, limit = 20 } = req.query;

    let query = {};
    if (status !== 'all') query.status = status;
    if (riskLevel !== 'all') query.riskLevel = riskLevel;

    const skip = (page - 1) * limit;

    const flaggedContent = await FlaggedContent.find(query)
      .populate('userId', 'name email')
      .sort({ flaggedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await FlaggedContent.countDocuments(query);

    res.json({
      data: flaggedContent,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get flagged content detail
router.get('/flagged/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const flagged = await FlaggedContent.findById(req.params.id)
      .populate('userId', 'name email loginCount createdAt')
      .populate('reviewedBy', 'name email');

    if (!flagged) {
      return res.status(404).json({ error: 'Flagged content not found' });
    }

    // Get related content
    let relatedContent = null;
    if (flagged.type === 'chat') {
      relatedContent = await Conversation.findById(flagged.contentId);
    } else {
      relatedContent = await JournalEntry.findById(flagged.contentId);
    }

    res.json({
      flagged,
      relatedContent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Review flagged content
router.put('/flagged/:id/review', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, notes, actionTaken } = req.body;

    const flagged = await FlaggedContent.findByIdAndUpdate(
      req.params.id,
      {
        status: status || 'reviewed',
        reviewedBy: req.user.userId,
        reviewedAt: new Date(),
        notes: notes || flagged.notes,
        actionTaken: actionTaken || flagged.actionTaken
      },
      { new: true }
    );

    res.json({
      message: 'Flagged content reviewed',
      flagged
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Escalate flagged content
router.post('/flagged/:id/escalate', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { escalatedTo } = req.body;

    const flagged = await FlaggedContent.findByIdAndUpdate(
      req.params.id,
      {
        status: 'escalated',
        escalatedTo: escalatedTo || [req.user.userId],
        reviewedBy: req.user.userId,
        reviewedAt: new Date()
      },
      { new: true }
    );

    // Send alert emails
    const user = await User.findById(flagged.userId);
    if (user && user.settings.emailNotifications) {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        'crisisAlert',
        {
          userName: user.name,
          contentPreview: flagged.content
        }
      );
    }

    res.json({
      message: 'Content escalated to crisis team',
      flagged
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact user
router.post('/flagged/:id/contact-user', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { method } = req.body; // email, phone, in-app

    const flagged = await FlaggedContent.findByIdAndUpdate(
      req.params.id,
      {
        contactedUser: true,
        contactedAt: new Date(),
        contactMethod: method
      },
      { new: true }
    );

    res.json({
      message: `User contacted via ${method}`,
      flagged
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats/overview', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stats = {
      total_flagged: await FlaggedContent.countDocuments(),
      critical: await FlaggedContent.countDocuments({ riskLevel: 'critical' }),
      high: await FlaggedContent.countDocuments({ riskLevel: 'high' }),
      medium: await FlaggedContent.countDocuments({ riskLevel: 'medium' }),
      low: await FlaggedContent.countDocuments({ riskLevel: 'low' }),
      pending: await FlaggedContent.countDocuments({ status: 'pending' }),
      reviewed: await FlaggedContent.countDocuments({ status: 'reviewed' }),
      escalated: await FlaggedContent.countDocuments({ status: 'escalated' }),
      total_users: await User.countDocuments(),
      active_users_24h: await User.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get high-risk users
router.get('/users/at-risk', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Users with critical/high risk flagged content
    const atRiskUsers = await FlaggedContent.aggregate([
      {
        $match: {
          riskLevel: { $in: ['critical', 'high'] }
        }
      },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          highestRisk: { $max: '$riskLevel' },
          lastFlagged: { $max: '$flaggedAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 50
      }
    ]);

    res.json(atRiskUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
