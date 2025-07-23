const cron = require("node-cron");
const Message = require("./models/messageModel");
const sendNotification = require("./utils/sendNotification"); // Helper function

cron.schedule("*/1 * * * *", async () => {
    console.log("Checking reminders...");
    const now = new Date();

    const dueReminders = await Message.find({
        "reminder.time": { $lte: now },
        "reminder.isNotified": false
    }).populate("sender", "name email");

    dueReminders.forEach(async (message) => {
        await sendNotification(message.sender.email, `Reminder: ${message.content}`);

        await Message.findByIdAndUpdate(message._id, {
            "reminder.isNotified": true
        });

        console.log(`Reminder sent to ${message.sender.name}`);
    });
});
