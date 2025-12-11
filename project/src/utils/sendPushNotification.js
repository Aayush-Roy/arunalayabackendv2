const { Expo } = require("expo-server-sdk");

let expo = new Expo();

async function sendPushNotification(pushToken, title, body, data = {}) {
  try {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.log("❌ Invalid Expo Token:", pushToken);
      return;
    }

    const message = {
      to: pushToken,
      sound: "default",
      title,
      body,
      data,
    };

    await expo.sendPushNotificationsAsync([message]);
    console.log("📩 Push Notification Sent:", title);
  } catch (err) {
    console.log("Push Error:", err);
  }
}

module.exports = { sendPushNotification };
