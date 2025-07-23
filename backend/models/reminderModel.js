const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User Model
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
