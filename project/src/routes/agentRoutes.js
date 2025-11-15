const express = require('express');
const {
  getAgentBookings,
  getAllBookings,
  updateBookingStatus,
  updatePaymentStatus,
  getAgentProfile,
} = require('../controllers/agentController');
const { protectAgent } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', protectAgent, getAgentProfile);
router.get('/bookings', protectAgent, getAgentBookings);
router.get('/bookings/all', protectAgent, getAllBookings);
router.put('/bookings/:id/status', protectAgent, updateBookingStatus);
router.put('/bookings/:id/payment', protectAgent, updatePaymentStatus);

module.exports = router;
