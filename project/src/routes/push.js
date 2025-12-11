// const express = require("express");
// const User = require("../models/User");
// const { sendPushNotification } = require("../utils/sendPushNotification");

// const router = express.Router();

// // SAVE TOKEN
// router.post("/save-token", async (req, res) => {
//   try {
//     const { userId, token } = req.body;

//     if (!userId || !token) {
//       return res.status(400).json({
//         success: false,
//         message: "userId and token are required",
//       });
//     }

//     await User.findByIdAndUpdate(userId, {
//       expoPushToken: token,
//     });

//     return res.json({
//       success: true,
//       message: "Expo push token saved successfully",
//     });
//   } catch (err) {
//     console.error("Save Token Error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while saving token",
//     });
//   }
// });

// module.exports = router;
const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/save-token", async (req, res) => {
  try {
    const { userId, token } = req.body;

    console.log("Incoming token:", token, "UserID:", userId);

    const updated = await User.findByIdAndUpdate(
      userId,
      { expoPushToken: token },
      { new: true }
    );

    console.log("Updated User:", updated);

    res.json({
      success: true,
      message: "Token saved",
    });

  } catch (err) {
    console.log("Token Save Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
