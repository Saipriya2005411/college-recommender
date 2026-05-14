const express = require('express');
const router = express.Router();
const College = require('../models/College');
const { protect } = require('../middleware/auth');

// @route GET /api/colleges
router.get('/', async (req, res) => {
  try {
    const { state, tier, type, course, search, page = 1, limit = 12 } = req.query;
    let query = { isActive: true };
    if (state) query.state = state;
    if (tier) query.tier = tier;
    if (type) query.type = type;
    if (course) query['courses.name'] = { $regex: course, $options: 'i' };
    if (search) query.$text = { $search: search };

    const total = await College.countDocuments(query);
    const colleges = await College.find(query)
      .select('-reviews')
      .sort({ ranking: 1, 'placements.avgPackage': -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, count: colleges.length, total, pages: Math.ceil(total / limit), colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/colleges/featured
router.get('/featured', async (req, res) => {
  try {
    const colleges = await College.find({ featured: true, isActive: true }).select('-reviews').limit(6);
    res.json({ success: true, colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/colleges/:id
router.get('/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id).populate('reviews.userId', 'name');
    if (!college) return res.status(404).json({ success: false, message: 'College not found' });

    // Track recently viewed (optional, needs auth)
    res.json({ success: true, college });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/colleges/:id/review
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ success: false, message: 'College not found' });

    const alreadyReviewed = college.reviews.find(r => r.userId.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Already reviewed' });

    college.reviews.push({ userId: req.user._id, rating, comment });
    college.totalReviews = college.reviews.length;
    college.avgRating = college.reviews.reduce((acc, r) => acc + r.rating, 0) / college.reviews.length;
    await college.save();

    res.json({ success: true, message: 'Review added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/colleges/compare
router.post('/compare', async (req, res) => {
  try {
    const { ids } = req.body;
    const colleges = await College.find({ _id: { $in: ids } });
    res.json({ success: true, colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
