const Booking = require('../models/Booking');
const Agent = require('../models/Agent');

// const getAgentBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ agentId: req.agent._id })
//       .populate('serviceId', 'title description price durationMins category imageUrl')
//       .populate('userId', 'name email phone address')
//       .sort({ createdAt: -1 });
//     console.log("from agent controllers=>",bookings)
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
// const getAgentBookings = async (req, res) => {
//   try {
//     const agentId = req.agent._id;

//     // Fetch bookings assigned to this agent
//     const bookings = await Booking.find({ agentId })
//       .populate("userId", "name phone address")
//       .populate("serviceId");

//     // Fetch agent's current rating
//     const agent = await Agent.findById(agentId).select("rating");

//     res.status(200).json({
//       success: true,
//       count: bookings.length,
//       rating: agent?.rating || 0,
//       data: bookings,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
const getAgentBookings = async (req, res) => {
  try {
    const agentId = req.agent._id;

    const bookings = await Booking.find({ agentId })
      .populate("userId", "name phone address")
      .populate("serviceId");

    // Fetch agent rating (already updated via feedback)
    const agent = await Agent.findById(agentId).select("rating");

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length,
      rating: agent?.rating || 0,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.bookingStatus = status;
    }

    const bookings = await Booking.find(filter)
      .populate('serviceId', 'title description price durationMins category')
      .populate('userId', 'name email phone address')
      .populate('agentId', 'name phone specialization')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus } = req.body;

    if (!bookingStatus) {
      return res.status(400).json({
        success: false,
        message: 'Please provide booking status',
      });
    }

    const validStatuses = [
      'pending',
      'confirmed',
      'on-the-way',
      'completed',
      'cancelled',
    ];

    if (!validStatuses.includes(bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (bookingStatus === 'confirmed' && !booking.agentId) {
      booking.agentId = req.agent._id;
    }

    booking.bookingStatus = bookingStatus;

    await booking.save();

    if (bookingStatus === 'completed') {
      await Agent.findByIdAndUpdate(req.agent._id, {
        $inc: { totalBookings: 1 },
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Please provide payment status',
      });
    }

    if (!['pending', 'paid'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.paymentStatus = paymentStatus;

    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAgentProfile = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent._id);

    if (agent) {
      res.json({
        success: true,
        data: {
          _id: agent._id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          specialization: agent.specialization,
          profileImage: agent.profileImage,
          rating: agent.rating,
          totalBookings: agent.totalBookings,
          isActive: agent.isActive,
          createdAt: agent.createdAt,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllagentProfiles = async (req, res) => {
  try {
    const agents = await Agent.find({}); 
    res.json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
  getAgentBookings,
  getAllBookings,
  updateBookingStatus,
  updatePaymentStatus,
  getAgentProfile,
  getAllagentProfiles
};
