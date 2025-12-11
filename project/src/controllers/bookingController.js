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
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Agent = require("../models/Agent");
const Service = require("../models/Service");
const User = require("../models/User");
// const { sendPushNotification } = require("../utils/sendPushNotification");
const {sendPushNotification} = require("../utils/sendPushNotification");

const ObjectId = mongoose.Types.ObjectId;
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







//Auto Assign 2
// const createBooking = async (req, res) => {
//   try {
//     const { serviceId, selectedDate, selectedTime, userAddress } = req.body;

//     // Logged in user
//     const userId = req.user._id || req.user.id;

//     // ---------------------------
//     // 1️⃣ VALIDATION
//     // ---------------------------
//     if (!serviceId || !selectedDate || !selectedTime || !userAddress) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields",
//       });
//     }

//     // ---------------------------
//     // 2️⃣ SERVICE FETCH
//     // ---------------------------
//     const service = await Service.findById(serviceId);
//     if (!service) {
//       return res.status(404).json({
//         success: false,
//         message: "Service not found",
//       });
//     }

//     // ---------------------------
//     // 3️⃣ ADDRESS → COORDINATES
//     // ---------------------------
//     const geoRes = await axios.get(
//       `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//         userAddress
//       )}&format=json&limit=1`,
//       {
//         headers: {
//           "User-Agent": "ArunalayaBookingService/1.0 (ar0671362@gmail.com)",
//         },
//       }
//     );

//     if (!geoRes.data.length) {
//       return res.status(400).json({
//         success: false,
//         message: "Unable to fetch coordinates for this address",
//       });
//     }

//     const latitude = parseFloat(geoRes.data[0].lat);
//     const longitude = parseFloat(geoRes.data[0].lon);

//     // ---------------------------
//     // 4️⃣ DISTANCE CALCULATION
//     // ---------------------------
//     const distance = calculateDistance(
//       SERVICE_CENTER_LOCATION.latitude,
//       SERVICE_CENTER_LOCATION.longitude,
//       latitude,
//       longitude
//     );

//     if (distance > 7) {
//       return res.status(400).json({
//         success: false,
//         message: `Service not available in your area. You are ${distance.toFixed(
//           1
//         )} km away (max 7 km).`,
//       });
//     }

//     // ---------------------------
//     // 5️⃣ TRAVEL + BILL CALC
//     // ---------------------------
//     const travelTime = calculateTravelTime(distance);
//     const travelCost = calculateTravelCost(distance);
//     const finalBillAmount = calculateFinalBill(service.price, travelCost);

//     // ---------------------------
//     // 6️⃣ AGENT AUTO-ASSIGN
//     // ⭐ REALTIME LEAST BUSY AGENT SYSTEM ⭐
//     // ---------------------------
//     const agents = await Agent.aggregate([
//       {
//         $lookup: {
//           from: "bookings",
//           localField: "_id",
//           foreignField: "agentId",
//           as: "assignedBookings",
//         },
//       },
//       {
//         $addFields: {
//           liveBookingCount: { $size: "$assignedBookings" },
//         },
//       },
//       {
//         $match: {
//           isActive: true, // Only active agents
//         },
//       },
//       {
//         $sort: { liveBookingCount: 1 }, // Least busy first
//       },
//       { $limit: 1 },
//     ]);

//     if (!agents.length) {
//       return res.status(400).json({
//         success: false,
//         message: "No physiotherapists available right now",
//       });
//     }

//     const agent = agents[0];

//     // ---------------------------
//     // 7️⃣ CREATE BOOKING
//     // ---------------------------
//     const booking = await Booking.create({
//       userId,
//       serviceId,
//       selectedDate,
//       selectedTime,
//       userAddress,
//       coordinates: { latitude, longitude },
//       travelDistance: distance,
//       travelTime,
//       travelCost,
//       servicePrice: service.price,
//       finalBillAmount,

//       agentId: agent._id,
//       bookingStatus: "pending",
//     });

//     // ---------------------------
//     // 8️⃣ POPULATE RESPONSE
//     // ---------------------------
//     const populatedBooking = await Booking.findById(booking._id)
//       .populate(
//         "serviceId",
//         "title description price durationMins category imageUrl"
//       )
//       .populate("userId", "name email phone")
//       .populate("agentId", "name phone specialization");

//     return res.status(201).json({
//       success: true,
//       message: "Booking created & therapist auto-assigned successfully",
//       data: populatedBooking,
//     });
//   } catch (error) {
//     console.error("Booking Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }

  
// };

const createBooking = async (req, res) => {
  try {
    const { serviceId, selectedDate, selectedTime, userAddress } = req.body;

    const userId = req.user._id || req.user.id;

    if (!serviceId || !selectedDate || !selectedTime || !userAddress) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const geoRes = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        userAddress
      )}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "ArunalayaBookingService/1.0 (ar0671362@gmail.com)",
        },
      }
    );

    if (!geoRes.data.length) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch coordinates for this address",
      });
    }

    const latitude = parseFloat(geoRes.data[0].lat);
    const longitude = parseFloat(geoRes.data[0].lon);

    const distance = calculateDistance(
      SERVICE_CENTER_LOCATION.latitude,
      SERVICE_CENTER_LOCATION.longitude,
      latitude,
      longitude
    );

    if (distance > 7) {
      return res.status(400).json({
        success: false,
        message: `Service not available in your area. You are ${distance.toFixed(
          1
        )} km away (max 7 km).`,
      });
    }

    const travelTime = calculateTravelTime(distance);
    const travelCost = calculateTravelCost(distance);
    const finalBillAmount = calculateFinalBill(service.price, travelCost);

    const agents = await Agent.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "agentId",
          as: "assignedBookings",
        },
      },
      {
        $addFields: {
          liveBookingCount: { $size: "$assignedBookings" },
        },
      },
      {
        $match: {
          isActive: true,
        },
      },
      {
        $sort: { liveBookingCount: 1 },
      },
      { $limit: 1 },
    ]);

    if (!agents.length) {
      return res.status(400).json({
        success: false,
        message: "No physiotherapists available right now",
      });
    }

    const agent = agents[0];

    // ---------------------------
    // 7️⃣ CREATE BOOKING
    // ---------------------------
    const booking = await Booking.create({
      userId,
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
      agentId: agent._id,
      bookingStatus: "pending",
    });

    // -------------------------------------------------------
    // 8️⃣ SEND PUSH NOTIFICATION TO USER AFTER BOOKING CREATED
    // -------------------------------------------------------
    const user = await User.findById(userId);

    if (user?.expoPushToken) {
      await sendPushNotification(
        user.expoPushToken,
        "Booking Confirmed 🎉",
        `Your booking for ${service.title} is created successfully.`,
        { bookingId: booking._id.toString() }
      );
    }
    console.log("🔥 REACHED PUSH CODE");
console.log("User Token:", user?.expoPushToken);

    // ---------------------------
    // 9️⃣ POPULATE RESPONSE
    // ---------------------------
    const populatedBooking = await Booking.findById(booking._id)
      .populate(
        "serviceId",
        "title description price durationMins category imageUrl"
      )
      .populate("userId", "name email phone")
      .populate("agentId", "name phone specialization");

    return res.status(201).json({
      success: true,
      message: "Booking created & therapist auto-assigned successfully",
      data: populatedBooking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("serviceId", "title description price durationMins category imageUrl")
      .populate("agentId", "name phone specialization")
      .sort({ createdAt: -1 });
    console.log(bookings)
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
// const getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate("serviceId", "title description price durationMins category imageUrl")
//       .populate("userId", "name email phone address")
//       .populate("agentId", "name phone specialization");

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     // Only owner can access
//     // if (booking.userId._id.toString() !== req.user._id.toString()) {
//     //   return res.status(403).json({
//     //     success: false,
//     //     message: "Not authorized to access this booking",
//     //   });
//     // }
//     const loggedInUserId = req.user._id?.toString() || req.user.id?.toString();

// if (booking.userId._id.toString() !== loggedInUserId) {
//   return res.status(403).json({
//     success: false,
//     message: "Not authorized to access this booking",
//   });
// }


//     res.json({
//       success: true,
//       data: booking,
//     });
//   } catch (error) {
//     console.error("Get Booking Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("serviceId", "title description price durationMins category imageUrl")
      .populate("userId", "name email phone")
      .populate("agentId", "name phone specialization");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Extract logged-in user's ID safely
    const loggedInUserId =
      req.user?._id?.toString() ||
      req.user?.id?.toString();

    if (!loggedInUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Ensure booking has userId
    if (!booking.userId?._id) {
      return res.status(500).json({
        success: false,
        message: "Booking has no userId stored",
      });
    }

    // Compare booking user and logged-in user
    if (booking.userId._id.toString() !== loggedInUserId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this booking",
      });
    }

    return res.json({
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



const getAgentBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("serviceId")
      .populate("userId");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Very important: Ensure the booking belongs to THIS AGENT
    if (booking.agentId?.toString() !== req.agent._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
  getAgentBookingDetails,
  cancelBooking,
};
