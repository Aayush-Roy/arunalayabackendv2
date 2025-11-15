const Booking = require('../models/Booking');

const getBillingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('serviceId', 'title description')
      .populate('userId', 'name email phone')
      .populate('agentId', 'name phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const invoice = {
      invoiceId: booking._id,
      invoiceDate: booking.createdAt,
      bookingDate: booking.selectedDate,
      bookingTime: booking.selectedTime,
      customer: {
        name: booking.userId.name,
        email: booking.userId.email,
        phone: booking.userId.phone,
        address: booking.userAddress,
      },
      service: {
        name: booking.serviceId.title,
        description: booking.serviceId.description,
        basePrice: booking.servicePrice,
      },
      agent: booking.agentId
        ? {
            name: booking.agentId.name,
            phone: booking.agentId.phone,
          }
        : null,
      travelDetails: {
        distance: booking.travelDistance,
        travelTime: booking.travelTime,
        travelCost: booking.travelCost,
      },
      billing: {
        servicePrice: booking.servicePrice,
        travelCost: booking.travelCost,
        totalAmount: booking.finalBillAmount,
      },
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
    };

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getBillingDetails,
};
