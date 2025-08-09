const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Venue = require('../models/Venue');

// @route   GET /api/venues
// @desc    Get all venues with search & filter parameters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, location, maxPrice } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (maxPrice) {
      query.pricePerHour = { $lte: Number(maxPrice) };
    }

    const venues = await Venue.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: venues.length, venues });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving venues' });
  }
});

// @route   GET /api/venues/:id
// @desc    Get single venue
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' });
    }
    res.json({ success: true, venue });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Venue not found' });
    }
    res.status(500).json({ success: false, message: 'Server error retrieving venue detail' });
  }
});

// @route   POST /api/venues
// @desc    Create a new venue
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json({ success: true, venue });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error creating venue' });
  }
});

// @route   PUT /api/venues/:id
// @desc    Update venue
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    let venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' });
    }
    venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json({ success: true, venue });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error updating venue' });
  }
});

// @route   DELETE /api/venues/:id
// @desc    Delete venue
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' });
    }
    await venue.deleteOne();
    res.json({ success: true, message: 'Venue removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error deleting venue' });
  }
});

module.exports = router;
