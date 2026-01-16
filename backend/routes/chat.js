const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const FlaggedContent = require('../models/FlaggedContent');
const { analyzeSuicideRisk } = require('../services/riskAnalysis');

// Create new conversation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = new Conversation({
      userId: req.user.userId,
      title: title || 'New Chat'
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's conversations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .select('-messages'); // Don't return all messages in list
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single conversation
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check ownership
    if (conversation.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add message to conversation
router.post('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { content, role } = req.body;

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Analyze content for crisis keywords
    if (role === 'user') {
      const riskAnalysis = analyzeSuicideRisk(content);
      conversation.riskLevel = riskAnalysis.riskLevel;

      // Flag if necessary
      if (riskAnalysis.riskLevel !== 'low') {
        conversation.flagged = true;
        conversation.flagReason = riskAnalysis.recommendedAction;
        
        // Create flagged content record
        await FlaggedContent.create({
          userId: req.user.userId,
          type: 'chat',
          contentId: conversation._id,
          content,
          riskLevel: riskAnalysis.riskLevel,
          keywords: riskAnalysis.keywords,
          reason: riskAnalysis.recommendedAction
        });
      }
    }

    // Add message
    conversation.messages.push({
      role,
      content,
      timestamp: new Date()
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete conversation
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
