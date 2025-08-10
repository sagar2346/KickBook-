const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @route   GET /api/reviews/venue/:venueId
// @desc    Get all reviews for a venue
// @access  Public
router.get('/venue/:venueId', async (req, res) => {
  try {
    const reviews = await Review.find({ venueId: req.params.venueId })
      .populate('userId', 'name profilePhoto')
      .sort({ createdAt: -1 });
    
    // Calculate average rating
    let averageRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      averageRating = (sum / reviews.length).toFixed(1);
    }
    
    res.json({ success: true, count: reviews.length, averageRating, reviews });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving reviews' });
  }
});

// @route   POST /api/reviews
// @desc    Create a review for a venue
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { venueId, rating, comment } = req.body;

    // Check if user has actually booked this venue and it's confirmed
    const hasBooked = await Booking.findOne({
      userId: req.user.id,
      venueId: venueId,
      status: 'Confirmed'
    });

    if (!hasBooked) {
      return res.status(403).json({ success: false, message: 'You can only review venues you have booked' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      userId: req.user.id,
      venueId: venueId
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this venue' });
    }

    const review = await Review.create({
      userId: req.user.id,
      venueId,
      rating,
      comment
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error creating review' });
  }
});

module.exports = router;
