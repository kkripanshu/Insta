const bcrypt = require("bcryptjs");
const OtpToken = require("../models/OtpToken");
const generateOTP = require("../utils/generateOTP");
const transporter = require("../config/email");
const OtpEmail = require("../emails/OTPEmail.js");
const { renderEmail } = require("../utils/renderEmail");

exports.sendOtp = async (req, res) => {
  try {
    const { email, mobileNumber } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const invalidateQuery = { email, isUsed: false };
    if (mobileNumber) {
      invalidateQuery.mobileNumber = mobileNumber;
    }

    await OtpToken.updateMany(invalidateQuery, { isUsed: true });

    const otp = await generateOTP(email, mobileNumber);
    console.log("OTP generated:", otp);

    const emailHtml = await renderEmail(OtpEmail, { otp });
    console.log("Email HTML rendered successfully");

    await transporter.sendMail({
      from: `"ConnectX" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your ConnectX OTP",
      html: emailHtml,
    });

    console.log("Email sent successfully to:", email);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err.message, err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, mobileNumber, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const findQuery = { email, isUsed: false };
    if (mobileNumber) {
      findQuery.mobileNumber = mobileNumber;
    }

    const otpDoc = await OtpToken.findOne(findQuery).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ message: "OTP not found or already used" });
    }

    if (otpDoc.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(otp, otpDoc.otpHash);
    if (!isValid) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    otpDoc.isUsed = true;
    await otpDoc.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

