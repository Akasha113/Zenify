const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const JournalEntry = require('../models/JournalEntry');
const FlaggedContent = require('../models/FlaggedContent');
const { analyzeSuicideRisk } = require('../services/riskAnalysis');

// Create journal entry
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Analyze content for crisis keywords
    const riskAnalysis = analyzeSuicideRisk(content);

    const entry = new JournalEntry({
      userId: req.user.userId,
      title,
      content,
      mood: mood || 'neutral',
      tags: tags || [],
      riskLevel: riskAnalysis.riskLevel,
      flagged: riskAnalysis.riskLevel !== 'low',
      flagReason: riskAnalysis.recommendedAction
    });

    await entry.save();

    // Create flagged content record if needed
    if (riskAnalysis.riskLevel !== 'low') {
      await FlaggedContent.create({
        userId: req.user.userId,
        type: 'journal',
        contentId: entry._id,
        content: content.substring(0, 500),
        riskLevel: riskAnalysis.riskLevel,
        keywords: riskAnalysis.keywords,
        reason: riskAnalysis.recommendedAction
      });
    }

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's journal entries
router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single entry
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (entry.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update entry
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (entry.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Re-analyze if content changed
    if (content && content !== entry.content) {
      const riskAnalysis = analyzeSuicideRisk(content);
      entry.riskLevel = riskAnalysis.riskLevel;
      entry.flagged = riskAnalysis.riskLevel !== 'low';
    }

    entry.title = title || entry.title;
    entry.content = content || entry.content;
    entry.mood = mood || entry.mood;
    entry.tags = tags || entry.tags;
    entry.updatedAt = new Date();

    await entry.save();
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete entry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (entry.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await JournalEntry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
