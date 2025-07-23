const express = require('express')
const router = express.Router();
const {registerUser,authUser,allUsers} = require("../controllers/userController")
const {protect} = require('../middleware/authMiddleware')
const {sendOtp} = require('../controllers/authControllers')

router.route('/').post(registerUser).get(protect,allUsers);
router.route('/login').post(authUser);
router.route('/send-otp').post(sendOtp);



module.exports = router
