const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');

// @route   GET /api/users/profile
// @desc    Get current user's profile info
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user's profile (optionally upload profile photo)
// @access  Private
router.put('/profile', protect, upload.single('profilePhoto'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update simple fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;

    // Check if new profile photo was uploaded
    if (req.file) {
      // Save static serving URL path
      user.profilePhoto = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profilePhoto: updatedUser.profilePhoto,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

module.exports = router;
