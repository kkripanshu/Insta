const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');
const OtpToken = require('../models/OtpToken');

async function generateOTP(email, mobileNumber) {
    // Generate a 6-digit numeric OTP
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });    
// Hash the OTP before storing
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);
// Set expiration time (e.g., 10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
// Create and save the OTP token document
    const otpToken = new OtpToken({
        email,
        mobileNumber,
        otpHash,
        expiresAt,
    });

    await otpToken.save();

    return otp;
}

module.exports = generateOTP;