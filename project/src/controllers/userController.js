// const User = require('../models/User');
// const Booking = require('../models/Booking');
// const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       res.json({
//         success: true,
//         data: {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           phone: user.phone,
//           address: user.address,
//           coordinates: user.coordinates,
//           profileImage: user.profileImage,
//           createdAt: user.createdAt,
//         },
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };




// // const getUserProfile = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user._id);

// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'User not found',
// //       });
// //     }

// //     // 🔥 Fetch all bookings of this user
// //     const bookings = await Booking.find({ userId: req.user._id })
// //       .populate('service')   // optional: if you want service details
// //       .populate('provider'); // optional: if you want provider details

// //     res.json({
// //       success: true,
// //       data: {
// //         user: {
// //           _id: user._id,
// //           name: user.name,
// //           email: user.email,
// //           phone: user.phone,
// //           address: user.address,
// //           coordinates: user.coordinates,
// //           profileImage: user.profileImage,
// //           createdAt: user.createdAt,
// //         },
// //         bookings: bookings,
// //       },
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;
//       user.phone = req.body.phone || user.phone;
//       user.address = req.body.address || user.address;
//       user.profileImage = req.body.profileImage || user.profileImage;

//       if (req.body.coordinates) {
//         user.coordinates.latitude =
//           req.body.coordinates.latitude || user.coordinates.latitude;
//         user.coordinates.longitude =
//           req.body.coordinates.longitude || user.coordinates.longitude;
//       }

//       if (req.body.password) {
//         user.password = req.body.password;
//       }

//       const updatedUser = await user.save();

//       res.json({
//         success: true,
//         data: {
//           _id: updatedUser._id,
//           name: updatedUser.name,
//           email: updatedUser.email,
//           phone: updatedUser.phone,
//           address: updatedUser.address,
//           coordinates: updatedUser.coordinates,
//           profileImage: updatedUser.profileImage,
//         },
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   getUserProfile,
//   updateUserProfile,
// };
// // const User = require('../models/User');
// // const Booking = require('../models/Booking');
// const User = require('../models/User.js');
// const Booking = require('../models/Booking.js')
// const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     console.log("FETCHED USER:", user);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }

//     // 🔥 IMPORTANT FIX → userId used in booking schema
//     const bookings = await Booking.find({ userId: req.user._id })
//       .populate('serviceId')
//       .populate('agentId');
//     console.log("USER BOOKINGS:", bookings);
//     res.json({
//       success: true,
//       data: {
//         user: {
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           phone: user.phone,
//           address: user.address,
//           coordinates: user.coordinates,
//           profileImage: user.profileImage,
//           createdAt: user.createdAt,
//         },
//         bookings,
//       },
//     });

//   } catch (error) {
//     console.log("PROFILE ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }

//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.phone = req.body.phone || user.phone;
//     user.address = req.body.address || user.address;
//     user.profileImage = req.body.profileImage || user.profileImage;

//     if (req.body.coordinates) {
//       user.coordinates = {
//         latitude: req.body.coordinates.latitude || user.coordinates.latitude,
//         longitude: req.body.coordinates.longitude || user.coordinates.longitude,
//       };
//     }

//     const updatedUser = await user.save();

//     res.json({
//       success: true,
//       data: updatedUser,
//     });

//   } catch (error) {
//     console.log("UPDATE ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   getUserProfile,
//   updateUserProfile,
// };





//for tesing
const User = require('../models/User');
// Remove or comment out Booking import
// const Booking = require('../models/Booking');

const getUserProfile = async (req, res) => {
  try {
    console.log('🔍 getUserProfile called for user:', req.user._id);
    
    const user = await User.findById(req.user._id);

    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ User found:', user.email);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        coordinates: user.coordinates,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ getUserProfile error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.profileImage = req.body.profileImage || user.profileImage;

      if (req.body.coordinates) {
        user.coordinates.latitude =
          req.body.coordinates.latitude || user.coordinates.latitude;
        user.coordinates.longitude =
          req.body.coordinates.longitude || user.coordinates.longitude;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          coordinates: updatedUser.coordinates,
          profileImage: updatedUser.profileImage,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};