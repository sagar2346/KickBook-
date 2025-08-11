const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Venue = require('../models/Venue');

// @route   GET /api/stats
// @desc    Retrieve platform statistics (bookings count, total revenue, user count, venue count)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    // 1. Total bookings count
    const totalBookings = await Booking.countDocuments();

    // 2. Total venues count
    const totalVenues = await Venue.countDocuments();

    // 3. Total customers count (role = 'user')
    const totalUsers = await User.countDocuments({ role: 'user' });

    // 4. Total revenue (Sum of totalPrice for 'Confirmed' bookings)
    const revenueResult = await Booking.aggregate([
      { $match: { status: 'Confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // 5. Additional charts data: Bookings by status
    const pendingCount = await Booking.countDocuments({ status: 'Pending' });
    const confirmedCount = await Booking.countDocuments({ status: 'Confirmed' });
    const cancelledCount = await Booking.countDocuments({ status: 'Cancelled' });

    res.json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
        totalUsers,
        totalVenues,
        statusBreakdown: {
          pending: pendingCount,
          confirmed: confirmedCount,
          cancelled: cancelledCount
        }
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error compiling dashboard statistics' });
  }
});

module.exports = router;
