const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {sendMessage,allMessages, deleteMessageForMe,deleteMessageForEveryone} = require('../controllers/messageControllers')
const upload = require('../middleware/uploadMiddleware');



const router = express.Router();


 //router.route('/').post(protect,sendMessage);
//  router.route('/').post(protect, upload.single("file"), sendMessage);
router.post('/', protect, upload.single("file"), (req, res, next) => {
  console.log("🔥 Multer middleware is working");
  next();
}, sendMessage)
 
 router.route('/:chatId').get(protect,allMessages);
//  router.route('/:messageId').delete(protect, deleteMessage);

// Delete message for the current user only
router.route('/:messageId/forme').delete(protect,deleteMessageForMe)
// Delete message for everyone (Admin/Sender only)
router.route('/:messageId/foreveryone').delete(protect,deleteMessageForEveryone);



module.exports= router;