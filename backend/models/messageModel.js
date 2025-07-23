
const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User"
         },
    content: {
         type: String,
          trim: true 
        },
    chat: {
         type: mongoose.Schema.Types.ObjectId,
          ref: "Chat"
         },
         file: {
      type: String
        },
    fileType: {
      type: String,
      enum: ["image", "video", ""],
      default: ""
    },
    readBy: [{
         type: mongoose.Schema.Types.ObjectId,
          ref: "User" }],

          deletedFor: [{ 
               type: mongoose.Schema.Types.ObjectId, 
               ref: "User" 
           }], // Users who deleted the message for themselves
           isDeletedForEveryone: { 
               type: Boolean, 
               default: false 
           }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
