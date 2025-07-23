const express = require("express");
const { addReminder, getReminders, deleteReminder } = require("../controllers/reminderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addReminder); // Add a reminder
router.get("/", protect, getReminders); // Get all reminders for the logged-in user
router.delete("/:id", protect, deleteReminder); // Delete a reminder

module.exports = router;
