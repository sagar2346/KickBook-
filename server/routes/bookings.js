const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Booking = require('../models/Booking');

// @route   GET /api/bookings
// @desc    Get all bookings (Admin sees all, User sees only their own)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.find()
        .populate('userId', 'name email phone')
        .populate('venueId', 'name location pricePerHour photos')
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ userId: req.user.id })
        .populate('venueId', 'name location pricePerHour photos')
        .sort({ createdAt: -1 });
    }
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving bookings' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('venueId', 'name location pricePerHour photos openTime closeTime');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving booking detail' });
  }
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { venueId, date, startTime, endTime, totalPrice } = req.body;

    // Check for overlap
    const existingBooking = await Booking.findOne({
      venueId,
      date,
      status: { $ne: 'Cancelled' },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'Time slot is already booked' });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      venueId,
      date,
      startTime,
      endTime,
      totalPrice,
      status: 'Confirmed'
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error creating booking' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error cancelling booking' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Admin update status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, booking });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error updating booking status' });
  }
});

module.exports = router;
