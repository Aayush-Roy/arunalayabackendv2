const Feedback = require('../models/Feedback');
const Service = require('../models/Service');
const Agent = require('../models/Agent');
const Booking = require('../models/Booking');

const createFeedback = async (req, res) => {
  try {
    const { bookingId, rating, reviewMessage } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide booking ID and rating',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit feedback for this booking',
      });
    }

    if (booking.bookingStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only submit feedback for completed bookings',
      });
    }

    const existingFeedback = await Feedback.findOne({ bookingId });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already submitted for this booking',
      });
    }

    const feedback = await Feedback.create({
      userId: req.user._id,
      bookingId,
      serviceId: booking.serviceId,
      agentId: booking.agentId,
      rating,
      reviewMessage,
    });

    const allServiceFeedback = await Feedback.find({
      serviceId: booking.serviceId,
    });
    const avgServiceRating =
      allServiceFeedback.reduce((acc, item) => acc + item.rating, 0) /
      allServiceFeedback.length;

    await Service.findByIdAndUpdate(booking.serviceId, {
      averageRating: parseFloat(avgServiceRating.toFixed(2)),
      totalReviews: allServiceFeedback.length,
    });

    if (booking.agentId) {
      const allAgentFeedback = await Feedback.find({
        agentId: booking.agentId,
      });
      const avgAgentRating =
        allAgentFeedback.reduce((acc, item) => acc + item.rating, 0) /
        allAgentFeedback.length;

      await Agent.findByIdAndUpdate(booking.agentId, {
        rating: parseFloat(avgAgentRating.toFixed(2)),
      });
    }

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getServiceFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ serviceId: req.params.serviceId })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.user._id })
      .populate('serviceId', 'title')
      .populate('bookingId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getServiceFeedback,
  getUserFeedback,
};
