const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const MoodEntry = require('../models/MoodEntry');

// Record mood entry
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { mood, intensity, note, activities, triggers } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const entry = new MoodEntry({
      userId: req.user.userId,
      mood,
      intensity: intensity || 5,
      note: note || '',
      activities: activities || [],
      triggers: triggers || []
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const entries = await MoodEntry.find({
      userId: req.user.userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood statistics
router.get('/stats/:period', authMiddleware, async (req, res) => {
  try {
    const { period = 'month' } = req.params;
    
    let startDate = new Date();
    switch(period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const entries = await MoodEntry.find({
      userId: req.user.userId,
      createdAt: { $gte: startDate }
    });

    // Calculate statistics
    const moods = {};
    const avgIntensity = entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length || 0;

    entries.forEach(entry => {
      moods[entry.mood] = (moods[entry.mood] || 0) + 1;
    });

    res.json({
      period,
      totalEntries: entries.length,
      averageIntensity: Math.round(avgIntensity * 10) / 10,
      moodBreakdown: moods,
      mostCommonMood: Object.keys(moods).reduce((a, b) => moods[a] > moods[b] ? a : b, 'none')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
