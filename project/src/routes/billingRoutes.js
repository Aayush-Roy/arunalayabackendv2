const express = require('express');
const { getBillingDetails } = require('../controllers/billingController');

const router = express.Router();

router.get('/:bookingId', getBillingDetails);

module.exports = router;
