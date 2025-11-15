const express = require('express');
const {
  createFeedback,
  getServiceFeedback,
  getUserFeedback,
} = require('../controllers/feedbackController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createFeedback);
router.get('/my', protect, getUserFeedback);
router.get('/service/:serviceId', getServiceFeedback);

module.exports = router;
