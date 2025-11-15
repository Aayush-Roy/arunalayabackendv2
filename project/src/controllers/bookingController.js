// const Booking = require('../models/Booking');
// const Service = require('../models/Service');
// const { calculateDistance } = require('../utils/distance');
// const {
//   calculateTravelTime,
//   calculateTravelCost,
//   calculateFinalBill,
// } = require('../utils/calculateCost');

// const SERVICE_CENTER_LOCATION = {
//   latitude: 28.7041,
//   longitude: 77.1025,
// };

// const createBooking = async (req, res) => {
//   try {
//     const {
//       serviceId,
//       selectedDate,
//       selectedTime,
//       userAddress,
//       coordinates,
//     } = req.body;

//     if (
//       !serviceId ||
//       !selectedDate ||
//       !selectedTime ||
//       !userAddress ||
//       !coordinates
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide all required fields',
//       });
//     }

//     const service = await Service.findById(serviceId);

//     if (!service) {
//       return res.status(404).json({
//         success: false,
//         message: 'Service not found',
//       });
//     }

//     const distance = calculateDistance(
//       SERVICE_CENTER_LOCATION.latitude,
//       SERVICE_CENTER_LOCATION.longitude,
//       coordinates.latitude,
//       coordinates.longitude
//     );

//     if (distance > 7) {
//       return res.status(400).json({
//         success: false,
//         message: 'Service not available in your area',
//         distance: distance,
//       });
//     }

//     const travelTime = calculateTravelTime(distance);
//     const travelCost = calculateTravelCost(distance);
//     const finalBillAmount = calculateFinalBill(service.price, travelCost);

//     const booking = await Booking.create({
//       userId: req.user._id,
//       serviceId,
//       selectedDate,
//       selectedTime,
//       userAddress,
//       coordinates,
//       travelDistance: distance,
//       travelTime,
//       travelCost,
//       servicePrice: service.price,
//       finalBillAmount,
//     });

//     const populatedBooking = await Booking.findById(booking._id)
//       .populate('serviceId', 'title description price durationMins category')
//       .populate('userId', 'name email phone');

//     res.status(201).json({
//       success: true,
//       data: populatedBooking,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const getUserBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ userId: req.user._id })
//       .populate('serviceId', 'title description price durationMins category imageUrl')
//       .populate('agentId', 'name phone specialization')
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: bookings.length,
//       data: bookings,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate('serviceId', 'title description price durationMins category imageUrl')
//       .populate('userId', 'name email phone address')
//       .populate('agentId', 'name phone specialization');

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found',
//       });
//     }

//     if (booking.userId._id.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to access this booking',
//       });
//     }

//     res.json({
//       success: true,
//       data: booking,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const cancelBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found',
//       });
//     }

//     if (booking.userId.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to cancel this booking',
//       });
//     }

//     if (booking.bookingStatus === 'completed') {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot cancel completed booking',
//       });
//     }

//     booking.bookingStatus = 'cancelled';
//     booking.cancellationReason = req.body.reason || 'User cancelled';

//     await booking.save();

//     res.json({
//       success: true,
//       data: booking,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   createBooking,
//   getUserBookings,
//   getBookingById,
//   cancelBooking,
// };
const axios = require("axios");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { calculateDistance } = require("../utils/distance");
const {
  calculateTravelTime,
  calculateTravelCost,
  calculateFinalBill,
} = require("../utils/calculateCost");

// Service Center Origin Location
const SERVICE_CENTER_LOCATION = {
  latitude: 28.7041,
  longitude: 77.1025,
};

// -----------------------------------------------------
// 📌 CREATE BOOKING
// -----------------------------------------------------
const createBooking = async (req, res) => {
  try {
    const { serviceId, selectedDate, selectedTime, userAddress } = req.body;

    // Validate required fields
    if (!serviceId || !selectedDate || !selectedTime || !userAddress) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // -----------------------------------------------------
    // 📌 Convert Address → Coordinates (Free API)
    // -----------------------------------------------------
    const geoRes = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        userAddress
      )}&format=json&limit=1`
    );

    if (geoRes.data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch coordinates for this address",
      });
    }

    const latitude = parseFloat(geoRes.data[0].lat);
    const longitude = parseFloat(geoRes.data[0].lon);

    // -----------------------------------------------------
    // 📌 Calculate Distance
    // -----------------------------------------------------
    const distance = calculateDistance(
      SERVICE_CENTER_LOCATION.latitude,
      SERVICE_CENTER_LOCATION.longitude,
      latitude,
      longitude
    );

    if (distance > 7) {
      return res.status(400).json({
        success: false,
        message: "Service not available in your area",
        distance,
      });
    }

    // -----------------------------------------------------
    // 📌 Travel calculations
    // -----------------------------------------------------
    const travelTime = calculateTravelTime(distance);
    const travelCost = calculateTravelCost(distance);
    const finalBillAmount = calculateFinalBill(service.price, travelCost);

    // -----------------------------------------------------
    // 📌 Create Booking
    // -----------------------------------------------------
    const booking = await Booking.create({
      userId: req.user._id,
      serviceId,
      selectedDate,
      selectedTime,
      userAddress,
      coordinates: { latitude, longitude },
      travelDistance: distance,
      travelTime,
      travelCost,
      servicePrice: service.price,
      finalBillAmount,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("serviceId", "title description price durationMins category imageUrl")
      .populate("userId", "name email phone");

    return res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -----------------------------------------------------
// 📌 GET USER BOOKINGS
// -----------------------------------------------------
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("serviceId", "title description price durationMins category imageUrl")
      .populate("agentId", "name phone specialization")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get User Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -----------------------------------------------------
// 📌 GET BOOKING BY ID
// -----------------------------------------------------
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("serviceId", "title description price durationMins category imageUrl")
      .populate("userId", "name email phone address")
      .populate("agentId", "name phone specialization");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only owner can access
    if (booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this booking",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get Booking Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -----------------------------------------------------
// 📌 CANCEL BOOKING
// -----------------------------------------------------
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only user who created booking can cancel
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    // Already completed bookings cannot be cancelled
    if (booking.bookingStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed booking",
      });
    }

    booking.bookingStatus = "cancelled";
    booking.cancellationReason = req.body.reason || "User cancelled";
    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};
