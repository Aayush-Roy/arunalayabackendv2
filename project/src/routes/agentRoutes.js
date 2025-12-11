const express = require('express');
const {
  getAgentBookings,
  getAllBookings,
  updateBookingStatus,
  updatePaymentStatus,
  getAgentProfile,
  getAllagentProfiles,
} = require('../controllers/agentController');
const { protectAgent } = require('../middlewares/authMiddleware');
const { getAgentBookingDetails } = require('../controllers/bookingController');

const router = express.Router();

router.get('/profile', protectAgent, getAgentProfile);
router.get('/bookings', protectAgent, getAgentBookings);
router.get('/all', getAllagentProfiles);
router.get('/bookings/all', protectAgent, getAllBookings);
router.get("/bookings/:id", protectAgent, getAgentBookingDetails);
router.put('/bookings/:id/status', protectAgent, updateBookingStatus);
router.put('/bookings/:id/payment', protectAgent, updatePaymentStatus);

module.exports = router;
