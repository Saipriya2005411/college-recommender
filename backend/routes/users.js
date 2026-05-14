const express = require('express');
const router = express.Router();
const User = require('../models/User');
const College = require('../models/College');
const { protect } = require('../middleware/auth');

// @route GET /api/users/dashboard
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedColleges', 'collegeName state city placements tier ranking imageURL')
      .populate('recentlyViewed', 'collegeName state city placements tier ranking imageURL');

    const totalSaved = user.savedColleges.length;
    const totalRecent = user.recentlyViewed.length;

    res.json({
      success: true,
      dashboard: {
        user: { name: user.name, email: user.email, state: user.state },
        totalSaved,
        totalRecent,
        savedColleges: user.savedColleges,
        recentlyViewed: user.recentlyViewed
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/users/save/:collegeId
router.post('/save/:collegeId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const collegeId = req.params.collegeId;

    const alreadySaved = user.savedColleges.includes(collegeId);
    if (alreadySaved) {
      user.savedColleges = user.savedColleges.filter(id => id.toString() !== collegeId);
      await user.save();
      return res.json({ success: true, message: 'College removed from saved', saved: false });
    }

    user.savedColleges.push(collegeId);
    await user.save();
    res.json({ success: true, message: 'College saved', saved: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/users/saved
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedColleges');
    res.json({ success: true, savedColleges: user.savedColleges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/users/view/:collegeId
router.post('/view/:collegeId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const collegeId = req.params.collegeId;
    user.recentlyViewed = user.recentlyViewed.filter(id => id.toString() !== collegeId);
    user.recentlyViewed.unshift(collegeId);
    if (user.recentlyViewed.length > 10) user.recentlyViewed.pop();
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
