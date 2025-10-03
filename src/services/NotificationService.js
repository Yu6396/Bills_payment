const { Notification } = require("../../models");

async function createNotification(userId, message) {
  return Notification.create({ user_id: userId, message, read: false });
}

module.exports = { createNotification };
