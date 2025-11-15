const express = require('express');
const {
  registerUser,
  loginUser,
  registerAgent,
  loginAgent,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/agent/signup', registerAgent);
router.post('/agent/login', loginAgent);

module.exports = router;
