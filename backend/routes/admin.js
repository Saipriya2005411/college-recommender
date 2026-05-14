const express = require('express');
const router = express.Router();
const College = require('../models/College');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @route GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalColleges = await College.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ role: 'student' });
    const tier1 = await College.countDocuments({ tier: 'Tier 1', isActive: true });
    const tier2 = await College.countDocuments({ tier: 'Tier 2', isActive: true });
    const tier3 = await College.countDocuments({ tier: 'Tier 3', isActive: true });
    const stateStats = await College.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ success: true, stats: { totalColleges, totalUsers, tier1, tier2, tier3, stateStats } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/admin/college
router.post('/college', async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json({ success: true, message: 'College added', college });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/admin/college/:id
router.put('/college/:id', async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!college) return res.status(404).json({ success: false, message: 'College not found' });
    res.json({ success: true, message: 'College updated', college });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/admin/college/:id
router.delete('/college/:id', async (req, res) => {
  try {
    await College.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'College removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
