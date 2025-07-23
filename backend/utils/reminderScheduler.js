const cron = require("node-cron");
const Reminder = require("../models/reminderModel");

// Function to check and send notifications
const checkReminders = async () => {
  const now = new Date();
  const reminders = await Reminder.find({ time: { $lte: now }, isCompleted: false });

  reminders.forEach(async (reminder) => {
    console.log(`🔔 Reminder: ${reminder.message}`);

    // Mark as completed to avoid duplicate notifications
    reminder.isCompleted = true;
    await reminder.save();
  });
};

// Run the scheduler every minute
cron.schedule("* * * * *", checkReminders);

module.exports = checkReminders;
