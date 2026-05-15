const express = require("express");
const rateLimit = require("express-rate-limit");
const { sendOtp, verifyOtp } = require("../controllers/otp.controller");

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many OTP requests. Try again later.",
});

router.post("/send", otpLimiter, sendOtp);
router.post("/verify", verifyOtp);

module.exports = router;
