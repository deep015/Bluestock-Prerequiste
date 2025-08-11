const express= require('express')
const router = express.Router();

// Import the controller functions
const {
  register,
  login,
  sendEmailVerification,
  verifyEmail,
  sendMobileVerification,
  verifyMobile,
} = require("../controllers/authController");

// User authentication routes
router.post("/register", register);
router.post("/login", login);

// Email and mobile verification routes
router.post("/send-email-verification", sendEmailVerification);
router.get("/verify-email", verifyEmail);
router.post("/send-mobile-verification", sendMobileVerification);
router.post("/verify-mobile", verifyMobile);

module.exports = router;
