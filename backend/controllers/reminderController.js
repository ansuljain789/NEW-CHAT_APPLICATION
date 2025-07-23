const Reminder = require("../models/reminderModel");

// ✅ Add a new reminder
const addReminder = async (req, res) => {
  try {
    const { message, time } = req.body;
    if (!message || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const reminder = new Reminder({
      user: req.user._id, // User ID from auth middleware
      message,
      time,
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ Get all reminders for logged-in user
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ Delete a reminder
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await reminder.deleteOne();
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = { addReminder, getReminders, deleteReminder };
