require("dotenv").config();

const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');


const abusiveWords = process.env.ABUSIVE_WORDS
  ? process.env.ABUSIVE_WORDS.split(",").map(word => word.trim().toLowerCase())
  : [];
//  const abusiveWords = ["badword", "offensive", "curseword", "slur"];
//  console.log("enter");

//  console.log(abusiveWords);


const sendMessage = asyncHandler(async(req,res) =>{
  
    
     
    // console.log(req.body);
    //   console.log(file);


const file = req.file;
const { content, chatId } = req.body;

console.log("🔥 Multer middleware is working");
console.log("content:", content);
console.log("chatId:", chatId);
console.log("file:", file);


    

    if ((!content &&!file) || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
      }
       // Fetch the user details
   const user = await User.findById(req.user._id);
  
   console.log(user);

 if(content){
  const containsAbusiveWord = abusiveWords.some((word) =>
    content.toLowerCase().includes(word)
);

  console.log(containsAbusiveWord);
  console.log("entering for chcking the abusive");

  //check for abusive word
   if(containsAbusiveWord){

    console.log("content is");
    console.log(content);
    
    console.log("Abusive content detected:", content);
    
    user.isSuspended = true;
    user.suspensionExpiresAt = new Date(Date.now() + 60* 1000); // 2 sec
    await user.save();
    console.log("You have been suspended from messaging for 2 hours due to inappropriate content.");
    console.log(user);
    console.log(user.suspensionExpiresAt);
    console.log(`You are suspended from sending messages until ${user.suspensionExpiresAt}`);
    
    return res.status(403).json({
           message: "You have been suspended from messaging for 1 hours due to inappropriate content.",  
              
         });
   }
  if (user.isSuspended && user.suspensionExpiresAt > new Date()) {
    console.log("You are suspended from sending messages until ${user.suspensionExpiresAt}");
    
    return res.status(403).json({
     
    });
  }

  //if suspension time passsed 
  if (user.suspensionExpiresAt && user.suspensionExpiresAt < new Date()) {
    user.isSuspended = false;
    user.suspensionExpiresAt = null;
    await user.save();
  }

}
      var newMessage = {
        sender: req.user._id,
        content: content || "",
        chat: chatId,
      };

        if(file){
          const fileType = file.mimetype.startsWith("image") ? "image" : "video";
          newMessage.file = `/uploads/${file.filename}`;
          newMessage.fileType = fileType;
        }

      try {
        var message = await Message.create(newMessage);
    
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
          path: "chat.users",
          select: "name pic email",
        });
    
        await Chat.findByIdAndUpdate(req.body.chatId, 
            { 
                latestMessage: message
             });
    
        res.json(message);
      } catch (error) {
        res.status(400);
        console.log("chat is not defined");
        
        throw new Error(error.message);
      }



})

const allMessages = asyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId})
         .populate("sender", "name pic email")
         .populate("chat");

      res.json(messages);
    


    
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

  const deleteMessageForMe = asyncHandler(async(req,res)=>{
    try{
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Add user to deletedFor array if not already present
    if (!message.deletedFor.includes(userId)) {
      message.deletedFor.push(userId);
      await message.save();
    }
    console.log(message.content);
    
    return res.status(200).json({ message: "Message deleted for you only" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
  })

  const deleteMessageForEveryone = asyncHandler(async(req,res)=>{
    try {
      const { messageId } = req.params;
      const userId = req.user._id;
  
      const message = await Message.findById(messageId);
     
      
       
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      

      console.log(message.sender.toString());
      
      const isSender = message.sender.toString() === userId.toString();
      console.log(isSender);
      //  const isAdmin = req.user.role === "admin";
     console.log(isSender);
    
     
      if(message.content=="This message is deleted"){
        console.log("already deleted");
        return res.status(200).json({ message: "Message deleted already" });
      }
      if (isSender) {
        message.isDeletedForEveryone = true;
        console.log(message.content);
        message.content = "This message is deleted"; // Soft delete
        console.log(message.content);
        
        await message.save();
  
        return res.status(200).json({ message: "Message deleted for everyone" });
      } else {
        return res.status(403).json({ error: "Unauthorized to delete for everyone" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })




module.exports = {sendMessage,allMessages,deleteMessageForMe,deleteMessageForEveryone};